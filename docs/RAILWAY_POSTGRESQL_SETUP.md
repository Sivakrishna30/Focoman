# Railway PostgreSQL Setup Guide

## Overview

**Important:** The database is **NOT bundled** with your backend server. PostgreSQL is a **separate service** that must be hosted independently. Railway makes this easy with their PostgreSQL plugin.

---

## Step-by-Step Setup

### Step 1: Add PostgreSQL to Railway

1. **Go to your Railway project:**
   - Open https://railway.app
   - Select your `Focoman` project

2. **Add PostgreSQL plugin:**
   - Click **"+ New"** button
   - Select **"Database"** → **"PostgreSQL"**
   - Railway will automatically:
     - Create a new PostgreSQL instance
     - Generate credentials (username, password, database name)
     - Set up connection URL
     - Link it to your backend service

3. **Verify PostgreSQL is running:**
   - You should see a new service called "PostgreSQL" in your project
   - It will have a purple elephant icon 🐘

---

### Step 2: Configure Environment Variables

Railway automatically injects environment variables when you link services. However, you need to ensure your backend service has the correct variables.

#### Automatic Variables (Railway provides these):

When you link PostgreSQL to your backend, Railway **automatically** sets:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

#### Railway PostgreSQL Variables (Auto-Generated)

When you add PostgreSQL to Railway, these variables are **automatically created** in the PostgreSQL service:

```env
DATABASE_PUBLIC_URL="postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_TCP_PROXY_DOMAIN}}:${{RAILWAY_TCP_PROXY_PORT}}/${{PGDATABASE}}"
DATABASE_URL="postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:5432/${{PGDATABASE}}"
PGDATA="/var/lib/postgresql/data/pgdata"
PGDATABASE="railway"
PGHOST="${{RAILWAY_PRIVATE_DOMAIN}}"
PGPASSWORD="pVAmAGfPdsTxvatXtMMymeeXWoFAqSvN"
PGPORT="5432"
PGUSER="postgres"
POSTGRES_DB="railway"
POSTGRES_PASSWORD="pVAmAGfPdsTxvatXtMMymeeXWoFAqSvN"
POSTGRES_USER="postgres"
```

#### Required Variables for Spring Boot (Add to Backend Service)

You need to add these variables to your **backend service** (not the PostgreSQL service) to connect to the database:

**Option A: Using Railway Variable Substitution (Recommended)**

In your backend service → **Variables** tab → **New Variable**, add:

```env
# Database Connection (maps Railway PostgreSQL to Spring Boot)
SPRING_DATASOURCE_URL=${{Postgres.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
SPRING_JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# Application Configuration
APP_ENV=production
H2_CONSOLE_ENABLED=false
JPA_DDL_AUTO=validate

# Connection Pool (optional - defaults are fine)
DB_POOL_MAX_SIZE=20
DB_POOL_MIN_IDLE=10

# Server Configuration
SERVER_PORT=8080

# Logging (optional)
LOG_LEVEL=INFO
SQL_LOG_LEVEL=WARN
HIKARI_LOG_LEVEL=WARN
```

**Option B: Manual Configuration**

If you prefer to manually enter the values from your PostgreSQL service:

```env
SPRING_DATASOURCE_URL=postgresql://postgres:pVAmAGfPdsTxvatXtMMymeeXWoFAqSvN@postgres.railway.internal:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=pVAmAGfPdsTxvatXtMMymeeXWoFAqSvN
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
SPRING_JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

**Option B: Manual Configuration**

If you prefer to manually enter the values:

1. Go to PostgreSQL service → **Variables** tab
2. Copy the `DATABASE_URL` value (e.g., `postgresql://user:pass@host:5432/dbname`)
3. Parse it and add to backend service:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/dbname
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=pass
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
SPRING_JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

---

