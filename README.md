# Student Management System

A full-stack web application for managing student records with authentication, built with React, Express.js, and PostgreSQL.

## Features

- **Authentication**: Simple username/password login system
- **Student Management**: Complete CRUD operations for student records
- **Search & Filter**: Advanced filtering by class, rank, and text search
- **Statistics Dashboard**: Overview of student data with visual metrics
- **Responsive Design**: Modern, mobile-friendly interface using Tailwind CSS

## Demo Credentials

- **Username**: `admin`
- **Password**: `pass123`

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- shadcn/ui component library
- TanStack Query for state management
- Wouter for routing
- React Hook Form with Zod validation

### Backend
- Express.js with TypeScript
- PostgreSQL database
- Drizzle ORM for database operations
- Express sessions for authentication
- Zod for request validation

## Quick Start (Local Development)

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd student-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   DATABASE_URL=postgresql://username:password@localhost:5432/student_management
   SESSION_SECRET=your-super-secure-session-secret
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:5000
   - Login with: admin / pass123

## AWS Deployment

This application is ready for AWS deployment with multiple options:

### Option 1: Docker + EC2 (Recommended)
```bash
# Deploy using Docker Compose
npm run deploy:aws
```

### Option 2: Elastic Beanstalk
```bash
# Install EB CLI
npm install -g @aws/eb-cli

# Initialize and deploy
eb init student-management --platform node.js
eb create production
eb deploy
```

### Option 3: Serverless (Lambda + API Gateway)
```bash
# Install Serverless Framework
npm install -g serverless

# Deploy
serverless deploy
```

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express.js backend
│   ├── auth.ts            # Authentication logic
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data access layer
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database and validation schemas
├── Dockerfile             # Docker container configuration
├── docker-compose.yml     # Local development with database
└── serverless.yml         # Serverless deployment configuration
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/auth/user` - Get current user

### Students
- `GET /api/students` - List students (with filtering)
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/stats` - Get student statistics

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret key for session encryption | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 5000) | No |

## Database Schema

### Users Table
- `id` - Primary key (UUID)
- `username` - Unique username
- `password` - User password (plaintext for demo)
- `first_name` - User's first name
- `last_name` - User's last name
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Students Table
- `id` - Primary key (UUID)
- `name` - Student's full name
- `class` - Student's class/grade
- `address` - Student's address
- `phone` - Contact phone number
- `rank` - Academic performance rank
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Sessions Table
- `sid` - Session ID
- `sess` - Session data (JSON)
- `expire` - Session expiration

## Security Considerations

⚠️ **Important**: This application uses plaintext passwords for demonstration purposes. In production:

1. Implement password hashing (bcrypt)
2. Use HTTPS/TLS encryption
3. Set secure session cookies
4. Implement rate limiting
5. Add input sanitization
6. Use environment variables for secrets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.