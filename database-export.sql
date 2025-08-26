-- Student Management System Database Export
-- Generated on: 2025-08-04
-- This file contains your complete database structure and data

-- Create database (if needed)
-- CREATE DATABASE student_management;

-- Create tables
CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions ("expire");

CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar UNIQUE NOT NULL,
  password varchar NOT NULL,
  first_name varchar,
  last_name varchar,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

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

-- Clear existing data (optional - remove these lines if you want to keep existing data)
-- TRUNCATE TABLE sessions;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE students;

-- Insert your current user data
INSERT INTO users (id, username, password, first_name, last_name, created_at, updated_at) VALUES
('45852611', 'admin', 'pass123', 'Workspace', 'We', '2025-08-04 14:24:54.69985', '2025-08-04 14:24:54.69985')
ON CONFLICT (username) DO UPDATE SET
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  updated_at = EXCLUDED.updated_at;

-- Insert your current student data
INSERT INTO students (id, name, class, address, phone, rank, created_at, updated_at) VALUES
('53db45ca-d1bc-4042-a597-54f04aee4f63', 'Student1', 'Grade 1', 'Test address', '(245) 645-4555', 'good', '2025-08-04 14:25:24.506438', '2025-08-04 14:25:24.506438'),
('2fec7c0f-3caa-43d5-ab52-2e6362b4d224', 'student2', 'Grade 2', 'test2', '(245) 645-4523', 'excellent', '2025-08-04 14:27:26.436519', '2025-08-04 14:27:26.436519')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  class = EXCLUDED.class,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  rank = EXCLUDED.rank,
  updated_at = EXCLUDED.updated_at;