### Step 3: Deploy Backend

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Migrate to PostgreSQL with production configs"
   git push
   ```

2. **Railway will automatically:**
   - Detect the push
   - Build your backend with PostgreSQL driver
   - Deploy with the new environment variables
   - Connect to PostgreSQL database

3. **Monitor deployment:**
   - Go to Railway → Backend service → **Deployments** tab
   - Watch the build logs
   - Check for any errors

---

## How It Works

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Railway Project                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Backend    │         │  PostgreSQL  │                 │
│  │   Service    │────────▶│   Database   │                 │
│  │  (Java App)  │  JDBC   │  (Persistent) │                 │
│  └──────────────┘         └──────────────┘                 │
│         │                         │                         │
│         │  Uses DATABASE_URL      │  Stores all data       │
│         │  env variable           │  (survives restarts)   │
│         └─────────────────────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Connection Flow

1. **Backend starts** → Reads `SPRING_DATASOURCE_URL` environment variable
2. **HikariCP pool** → Creates connection pool to PostgreSQL
3. **JPA/Hibernate** → Connects to PostgreSQL and manages schema
4. **Data persists** → All data stored in PostgreSQL (not in backend container)

---

## Data Migration from H2 to PostgreSQL

Since you're in development phase with minimal data, you have two options:

### Option A: Fresh Start (Recommended for Dev)

Since you said "not much data there", just start fresh:

1. **Deploy with PostgreSQL** (steps above)
2. **Register a new studio** to test
3. **Old H2 data is gone** (which is fine for dev)

### Option B: Export/Import H2 Data (If you have important test data)

If you need to preserve existing H2 data:

1. **Export H2 data locally:**
   ```bash
   # Start your local backend with H2
   cd focoman-backend
   mvn spring-boot:run
   
   # Access H2 console: http://localhost:8080/h2-console
   # JDBC URL: jdbc:h2:file:./data/focomandb
   # Run queries to export data:
   SELECT * FROM studios;
   SELECT * FROM users;
   # etc.
   ```

2. **Create SQL insert statements** from exported data

3. **Execute on Railway PostgreSQL:**
   ```bash
   # Install PostgreSQL client
   # Get Railway PostgreSQL connection details
   
   # Connect and run inserts
   psql -h host -U user -d database
   \i migrate_data.sql
   ```

---

## Verification Steps

### 1. Check Database Connection

After deployment, check Railway logs:

```bash
# In Railway → Backend service → Logs
# Look for:
"Started FocomanBackendApplication in X seconds"
"HikariPool-1 - Starting..."
"HikariPool-1 - Start completed."
```

### 2. Test Studio Creation

1. Go to your frontend (Vercel or local)
2. Create a new studio
3. Should succeed without errors

### 3. Verify Data Persistence

1. **Create a studio** → Note the credentials
2. **Trigger a Railway redeploy:**
   - Make a small change (e.g., update README)
   - Push to GitHub
   - Railway will redeploy
3. **Login with same credentials** → Should work! ✅

### 4. Check PostgreSQL Directly

In Railway → PostgreSQL service → **Query** tab:

```sql
-- List all studios
SELECT * FROM studios;

-- List all users
SELECT * FROM users;

-- Check connection
SELECT 1;
```

---

## Environment Variables Reference

### Required Variables (Backend Service)

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://host:5432/db` | ✅ Yes |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` or `neondb_owner` | ✅ Yes |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `your_password` | ✅ Yes |
| `SPRING_DATASOURCE_DRIVER` | JDBC driver class | `org.postgresql.Driver` | ✅ Yes |
| `SPRING_JPA_DIALECT` | Hibernate dialect | `org.hibernate.dialect.PostgreSQLDialect` | ✅ Yes |
| `APP_ENV` | Application environment | `production` | ✅ Yes |
| `SERVER_PORT` | Server port | `8080` | ✅ Yes |

### Optional Variables (with defaults)

| Variable | Description | Default Value | Notes |
|----------|-------------|---------------|-------|
| `H2_CONSOLE_ENABLED` | Enable H2 console | `false` (prod) / `true` (dev) | Keep `false` in prod |
| `JPA_DDL_AUTO` | Hibernate DDL mode | `validate` (prod) / `update` (dev) | Use `validate` in prod |
| `DB_POOL_MAX_SIZE` | Max connections | `20` | Adjust based on load |
| `DB_POOL_MIN_IDLE` | Min idle connections | `10` | Adjust based on load |
| `LOG_LEVEL` | App log level | `INFO` | Use `WARN` in prod |
| `SQL_LOG_LEVEL` | SQL log level | `WARN` | Keep `WARN` in prod |

---

## Common Issues & Solutions

### Issue 1: "Connection refused" or "Timeout"

**Cause:** Backend can't connect to PostgreSQL

**Solutions:**
- ✅ Verify `SPRING_DATASOURCE_URL` is correct
- ✅ Check PostgreSQL service is running in Railway
- ✅ Ensure backend service is linked to PostgreSQL service
- ✅ Check Railway logs for connection errors

### Issue 2: "Password authentication failed"

**Cause:** Wrong username or password

**Solutions:**
- ✅ Verify `SPRING_DATASOURCE_USERNAME` matches PostgreSQL `USER`
- ✅ Verify `SPRING_DATASOURCE_PASSWORD` matches PostgreSQL `PASSWORD`
- ✅ Use Railway's variable substitution: `${{Postgres.PASSWORD}}`

### Issue 3: "Database does not exist"

**Cause:** Wrong database name in connection URL

**Solutions:**
- ✅ Check `DATABASE_URL` in PostgreSQL service variables
- ✅ Ensure database name is included in `SPRING_DATASOURCE_URL`

### Issue 4: "SSL error" or "SSL connection required"

**Cause:** PostgreSQL requires SSL connection (common with Neon, Supabase)

**Solutions:**
- ✅ Add `?sslmode=require` to connection URL:
  ```
  SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/db?sslmode=require
  ```

### Issue 5: "Too many connections"

**Cause:** Connection pool too large or connections not being closed

**Solutions:**
- ✅ Reduce `DB_POOL_MAX_SIZE` (try 10-15)
- ✅ Check for connection leaks (enable `leak-detection-threshold`)
- ✅ Ensure all database connections are properly closed in code

---

## PostgreSQL Providers Comparison

### Railway PostgreSQL (Recommended for you)

**Pros:**
- ✅ Already using Railway for backend
- ✅ One-click setup
- ✅ Automatic backups
- ✅ Easy variable linking
- ✅ Same region as backend (low latency)

**Cons:**
- ❌ Free tier has limitations (but sufficient for dev/small prod)

**Setup:** Use the steps above

---

### Neon PostgreSQL (Alternative)

**Pros:**
- ✅ Generous free tier (3GB storage)
- ✅ Serverless (auto-scales to zero)
- ✅ Branching (like Git for databases)
- ✅ Fast performance

**Cons:**
- ❌ Separate service to manage
- ❌ Need to manually configure connection

**Setup:**
1. Sign up at https://neon.tech
2. Create project → Get connection string
3. Add to Railway environment variables:
   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxx.aws.neon.tech/dbname?sslmode=require
   SPRING_DATASOURCE_USERNAME=neondb_owner
   SPRING_DATASOURCE_PASSWORD=your_password
   SPRING_JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect
   ```

