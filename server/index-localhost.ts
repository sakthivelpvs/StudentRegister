import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerLocalhostRoutes } from "./routes-localhost.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for localhost development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Logging middleware for localhost debugging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`[${new Date().toLocaleTimeString()}] ${logLine}`);
    }
  });

  next();
});

(async () => {
  console.log('🚀 Starting Student Management System (Localhost)...');
  console.log('📍 Environment:', process.env.NODE_ENV || 'development');
  console.log('🗄️  Database URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
  
  const server = await registerLocalhostRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('❌ Error:', err);
    res.status(status).json({ message });
  });

  // For localhost, serve static files from dist
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development: Simple message for API-only testing
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Student Management API is running!',
        endpoints: {
          login: 'POST /api/login',
          logout: 'POST /api/logout',
          user: 'GET /api/auth/user',
          students: 'GET /api/students'
        },
        credentials: {
          username: 'admin',
          password: 'pass123'
        }
      });
    });
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, '0.0.0.0', () => {
    console.log(`\n🎉 Server running on http://localhost:${port}`);
    console.log(`📊 API available at http://localhost:${port}/api`);
    console.log(`🔑 Login with: admin / pass123\n`);
  });
})();