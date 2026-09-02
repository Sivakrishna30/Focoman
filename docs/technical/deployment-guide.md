# FOCOMAN Deployment Guide — Google Cloud Run & Firebase

**Document Type:** Technical Deployment Guide  
**Status:** Active Target Specification  
**Project:** Focoman  
**Supersedes:** Legacy Railway / PostgreSQL Deployment Guide  

---

## 1. Architecture Overview

Focoman is deployed as a single containerized Next.js 15 application on **Google Cloud Run**, integrated with **Firebase Authentication** and **Google Cloud Firestore**.

```text
GitHub (Sivakrishna30/Focoman)
        ↓
GitHub Actions CI/CD Pipeline
        ↓
Docker Container Build (Next.js Standalone)
        ↓
Google Cloud Run Deployment
        ↓
Firebase Services (Firestore & Firebase Auth)
```

---

## 2. Prerequisites

1. **Google Cloud Platform (GCP) Project** with billing enabled.
2. **Firebase Project** created and linked to the GCP Project.
3. **Firestore Database** initialized in Native Mode.
4. **Firebase Authentication** enabled (Email/Password & Anonymous Auth).
5. **Google Cloud Run API & Container Registry / Artifact Registry** enabled.
6. **GitHub Repository Secrets** configured for automated deployment.

---

## 3. Environment Variables Strategy

### Web Application (`apps/web`)

| Variable | Description | Exposed to Client? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Client API Key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | GCP / Firebase Project ID | Yes |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin SDK Private Key | **NO (Server-Only)** |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin Service Account Email | **NO (Server-Only)** |
| `WHATSAPP_BUSINESS_API_TOKEN` | WhatsApp API Credentials | **NO (Server-Only)** |

---

## 4. Google Cloud Run Deployment Steps

### Step 1: Container Build

Using the project Dockerfile:
```bash
docker build -t gcr.io/[PROJECT_ID]/focoman-web:latest -f apps/web/Dockerfile .
```

### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy focoman-web \
  --image gcr.io/[PROJECT_ID]/focoman-web:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10
```

---

## 5. Superseded Railway & Relational Deployment Notes

- Legacy deployment instructions using `railway.json`, `nixpacks.toml`, Railway, Neon PostgreSQL, or Cloud SQL are **SUPERSEDED** and archived.
- Google Cloud Run + Firebase represents the active production deployment target.