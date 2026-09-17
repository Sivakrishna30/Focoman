# FOCOMAN Quick Setup & Development Guide

**Document Type:** Developer Setup & Operational Reference  
**Status:** Active Target Specification  
**Project:** Focoman  
**Architecture:** 100% Full-Stack JavaScript / TypeScript Monorepo  

---

## 1. Prerequisites

Before running Focoman locally, ensure you have:

- **Node.js**: v20.x or v22.x LTS installed
- **Package Manager**: `npm` (v10+) or `pnpm` (v9+)
- **Git**: v2.40+
- **Google / Firebase Account**: For Firebase Authentication & Firestore (or local emulator)

---

## 2. Project Monorepo Structure

Focoman is structured as a unified TypeScript monorepo:

```text
focoman/
├── apps/
│   └── web/                   # Next.js 15 App Router application
│       ├── src/app/           # Pages, Layouts, and Server Actions
│       ├── src/components/    # Shared UI components
│       ├── src/features/      # Domain feature views (OMS, CRM, ERP, WhatsApp)
│       ├── src/lib/           # Firebase client & Server Auth helpers
│       └── package.json
│
├── packages/                  # Shared modular TypeScript packages
│   ├── types/                 # Shared domain contracts (Order, Studio, Member, Task)
│   ├── validation/            # Zod validation schemas
│   ├── domain/                # Workflow generators & business rules
│   ├── db/                    # Server-Only Firestore Admin repository
│   ├── auth/                  # Server-side Firebase Auth verification
│   └── config/                # Environment & constants
│
├── docs/                      # Authoritative specifications & architecture
│   ├── product/               # Product Discovery Document (OMS-First)
│   ├── technical/             # Technical designs & deployment guides
│   └── Index.md               # Documentation map
├── package.json               # Root workspace scripts
└── .env.example               # Reference environment variables
```

---

## 3. Local Environment Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-org/focoman.git
cd focoman

# Install all workspace dependencies
npm install
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `apps/web/.env.local` (or root `.env`):

```bash
cp .env.example apps/web/.env.local
```

Populate the required environment variables:

```env
# Client-Side Firebase Configuration (Required for Google Sign-In)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=focoman-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=focoman-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=focoman-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1076087076684
NEXT_PUBLIC_FIREBASE_APP_ID=1:1076087076684:web:e8bcf...

# Server-Side Firebase Admin SDK (Required for Server Actions & Firestore)
FIREBASE_PROJECT_ID=focoman-app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@focoman-app.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...-----END PRIVATE KEY-----\n"

# Operational WhatsApp Alerts (Optional for local testing)
WHATSAPP_BUSINESS_API_TOKEN=
```

---

## 4. Running the Application

### Start Development Server

```bash
# From workspace root
npm run dev
```

The Next.js 15 development server starts on `http://localhost:3000`.

### Key Application Routes

| URL Route | Purpose & Description |
| :--- | :--- |
| `http://localhost:3000` | Focoman landing page and studio sign-in |
| `http://localhost:3000/sign-in` | Google Sign-In authentication entry point |
| `http://localhost:3000/workspaces` | Multi-studio workspace selector |
| `http://localhost:3000/onboarding/register-studio` | Register new photography studio & unique slug |
| `http://localhost:3000/onboarding/join-studio` | Join existing studio via invitation token |
| `http://localhost:3000/[studioSlug]/dashboard` | Studio operations dashboard overview |
| `http://localhost:3000/[studioSlug]/dashboard/oms` | Confirmed Order Management & post-event workflows |
| `http://localhost:3000/[studioSlug]/dashboard/crm` | Customer contact directory & order history |
| `http://localhost:3000/[studioSlug]/dashboard/erp` | Crew management & resource assignment |
| `http://localhost:3000/[studioSlug]/dashboard/whatsapp` | WhatsApp milestone notification operational hub |
| `http://localhost:3000/track/[passkey]` | Guest customer order tracker (no login required) |
| `http://localhost:3000/devportal` | Internal system status and engineering task manager |

---

## 5. Verification & Testing

Verify that the codebase compiles cleanly and passes all linting rules:

```bash
# Run ESLint across web app and packages
npm run lint

# Run production build compilation
npm run build
```

---

## 6. Common Development Workflows

### Testing Confirmed Order Workflow (OMS-First)
1. Sign in with Google at `/sign-in`.
2. Navigate to your studio workspace (e.g. `/luminary/dashboard/oms`).
3. Click **"New Confirmed Order"** to register a booking with customer details, deliverables, and advance payment.
4. View the order transition from `Awaiting Event` to `Post-Event In Progress`.
5. Check off dynamically generated workflow tasks (RAW Ingest → Selection → Editing → Album Print).
6. Copy the unique **Guest Passkey** and open `/track/[passkey]` in a private browser window to inspect the customer tracking portal.
