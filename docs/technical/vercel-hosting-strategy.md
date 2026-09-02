# FOCOMAN - Vercel & Cloud Deployment Strategy

**Document Type:** Technical Deployment Specification  
**Status:** Active Target Specification  
**Project:** Focoman  
**Supersedes:** Legacy Vercel + Spring Boot + Railway Deployment Strategy  

---

## 1. Primary Target Architecture: Google Cloud Run

For production multi-region deployments, Focoman is deployed as a single containerized **Next.js 15 App Router** instance on **Google Cloud Run**, integrated with **Firebase Authentication** and **Google Cloud Firestore**.

```text
User Request
     ↓
Google Cloud Run (Integrated Next.js Application Container)
     ↓
Firebase Auth & Google Cloud Firestore
```

---

## 2. Secondary Static Asset Hosting Strategy (Vercel)

If static frontend caching or global edge asset distribution is enabled via Vercel, the Next.js application deploys directly to Vercel while connecting to server-side Firebase & Google Cloud infrastructure.

```text
┌─────────────────────────────────────────────────────────┐
│                    Vercel Edge (Frontend)                │
│  https://focoman.vercel.app                             │
│  Next.js 15 App Router + TypeScript + Tailwind          │
└──────────────────────┬──────────────────────────────────┘
                       │ Server Actions & API Handlers
                       ▼
┌─────────────────────────────────────────────────────────┐
│            Google Cloud & Firebase Platform             │
│  - Firebase Authentication                               │
│  - Google Cloud Firestore (Native Document Database)    │
│  - Google Cloud Run (Server-Side Microservices/Tasks)    │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Environment Variables Summary

### Client-Side Variables (`apps/web`)

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | GCP / Firebase Project ID |

### Server-Side Privileged Variables (Server-Only)

| Variable | Description |
| :--- | :--- |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin SDK Private Key |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin Service Account Email |
| `WHATSAPP_BUSINESS_API_TOKEN` | WhatsApp Business API Credentials |

---

## 4. Superseded Architecture Notes

- Legacy deployment modes using separate Java Spring Boot containers, Railway, Neon PostgreSQL, or Cloud SQL are **SUPERSEDED** and archived.