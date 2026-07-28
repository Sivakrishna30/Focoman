# Quick Setup Guide - Railway PostgreSQL

## Your Railway PostgreSQL Variables

You already have PostgreSQL added to Railway. Here are your actual variables:

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

---

## What You Need to Do Right Now

### Step 1: Add Variables to Backend Service

Go to Railway → **Your Backend Service** → **Variables** tab → **New Variable**

Add these **5 variables**:

```
SPRING_DATASOURCE_URL=${{Postgres.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
SPRING_JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

**Important:** 
- Add these to your **backend service** (the Java app), NOT the PostgreSQL service
- Use the format `${{Postgres.VARIABLE_NAME}}` to reference PostgreSQL variables

---

### Step 2: Add Production Variables

Still in backend service → **Variables** tab, add these:

```
APP_ENV=production
H2_CONSOLE_ENABLED=false
JPA_DDL_AUTO=validate
SERVER_PORT=8080
```

---

### Step 3: Push Code Changes

```bash
cd c:/Users/DELL/Downloads/FocoMan

# Stage all changes
git add .

# Commit
git commit -m "Migrate to PostgreSQL with production configs"

# Push to GitHub
git push
```

---

### Step 4: Railway Auto-Deploys

After you push:
1. Railway detects the push
2. Builds your backend with PostgreSQL driver
3. Deploys with the new environment variables
4. Connects to PostgreSQL database
5. **Watch the deployment in Railway → Backend → Deployments**

---

## Verification

### Check Deployment Logs

In Railway → Backend service → **Logs**, look for:

```
✅ Started FocomanBackendApplication in X seconds
✅ HikariPool-1 - Starting...
✅ HikariPool-1 - Start completed.
✅ Connected to PostgreSQL database
```

### Test Studio Creation

1. Go to your frontend
2. Create a new studio
3. Should succeed

### Verify Data Persistence

1. Create a studio (note credentials)
2. Make a small change to any file
3. Push to GitHub
4. Wait for Railway redeploy
5. Login with same credentials → **Should work!** ✅

---

## How to Link Services in Railway

If you haven't linked PostgreSQL to backend yet:

1. Go to Railway project
2. Click on your **backend service**
3. Go to **Settings** tab
4. Under **Service Connections**, click **+ Connect**
5. Select **PostgreSQL**
6. Click **Connect**

This creates the connection so `${{Postgres.VARIABLE}}` works.

---

## Visual Guide

```
Railway Project Structure:
┌─────────────────────────────────────────┐
│  Focoman Project                        │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Backend     │  │  PostgreSQL  │   │
│  │  Service     │◀─│  Service     │   │
│  │  (Java App)  │  │  (Database)  │   │
│  └──────────────┘  └──────────────┘   │
│       │                  │             │
│       │  Uses            │  Stores     │
│       │  ${{Postgres.   │  all data   │
│       │  DATABASE_URL}} │             │
│       └─────────────────┘             │
│                                         │
└─────────────────────────────────────────┘
```

---

## Troubleshooting

### "Variable ${{Postgres.DATABASE_URL}} not found"

**Solution:** Link PostgreSQL to backend service:
1. Backend service → Settings → Service Connections
2. Connect to PostgreSQL

### "Connection refused"

**Solution:** Check variables are correct:
- `SPRING_DATASOURCE_URL` should be `${{Postgres.DATABASE_URL}}`
- `SPRING_DATASOURCE_USERNAME` should be `${{Postgres.PGUSER}}`
- `SPRING_DATASOURCE_PASSWORD` should be `${{Postgres.POSTGRES_PASSWORD}}`

### "Password authentication failed"

**Solution:** Use Railway variable substitution (don't hardcode password):
- ✅ Correct: `SPRING_DATASOURCE_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}`
- ❌ Wrong: `SPRING_DATASOURCE_PASSWORD=pVAmAGfPdsTxvatXtMMymeeXWoFAqSvN`

---

## Summary

**You have:**
- ✅ PostgreSQL service in Railway (with those variables)
- ✅ Backend code updated (pom.xml + application.yml)
- ✅ Documentation created

**You need to do:**
1. Add 5 Spring Boot variables to backend service (using `${{Postgres.xxx}}`)
2. Add 4 production variables to backend service
3. Push code to GitHub
4. Wait for Railway deployment

**That's it!** Railway handles everything else automatically.

---

## Files Changed

```
focoman-backend/
├── pom.xml (added PostgreSQL dependency)
└── src/main/resources/
    ├── application.yml (dual DB support + connection pooling)
    └── application-prod.yml (production configs)

docs/
├── ISSUE_ANALYSIS.md (root cause analysis)
├── RAILWAY_POSTGRESQL_SETUP.md (detailed guide)
└── QUICK_SETUP_GUIDE.md (this file)
```

---

## Next Steps

1. **Right now:** Add variables to Railway backend service
2. **Then:** Push code changes
3. **Finally:** Test studio creation and login
4. **Verify:** Data persists after redeploy

**Total time:** 10 minutes
**Difficulty:** Easy (copy-paste variables)

---

## Questions?

- Check `docs/RAILWAY_POSTGRESQL_SETUP.md` for detailed explanations
- Check `docs/ISSUE_ANALYSIS.md` for root cause analysis
- Railway logs are your best friend for debugging

**You're almost there! Just add those variables and push the code.** 🚀