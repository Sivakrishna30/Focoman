# DevPortal - Internal Task Management System

## Overview
The DevPortal is a standalone internal tool for the Focoman development team (Siva, Asif, Rohith, Manohar) to track bugs, enhancements, tasks, and project management. It is **not** accessible from the main dashboard sidebar.

## Access
- **URL**: `/devportal`
- **From Homepage**: Click "Dev Portal (Internal)" link in the footer or after studio registration
- **No Authentication Required**: Currently open for internal team use

## Features

### 1. Task Management Table
- **Full table view** of all tasks with columns:
  - ID, Title, Type, Priority, Status, Assigned To, Module, Reported By, Actions
- **Inline editing**:
  - Change task status via dropdown
  - Assign tasks by typing name and pressing Enter
  - Delete tasks with confirmation
- **Filtering**:
  - By status (Open, In Progress, In Review, Testing, Done, Closed)
  - By module (Frontend, Backend, CRM, ERP, OMS, Auth, UI, Team)
  - By assignee (dynamic list based on current assignments)

### 2. Task Creation
- Click "+ New Task" button to open creation panel
- Fields:
  - Title (required)
  - Description (required)
  - Type: Bug, Feature, Enhancement, Task, Team
  - Priority: Low, Medium, High, Critical
  - Module: Frontend, Backend, CRM, ERP, OMS, Auth, UI, Team
  - Reported By (your name)

### 3. Database Inspector
- Click "Show DB Inspector" to toggle side panel
- **Connection Status**: Shows if database is connected (via Spring Boot Actuator)
- **Table Statistics**: Real-time counts of tasks by status
- **Recent Activity**: Last 5 updated tasks with timestamps
- **Database Access Info**: Direct connection details for manual queries

## Team Members
The following team members are pre-configured in the system (all as team members - no roles):
1. **Siva**
2. **Asif**
3. **Rohith**
4. **Manohar**

## Database Verification

### Check Database Connection
The DevPortal displays database connection status in real-time:
- **Green dot**: Database connected
- **Red dot**: Database disconnected

### Verify Data is Being Saved

#### Method 1: Using DevPortal UI
1. Create a new task using the "+ New Task" button
2. Verify it appears in the table immediately
3. Check the "Database Inspector" panel shows updated counts
4. Refresh the page - task should persist

#### Method 2: Using Railway SQL Editor
1. Go to your Railway project dashboard
2. Navigate to PostgreSQL service
3. Click "Query" tab
4. Run SQL queries:

```sql
-- Check if dev_tasks table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'dev_tasks';

-- Count total tasks
SELECT COUNT(*) FROM dev_tasks;

-- View all tasks
SELECT id, title, type, priority, status, assigned_to, module, reported_by, created_at, updated_at 
FROM dev_tasks 
ORDER BY updated_at DESC;

-- Check team members
SELECT id, title, assigned_to, module 
FROM dev_tasks 
WHERE module = 'TEAM';
```

#### Method 3: Using psql Command Line
```bash
# Connect to Railway PostgreSQL
psql -h postgres.railway.internal -U postgres -d railway

# Once connected, run queries:
\dt  # List all tables
SELECT * FROM dev_tasks;  # View all tasks
```

### Method 4: Using Spring Boot Actuator
The application exposes health endpoints:
- `GET /actuator/health` - Overall health status
- `GET /actuator/health/db` - Database-specific health
- `GET /actuator/metrics` - Application metrics

## Backend API Endpoints

### Task Operations
- `GET /api/dev/tasks` - Get all tasks
- `GET /api/dev/tasks/status/{status}` - Filter by status
- `GET /api/dev/tasks/assignee/{assignee}` - Filter by assignee
- `POST /api/dev/tasks` - Create new task
  - Parameters: title, description, type, priority, reportedBy, module
- `PUT /api/dev/tasks/{taskId}/status` - Update task status
  - Parameters: status
- `PUT /api/dev/tasks/{taskId}/assign` - Assign task
  - Parameters: assignedTo
- `DELETE /api/dev/tasks/{taskId}` - Delete task

### Database Schema
Table: `dev_tasks`
```sql
- id: VARCHAR (Primary Key, e.g., "TASK-001")
- title: VARCHAR (Not null)
- description: TEXT
- type: VARCHAR (Not null) - BUG, FEATURE, ENHANCEMENT, TASK, TEAM
- priority: VARCHAR (Not null) - LOW, MEDIUM, HIGH, CRITICAL
- status: VARCHAR (Not null) - OPEN, IN_PROGRESS, IN_REVIEW, TESTING, DONE, CLOSED
- assigned_to: VARCHAR (Nullable)
- reported_by: VARCHAR (Not null)
- module: VARCHAR - FRONTEND, BACKEND, CRM, ERP, OMS, AUTH, UI, TEAM
- created_at: TIMESTAMP (Not null)
- updated_at: TIMESTAMP (Not null)
```

## Troubleshooting

### Database Not Connected
1. Check Railway PostgreSQL service is running
2. Verify `SPRING_DATASOURCE_URL` environment variable is set correctly
3. Check application logs for connection errors
4. Ensure JDBC URL has `jdbc:` prefix (auto-fixed by DatasourceConfig)

### Tasks Not Persisting
1. Verify database connection is UP (green indicator)
2. Check browser console for API errors
3. Verify backend is running and accessible
4. Check Railway logs for exceptions

### Can't Access DevPortal
1. Ensure you're navigating to `/devportal` (not under `/dashboard`)
2. Check that the route exists in Next.js app
3. Verify backend API is responding

## Development Notes

### Frontend
- Location: `focoman-frontend/src/app/devportal/page.tsx`
- API Service: `focoman-frontend/src/services/devPortalApi.ts`

### Backend
- Entity: `focoman-backend/src/main/java/com/focoman/devportal/entity/TaskEntity.java`
- Repository: `focoman-backend/src/main/java/com/focoman/devportal/repository/TaskRepository.java`
- Service: `focoman-backend/src/main/java/com/focoman/devportal/service/DevPortalService.java`
- Controller: `focoman-backend/src/main/java/com/focoman/devportal/controller/DevPortalController.java`

### Database Configuration
- Auto-fix for Railway JDBC URL: `focoman-backend/src/main/java/com/focoman/config/DatasourceConfig.java`
- Application config: `focoman-backend/src/main/resources/application.yml`

## Security Note
Currently, the DevPortal has no authentication. It's intended for internal team use only. For production deployment, consider adding:
- Team member authentication
- Role-based access control
- IP whitelisting
- API rate limiting