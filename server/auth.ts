import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (req.session && (req.session as any).userId) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
};

// Initialize default admin user
export async function initializeDefaultUser() {
  try {
    const existingUser = await storage.getUserByUsername("admin");
    if (!existingUser) {
      await storage.createUser({
        username: "admin",
        password: "pass123", // In production, this should be hashed
        firstName: "Admin",
        lastName: "User",
      });
      console.log("Default admin user created: admin/pass123");
    }
  } catch (error) {
    console.error("Error initializing default user:", error);
  }
}