import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  
  // For localhost, we'll create session store with better error handling
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
    schemaName: "public",
    // Add error logging for localhost debugging
    errorLog: (err: Error) => {
      console.error('Session store error:', err);
    }
  });
  
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: 'student_mgmt_session',
    cookie: {
      httpOnly: true,
      secure: false, // false for localhost HTTP
      maxAge: sessionTtl,
      sameSite: 'lax'
    },
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    if (req.session && (req.session as any).userId) {
      return next();
    }
    
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: "Authentication failed" });
  }
};

// Initialize default admin user with better error handling
export async function initializeDefaultUser() {
  try {
    console.log('🔧 Initializing default admin user...');
    
    const existingUser = await storage.getUserByUsername("admin");
    if (!existingUser) {
      await storage.createUser({
        username: "admin",
        password: "pass123", // In production, this should be hashed
        firstName: "Admin",
        lastName: "User",
      });
      console.log('✅ Default admin user created: admin/pass123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing default user:', error);
    throw error; // Re-throw to see the full error
  }
}