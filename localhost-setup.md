# Localhost Setup Guide

## Prerequisites

### Required Software:
- **Node.js 18+** - https://nodejs.org/
- **PostgreSQL 12+** - https://www.postgresql.org/download/
- **Git** (optional) - For version control

## Installation Steps

### 1. Extract Files
```bash
# Extract the ZIP file to your desired directory
unzip student-management-localhost.zip
cd student-management-system
```

### 2. Install Dependencies
```bash
# Install all required packages
npm install
```

### 3. Database Setup

#### Option A: Create New Database
```bash
# Create database
createdb student_management

# Import schema and data
psql student_management < database-export.sql
```

#### Option B: Use Existing PostgreSQL
```bash
# Connect to your existing PostgreSQL
psql -h localhost -U your_username -d your_database < database-export.sql
```

### 4. Environment Configuration
```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/student_management
SESSION_SECRET=your-secret-key-here
```

### 5. Start the Application
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

## Access the Application

- **URL**: http://localhost:5000
- **Username**: admin  
- **Password**: pass123

## Project Structure

```
student-management-system/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # App pages
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/                 # Backend Express app
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── auth.ts            # Authentication
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                # Shared types
│   └── schema.ts          # Database schema
├── database-export.sql    # Complete database
├── package.json           # Dependencies
└── README.md              # Documentation
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Database operations
npm run db:push     # Push schema changes
npm run db:studio   # Open database studio

# Type checking
npm run type-check

# Linting
npm run lint
```

## Features

### ✅ Authentication
- Simple username/password login
- Session-based authentication
- Logout functionality

### ✅ Student Management
- Add new students
- Edit existing students
- Delete students
- Search and filter
- Pagination

### ✅ Data Fields
- Name
- Class/Grade
- Address
- Phone Number
- Rank/Performance

### ✅ User Interface
- Responsive design
- Modern UI components
- Toast notifications
- Loading states
- Form validation

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep student_management

# Test connection
psql "postgresql://username:password@localhost:5432/student_management" -c "SELECT 1;"
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3000 npm run dev
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Set proper production values
2. **Database**: Use managed PostgreSQL service
3. **Process Manager**: Use PM2 or similar
4. **Reverse Proxy**: Use Nginx
5. **SSL**: Enable HTTPS
6. **Monitoring**: Add logging and monitoring

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check console logs for error messages
4. Ensure database connection is working

The application should work out of the box on any system with Node.js and PostgreSQL installed.