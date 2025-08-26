-- Initialize the database with required tables
-- This will be run when the PostgreSQL container starts

-- Create sessions table for express-session
CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
);

-- Add index on expire column for performance
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions ("expire");

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar UNIQUE NOT NULL,
  password varchar NOT NULL,
  first_name varchar,
  last_name varchar,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class varchar NOT NULL,
  address text NOT NULL,
  phone varchar NOT NULL,
  rank varchar NOT NULL,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO users (username, password, first_name, last_name)
VALUES ('admin', 'pass123', 'Admin', 'User')
ON CONFLICT (username) DO NOTHING;