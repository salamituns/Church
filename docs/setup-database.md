# Database Setup Guide

## Quick Start Options

### Option 1: SQLite (Easiest for Development) ⚡

SQLite is perfect for local development - no database server needed!

1. **Update Prisma schema** to use SQLite:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Create `.env` file** in project root:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

That's it! The database file will be created at `prisma/dev.db`

---

### Option 2: PostgreSQL (Production Ready) 🚀

PostgreSQL is recommended for production deployments.

#### Local PostgreSQL Setup

1. **Install PostgreSQL** (if not installed):
   ```bash
   # macOS
   brew install postgresql@14
   brew services start postgresql@14

   # Or use Postgres.app (easier): https://postgresapp.com/
   ```

2. **Create database**:
   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database and user
   CREATE DATABASE church;
   CREATE USER church_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE church TO church_user;
   \q
   ```

3. **Create `.env` file**:
   ```env
   DATABASE_URL="postgresql://church_user:your_password@localhost:5432/church?schema=public"
   ```

4. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

#### Using a Cloud Database (Recommended for Production)

**Option A: Vercel Postgres** (if deploying to Vercel)
- Go to Vercel Dashboard → Your Project → Storage → Create Database
- Copy the connection string to `.env`

**Option B: Supabase** (Free tier available)
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (starts with `postgresql://`)
5. Add to `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

**Option C: Railway** (Easy setup)
1. Sign up at https://railway.app
2. Create new project → Add PostgreSQL
3. Copy connection string to `.env`

**Option D: Neon** (Serverless PostgreSQL)
1. Sign up at https://neon.tech
2. Create project
3. Copy connection string to `.env`

---

## Step-by-Step Setup

### 1. Create Environment File

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Or create manually
touch .env
```

### 2. Add DATABASE_URL

Open `.env` and add your database URL:

**For SQLite (Development):**
```env
DATABASE_URL="file:./dev.db"
```

**For PostgreSQL:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/church?schema=public"
```

### 3. Update Prisma Schema (if using SQLite)

If you chose SQLite, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"  // Change from "postgresql"
  url      = env("DATABASE_URL")
}
```

**Note:** If using SQLite, you may need to adjust some field types (like `Decimal` to `Float`). The current schema is optimized for PostgreSQL.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database (if it doesn't exist)
- Create all tables based on the schema
- Generate migration files

### 6. Verify Setup

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your database.

---

## Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"

**Solution:** Make sure you have a `.env` file in the project root with `DATABASE_URL` set.

### Error: "Can't reach database server"

**Solutions:**
- Check PostgreSQL is running: `brew services list` (macOS)
- Verify connection string format
- Check firewall settings
- For cloud databases, verify IP whitelist

### Error: "Database does not exist"

**Solution:** Create the database first:
```bash
psql postgres
CREATE DATABASE church;
\q
```

### Error: "Permission denied"

**Solution:** Grant proper permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE church TO your_user;
```

---

## Production Deployment

For production, use a managed PostgreSQL service:

1. **Vercel Postgres** (if using Vercel)
2. **Supabase** (free tier: 500MB)
3. **Neon** (serverless, free tier available)
4. **Railway** (easy setup)
5. **AWS RDS** (enterprise)

Add the connection string to your hosting platform's environment variables.

---

## Next Steps

After database setup:

1. ✅ Database is ready
2. ⏭️ Set up email service (Resend)
3. ⏭️ Configure Stripe webhooks
4. ⏭️ Test donation flow

See `docs/code-review-implementation-summary.md` for complete setup instructions.
