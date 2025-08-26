import {
  users,
  students,
  type User,
  type Student,
  type InsertUser,
  type InsertStudent,
} from "@shared/schema";
import { db } from "./db-localhost.js";
import { eq, ilike, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
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
  updateStudent(id: string, student: InsertStudent): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
  getStudentStats(): Promise<{
    totalStudents: number;
    activeClasses: number;
    topRank: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('❌ Error getting user by username:', error);
      throw error;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .returning();
      return user;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  // Student operations
  async getStudents(filters?: {
    search?: string;
    class?: string;
    rank?: string;
  }): Promise<Student[]> {
    try {
      let query = db.select().from(students);
      
      const conditions = [];
      
      if (filters?.search) {
        conditions.push(ilike(students.name, `%${filters.search}%`));
      }
      
      if (filters?.class) {
        conditions.push(eq(students.class, filters.class));
      }
      
      if (filters?.rank) {
        conditions.push(eq(students.rank, filters.rank));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      
      const result = await query.orderBy(students.name);
      return result;
    } catch (error) {
      console.error('❌ Error getting students:', error);
      throw error;
    }
  }

  async getStudent(id: string): Promise<Student | undefined> {
    try {
      const [student] = await db.select().from(students).where(eq(students.id, id));
      return student;
    } catch (error) {
      console.error('❌ Error getting student:', error);
      throw error;
    }
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    try {
      const [student] = await db
        .insert(students)
        .values(studentData)
        .returning();
      return student;
    } catch (error) {
      console.error('❌ Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(id: string, studentData: InsertStudent): Promise<Student | undefined> {
    try {
      const [student] = await db
        .update(students)
        .set({ ...studentData, updatedAt: new Date() })
        .where(eq(students.id, id))
        .returning();
      return student;
    } catch (error) {
      console.error('❌ Error updating student:', error);
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<boolean> {
    try {
      const result = await db.delete(students).where(eq(students.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('❌ Error deleting student:', error);
      throw error;
    }
  }

  async getStudentStats(): Promise<{
    totalStudents: number;
    activeClasses: number;
    topRank: string;
  }> {
    try {
      const [totalResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(students);

      const classesResult = await db
        .selectDistinct({ class: students.class })
        .from(students);

      const ranksResult = await db
        .select({ 
          rank: students.rank,
          count: sql<number>`count(*)` 
        })
        .from(students)
        .groupBy(students.rank)
        .orderBy(sql`count(*) desc`);

      return {
        totalStudents: Number(totalResult.count),
        activeClasses: classesResult.length,
        topRank: ranksResult[0]?.rank || "none",
      };
    } catch (error) {
      console.error('❌ Error getting student stats:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();