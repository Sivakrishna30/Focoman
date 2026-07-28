# JDBC URL Fix for Railway PostgreSQL

## Problem
Railway was providing the `SPRING_DATASOURCE_URL` environment variable without the `jdbc:` prefix, causing the following error:

```
java.lang.RuntimeException: Driver org.postgresql.Driver claims to not accept jdbcUrl, postgresql://postgres:...@postgres.railway.internal:5432/railway
```

## Root Cause
The PostgreSQL JDBC driver requires URLs to start with `jdbc:postgresql://`, but Railway's environment variable was providing:
- **Incorrect**: `postgresql://postgres:...@postgres.railway.internal:5432/railway`
- **Correct**: `jdbc:postgresql://postgres:...@postgres.railway.internal:5432/railway`

## Solution
Created a Spring Boot event listener (`DatasourceConfig.java`) that intercepts the environment preparation phase and automatically adds the `jdbc:` prefix if it's missing.

### Files Modified
1. **Created**: `focoman-backend/src/main/java/com/focoman/config/DatasourceConfig.java`
   - Implements `ApplicationListener<ApplicationEnvironmentPreparedEvent>`
   - Runs early in the Spring Boot startup process
   - Checks if `SPRING_DATASOURCE_URL` is missing the `jdbc:` prefix
   - Automatically prepends `jdbc:` if needed

### How It Works
1. The `ApplicationEnvironmentPreparedEvent` fires when the Spring Environment is ready but before the application context is created
2. The listener checks the `SPRING_DATASOURCE_URL` property
3. If the URL doesn't start with `jdbc:`, it prepends it
4. The corrected URL is added to the environment property sources with highest priority
5. When the datasource is created later, it uses the corrected URL

## Testing
After deploying to Railway, the application should now:
1. Receive the PostgreSQL URL from Railway (without `jdbc:` prefix)
2. Automatically add the `jdbc:` prefix during startup
3. Successfully connect to the PostgreSQL database

## Additional Notes
- The fix is transparent and doesn't affect local development (H2 database)
- No changes needed to Railway configuration
- Works with both PostgreSQL and other JDBC databases
- The solution is non-intrusive and follows Spring Boot best practices