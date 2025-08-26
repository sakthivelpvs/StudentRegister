import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentFormModal } from "@/components/student-form-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { GraduationCap, Users, BookOpen, Trophy, UserPlus, Search, Edit, Trash2, LogOut } from "lucide-react";
import type { Student } from "@shared/schema";

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState("all");
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // No need for manual redirect - App.tsx handles routing

  // Fetch students with filters
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["/api/students", searchTerm, classFilter, rankFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (classFilter !== "all") params.append("class", classFilter);
      if (rankFilter !== "all") params.append("rank", rankFilter);
      
      const response = await fetch(`/api/students?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = new Error(`${response.status}: ${response.statusText}`);
        if (response.status === 401) {
          queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
          return [];
        }
        throw error;
      }
      
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Fetch student statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/students/stats"],
    enabled: isAuthenticated,
  });

  // Delete student mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/students/stats"] });
      toast({
        title: "Success",
        description: "Student deleted successfully!",
      });
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddStudent = () => {
    setEditingStudent(null);
    setStudentModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentModalOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteMutation.mutate(studentToDelete.id);
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "excellent":
        return "bg-emerald-100 text-emerald-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "needs-improvement":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRankLabel = (rank: string) => {
    switch (rank) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "average":
        return "Average";
      case "needs-improvement":
        return "Needs Improvement";
      default:
        return rank;
    }
  };

  const getClassColor = (className: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-emerald-100 text-emerald-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
    ];
    const index = className.charCodeAt(className.length - 1) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Student Management</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Welcome, {user?.firstName || user?.username || 'User'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  try {
                    await apiRequest("POST", "/api/logout");
                    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
                    toast({
                      title: "Success",
                      description: "Logged out successfully",
                    });
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
                className="text-slate-700 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Students</h2>
            <p className="mt-2 text-slate-600">Manage student records and information</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={handleAddStudent} className="bg-blue-500 hover:bg-blue-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Students</p>
                  {stats ? (
                    <p className="text-3xl font-bold text-slate-900">{stats.totalStudents}</p>
                  ) : (
                    <Skeleton className="h-9 w-16" />
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="text-blue-500 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Classes</p>
                  {stats ? (
                    <p className="text-3xl font-bold text-slate-900">{stats.activeClasses}</p>
                  ) : (
                    <Skeleton className="h-9 w-16" />
                  )}
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-emerald-500 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Top Performers</p>
                  {stats ? (
                    <p className="text-3xl font-bold text-slate-900">{stats.topPerformers}</p>
                  ) : (
                    <Skeleton className="h-9 w-16" />
                  )}
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Trophy className="text-amber-500 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">New This Month</p>
                  {stats ? (
                    <p className="text-3xl font-bold text-slate-900">{stats.newThisMonth}</p>
                  ) : (
                    <Skeleton className="h-9 w-16" />
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <UserPlus className="text-purple-500 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search students by name, class, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-3">
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Grade 1">Grade 1</SelectItem>
                    <SelectItem value="Grade 2">Grade 2</SelectItem>
                    <SelectItem value="Grade 3">Grade 3</SelectItem>
                    <SelectItem value="Grade 4">Grade 4</SelectItem>
                    <SelectItem value="Grade 5">Grade 5</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={rankFilter} onValueChange={setRankFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Ranks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranks</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-900">Student</TableHead>
                  <TableHead className="font-semibold text-slate-900">Class</TableHead>
                  <TableHead className="font-semibold text-slate-900">Address</TableHead>
                  <TableHead className="font-semibold text-slate-900">Phone</TableHead>
                  <TableHead className="font-semibold text-slate-900">Rank</TableHead>
                  <TableHead className="font-semibold text-slate-900 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-16 mx-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-lg font-medium mb-2">No students found</p>
                        <p className="text-sm">Add your first student to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${getAvatarColor(student.name)} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-medium text-sm">
                              {getInitials(student.name)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{student.name}</p>
                            <p className="text-sm text-slate-600">ID: {student.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getClassColor(student.class)}>
                          {student.class}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-900">{student.address}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-900">{student.phone}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRankColor(student.rank)}>
                          {getRankLabel(student.rank)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStudent(student)}
                            className="text-slate-400 hover:text-blue-500"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudent(student)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      {/* Modals */}
      <StudentFormModal
        open={studentModalOpen}
        onOpenChange={setStudentModalOpen}
        student={editingStudent}
      />
      
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        student={studentToDelete}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
