import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-localhost.js";
import { getSession, isAuthenticated, initializeDefaultUser } from "./auth-localhost.js";
import { insertStudentSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

export async function registerLocalhostRoutes(app: Express): Promise<Server> {
  console.log('🔧 Setting up routes for localhost...');
  
  // Session middleware
  app.use(getSession());
  
  // Initialize default admin user
  await initializeDefaultUser();

  // Auth routes
  app.post('/api/login', async (req, res) => {
    try {
      console.log('🔐 Login attempt:', req.body.username);
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        console.log('❌ Invalid credentials for:', username);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user session
      (req.session as any).userId = user.id;
      console.log('✅ Login successful for:', username);
      res.json({ 
        message: "Login successful", 
        user: { 
          id: user.id, 
          username: user.username, 
          firstName: user.firstName, 
          lastName: user.lastName 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('❌ Validation error:', error.errors);
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("❌ Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Logout error:', err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('student_mgmt_session');
      console.log('✅ Logout successful');
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ 
        id: user.id, 
        username: user.username, 
        firstName: user.firstName, 
        lastName: user.lastName 
      });
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Student routes
  app.get("/api/students", isAuthenticated, async (req, res) => {
    try {
      const { search, class: classFilter, rank } = req.query;
      const students = await storage.getStudents({
        search: search as string,
        class: classFilter as string,
        rank: rank as string,
      });
      res.json(students);
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/students/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getStudentStats();
      res.json(stats);
    } catch (error) {
      console.error("❌ Error fetching student stats:", error);
      res.status(500).json({ message: "Failed to fetch student stats" });
    }
  });

  app.post("/api/students", isAuthenticated, async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      console.log('✅ Student created:', student.name);
      res.status(201).json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("❌ Error creating student:", error);
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  app.put("/api/students/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.updateStudent(id, studentData);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      console.log('✅ Student updated:', student.name);
      res.json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("❌ Error updating student:", error);
      res.status(500).json({ message: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteStudent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      console.log('✅ Student deleted:', id);
      res.json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting student:", error);
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  console.log('✅ All routes registered');
  const httpServer = createServer(app);
  return httpServer;
}