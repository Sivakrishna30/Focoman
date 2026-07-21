# FOCOMAN Recommended Architecture

This is an architectural decision that will affect Focoman for years. Given the product stage (MVP to startup to SaaS), Focoman should not start with microservices.

## Recommended Architecture

```text
GitHub Repository
│
├── focoman-frontend/      (Next.js)
├── focoman-backend/       (Spring Boot)
└── docs/                  (Project Proposal, Design Docs, APIs)
```

Keep frontend and backend as separate projects, but in the same Git repository, a monorepo, or separate repositories if preferred. For a small team, a monorepo is often simpler.

## Backend Structure

Within the backend, use a modular monolith.

```text
com.focoman

├── auth
├── dashboard
├── customer
├── lead
├── order
├── employee
├── payment
├── notification
├── integrations
│     ├── whatsapp
│     ├── googlecalendar
│     └── googledrive
├── common
├── security
├── config
└── exception
```

Each module contains its own:

```text
order

├── controller
├── service
├── repository
├── entity
├── dto
└── mapper
```

This is clean, maintainable, and easy to split into microservices later if needed.

## Frontend Structure

```text
src/

components/
pages (or app/)
features/

    orders/

    customers/

    dashboard/

    employees/

services/

hooks/

utils/

types/
```

Keep business features grouped together rather than grouping by file type alone.

## Why Not Microservices Now?

Microservices add complexity:

- API Gateway
- Service discovery
- Distributed logging
- Distributed transactions
- Multiple deployments
- Network communication
- More DevOps work

For 20 to 200 studios, this complexity usually is not justified.

A modular monolith can comfortably handle thousands of users if designed well.

## Downtime During Deployment

This is solved by deployment strategy, not by microservices alone.

Recommended flow:

```text
Developer

↓

GitHub

↓

GitHub Actions

↓

Build Docker Image

↓

Deploy to Staging (Pre-Prod)

↓

Automated Tests

↓

Manual Verification

↓

Deploy to Production
```

## Environments

Maintain separate environments:

```text
Development

↓

QA / Test

↓

Staging (Pre-Production)

↓

Production
```

Each environment should have its own:

- Database
- Configuration
- Secrets
- URLs

Never let developers test directly on Production.

## UI Changes

If the frontend only communicates through versioned REST APIs:

```text
Frontend

↓

REST API

↓

Backend
```

you can deploy UI independently of the backend, provided the API contract has not changed.

If the API changes:

- Add a new endpoint or a new API version.
- Keep the old one until the new frontend is deployed.
- Then remove the old version later.

## Database Changes

Avoid changing tables directly in production.

Use migration tools such as Flyway, commonly used with Spring Boot.

```text
Version 1

↓

Migration

↓

Version 2
```

This keeps schema changes repeatable and safe.

## Zero-Downtime Deployment

With Google Cloud Run:

```text
Version 1

↓

Deploy Version 2

↓

Health Check

↓

Traffic Shift

↓

100% to Version 2

↓

Version 1 Removed
```

Users typically will not notice the deployment.

## Should Frontend and Backend Be in One Server?

Yes, they can be deployed separately:

```text
Next.js

↓

Cloud Run Service A

Spring Boot

↓

Cloud Run Service B

Cloud SQL
```

Advantages:

- Deploy frontend without touching backend.
- Deploy backend without rebuilding frontend.
- Independent scaling.

## Recommended Architecture for Focoman

```text
GitHub (Monorepo)

├── focoman-frontend
├── focoman-backend
└── docs
```

Backend:

- Modular Monolith, feature-based packages

Frontend:

- Feature-based architecture

Deployment:

- Frontend to Google Cloud Run
- Backend to Google Cloud Run
- Database to Google Cloud SQL
- CDN/Security to Cloudflare

CI/CD:

- GitHub Actions
- Docker
- Staging to Production

## Migration Path

Phase 1 (Current):

- Modular Monolith

Phase 2 (100+ studios):

- Optimize modules, caching, background jobs

Phase 3 (1,000+ studios or clear scaling needs):

- Extract high-load modules, for example Notifications or Reporting, into independent microservices if they become bottlenecks.

This approach avoids premature complexity while keeping a clear path to scale. For a startup like Focoman, it is generally the best balance of development speed, maintainability, deployment safety, and future growth.
