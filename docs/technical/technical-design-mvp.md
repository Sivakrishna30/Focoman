# FOCOMAN

# Technical Design Document

Version: 1.0 (MVP)

## 1. Purpose

This document defines the technical architecture, technology stack, deployment strategy, hosting decisions, security approach, and infrastructure design for the Focoman platform.
It acts as the technical blueprint for development.

## 2. Technology Stack

Frontend

- Next.js (React)
- TypeScript
- Tailwind CSS

Why?

- Modern and responsive UI
- SEO-friendly public pages
- Excellent performance
- Large ecosystem
- Easy future expansion

Backend

- Java 21
- Spring Boot 3

Why?

Spring Boot was selected because:

- Enterprise-grade framework
- Excellent REST API support
- Highly scalable
- Strong security ecosystem
- Large developer community
- Easy maintenance
- Well suited for long-term SaaS products

Since the team has prior Java experience, development and maintenance become easier.

Database

- PostgreSQL

Why?

- Open source
- ACID compliant
- Reliable
- Supports relational data efficiently
- JSON support when needed
- Excellent performance
- Easy migration across cloud providers

## 3. Cloud Platform

Selected Platform

- Google Cloud Platform (GCP)

## 4. Why Google Cloud?

Google Cloud was selected over AWS for the MVP because it provides a simpler operational model with lower infrastructure management overhead while still offering production-grade scalability.
Key reasons include:

- Serverless deployment using Cloud Run
- Managed PostgreSQL through Cloud SQL
- Seamless integration with Google Drive and Google Workspace
- Lower operational complexity for a small team
- Automatic scaling
- Pay-as-you-use pricing
- Easy Docker deployment
- Built-in monitoring and logging

## 5. Why Not AWS ECS for the MVP?

AWS ECS is a powerful enterprise solution, but for the current stage of Focoman it introduces additional operational complexity.
Compared with Google Cloud Run:

- More infrastructure configuration is required.
- Container orchestration is more involved.
- Initial deployment and maintenance effort is higher.

AWS remains a valid option for future enterprise deployments, but Google Cloud provides a simpler and faster path for launching the MVP.

## 6. Hosting Strategy

Application deployment:

```text
Internet
↓
Google Cloud Load Balancer
↓
Google Cloud Run
↓
Spring Boot Application
↓
Cloud SQL (PostgreSQL)
```

Benefits:

- Automatic scaling
- High availability
- HTTPS support
- Managed infrastructure
- Container-based deployment
- No server maintenance

## 7. Database Hosting

Google Cloud SQL

Database Engine:

- PostgreSQL

Advantages:

- Managed backups
- Automatic updates
- High availability options
- Secure networking
- Monitoring

## 8. Storage Strategy

Focoman will not store customer photos or videos.
Instead:

- Google Drive links
- Shared folders
- Optional Google Cloud Storage for application-generated files, such as invoices or exports

Benefits:

- Lower storage cost
- Smaller database
- Faster backups
- Reduced infrastructure complexity

## 9. Authentication

Authentication method:

- JWT (JSON Web Token)

Flow:

```text
User Login
↓
Credentials Verified
↓
JWT Generated
↓
Client Stores Token
↓
Token Sent with Every API Request
↓
Backend Validates JWT
↓
API Response
```

Benefits:

- Stateless authentication
- Fast API access
- Secure session handling
- Easy mobile integration

## 10. Third-Party Integrations

Planned integrations:

- Google Drive
- Google Calendar
- WhatsApp Business API
- Email Service

Future integrations:

- Razorpay
- SMS Gateway
- Google OAuth

## 11. Deployment Pipeline

```text
Source Code
↓
GitHub
↓
GitHub Actions (CI/CD)
↓
Docker Image Build
↓
Google Cloud Run Deployment
```

## 12. Security Strategy

HTTPS

- All traffic will be encrypted using HTTPS.

Authentication

- JWT-based authentication.

Authorization

- Role-Based Access Control (RBAC)

Roles:

- Studio Owner
- Employee
- Customer

Password Security

- Passwords will be stored using strong hashing algorithms.
- Plain text passwords will never be stored.

Rate Limiting

API rate limiting will prevent abuse.
Examples:

- Requests per minute
- Requests per IP
- Requests per user

CAPTCHA

CAPTCHA will protect:

- Login
- Contact forms
- Public enquiry forms

Cloudflare

Cloudflare will be used as an edge security layer to provide:

- DDoS protection
- CDN acceleration
- DNS management
- Basic Web Application Firewall (WAF)
- Additional request filtering

Logging

All important events will be logged.
Examples:

- Login
- Failed Login
- API Errors
- System Errors
- Security Events

Monitoring

- Google Cloud Monitoring will be enabled.
- Application health will be continuously monitored.

## 13. Cost Control Strategy

The platform is designed to keep infrastructure costs predictable during the MVP stage.
Measures include:

- Google Cloud Budget Alerts
- Monthly spending notifications
- Autoscaling through Cloud Run
- Maximum Cloud Run instance limits
- Rate limiting
- Cloudflare request filtering
- Monitoring and usage analysis

These measures reduce the risk of unexpected cloud bills caused by traffic spikes or malicious requests.

## 14. Expected Initial Scale

Initial deployment target:

- 20 Studios
- Around 100 Business Orders per day
- Low to moderate concurrent users

The selected architecture can comfortably support this scale while allowing future growth without major architectural changes.

## 15. Future Scalability

The architecture supports future expansion, including:

- Mobile applications
- Multiple geographic regions
- Increased customer base
- Additional integrations
- AI-powered features
- Analytics dashboards
- Microservice adoption if required

## 16. Technology Summary

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Java 21, Spring Boot 3
- Database: PostgreSQL
- Cloud Platform: Google Cloud Platform
- Hosting: Google Cloud Run
- Database Hosting: Google Cloud SQL
- Storage: Google Drive, Google Cloud Storage optional
- Authentication: JWT
- Version Control: GitHub
- CI/CD: GitHub Actions
- Edge Security: Cloudflare
- Monitoring: Google Cloud Monitoring

## Document Status

- Version: 1.0
- Status: Draft
- Prepared For: Focoman Development Team

Next Phase:

- High Level Design (HLD)
- Low Level Design (LLD)
- UI/UX Design
