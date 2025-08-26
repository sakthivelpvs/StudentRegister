# Complete Localhost Setup Guide

## 🚨 Issues You Encountered & Solutions

### Problem 1: `.env` File Not Recognized
**Issue**: App couldn't read environment variables from `.env` file
**Solution**: ✅ Added `dotenv` package and `import 'dotenv/config'` at the top of server files

### Problem 2: `import.meta.dirname` Error
**Issue**: Node.js doesn't support `import.meta.dirname` in some versions
**Solution**: ✅ Created localhost-specific files using `fileURLToPath` and `path.dirname`

### Problem 3: 500 Internal Server Error on Login
**Issue**: Neon serverless driver doesn't work well with localhost PostgreSQL
**Solution**: ✅ Created localhost-specific database connection using regular `pg` driver

## 🎯 Complete Localhost Setup

### Step 1: Create Database
```bash
# Create PostgreSQL database
createdb student_management

# Import schema and data
psql student_management < database-export.sql
```

### Step 2: Environment Setup
Create `.env` file:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/student_management
SESSION_SECRET=your-secret-key-here
```

### Step 3: Install Dependencies
```bash
# Install the required packages
npm install dotenv pg @types/pg
```

### Step 4: Use Localhost Files
Instead of the original files, use these localhost-specific versions:

**Replace server/index.ts with:**
```bash
node server/index-localhost.js
```

Or update your npm scripts to use:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx --env-file=.env server/index-localhost.ts"
  }
}
```

## 🔧 What I Fixed

### ✅ Database Connection
- **Old**: Neon serverless driver (requires WebSocket)
- **New**: Regular PostgreSQL driver for localhost
- **File**: `server/db-localhost.ts`

### ✅ Session Storage  
- **Old**: Session errors with Neon connection
- **New**: Proper localhost PostgreSQL session store
- **File**: `server/auth-localhost.ts`

### ✅ Environment Variables
- **Old**: No dotenv support
- **New**: Proper dotenv configuration
- **File**: `server/index-localhost.ts`

### ✅ Import Issues
- **Old**: `import.meta.dirname` not supported
- **New**: `fileURLToPath` with proper path resolution
- **File**: All localhost files

### ✅ Better Error Logging
- Added detailed console logging for debugging
- Session errors are now visible
- Database connection status logging

## 🚀 Ready-to-Use Files

I've created complete localhost versions:

1. **`server/index-localhost.ts`** - Main server with proper imports
2. **`server/db-localhost.ts`** - PostgreSQL connection for localhost  
3. **`server/auth-localhost.ts`** - Session handling for localhost
4. **`server/routes-localhost.ts`** - API routes with better logging
5. **`server/storage-localhost.ts`** - Database operations
6. **`localhost-package.json`** - Updated dependencies and scripts

## 🎯 Quick Start Commands

```bash
# 1. Setup database
createdb student_management
psql student_management < database-export.sql

# 2. Create .env file (see template above)
cp .env.example .env

# 3. Install dependencies  
npm install dotenv pg @types/pg

# 4. Start localhost server
NODE_ENV=development tsx --env-file=.env server/index-localhost.ts
```

## 🔍 Testing the Fix

1. **Server starts**: Should see "🎉 Server running on http://localhost:5000"
2. **Database connection**: Should see "✅ Connected to PostgreSQL database"  
3. **Admin user**: Should see "✅ Admin user already exists"
4. **Login test**: POST to `/api/login` with admin/pass123

## 📝 API Endpoints

- **GET** `/` - Server info and available endpoints
- **POST** `/api/login` - Login (admin/pass123)
- **POST** `/api/logout` - Logout  
- **GET** `/api/auth/user` - Get current user
- **GET** `/api/students` - List students
- **POST** `/api/students` - Create student
- **PUT** `/api/students/:id` - Update student
- **DELETE** `/api/students/:id` - Delete student

## 🐛 Troubleshooting

### If login still fails:
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT * FROM users;"

# Check sessions table
psql $DATABASE_URL -c "SELECT * FROM sessions;"

# Check server logs for detailed errors
```

### If environment variables not loaded:
```bash
# Verify .env file exists and has correct format
cat .env

# Try explicit dotenv loading
NODE_OPTIONS="--require dotenv/config" npm run dev
```

The localhost setup is now complete and should work without the import.meta.dirname and Neon driver issues!