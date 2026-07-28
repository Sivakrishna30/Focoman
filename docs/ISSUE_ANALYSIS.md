# Issue Analysis: Database Persistence & 404 Error

## Issues Identified

### 1. **Database Not Persisting on Railway** ❌

**Current Configuration:**
```yaml
# application.yml (line 5)
url: ${SPRING_DATASOURCE_URL:jdbc:h2:file:./data/focomandb;MODE=PostgreSQL;AUTO_SERVER=TRUE}
```

**Problem:**
- Using H2 file-based database stored at `./data/focomandb`
- Railway uses **ephemeral filesystem** - all files are lost when container restarts
- Every deployment/restart wipes the database completely
- This explains why "entries are not really saving in the db"

**Impact:**
- Studios created are lost on Railway restart
- Users cannot log in after deployment cycles
- All data (studios, users, orders) is temporary

---

### 2. **404 Error After Studio Creation** ❌

**Flow Analysis:**

1. **Studio Creation** (HomePage.tsx:119-125)
   ```typescript
   if (res.success) {
     setCreatedStudioInfo({
       studioId: res.studioId || `STU-100201`,
       brandName: adminSignupForm.brandName,
       ownerName: adminSignupForm.ownerName,
       prefix: res.studioPrefix || adminSignupForm.prefix,
     });
   }
   ```

2. **Navigation** (HomePage.tsx:121-125)
   ```typescript
   onClick={() => router.push(`/${createdStudioInfo.prefix.toLowerCase()}/dashboard/erp`)}
   ```

3. **Dashboard Layout** (layout.tsx:9-10)
   ```typescript
   const response = await fetch(`${BACKEND_URL}/api/studios/${encodeURIComponent(studioSlug)}`);
   if (!response.ok) notFound();  // ⚠️ Returns 404 if studio not found
   ```

4. **Backend Endpoint** (StudioProfileController.java:18-24)
   ```java
   @GetMapping("/{prefix}")
   public ResponseEntity<StudioProfileResponse> getByPrefix(@PathVariable String prefix) {
     return studioRepository.findByPrefixIgnoreCase(prefix)
       .map(studio -> ResponseEntity.ok(...))
       .orElseGet(() -> ResponseEntity.notFound().build());  // ⚠️ Returns 404
   }
   ```

**Root Causes:**
1. **Database wiped** → Studio doesn't exist → 404 error
2. **Prefix mismatch** → Frontend uses lowercase, backend stores uppercase
   - Frontend: `router.push(`/${prefix.toLowerCase()}/dashboard`)`
   - Backend lookup: `findByPrefixIgnoreCase(prefix)` ✓ (case-insensitive, so this is OK)

**Actual Problem:**
The studio IS being created in the database, but since H2 is file-based on Railway's ephemeral filesystem, the data is lost immediately after creation or on next restart.

---

## Solutions Required

### Solution 1: Switch to Persistent Database (REQUIRED)

**Option A: Railway PostgreSQL (Recommended)**
1. Add PostgreSQL plugin in Railway
2. Update `application.yml`:
   ```yaml
   spring:
     datasource:
       url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/focomandb}
       driverClassName: org.postgresql.Driver
       username: ${SPRING_DATASOURCE_USERNAME:postgres}
       password: ${SPRING_DATASOURCE_PASSWORD:}
     jpa:
       database-platform: org.hibernate.dialect.PostgreSQLDialect
   ```

**Option B: Neon PostgreSQL (Free Tier)**
1. Sign up at https://neon.tech
2. Create database and get connection string
3. Set `SPRING_DATASOURCE_URL` environment variable in Railway

**Option C: Supabase PostgreSQL**
1. Sign up at https://supabase.com
2. Create project and get connection string
3. Set environment variables in Railway

---

### Solution 2: Fix Frontend-Backend Field Mapping

**Current Issue:**
- `StudioProfileResponse` expects: `studioName` (3rd parameter)
- `StudioEntity` has field: `name`
- Controller passes: `studio.getName()` ✓ (correct)

**Status:** ✅ This is actually correct! The record maps correctly.

**Verification:**
```java
// StudioProfileResponse record
public record StudioProfileResponse(
    String studioId,      // 1st param
    String prefix,        // 2nd param
    String studioName,    // 3rd param ← receives studio.getName()
    String brandName,     // 4th param
    String ownerName,     // 5th param
    String city           // 6th param
) {}

// Controller passes:
new StudioProfileResponse(
    studio.getId(),           // studioId ✓
    studio.getPrefix(),       // prefix ✓
    studio.getName(),         // studioName ✓ (Entity field "name" → Response field "studioName")
    studio.getBrandName(),    // brandName ✓
    ownerName,                // ownerName ✓
    studio.getCity()          // city ✓
);
```

**Frontend Access:**
```typescript
// layout.tsx line 12
studioName={studio.studioName}  // ✓ Correct - matches record field name
ownerName={studio.ownerName}    // ✓ Correct
```

---

## Immediate Actions Needed

### Priority 1: Database Migration (CRITICAL)
1. Choose a PostgreSQL provider (Railway plugin, Neon, or Supabase)
2. Update `application.yml` with PostgreSQL config
3. Set environment variables in Railway
4. Redeploy backend

### Priority 2: Verify Data Persistence
1. Create a test studio
2. Check if it persists after Railway restart
3. Verify login works after creation

### Priority 3: Test Complete Flow
1. Register new studio
2. Verify redirect to dashboard works
3. Verify login with same credentials works
4. Test data persistence across restarts

---

## Environment Variables to Set in Railway

```env
# For PostgreSQL (Example for Neon)
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxx.us-east-1.aws.neon.tech/focomandb?sslmode=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# Disable H2 console in production
H2_CONSOLE_ENABLED=false

# App environment
APP_ENV=production
SERVER_PORT=8080
```

---

## Testing Checklist

- [ ] Database is PostgreSQL (not H2 file-based)
- [ ] Environment variables are set in Railway
- [ ] Backend deploys successfully
- [ ] Studio creation succeeds
- [ ] Studio data persists after backend restart
- [ ] Login works with created credentials
- [ ] Dashboard loads without 404 error
- [ ] Data survives Railway deployment cycles