# RENITE — SYSTEM ENHANCEMENT ROADMAP

> **Status:** In Progress
> **Goal:** Transform Renite from a Supabase-dependent application into a fully independent, backend-driven system with our own database infrastructure, ORM, authentication, business logic, real-time communication, storage, testing, DevOps, and deployment architecture.

---

# Table of Contents

1. [Vision](#1-vision)
2. [Target Architecture](#2-target-architecture)
3. [Core Technology Stack](#3-core-technology-stack)
4. [Enhancement Principles](#4-enhancement-principles)
5. [Phase 0 — System Audit & Migration Planning](#phase-0--system-audit--migration-planning)
6. [Phase 1 — Backend Foundation](#phase-1--backend-foundation)
7. [Phase 2 — Database & ORM Infrastructure](#phase-2--database--orm-infrastructure)
8. [Phase 3 — Authentication & Authorization](#phase-3--authentication--authorization)
9. [Phase 4 — Core Domain Migration](#phase-4--core-domain-migration)
10. [Phase 5 — Real-Time Communication](#phase-5--real-time-communication)
11. [Phase 6 — Notifications](#phase-6--notifications)
12. [Phase 7 — File & Object Storage](#phase-7--file--object-storage)
13. [Phase 8 — Admin System Integration](#phase-8--admin-system-integration)
14. [Phase 9 — Frontend Integration](#phase-9--frontend-integration)
15. [Phase 10 — Testing, Security & Quality](#phase-10--testing-security--quality)
16. [Phase 11 — DevOps & Infrastructure](#phase-11--devops--infrastructure)
17. [Phase 12 — Production Deployment](#phase-12--production-deployment)
18. [Phase 13 — Complete Supabase Removal](#phase-13--complete-supabase-removal)
19. [Definition of Complete Migration](#definition-of-complete-migration)

---

# 1. Vision

Renite will operate as an independent platform.

The frontend applications will not directly depend on Supabase or any Backend-as-a-Service platform for application logic.

Instead, all core operations will pass through the Renite backend.

```text
renite-app ───────┐
                  │
                  ▼
           RENITE BACKEND
                  │
                  ├── Authentication
                  ├── Authorization
                  ├── Business Logic
                  ├── Validation
                  ├── Matching
                  ├── Messaging
                  ├── Notifications
                  ├── Audit Logging
                  ├── File Management
                  └── Real-Time Events
                  │
          ┌───────┼────────┐
          │       │        │
          ▼       ▼        ▼
     PostgreSQL  Storage  Redis*
```

```text
renite-admin ─────┘
```

> `* Redis will be introduced only when required by caching, queues, rate limiting, or multi-instance real-time scaling.`

---

# 2. Target Architecture

## 2.1 Applications

The Renite ecosystem consists of:

```text
renite/
│
├── renite-app/              # Main user application
│
├── renite-admin/            # Administrative application
│
├── backend/                 # Central Renite backend
│
├── infrastructure/          # Docker, deployment and infrastructure
│
└── RENITE_ENHANCEMENT.md    # This roadmap
```

---

## 2.2 Backend Architecture

The backend will follow a layered architecture.

```text
HTTP Request
     │
     ▼
Route
     │
     ▼
Middleware
     │
     ├── Authentication
     ├── Authorization
     ├── Validation
     ├── Logging
     ├── Rate Limiting
     └── Error Handling
     │
     ▼
Controller
     │
     ▼
Service
     │
     ├── Business Rules
     ├── Domain Logic
     ├── Transactions
     └── Events
     │
     ▼
Repository
     │
     ▼
ORM
     │
     ▼
PostgreSQL
```

### Rule

Controllers must remain thin.

Controllers should:

* Receive requests.
* Extract validated input.
* Call services.
* Return responses.

Business logic belongs in services.

Database access belongs in repositories.

---

# 3. Core Technology Stack

## Backend

* Node.js
* Express.js
* JavaScript
* Socket.IO

## Database

* PostgreSQL

## ORM

**Primary recommendation: Prisma**

Prisma will provide:

* Schema definition.
* Database migrations.
* Relational modeling.
* Type-safe database tooling where applicable.
* Database client access.

## Authentication

* JWT access tokens.
* Refresh tokens.
* Password hashing.
* Role-Based Access Control.

## Validation

* Zod or an equivalent centralized validation system.

## Testing

* Jest
* Supertest

## Security

* Helmet
* CORS
* Rate limiting
* Secure password hashing
* Token validation
* Input validation
* Security headers

## Logging

* Structured application logging.
* Request logging.
* Error logging.
* Audit logging.

## Real-Time

* Socket.IO

## Object Storage

* MinIO or another S3-compatible implementation.

## Infrastructure

* Docker
* Docker Compose
* Reverse proxy
* GitHub Actions

---

# 4. Enhancement Principles

The following principles apply throughout the entire migration.

## 4.1 No New Direct Supabase Features

From the start of this enhancement process:

> New features should not introduce additional direct Supabase dependencies.

All new backend functionality should be implemented through the Renite backend.

---

## 4.2 Build Before Removing

We do not delete Supabase functionality until its replacement has been:

1. Designed.
2. Implemented.
3. Tested.
4. Integrated.
5. Verified.

Migration pattern:

```text
Existing Supabase Feature
        │
        ▼
Analyze
        │
        ▼
Build Backend Replacement
        │
        ▼
Test Replacement
        │
        ▼
Integrate Frontends
        │
        ▼
Verify
        │
        ▼
Remove Supabase Dependency
```

---

## 4.3 One Source of Business Logic

Business rules must not be duplicated between:

* `renite-app`
* `renite-admin`
* backend

The backend is the source of truth.

---

## 4.4 Security Is Backend-Enforced

Frontend permissions are for user experience.

Backend permissions are for security.

Example:

```text
Frontend hides "Delete User" button
                ≠
User cannot delete another user
```

The backend must always verify permissions.

---

# Phase 0 — System Audit & Migration Planning

## Objective

Understand the current Renite system before changing architecture.

## Tasks

### 0.1 Audit `renite-app`

Identify:

* Supabase client initialization.
* Authentication usage.
* Direct database queries.
* Storage usage.
* Realtime subscriptions.
* Tables currently used.
* User flows dependent on Supabase.

---

### 0.2 Audit `renite-admin`

Identify:

* Admin authentication.
* Direct Supabase queries.
* Admin-specific tables.
* Report management.
* User management.
* Moderation operations.
* Analytics or dashboard queries.

---

### 0.3 Audit Current Backend

Inspect the existing backend for:

* Routes.
* Controllers.
* Services.
* Middleware.
* Conversation implementation.
* Message implementation.
* Socket.IO setup.
* Tests.
* Logging.
* Audit logging.
* Error handling.
* Authentication state.

---

### 0.4 Create Migration Inventory

Create a list similar to:

| Feature        | Current System     | Replacement          | Status  |
| -------------- | ------------------ | -------------------- | ------  |
| Authentication | Supabase           | Renite Auth          | ⬜      |
| Users          | Supabase DB        | PostgreSQL           | ⬜      |
| Assets         | Supabase DB        | PostgreSQL           | ⬜      |
| Reports        | Supabase DB        | PostgreSQL           | ⬜      |
| Conversations  | Mixed              | Backend + PostgreSQL | 🟨      |
| Messages       | Mixed              | Backend + PostgreSQL | 🟨      |
| Storage        | Supabase Storage   | MinIO/S3             | ⬜      |
| Realtime       | Supabase/Socket.IO | Socket.IO            | 🟨      |
| Admin          | Supabase           | Backend API          | ⬜      |

---

## Phase 0 Definition of Done

* [ ] All Supabase dependencies identified.
* [ ] All tables documented.
* [ ] All storage buckets documented.
* [ ] All authentication flows documented.
* [ ] Existing backend status documented.
* [ ] Migration inventory completed.

> **Do not remove Supabase yet.**

---

# Phase 1 — Backend Foundation

## Objective

Stabilize the Renite backend as the central system.

## Required Structure

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │
│   ├── controllers/
│   │
│   ├── services/
│   │
│   ├── repositories/
│   │
│   ├── routes/
│   │
│   ├── middleware/
│   │
│   ├── validators/
│   │
│   ├── sockets/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   ├── app.js
│   │
│   └── server.js
│
├── tests/
│
├── package.json
│
└── .env.example
```

---

## Tasks

### 1.1 Standardize Environment Configuration

Required variables:

```env
NODE_ENV=
PORT=

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

CLIENT_APP_URL=
CLIENT_ADMIN_URL=

STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Secrets must never be committed.

---

### 1.2 Confirm Server Architecture

Separate:

```text
app.js
```

from:

```text
server.js
```

`app.js`

* Express configuration.
* Middleware.
* Routes.

`server.js`

* HTTP server.
* Socket.IO.
* Application startup.

---

### 1.3 Standardize Error Handling

Every error should eventually pass through a centralized error handler.

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Error
  ↓
Error Middleware
  ↓
Consistent API Response
```

---

### 1.4 Standardize API Response Format

Success example:

```json
{
  "success": true,
  "data": {}
}
```

Error example:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found"
  }
}
```

---

### 1.5 Add Health Endpoints

Required:

```text
GET /health
GET /api/health
```

The production infrastructure will use these for health checks.

---

## Phase 1 Definition of Done

* [ ] Backend structure standardized.
* [ ] Environment configuration standardized.
* [ ] Error handling centralized.
* [ ] API responses standardized.
* [ ] CORS configured.
* [ ] Helmet configured.
* [ ] Logging operational.
* [ ] Health endpoint tested.
* [ ] Existing tests passing.

---

# Phase 2 — Database & ORM Infrastructure

## Objective

Replace Supabase Database with our own PostgreSQL infrastructure.

## Tasks

### 2.1 Introduce PostgreSQL

Set up PostgreSQL for local development.

Initial development architecture:

```text
Docker
│
├── PostgreSQL
│
└── Renite Backend
```

---

### 2.2 Introduce Prisma

Install and configure Prisma.

Required components:

```text
backend/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
```

---

### 2.3 Define Database Standards

All tables should have a consistent strategy for:

* Primary IDs.
* Timestamps.
* Foreign keys.
* Indexes.
* Soft deletion where appropriate.
* Audit references.

Recommended common fields:

```text
id
created_at
updated_at
```

Where required:

```text
deleted_at
created_by
updated_by
```

---

### 2.4 Create Core Schema

Initial entities:

```text
User
Role
RefreshToken

Asset
AssetImage

Report
ReportMatch

Claim

Conversation
ConversationParticipant
Message

Notification

Wallet
Transaction

AuditLog
```

---

### 2.5 Create Database Migrations

The database must be reproducible from code.

```text
Developer clones repository
        │
        ▼
Starts PostgreSQL
        │
        ▼
Runs migrations
        │
        ▼
Database is created
```

---

### 2.6 Introduce Repository Layer

Example:

```text
User Service
      │
      ▼
User Repository
      │
      ▼
Prisma
      │
      ▼
PostgreSQL
```

Services should not contain scattered raw database queries.

---

## Phase 2 Definition of Done

* [ ] PostgreSQL running locally.
* [ ] Prisma configured.
* [ ] Database schema created.
* [ ] Initial migrations created.
* [ ] Repositories introduced.
* [ ] Database can be recreated from migrations.
* [ ] No Supabase database dependency required for newly migrated modules.

---

# Phase 3 — Authentication & Authorization

## Objective

Replace Supabase Authentication with Renite Authentication.

## Tasks

### 3.1 User Registration

```text
POST /api/auth/register
```

Flow:

```text
Validate Input
      ↓
Check Existing User
      ↓
Hash Password
      ↓
Create User
      ↓
Assign Default Role
      ↓
Create Audit Log
```

---

### 3.2 Login

```text
POST /api/auth/login
```

Flow:

```text
Find User
      ↓
Verify Password
      ↓
Generate Access Token
      ↓
Generate Refresh Token
      ↓
Store/Track Session
      ↓
Return Authentication Response
```

---

### 3.3 Token Refresh

```text
POST /api/auth/refresh
```

---

### 3.4 Logout

```text
POST /api/auth/logout
```

Refresh tokens should be revocable.

---

### 3.5 Authentication Middleware

```text
authenticate
```

Responsibilities:

* Extract token.
* Verify token.
* Identify user.
* Attach user to request.

---

### 3.6 Role-Based Access Control

Initial roles may include:

```text
USER
ADMIN
SUPER_ADMIN
```

Example:

```text
requireRole("ADMIN")
```

---

### 3.7 Socket Authentication

Socket.IO connections must authenticate before accessing protected events.

```text
Client connects
      ↓
Provide access token
      ↓
Socket middleware verifies token
      ↓
Attach user identity
      ↓
Allow connection
```

---

## Phase 3 Definition of Done

* [ ] Registration implemented.
* [ ] Login implemented.
* [ ] Access tokens implemented.
* [ ] Refresh tokens implemented.
* [ ] Logout implemented.
* [ ] Password hashing implemented.
* [ ] Authentication middleware tested.
* [ ] RBAC implemented.
* [ ] Socket authentication implemented.
* [ ] Frontend no longer requires Supabase Auth for migrated flows.

---

# Phase 4 — Core Domain Migration

## Objective

Move Renite's primary business features to the new backend and PostgreSQL.

Modules must be migrated individually.

---

## 4.1 Users

Tasks:

* [ ] User profile.
* [ ] Profile update.
* [ ] User retrieval.
* [ ] Account status.
* [ ] User administration.

---

## 4.2 Assets

Tasks:

* [ ] Create asset.
* [ ] Read asset.
* [ ] Update asset.
* [ ] Delete/archive asset.
* [ ] Asset ownership validation.
* [ ] Asset images.

---

## 4.3 Lost & Found Reports

Tasks:

* [ ] Create report.
* [ ] Update report.
* [ ] Retrieve report.
* [ ] Report status.
* [ ] Report ownership.
* [ ] Report history.

---

## 4.4 Matching Engine

Tasks:

* [ ] Define matching criteria.
* [ ] Identify candidate reports.
* [ ] Create report matches.
* [ ] Match scoring.
* [ ] Match status.
* [ ] Admin review where required.

---

## 4.5 Claims

Tasks:

* [ ] Create claim.
* [ ] Validate claim.
* [ ] Claim status.
* [ ] Claim ownership.
* [ ] Approval/rejection flow.
* [ ] Claim audit history.

---

## Phase 4 Definition of Done

* [ ] Core domain entities migrated.
* [ ] Business logic exists in services.
* [ ] Database access uses repositories.
* [ ] All authorization checks are backend-enforced.
* [ ] Supabase queries removed from migrated modules.
* [ ] Integration tests created.

---

# Phase 5 — Real-Time Communication

## Objective

Make Socket.IO the official real-time communication system.

## Modules

### Conversations

* [ ] Create conversation.
* [ ] Retrieve conversation.
* [ ] Conversation membership.
* [ ] Conversation authorization.

### Messages

* [ ] Send message.
* [ ] Retrieve messages.
* [ ] Message authorization.
* [ ] Message persistence.
* [ ] Real-time delivery.

---

## Standard Flow

```text
User Sends Message
       │
       ▼
Backend Validates
       │
       ▼
Check Conversation Membership
       │
       ▼
Save Message in PostgreSQL
       │
       ▼
Create Audit/Event Record
       │
       ▼
Emit Socket Event
       │
       ▼
Recipient Receives Message
```

---

## Socket Events

Example event groups:

```text
conversation:join
conversation:leave

message:send
message:new

typing:start
typing:stop

notification:new
```

Final event names will be standardized before implementation.

---

## Phase 5 Definition of Done

* [ ] Conversations persist in PostgreSQL.
* [ ] Messages persist in PostgreSQL.
* [ ] Socket authentication enforced.
* [ ] Conversation authorization enforced.
* [ ] Real-time message delivery tested.
* [ ] Existing conversation tests updated.
* [ ] No Supabase Realtime dependency remains.

---

# Phase 6 — Notifications

## Objective

Create a centralized notification system.

Notification sources:

* New message.
* Report match.
* Claim update.
* Admin action.
* System event.

Architecture:

```text
Business Event
      │
      ▼
Notification Service
      │
      ├── Save Notification
      │
      └── Emit Real-Time Event
```

Tasks:

* [ ] Notification model.
* [ ] Notification service.
* [ ] Mark as read.
* [ ] Retrieve notifications.
* [ ] Real-time delivery.

---

## Phase 6 Definition of Done

* [ ] Notification database model created.
* [ ] Notification API implemented.
* [ ] Real-time notifications operational.
* [ ] Notification permissions tested.

---

# Phase 7 — File & Object Storage

## Objective

Replace Supabase Storage.

## Initial Architecture

```text
Client
  │
  ▼
Renite Backend
  │
  ▼
Storage Service
  │
  ▼
MinIO / S3-Compatible Storage
```

## Supported Files

* Profile images.
* Asset images.
* Lost item images.
* Found item images.
* Claim evidence.

## Tasks

* [ ] Storage infrastructure.
* [ ] Bucket strategy.
* [ ] Upload validation.
* [ ] File type restrictions.
* [ ] File size restrictions.
* [ ] Secure file naming.
* [ ] Object metadata.
* [ ] File deletion.
* [ ] Image access strategy.

---

## Phase 7 Definition of Done

* [ ] Storage service operational.
* [ ] File upload tested.
* [ ] File access secured.
* [ ] File deletion implemented.
* [ ] Supabase Storage dependency removed.

---

# Phase 8 — Admin System Integration

## Objective

Connect `renite-admin` to the central Renite backend.

Architecture:

```text
renite-admin
      │
      ▼
Renite API
      │
      ▼
Authentication
      │
      ▼
Authorization
      │
      ▼
Admin Services
```

## Admin Features

Potential modules:

* [ ] Dashboard.
* [ ] User management.
* [ ] Report management.
* [ ] Claim management.
* [ ] Conversation moderation.
* [ ] Administrative actions.
* [ ] Audit log viewing.
* [ ] System monitoring.

---

## Rule

Every administrative endpoint must enforce authorization.

Example:

```text
GET /api/admin/users
```

Must require:

```text
Authentication
      +
ADMIN Role
```

---

## Phase 8 Definition of Done

* [ ] Admin authentication integrated.
* [ ] Admin routes protected.
* [ ] Admin operations moved to backend.
* [ ] No direct Supabase queries remain in admin application.

---

# Phase 9 — Frontend Integration

## Objective

Make both frontend applications communicate exclusively through the Renite backend.

---

## 9.1 API Client

Both applications should have a centralized API layer.

Example:

```text
src/
└── api/
    ├── client.js
    ├── auth.api.js
    ├── users.api.js
    ├── assets.api.js
    ├── reports.api.js
    └── conversations.api.js
```

---

## 9.2 Authentication Integration

Flow:

```text
Frontend
   │
   ▼
POST /api/auth/login
   │
   ▼
Renite Backend
   │
   ▼
Access Token / Session
```

---

## 9.3 Socket Integration

Socket connection should be centralized.

```text
src/
└── services/
    └── socket.js
```

The application should not create uncontrolled socket connections from multiple components.

---

## 9.4 Remove Supabase Client

Once all features are migrated:

* [ ] Remove Supabase imports.
* [ ] Remove Supabase environment variables.
* [ ] Remove Supabase packages.
* [ ] Remove Supabase authentication code.
* [ ] Remove Supabase database queries.
* [ ] Remove Supabase storage code.
* [ ] Remove Supabase realtime subscriptions.

---

## Phase 9 Definition of Done

* [ ] `renite-app` communicates through backend API.
* [ ] `renite-admin` communicates through backend API.
* [ ] Authentication uses Renite backend.
* [ ] Real-time uses Socket.IO.
* [ ] No active frontend dependency on Supabase.

---

# Phase 10 — Testing, Security & Quality

## Objective

Ensure the independent Renite system is reliable and secure.

---

## 10.1 Unit Tests

Test:

* Services.
* Validators.
* Utilities.
* Authorization rules.
* Business logic.

---

## 10.2 Integration Tests

Test:

```text
HTTP Request
     ↓
Route
     ↓
Middleware
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Test Database
```

---

## 10.3 Authentication Tests

Required cases:

* [ ] Registration.
* [ ] Login.
* [ ] Invalid credentials.
* [ ] Invalid token.
* [ ] Expired token.
* [ ] Refresh token.
* [ ] Logout.
* [ ] Revoked session.

---

## 10.4 Authorization Tests

Test:

* User cannot access admin endpoint.
* User cannot modify another user's resource.
* Non-participant cannot access private conversation.
* Admin permissions work correctly.

---

## 10.5 Security

Implement and verify:

* [ ] Helmet.
* [ ] CORS restrictions.
* [ ] Rate limiting.
* [ ] Input validation.
* [ ] Secure password hashing.
* [ ] Token security.
* [ ] Sensitive environment variables protected.
* [ ] Database credentials protected.
* [ ] File upload validation.
* [ ] Secure error responses.

---

## 10.6 Audit Logs

Important actions should be traceable.

Examples:

```text
USER_REGISTERED
USER_LOGIN
REPORT_CREATED
REPORT_UPDATED
CLAIM_CREATED
CLAIM_APPROVED
CLAIM_REJECTED
ADMIN_ACTION
MESSAGE_DELETED
USER_SUSPENDED
```

Audit logs should capture:

```text
Who
What
When
Where applicable: Target
```

---

## Phase 10 Definition of Done

* [ ] Unit tests implemented.
* [ ] Integration tests implemented.
* [ ] Authentication tested.
* [ ] Authorization tested.
* [ ] Security middleware configured.
* [ ] Audit logging operational.
* [ ] CI tests passing.

---

# Phase 11 — DevOps & Infrastructure

## Objective

Make Renite independently deployable and maintainable.

---

## 11.1 Docker

Create container definitions for:

```text
backend
postgres
minio
```

Development example:

```text
docker-compose.yml
```

Services:

```text
Renite Backend
PostgreSQL
MinIO
```

Redis may be added later.

---

## 11.2 Environment Management

Provide:

```text
.env.example
```

Never commit:

```text
.env
production secrets
database credentials
JWT secrets
storage secrets
```

---

## 11.3 Database Backup Strategy

Define:

* Backup frequency.
* Retention period.
* Storage location.
* Restore procedure.

A backup is not complete until restoration has been tested.

---

## 11.4 Logging

Production logging should support:

* Application logs.
* Error logs.
* Request logs.
* Audit logs.

---

## 11.5 Monitoring

At minimum:

```text
Health Checks
Application Availability
Database Availability
Error Monitoring
Disk/Storage Monitoring
```

---

## Phase 11 Definition of Done

* [ ] Docker development environment works.
* [ ] Environment configuration documented.
* [ ] Backup strategy documented.
* [ ] Restore procedure tested.
* [ ] Logging operational.
* [ ] Health checks operational.
* [ ] Monitoring strategy defined.

---

# Phase 12 — Production Deployment

## Objective

Deploy Renite as an independent production system.

## Target Architecture

```text
                    Internet
                       │
                       ▼
                Reverse Proxy
                 Nginx / Caddy
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
         Renite Backend      Static Apps
              │
      ┌───────┼────────┐
      │       │        │
      ▼       ▼        ▼
 PostgreSQL  Storage  Redis*
```

---

## Deployment Requirements

* [ ] HTTPS.
* [ ] Environment secrets.
* [ ] Production database.
* [ ] Persistent storage.
* [ ] Database backups.
* [ ] Automated deployment.
* [ ] Health checks.
* [ ] Rollback strategy.

---

## CI/CD Pipeline

```text
Pull Request
      │
      ▼
Install Dependencies
      │
      ▼
Lint
      │
      ▼
Run Tests
      │
      ▼
Build
      │
      ▼
Merge
      │
      ▼
Build Docker Image
      │
      ▼
Deploy
      │
      ▼
Run Database Migration
      │
      ▼
Health Check
```

---

## Phase 12 Definition of Done

* [ ] Production environment operational.
* [ ] HTTPS enabled.
* [ ] CI/CD pipeline operational.
* [ ] Database migrations automated.
* [ ] Backups operational.
* [ ] Health checks passing.
* [ ] Rollback strategy documented.

---

# Phase 13 — Complete Supabase Removal

## Objective

Remove Supabase completely from the Renite ecosystem.

This phase must only begin after all previous migration phases are verified.

---

## Removal Checklist

### Backend

* [ ] Remove Supabase SDK.
* [ ] Remove Supabase configuration.
* [ ] Remove Supabase environment variables.
* [ ] Remove Supabase authentication logic.
* [ ] Remove Supabase database access.
* [ ] Remove Supabase storage access.
* [ ] Remove Supabase realtime logic.

### `renite-app`

* [ ] Remove Supabase client.
* [ ] Remove Supabase authentication.
* [ ] Remove Supabase queries.
* [ ] Remove Supabase subscriptions.
* [ ] Remove Supabase storage usage.
* [ ] Remove Supabase environment variables.
* [ ] Remove Supabase package.

### `renite-admin`

* [ ] Remove Supabase client.
* [ ] Remove Supabase queries.
* [ ] Remove Supabase authentication.
* [ ] Remove Supabase environment variables.
* [ ] Remove Supabase package.

---

## Final Verification

Search the repositories for:

```text
supabase
createClient
SUPABASE_
@supabase
```

Expected result:

```text
No production dependencies remain.
```

---

# Definition of Complete Migration

The Renite enhancement is considered complete when:

* [ ] Both frontend applications communicate only with Renite backend APIs.
* [ ] No frontend directly accesses Supabase.
* [ ] Authentication is owned by Renite.
* [ ] Authorization is enforced by Renite backend.
* [ ] PostgreSQL is independently managed.
* [ ] ORM schema and migrations are version-controlled.
* [ ] All core business logic exists in backend services.
* [ ] Conversations and messages use PostgreSQL.
* [ ] Real-time communication uses Socket.IO.
* [ ] Notifications are centralized.
* [ ] File storage no longer uses Supabase.
* [ ] Tests cover critical flows.
* [ ] Audit logging is operational.
* [ ] Docker development environment works.
* [ ] CI/CD pipeline works.
* [ ] Production deployment works.
* [ ] Backup and restore procedures exist.
* [ ] Supabase packages are removed.
* [ ] Supabase environment variables are removed.
* [ ] Supabase dependencies are zero.

---

# Enhancement Progress

| Phase | Name                              | Status                              |
| ----- | --------------------------------- | ----------------------------------  |
| 0     | System Audit & Migration Planning | ⬜ Not Started                      |
| 1     | Backend Foundation                | ⬜ Not Started                      |
| 2     | Database & ORM Infrastructure     | ⬜ Not Started                      |
| 3     | Authentication & Authorization    | ⬜ Not Started                      |
| 4     | Core Domain Migration             | ⬜ Not Started                      |
| 5     | Real-Time Communication           | 🟨 Partially Existing               |
| 6     | Notifications                     | ⬜ Not Started                      |
| 7     | File & Object Storage             | ⬜ Not Started                      |
| 8     | Admin System Integration          | ⬜ Not Started                      |
| 9     | Frontend Integration              | ⬜ Not Started                      |
| 10    | Testing, Security & Quality       | 🟨 Partially Existing               |
| 11    | DevOps & Infrastructure           | 🟨 Partially Existing               |
| 12    | Production Deployment             | ⬜ Not Started                      |
| 13    | Complete Supabase Removal         | 🔒 Locked Until Migration Complete  |

---

# Current Rule

> **We work sequentially.**
>
> We complete and verify the current phase before moving to the next phase.
>
> We do not delete existing Supabase functionality until its replacement is working.
>
> The next active phase is determined by the Enhancement Progress table.

---

# Current Starting Point

## NEXT PHASE: Phase 0 — System Audit & Migration Planning

Before modifying the architecture, we will inspect:

1. `/renite-app`
2. `/renite-admin`
3. `/backend`
4. All Supabase usage.
5. Current database structure.
6. Current authentication flow.
7. Current storage usage.
8. Current realtime implementation.
