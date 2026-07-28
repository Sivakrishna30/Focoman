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
Created a Spring Boot `EnvironmentPostProcessor` (`JdbcUrlEnvironmentPostProcessor.java`) that intercepts the environment preparation phase and automatically adds the `jdbc:` prefix if it's missing. This processor handles both `SPRING_DATASOURCE_URL` and the default Railway `DATABASE_URL`.

### Files Modified
1. **Created**: `focoman-backend/src/main/java/com/focoman/config/JdbcUrlEnvironmentPostProcessor.java`
   - Implements `EnvironmentPostProcessor`
   - Automatically detects PostgreSQL URLs missing the `jdbc:` prefix
   - Sets the correct driver class and Hibernate dialect for PostgreSQL
2. **Registered**: `focoman-backend/src/main/resources/META-INF/spring.factories`
   - Ensures the processor runs during Spring Boot startup

### How It Works
1. The `EnvironmentPostProcessor` runs very early in the Spring Boot lifecycle
2. It checks for `SPRING_DATASOURCE_URL` or `DATABASE_URL` environment variables
3. If a URL is found starting with `postgresql://`, it:
   - Prepends `jdbc:` to create a valid JDBC URL
   - Sets `spring.datasource.url` to the corrected value
   - Sets `spring.datasource.driver-class-name` to `org.postgresql.Driver`
   - Sets `spring.jpa.database-platform` to `org.hibernate.dialect.PostgreSQLDialect`
4. These properties are added to the environment with the highest priority, overriding any incorrect settings

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