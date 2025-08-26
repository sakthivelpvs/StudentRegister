import {
  users,
  students,
  type User,
  type InsertUser,
  type Student,
  type InsertStudent,
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations for simple auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student operations
  getStudents(filters?: {
    search?: string;
    class?: string;
    rank?: string;
  }): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
  getStudentStats(): Promise<{
    totalStudents: number;
    activeClasses: number;
    topPerformers: number;
    newThisMonth: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations for simple auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Student operations
  async getStudents(filters?: {
    search?: string;
    class?: string;
    rank?: string;
  }): Promise<Student[]> {
    let query = db.select().from(students);
    
    const conditions = [];
    
    if (filters?.search) {
      conditions.push(
        or(
          ilike(students.name, `%${filters.search}%`),
          ilike(students.class, `%${filters.search}%`),
          ilike(students.address, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.class && filters.class !== "all") {
      conditions.push(eq(students.class, filters.class));
    }
    
    if (filters?.rank && filters.rank !== "all") {
      conditions.push(eq(students.rank, filters.rank));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(students.createdAt);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db
      .insert(students)
      .values(student)
      .returning();
    return newStudent;
  }

  async updateStudent(id: string, studentData: Partial<InsertStudent>): Promise<Student> {
    const [updatedStudent] = await db
      .update(students)
      .set({ ...studentData, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<void> {
    await db.delete(students).where(eq(students.id, id));
  }

  async getStudentStats(): Promise<{
    totalStudents: number;
    activeClasses: number;
    topPerformers: number;
    newThisMonth: number;
  }> {
    const allStudents = await db.select().from(students);
    const totalStudents = allStudents.length;
    
    const uniqueClasses = new Set(allStudents.map(s => s.class));
    const activeClasses = uniqueClasses.size;
    
    const topPerformers = allStudents.filter(s => s.rank === "excellent").length;
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const newThisMonth = allStudents.filter(s => 
      s.createdAt && new Date(s.createdAt) > oneMonthAgo
    ).length;
    
    return {
      totalStudents,
      activeClasses,
      topPerformers,
      newThisMonth,
    };
  }
}

export const storage = new DatabaseStorage();
