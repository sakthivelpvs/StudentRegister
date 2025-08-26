# Database Migration Guide for AWS

## Your Database Options for AWS:

### **Option 1: AWS RDS PostgreSQL (Recommended for Production)**
**Cost**: ~$12.50/month for db.t3.micro

#### Setup Steps:
1. **Create RDS Instance:**
   ```bash
   # Via AWS Console:
   # - Engine: PostgreSQL 15+
   # - Instance: db.t3.micro
   # - Storage: 20GB
   # - Username: student_admin
   # - Password: [your-secure-password]
   ```

2. **Get Connection String:**
   ```
   DATABASE_URL=postgresql://student_admin:your-password@your-rds-endpoint.amazonaws.com:5432/student_management
   ```

3. **Import Your Data:**
   ```bash
   # Connect and run the export file
   psql "postgresql://student_admin:password@your-rds-endpoint:5432/student_management" < database-export.sql
   ```

### **Option 2: Docker PostgreSQL (Good for Development)**
**Cost**: Free (runs on your EC2 instance)

#### Already Configured:
- The `docker-compose.yml` I created includes PostgreSQL
- Your data will be imported automatically via `init-db.sql`
- No additional setup needed!

### **Option 3: Existing External Database**
If you have a PostgreSQL database elsewhere:

1. **Update CONNECTION_URL** in your environment variables
2. **Run the migration:**
   ```bash
   psql "your-database-url" < database-export.sql
   ```

## **Files I Created for Database Migration:**

1. **`database-export.sql`** - Your complete current database with:
   - Admin user (admin/pass123)
   - 2 sample students
   - All table structures

2. **`init-db.sql`** - Fresh database initialization with:
   - Table creation scripts
   - Default admin user
   - Ready for Docker deployment

3. **`docker-compose.yml`** - Includes PostgreSQL container with:
   - Automatic database creation
   - Volume persistence
   - Environment variables

## **Migration Process by Deployment Type:**

### **If Using Docker (Easiest):**
```bash
# Your data is automatically loaded via init-db.sql
# Plus you can restore your current data:
docker-compose up -d
docker exec -i postgres_container psql -U student_user student_management < database-export.sql
```

### **If Using AWS RDS:**
```bash
# 1. Create RDS instance in AWS Console
# 2. Set DATABASE_URL environment variable
# 3. Import your data:
psql $DATABASE_URL < database-export.sql
```

### **If Using Serverless (Lambda):**
- You'll still need RDS or external PostgreSQL
- Lambda cannot run database containers
- Use RDS with the connection string

## **Your Current Data Summary:**
- **Users**: 1 admin account (admin/pass123)
- **Students**: 2 sample students
  - Student1 (Grade 1, Good rank)
  - student2 (Grade 2, Excellent rank)
- **Sessions**: 1 active session (will be recreated)

## **Next Steps:**
1. Download the `database-export.sql` file from Replit
2. Choose your AWS database option
3. Run the migration script
4. Update your app's DATABASE_URL environment variable
5. Test the connection

The database migration is ready! Your application will work immediately with the new database.