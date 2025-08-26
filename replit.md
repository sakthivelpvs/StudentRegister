# Overview

This is a full-stack student management system built with React on the frontend and Express.js on the backend. The application allows users to manage student records with features like adding, editing, deleting, and searching students. It includes authentication via Replit's OAuth system and provides a clean, modern interface using shadcn/ui components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with OpenID Connect for Replit OAuth
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## Database Design
- **Database**: PostgreSQL with Neon serverless adapter
- **Schema Management**: Drizzle migrations with schema defined in TypeScript
- **Core Tables**:
  - `users`: User authentication and profile data (required for Replit Auth)
  - `students`: Student records with name, class, address, phone, and rank
  - `sessions`: Session storage (required for Replit Auth)

## Authentication & Authorization
- **Provider**: Replit OAuth via OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with 7-day expiry
- **Route Protection**: Middleware-based authentication checks on all API routes
- **User Management**: Automatic user creation/update on login

## Project Structure
- **Monorepo Layout**: Client and server code in separate directories
- **Shared Types**: Common TypeScript interfaces and Zod schemas in `/shared`
- **Path Aliases**: TypeScript path mapping for clean imports (@/, @shared/)
- **Build Strategy**: Separate builds for client (Vite) and server (esbuild)

# External Dependencies

## Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **WebSocket Support**: ws library for Neon's WebSocket connections

## Authentication
- **Replit Auth**: OpenID Connect integration for user authentication
- **Passport.js**: Authentication middleware with openid-client strategy

## UI & Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library with design system

## Development Tools
- **TypeScript**: Static type checking across the entire stack
- **Vite**: Fast development server with HMR
- **esbuild**: Fast production bundling for the server
- **Drizzle Kit**: Database migration and introspection tools

## Runtime Dependencies
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation utilities
- **clsx & tailwind-merge**: Conditional CSS class utilities