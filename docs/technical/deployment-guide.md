# FOCOMAN - Deployment Guide

## Prerequisites
- GitHub repository connected
- Railway.app account
- Neon PostgreSQL database
- Vercel account

## Step 1: Deploy Backend to Railway

1. **Connect Repository:**
   - Go to https://railway.app
   - New Project → Deploy from GitHub
   - Select `Sivakrishna30/Focoman` repository
   - Select `focoman-backend` as the service

2. **Configure Environment Variables in Railway:**
   ```
   SERVER_PORT=8080
   SPRING_DATASOURCE_URL=jdbc:postgresql://...
   SPRING_DATASOURCE_USERNAME=railway
   SPRING_DATASOURCE_PASSWORD=...
   JWT_SECRET=your-jwt-secret-key-here
   ```

3. **Deploy:**
   - Railway will auto-build using the Dockerfile
   - Wait for build to complete
   - Railway will provide a URL like `https://focoman-backend.up.railway.app`

## Step 2: Deploy Frontend to Vercel

1. **Deploy:**
   ```bash
   cd focoman-frontend
   vercel --prod
   ```
   Or use Vercel dashboard:
   - Import from GitHub repository
   - Select `focoman-frontend` folder
   - Deploy

2. **Configure Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://focoman-backend.up.railway.app
   NEXT_PUBLIC_APP_ENV=testing
   ```

3. **Custom Domain (Optional):**
   - Add domain in Vercel dashboard
   - Update DNS records
   - Example: `https://focoman.com`

## Step 3: Setup Database (Neon)

1. **Create Database:**
   - Go to https://neon.tech
   - Sign up / Login
   - Create new project: `focoman-db`
   - Copy connection string

2. **Connection String Format:**
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/focoman?sslmode=require
   ```

3. **Update Railway Environment:**
   - Paste connection string as `SPRING_DATASOURCE_URL`
   - Extract username and password from connection string
   - Set `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`

## Step 4: Verify Deployment

1. **Test Backend:**
   ```bash
   curl https://focoman-backend.up.railway.app/api/crm/customers?studioId=STU-100201
   ```
   Should return JSON with customers

2. **Test Frontend:**
   - Open https://focoman.vercel.app
   - Login with test credentials
   - Verify CRM, ERP, OMS pages load

3. **Test Dev Portal:**
   - Navigate to https://focoman.vercel.app/devportal
   - Should show task list (only in testing mode)

## Environment Variables Summary

### Frontend (Vercel)
| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://focoman-backend.up.railway.app` | Yes |
| `NEXT_PUBLIC_APP_ENV` | `testing` or `production` | Yes |

### Backend (Railway)
| Variable | Value | Required |
|----------|-------|----------|
| `SERVER_PORT` | `8080` | No (default) |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://...` | Yes (production) |
| `SPRING_DATASOURCE_USERNAME` | `...` | Yes (production) |
| `SPRING_DATASOURCE_PASSWORD` | `...` | Yes (production) |
| `JWT_SECRET` | `...` | Yes (production) |

## Database Migration

The app supports both H2 (local) and PostgreSQL (production):

- **Local:** Uses `./data/focomandb` (H2 file database)
- **Production:** Uses PostgreSQL via environment variables

No manual migration needed - Hibernate `ddl-auto: update` will create tables automatically.

## Cost Estimate

| Service | Monthly Cost |
|---------|--------------|
| Vercel (Frontend) | Free |
| Railway (Backend) | $5-10 |
| Neon (Database) | Free (0.5GB) |
| **Total** | **$5-10/month** |

## Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Verify PostgreSQL connection string
- Ensure all environment variables are set

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_BACKEND_URL` in Vercel
- Check CORS settings in backend
- Test backend URL directly in browser

### Database connection issues
- Verify Neon database is active
- Check connection string format
- Ensure SSL mode is enabled (`sslmode=require`)

## Next Steps

1. Set up monitoring (Railway metrics / Vercel Analytics)
2. Configure custom domain
3. Set up CI/CD for automatic deployments
4. Add error tracking (Sentry)
5. Configure backup strategy for database