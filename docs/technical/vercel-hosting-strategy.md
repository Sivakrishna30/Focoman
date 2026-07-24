# FOCOMAN - Vercel Hosting Strategy

## Architecture Overview

Since Focoman has two separate services (Next.js frontend + Spring Boot backend), Vercel can only host the frontend. The backend needs a separate hosting solution.

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                     │
│  https://focoman.vercel.app                              │
│  Next.js 15 + TypeScript + Tailwind CSS                  │
│                                                          │
│  Environment Variables:                                  │
│  - NEXT_PUBLIC_BACKEND_URL=https://api.focoman.com       │
│  - NEXT_PUBLIC_APP_ENV=production|testing                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Railway / Render / GCP Cloud Run            │
│              (Spring Boot Backend)                       │
│  https://focoman-api.up.railway.app                      │
│                                                          │
│  Environment Variables:                                  │
│  - SERVER_PORT=8080                                      │
│  - SPRING_DATASOURCE_URL=jdbc:postgresql://...           │
│  - SPRING_DATASOURCE_USERNAME=...                        │
│  - SPRING_DATASOURCE_PASSWORD=...                        │
│  - JWT_SECRET=...                                        │
└──────────────────────┬──────────────────────────────────┘
                       │ JDBC
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Neon / Supabase / Cloud SQL                 │
│              (PostgreSQL Database)                       │
│  postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech   │
└─────────────────────────────────────────────────────────┘
```

## Option 1: Recommended (Free/Cheap)

| Service | What | Cost |
|---------|------|------|
| **Vercel** | Frontend (Next.js) | Free |
| **Railway.app** | Backend (Spring Boot) | $5-10/month |
| **Neon.tech** | PostgreSQL Database | Free tier (0.5GB) |

### Steps:

1. **Frontend → Vercel**
   ```bash
   # In focoman-frontend/
   vercel --prod
   ```
   - Set env: `NEXT_PUBLIC_BACKEND_URL=https://focoman-api.up.railway.app`
   - Set env: `NEXT_PUBLIC_APP_ENV=testing` (for dev portal)

2. **Backend → Railway**
   ```bash
   # In focoman-backend/
   # Create a Dockerfile for Railway
   ```
   - Set env: `SPRING_DATASOURCE_URL=jdbc:postgresql://...`
   - Set env: `SPRING_DATASOURCE_USERNAME=...`
   - Set env: `SPRING_DATASOURCE_PASSWORD=...`

3. **Database → Neon**
   - Create free PostgreSQL database
   - Copy connection string to Railway env vars

## Option 2: All-in-One VPS (More Control)

| Service | What | Cost |
|---------|------|------|
| **Vercel** | Frontend (Next.js) | Free |
| **Hetzner/AWS EC2** | Backend + DB | $5-10/month |

## Option 3: Google Cloud (As per original design docs)

| Service | What | Cost |
|---------|------|------|
| **Vercel** | Frontend (Next.js) | Free |
| **Google Cloud Run** | Backend (Docker) | Pay-per-use |
| **Cloud SQL** | PostgreSQL | $10-20/month |

## Database Configuration

For production/testing, update `application.yml`:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    driverClassName: org.postgresql.Driver
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: update
```

## Frontend Environment Variables (Vercel)

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.focoman.com` | Backend API base URL |
| `NEXT_PUBLIC_APP_ENV` | `testing` or `production` | Controls dev portal visibility |

## Backend Environment Variables (Railway/Render)

| Variable | Value | Purpose |
|----------|-------|---------|
| `SERVER_PORT` | `8080` | Server port |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://...` | Database URL |
| `SPRING_DATASOURCE_USERNAME` | `...` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `...` | Database password |
| `JWT_SECRET` | `...` | JWT signing secret |

## Dockerfile for Backend (Railway/Render)

```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/focoman-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Deployment Checklist

- [ ] Create Neon PostgreSQL database
- [ ] Deploy backend to Railway with Dockerfile
- [ ] Set backend environment variables
- [ ] Deploy frontend to Vercel
- [ ] Set frontend environment variables
- [ ] Test API connectivity
- [ ] Verify dev portal visibility (testing vs production)
- [ ] Set up custom domain (optional)