---

### Supabase PostgreSQL (Alternative)

**Pros:**
- ✅ Generous free tier (500MB)
- ✅ Built-in auth, storage, realtime
- ✅ Great developer experience

**Cons:**
- ❌ More features than you need
- ❌ Separate service

**Setup:**
1. Sign up at https://supabase.com
2. Create project → Get connection string
3. Add to Railway environment variables (same as Neon)

---

## Cost Estimate

### Railway PostgreSQL

- **Free Tier:** $5/month credit (Hobby plan)
  - Includes 512MB PostgreSQL database
  - 100 hours runtime
  - Perfect for development and small production

- **Pro Tier:** $20/month + usage
  - 8GB PostgreSQL database
  - Unlimited runtime
  - Better for production

### Neon PostgreSQL

- **Free Tier:** $0/month
  - 3GB storage
  - 100 hours compute/month
  - Perfect for development

- **Pro Tier:** $19/month
  - 10GB storage
  - Unlimited compute
  - Better for production

---

## Summary

### What You Need to Do:

1. ✅ **Add PostgreSQL plugin** in Railway (one click)
2. ✅ **Add environment variables** to backend service (copy-paste from above)
3. ✅ **Commit and push** code changes (pom.xml + application.yml)
4. ✅ **Railway auto-deploys** with PostgreSQL connection
5. ✅ **Test** studio creation and login
6. ✅ **Verify** data persists after redeploy

### What Happens Automatically:

- ✅ Railway creates PostgreSQL instance
- ✅ Railway injects connection credentials
- ✅ Railway builds and deploys backend
- ✅ Hibernate creates tables automatically (first run)
- ✅ Data persists across restarts

### What You Don't Need to Do:

- ❌ Manually install PostgreSQL
- ❌ Manually configure connection pooling (HikariCP is auto-configured)
- ❌ Manually create database schema (Hibernate does it)
- ❌ Manually backup database (Railway does it)

---

## Next Steps After Setup

1. **Test the complete flow:**
   - Register new studio
   - Login with same credentials
   - Verify dashboard loads
   - Trigger Railway redeploy
   - Login again (should still work)

2. **Monitor database:**
   - Railway → PostgreSQL → **Metrics** tab
   - Check connections, queries, storage

3. **Set up backups:**
   - Railway PostgreSQL has automatic backups
   - Configure backup schedule in PostgreSQL service settings

4. **Production checklist:**
   - [ ] PostgreSQL is linked to backend
   - [ ] Environment variables are set
   - [ ] Backend deploys successfully
   - [ ] Studio creation works
   - [ ] Login works
   - [ ] Data persists after restart
   - [ ] H2 console is disabled (`H2_CONSOLE_ENABLED=false`)
   - [ ] SQL logging is disabled (`SHOW_SQL=false`)
   - [ ] Error details are hidden (`include-message=never`)

---

## Questions Answered

### Q: Will the database be automatically added on git push?

**A:** No, but Railway makes it easy:
- Git push deploys your **code changes** (pom.xml, application.yml)
- PostgreSQL is a **separate service** you add via Railway UI (one click)
- Once added, Railway **automatically connects** them via environment variables

### Q: Does the DB need to be hosted or will it be bundled?

**A:** **It must be hosted separately.** PostgreSQL is a server process that:
- Runs in its own container/service
- Persists data independently
- Listens on a port for connections
- Is **NOT** bundled inside your backend JAR

Railway handles hosting both services (backend + PostgreSQL) and connects them.

### Q: How do I sync the database schema?

**A:** Hibernate handles this automatically:
- **Development:** `ddl-auto: update` → Auto-creates/modifies tables
- **Production:** `ddl-auto: validate` → Validates schema, doesn't modify

For production migrations, consider using **Flyway** or **Liquibase** (future enhancement).

---

## Support

If you encounter issues:
1. Check Railway logs (Backend service → Logs)
2. Check PostgreSQL logs (PostgreSQL service → Logs)
3. Verify environment variables are set correctly
4. Test connection using Railway's Query tool
5. Review this guide's "Common Issues" section