# RENITE FRONTEND ENHANCEMENT ROADMAP

> **Document:** `FRONTEND_ENHANCEMENT.md`  
> **Scope:** `renite-app` and `renite-admin`  
> **Status:** Ready to Begin  
> **Primary Goal:** Transform both Renite frontend applications into clean, secure, maintainable applications that communicate exclusively with the Renite Backend and have zero Supabase dependency.

---

# Table of Contents

1. [Purpose](#1-purpose)
2. [Current Architecture](#2-current-architecture)
3. [Target Architecture](#3-target-architecture)
4. [Frontend Principles](#4-frontend-principles)
5. [Frontend Developer Responsibilities](#5-frontend-developer-responsibilities)
6. [Backend–Frontend Coordination Rules](#6-backendfrontend-coordination-rules)
7. [Phase 0 — Frontend Baseline Audit](#phase-0--frontend-baseline-audit)
8. [Phase 1 — Architecture & Code Cleanup](#phase-1--architecture--code-cleanup)
9. [Phase 2 — Shared API Integration Layer](#phase-2--shared-api-integration-layer)
10. [Phase 3 — Authentication Migration](#phase-3--authentication-migration)
11. [Phase 4 — renite-app Enhancement](#phase-4--renite-app-enhancement)
12. [Phase 5 — renite-admin Enhancement](#phase-5--renite-admin-enhancement)
13. [Phase 6 — Chat & Real-Time Integration](#phase-6--chat--real-time-integration)
14. [Phase 7 — State Management & Data Flow](#phase-7--state-management--data-flow)
15. [Phase 8 — UI/UX Enhancement](#phase-8--uiux-enhancement)
16. [Phase 9 — Loading, Error & Empty States](#phase-9--loading-error--empty-states)
17. [Phase 10 — Frontend Security & Route Protection](#phase-10--frontend-security--route-protection)
18. [Phase 11 — Testing & Quality Assurance](#phase-11--testing--quality-assurance)
19. [Phase 12 — Deployment Preparation](#phase-12--deployment-preparation)
20. [Phase 13 — Complete Supabase Removal](#phase-13--complete-supabase-removal)
21. [Progress Tracker](#progress-tracker)
22. [Current Starting Point](#current-starting-point)

---

# 1. Purpose

This document defines the enhancement plan for:

```text
renite-app
renite-admin
```

The frontend applications are currently transitioning away from a Supabase-dependent architecture.

The final architecture must be:

```text
┌─────────────────┐
│   renite-app    │
│                 │
└────────┬────────┘
         │
         │ REST API + Socket.IO
         ▼
┌───────────────────────┐
│    RENITE BACKEND     │
│                       │
│  Authentication       │
│  Authorization        │
│  Business Logic       │
│  API                  │
│  Socket.IO            │
└───────────┬───────────┘
            │
            ▼
      Renite Database
```

```text
┌─────────────────┐
│  renite-admin   │
│                 │
└────────┬────────┘
         │
         └──────► RENITE BACKEND
```

The frontend must **not** directly access:

- Supabase Auth
- Supabase Database
- Supabase Storage
- Supabase Realtime

---

# 2. Current Architecture

The current system contains a mixture of:

```text
Frontend
   │
   ├── Supabase
   │
   └── Renite Backend
```

Some frontend modules have already been rewired to communicate with the backend.

Other areas still contain:

- Supabase authentication calls
- Supabase session handling
- Mock data
- Incomplete backend integration
- Old routes
- Inconsistent error handling
- Unfinished administrative interfaces

Known examples include:

```text
renite-app
│
├── Login / Registration
├── Emergency Reports
├── Asset Reports
├── Profile
├── Police Home
└── Chat ← currently mock/incomplete
```

```text
renite-admin
│
├── Admin Authentication
├── Users Management
├── Verifications
├── Assets Inventory
├── Audit Logs
├── Missing Persons / Emergency Reports
├── Dashboard
└── Staff Creation UI ← incomplete
```

---

# 3. Target Architecture

The final frontend architecture should look like:

```text
renite-app
│
├── pages/
├── components/
├── features/
├── api/
├── services/
├── hooks/
├── context/ or store/
├── utils/
├── constants/
└── routes/
```

Each frontend should communicate through a centralized API layer.

```text
React Component
       │
       ▼
Hook / Feature Logic
       │
       ▼
API Module
       │
       ▼
API Client
       │
       ▼
Renite Backend
```

The frontend must not contain:

```text
React Component
       │
       ▼
Direct Database Query
```

---

# 4. Frontend Principles

## 4.1 Backend Is the Source of Truth

The frontend displays and submits data.

The backend owns:

- Authentication validation
- Authorization
- Business rules
- Database operations
- Role permissions
- Sensitive data access

The frontend must never assume that hiding a button provides security.

---

## 4.2 Centralized API Access

Do not scatter requests throughout components.

Avoid:

```javascript
fetch("http://localhost:5000/api/users")
```

inside multiple React components.

Instead:

```text
components
    ↓
api/users.api.js
    ↓
api/client.js
    ↓
Renite Backend
```

---

## 4.3 No New Supabase Dependencies

During the enhancement process:

> No new feature may introduce a new direct Supabase dependency.

If the required backend endpoint does not exist:

1. Document the missing API requirement.
2. Coordinate with the backend developer.
3. Wait for the API contract.
4. Integrate through the backend.

---

## 4.4 Preserve Working Features

Do not rewrite working screens unnecessarily.

Enhancement should follow:

```text
Inspect
   ↓
Understand
   ↓
Improve
   ↓
Test
   ↓
Replace old dependency
```

---

# 5. Frontend Developer Responsibilities

The frontend developer owns:

- UI components
- Pages
- Routing
- Route protection
- API integration
- Authentication state handling
- Token/session handling strategy
- Socket.IO client integration
- Loading states
- Error states
- Empty states
- Form validation
- User feedback
- Responsive design
- Accessibility
- Frontend tests
- Removal of Supabase frontend dependencies

The frontend developer does **not** own:

- Database queries
- Backend authorization
- Business logic enforcement
- Database migrations
- Token generation
- Password hashing
- Server-side security rules

---

# 6. Backend–Frontend Coordination Rules

Every backend integration must be based on an API contract.

The frontend developer should know:

```text
Endpoint
HTTP Method
Authentication Required?
Required Role/Permission?
Request Body
Query Parameters
Success Response
Error Responses
```

Example:

```text
POST /api/auth/login
```

Request:

```json
{
  "identifier": "user identifier",
  "password": "password"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "user": {},
    "accessToken": "..."
  }
}
```

The exact response structure must be agreed upon before frontend integration.

---

# Phase 0 — Frontend Baseline Audit

## Objective

Understand the current state of both frontend applications before restructuring them.

---

## 0.1 Audit `renite-app`

Identify all:

- Pages
- Components
- Routes
- Supabase imports
- Supabase authentication calls
- Direct database queries
- API calls
- Axios/fetch configuration
- Mock data
- Local storage usage
- Session handling
- Role checks
- Protected routes
- Socket.IO usage

Create an inventory.

Example:

| Feature | Current Source | Target | Status |
|---|---|---|---|
| Login | Supabase/Auth | Renite API | ⬜ |
| Registration | Supabase/Auth | Renite API | ⬜ |
| Profile | Backend/API | Renite API | 🟨 |
| Emergency Report | Backend/API | Renite API | 🟨 |
| Assets | Backend/API | Renite API | 🟨 |
| Police Home | Backend/API | Renite API | 🟨 |
| Chat | Mock Data | API + Socket.IO | ⬜ |
| Notifications | Missing/Mock | Backend + Socket.IO | ⬜ |

---

## 0.2 Audit `renite-admin`

Identify all:

- Pages
- Components
- Admin authentication usage
- Supabase imports
- API requests
- Mock data
- Route protection
- Role checks
- Incomplete features

Example:

| Feature | Current Source | Target | Status |
|---|---|---|---|
| Admin Login | Current/Supabase | Renite API | ⬜ |
| Dashboard | Backend/API | Renite API | 🟨 |
| Users Management | Backend/API | Renite API | 🟨 |
| Create Staff | Missing UI | Renite API | ⬜ |
| Verifications | Backend/API | Renite API | 🟨 |
| Assets Inventory | Backend/API | Renite API | 🟨 |
| Audit Logs | Backend/API | Renite API | 🟨 |
| Emergency Reports | Backend/API | Renite API | 🟨 |

---

## 0.3 Identify Mock Data

Search both projects for:

```text
mock
dummy
sample
fake
static
hardcoded
```

Every mock implementation should be classified as:

```text
Keep temporarily
Replace with API
Remove
```

---

## Phase 0 Definition of Done

- [ ] `renite-app` audited.
- [ ] `renite-admin` audited.
- [ ] All Supabase imports identified.
- [ ] All API clients identified.
- [ ] All mock data identified.
- [ ] All authentication flows documented.
- [ ] All routes documented.
- [ ] Current frontend migration inventory created.

---

# Phase 1 — Architecture & Code Cleanup

## Objective

Create a consistent frontend structure before adding more integrations.

---

## 1.1 Organize API Files

Recommended structure:

```text
src/
├── api/
│   ├── client.js
│   ├── auth.api.js
│   ├── users.api.js
│   ├── reports.api.js
│   ├── assets.api.js
│   ├── cases.api.js
│   ├── conversations.api.js
│   └── admin.api.js
```

Not every application requires every API file.

Each application should contain only the modules it uses.

---

## 1.2 Organize Services

Recommended:

```text
src/
├── services/
│   ├── auth.service.js
│   ├── socket.service.js
│   └── storage.service.js
```

Services should handle reusable application behavior.

---

## 1.3 Organize Shared Components

```text
src/
├── components/
│   ├── common/
│   ├── layout/
│   ├── forms/
│   ├── feedback/
│   └── navigation/
```

Reusable components may include:

- Button
- Input
- Modal
- ConfirmDialog
- Loader
- ErrorState
- EmptyState
- Pagination
- SearchInput

Avoid duplicating these components across pages.

---

## 1.4 Remove Dead Code

Identify and remove:

- Unused routes
- Broken routes
- Dead registration flows
- Obsolete components
- Duplicate files
- Case-sensitive filename conflicts
- Unused imports
- Old Supabase helpers when replacements exist

---

## Phase 1 Definition of Done

- [ ] Frontend structure standardized.
- [ ] API modules organized.
- [ ] Shared components organized.
- [ ] Dead code reviewed.
- [ ] Broken routes removed or fixed.
- [ ] Filename inconsistencies fixed.
- [ ] No unnecessary duplicate API logic.

---

# Phase 2 — Shared API Integration Layer

## Objective

Ensure all backend communication passes through centralized API clients.

---

## 2.1 Standardize API Clients

Both applications should have one primary API client.

Example:

```text
renite-app
└── src/api/client.js
```

```text
renite-admin
└── src/api/client.js
```

Responsibilities:

- Base URL
- Authentication headers
- Request configuration
- Response handling
- Error normalization

---

## 2.2 Environment Configuration

Use environment variables.

Example:

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

Do not hardcode:

```text
localhost URLs
production URLs
API secrets
database credentials
```

---

## 2.3 Request Interceptors

The API client should automatically attach authentication credentials.

The application should not manually attach tokens inside every component.

---

## 2.4 Response/Error Interceptors

Normalize backend errors.

Instead of showing:

```text
Request failed with status code 404
```

display meaningful backend-provided errors when safe:

```text
Report not found.
You are not authorized to perform this action.
Invalid credentials.
```

---

## 2.5 Standard Error Object

Frontend API errors should follow a predictable structure.

Example:

```javascript
{
  message,
  code,
  status
}
```

Components should not need to understand Axios/fetch implementation details.

---

## Phase 2 Definition of Done

- [ ] One API client per frontend.
- [ ] Environment variables configured.
- [ ] Authentication credentials centralized.
- [ ] Response errors normalized.
- [ ] Backend error messages surfaced correctly.
- [ ] No duplicated request logic across components.

---

# Phase 3 — Authentication Migration

## Objective

Prepare both frontends to use the independent Renite authentication system.

> This phase must coordinate with the backend authentication migration.

---

## 3.1 Authentication Flow

Target flow:

```text
User
  │
  ▼
Login Page
  │
  ▼
POST /api/auth/login
  │
  ▼
Renite Backend
  │
  ├── User
  ├── Role
  └── Tokens/Session
  │
  ▼
Frontend Auth State
```

---

## 3.2 Authentication State

Create a centralized authentication mechanism.

Possible structure:

```text
src/
├── context/
│   └── AuthContext.jsx
```

or an approved state management solution.

Auth state should provide:

```text
user
role
isAuthenticated
isLoading
login()
logout()
refreshSession()
```

The exact implementation should be chosen once and used consistently.

---

## 3.3 Remove Supabase Authentication

Replace:

```text
supabase.auth.signInWithPassword()
supabase.auth.signUp()
supabase.auth.signOut()
supabase.auth.getSession()
supabase.auth.onAuthStateChange()
```

with Renite API-based authentication.

---

## 3.4 Role-Based Navigation

Expected roles:

```text
user
police
admin
```

Example:

```text
user
  └── Citizen application features

police
  └── Authorized officer/partner features

admin
  └── Administrative application
```

Frontend role checks are for navigation and UX only.

The backend remains the security authority.

---

## 3.5 Resolve Login Identifier Ambiguity

The current UI must match backend behavior.

Decide and implement one of:

```text
Officer Login
├── Fayda ID only
```

or:

```text
Officer Login
├── Fayda ID
└── Badge ID
```

The label must not promise functionality that does not exist.

---

## 3.6 Logout

Logout must:

- Clear frontend authentication state.
- Clear stored credentials/session information according to the chosen strategy.
- Call backend logout when required.
- Disconnect Socket.IO.

---

## Phase 3 Definition of Done

- [ ] Centralized authentication state.
- [ ] Login uses Renite API.
- [ ] Registration uses Renite API.
- [ ] Session restoration implemented.
- [ ] Logout implemented.
- [ ] Role-based navigation implemented.
- [ ] Protected routes implemented.
- [ ] Socket disconnects on logout.
- [ ] Supabase Auth calls removed from migrated flows.

---

# Phase 4 — `renite-app` Enhancement

## Objective

Complete and improve the citizen and officer application.

---

# 4.1 Authentication Pages

Review:

- Login
- Registration
- Password validation
- Form errors
- Authentication errors
- Loading states
- Redirect behavior

Required:

- [ ] Prevent duplicate submissions.
- [ ] Show validation errors.
- [ ] Show backend authentication errors.
- [ ] Show loading state.
- [ ] Redirect correctly after login.
- [ ] Remove obsolete police registration flow.
- [ ] Resolve identifier ambiguity.

---

# 4.2 Profile

Enhance:

- Profile loading.
- Profile editing.
- Save state.
- Error state.
- Sensitive data handling.

Requirements:

- [ ] Fetch profile through API.
- [ ] Update profile through API.
- [ ] Validate form fields.
- [ ] Display loading state.
- [ ] Display save success/failure feedback.

---

# 4.3 Emergency Reports

Enhance:

- Report creation.
- Report retrieval.
- Status display.
- Validation.
- Submission feedback.

Requirements:

- [ ] Use the correct backend model.
- [ ] Use `emergency_reports`.
- [ ] Remove references to nonexistent tables.
- [ ] Handle failed requests visibly.
- [ ] Prevent duplicate submission.

---

# 4.4 Asset Reports

Enhance:

- Asset creation.
- Asset listing.
- Asset updates.
- Asset status.
- Image/file integration when storage migration is ready.

---

# 4.5 Police Home

Enhance:

- Authentication guard.
- Police role guard.
- Loading state.
- Visible API failure state.
- Redirect unauthorized users.

Features:

- [ ] Search.
- [ ] Case lookup.
- [ ] Case status updates.
- [ ] Verification-related operations.
- [ ] Alerts where permitted.

The page must never remain indefinitely on:

```text
Loading officer details...
```

because of an unauthorized or failed request.

---

# 4.6 Search

Standardize:

```text
Search Input
     ↓
Loading
     ↓
Results
     ↓
No Results
     ↓
Error
```

Requirements:

- [ ] Debounce where appropriate.
- [ ] Prevent unnecessary duplicate requests.
- [ ] Handle empty queries.
- [ ] Handle backend errors.
- [ ] Respect user permissions.

---

## Phase 4 Definition of Done

- [ ] Citizen flows integrated with backend.
- [ ] Officer flows integrated with backend.
- [ ] Profile complete.
- [ ] Emergency reports complete.
- [ ] Asset reports complete.
- [ ] Police Home guarded.
- [ ] Search standardized.
- [ ] All critical pages have loading/error states.

---

# Phase 5 — `renite-admin` Enhancement

## Objective

Complete the administrative frontend.

---

# 5.1 Admin Authentication

Requirements:

- [ ] Use centralized Renite authentication.
- [ ] Remove any self-service admin registration.
- [ ] Protect admin routes.
- [ ] Redirect unauthorized users.
- [ ] Handle expired sessions.
- [ ] Implement logout correctly.

There must be no frontend mechanism that allows a normal user to create an admin account.

---

# 5.2 Admin Dashboard

Integrate:

```text
GET /admin/stats
```

Display:

- User statistics.
- Reports.
- Cases.
- Verifications.
- Other backend-supported metrics.

Requirements:

- [ ] Loading state.
- [ ] Error state.
- [ ] Empty/zero-data handling.
- [ ] Responsive layout.

---

# 5.3 Users Management

Enhance:

- User listing.
- Search.
- Filtering.
- Pagination.
- User details.
- Account actions where authorized.

Use backend endpoints only.

---

# 5.4 Create Staff UI

The backend endpoint already exists conceptually:

```text
POST /admin/staff
```

The frontend must provide a controlled administrative interface.

Requirements:

- [ ] Staff creation form.
- [ ] Input validation.
- [ ] Role selection limited to allowed roles.
- [ ] Success feedback.
- [ ] Error feedback.
- [ ] Refresh user/staff data after creation.

The UI must not allow arbitrary role escalation.

---

# 5.5 Verifications Administration

Enhance:

- Verification listing.
- Filtering.
- Verification detail view.
- Approval/rejection actions.
- Action feedback.

---

# 5.6 Assets Inventory

Enhance:

- Asset listing.
- Search.
- Filtering.
- Pagination.
- Asset details.

---

# 5.7 Emergency Reports Management

Ensure all pages use:

```text
emergency_reports
```

and the corresponding backend APIs.

Remove:

```text
missing_persons
missing_reports
```

references if they are obsolete.

---

# 5.8 Audit Logs

Integrate:

```text
GET /admin/audit-logs
```

Enhance:

- Filtering.
- Pagination.
- Action display.
- User/actor information where authorized.
- Timestamp formatting.

Audit logs should be primarily read-only.

---

## Phase 5 Definition of Done

- [ ] Admin authentication migrated.
- [ ] Dashboard integrated.
- [ ] Users management integrated.
- [ ] Create Staff UI implemented.
- [ ] Verifications integrated.
- [ ] Assets inventory integrated.
- [ ] Emergency reports integrated.
- [ ] Audit logs integrated.
- [ ] All admin routes protected.

---

# Phase 6 — Chat & Real-Time Integration

## Objective

Replace mock chat with the existing backend conversation/message system.

Current problem:

```text
Chat.jsx
   │
   ▼
Mock Data
```

Target:

```text
Chat.jsx
   │
   ├── REST API
   │
   └── Socket.IO
          │
          ▼
    Renite Backend
```

---

## 6.1 Conversation Loading

Load:

- Conversations.
- Participants where permitted.
- Latest message.
- Unread state when supported.

---

## 6.2 Message History

Implement:

```text
Open Conversation
       ↓
GET Messages
       ↓
Loading
       ↓
Display Messages
       ↓
Load More / Pagination if required
```

---

## 6.3 Send Messages

Flow:

```text
User Sends Message
       │
       ▼
Show Sending State
       │
       ▼
Backend Persists Message
       │
       ▼
Socket Event Received
       │
       ▼
Update Conversation UI
```

Avoid duplicate messages caused by both HTTP and Socket.IO updates.

---

## 6.4 Socket Connection

Create one centralized socket service.

Example:

```text
src/
└── services/
    └── socket.service.js
```

The application must not create a new socket connection every time a component renders.

---

## 6.5 Socket Lifecycle

```text
Application Starts
       │
       ▼
Authentication Ready
       │
       ▼
Connect Socket
       │
       ▼
Authenticate
       │
       ▼
Join Required Rooms
```

On logout:

```text
Logout
   ↓
Leave Rooms
   ↓
Disconnect Socket
   ↓
Clear State
```

---

## 6.6 Contact Exchange Direction

The current direct contact reveal after a verified match is considered temporary.

The preferred future UX is:

```text
Verified Match
       ↓
Conversation Available
       ↓
Users Communicate
       ↓
Contact Sharing Happens Voluntarily
```

The frontend must not expose sensitive contact information unless explicitly authorized by the backend.

---

## Phase 6 Definition of Done

- [ ] Mock chat removed.
- [ ] Conversations loaded from API.
- [ ] Messages loaded from API.
- [ ] Messages sent through backend.
- [ ] Socket.IO integrated.
- [ ] Socket lifecycle managed.
- [ ] Duplicate messages prevented.
- [ ] Error/loading states implemented.

---

# Phase 7 — State Management & Data Flow

## Objective

Standardize how frontend data is stored and updated.

---

## 7.1 State Classification

Use local component state for:

```text
Input values
Modal visibility
UI toggles
Temporary page state
```

Use shared/global state for:

```text
Authentication
Current user
Session
Global notifications
Socket connection state
```

Use API/server state management consistently for:

```text
Users
Reports
Assets
Cases
Conversations
Messages
Admin data
```

---

## 7.2 Avoid Unnecessary Global State

Do not place all application data into one global store.

Prefer:

```text
Local State
+
Shared State where necessary
+
Centralized API data handling
```

---

## 7.3 Standard Data States

Every server-backed page should consider:

```text
Loading
Error
Empty
Success
Refreshing
```

---

## Phase 7 Definition of Done

- [ ] Authentication state centralized.
- [ ] Server data strategy standardized.
- [ ] Local state used appropriately.
- [ ] Unnecessary prop drilling reduced.
- [ ] Data refresh behavior standardized.

---

# Phase 8 — UI/UX Enhancement

## Objective

Create a consistent and understandable Renite experience.

---

# 8.1 Design Consistency

Standardize:

- Typography.
- Spacing.
- Buttons.
- Inputs.
- Cards.
- Modals.
- Tables.
- Status badges.
- Alerts.
- Icons.

---

# 8.2 Responsive Design

Verify:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Priority:

```text
renite-app
    ↓
Mobile-first
```

```text
renite-admin
    ↓
Desktop-first but responsive
```

---

# 8.3 Onboarding Experience

Implement or plan a first-time user experience.

Example:

```text
New User
    │
    ▼
Welcome
    │
    ▼
"Would you like a quick guide?"
    │
    ├── Yes → Guided Tour
    │
    └── Skip → Continue to Application
```

Possible tour targets:

- Navigation.
- Reporting.
- Assets.
- Profile.
- Wallet/features where applicable.
- Help.
- Important actions.

The tour should:

- Run only when appropriate.
- Be skippable.
- Remember completion.
- Be replayable from settings/help.

---

# 8.4 Accessibility

Review:

- Keyboard navigation.
- Form labels.
- Focus states.
- Error messages.
- Color-independent status indicators.
- Screen-reader-friendly controls.

---

## Phase 8 Definition of Done

- [ ] Shared design patterns standardized.
- [ ] Critical flows responsive.
- [ ] Accessibility issues reviewed.
- [ ] Onboarding experience planned or implemented.
- [ ] Navigation consistency improved.

---

# Phase 9 — Loading, Error & Empty States

## Objective

Ensure the application always communicates what is happening.

Every major data screen should support:

```text
Loading
   ↓
Success ──► Display Data

Error
   ↓
Show Useful Error
   ↓
Retry

No Data
   ↓
Explain Empty State
   ↓
Provide Next Action
```

---

## Required Components

Create reusable:

```text
LoadingState
ErrorState
EmptyState
RetryButton
```

Example:

Instead of:

```text
Loading...
```

forever after an API failure:

```text
Unable to load officer information.

[Try Again]
```

---

## Phase 9 Definition of Done

- [ ] Critical pages have loading states.
- [ ] Critical pages have error states.
- [ ] Critical pages have empty states.
- [ ] Retry behavior implemented where appropriate.
- [ ] API failures are visible to users.

---

# Phase 10 — Frontend Security & Route Protection

## Objective

Prevent unauthorized navigation and minimize sensitive data exposure.

---

## 10.1 Protected Routes

Examples:

```text
/auth/*

Public Routes
```

```text
/app/*
```

Requires:

```text
Authenticated User
```

```text
/police/*
```

Requires:

```text
Authenticated
+
Police Permission/Role
```

```text
/admin/*
```

Requires:

```text
Authenticated
+
Admin Role
```

---

## 10.2 Permission-Based UI

Use permissions for UX.

Example:

```text
Can User See Button?
        ↓
Permission Check
```

But remember:

```text
Frontend Permission Check
          ≠
Security Enforcement
```

Backend authorization is mandatory.

---

## 10.3 Sensitive Data

Do not:

- Store secrets in source code.
- Expose backend secrets.
- Expose database credentials.
- Log sensitive tokens.
- Display sensitive personal information unnecessarily.

---

## Phase 10 Definition of Done

- [ ] Public routes defined.
- [ ] Protected routes defined.
- [ ] Police routes protected.
- [ ] Admin routes protected.
- [ ] Unauthorized redirects work.
- [ ] Sensitive data exposure reviewed.

---

# Phase 11 — Testing & Quality Assurance

## Objective

Ensure frontend changes do not break critical flows.

---

## 11.1 Component Tests

Test reusable components where valuable.

Examples:

- Forms.
- Route guards.
- Error states.
- Authentication behavior.

---

## 11.2 Integration Tests

Test critical flows:

```text
Registration
    ↓
Login
    ↓
Authenticated Navigation
```

```text
Create Emergency Report
    ↓
Backend Response
    ↓
UI Update
```

```text
Admin Login
    ↓
Protected Dashboard
```

```text
Open Conversation
    ↓
Load Messages
    ↓
Send Message
    ↓
Receive Real-Time Update
```

---

## 11.3 Manual QA Checklist

Before merging:

- [ ] Login works.
- [ ] Logout works.
- [ ] Protected routes work.
- [ ] Unauthorized users are redirected.
- [ ] API errors display correctly.
- [ ] Loading states display correctly.
- [ ] Mobile layout works.
- [ ] Desktop layout works.
- [ ] No console errors.
- [ ] No broken routes.

---

## Phase 11 Definition of Done

- [ ] Critical frontend flows tested.
- [ ] Authentication tested.
- [ ] Route protection tested.
- [ ] API integration tested.
- [ ] Chat tested.
- [ ] Admin flows tested.
- [ ] Critical console errors resolved.

---

# Phase 12 — Deployment Preparation

## Objective

Prepare both frontends for deployment against the production Renite backend.

---

## Tasks

### Environment Configuration

Development:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Production values must point to the deployed Renite backend.

---

### Build Verification

For both applications:

```text
Install
   ↓
Lint
   ↓
Test
   ↓
Build
```

---

### Production API Verification

Verify:

```text
renite-app
      │
      ▼
Production Renite API
```

and:

```text
renite-admin
      │
      ▼
Production Renite API
```

---

## Deployment Checklist

- [ ] Production API URL configured.
- [ ] Production Socket URL configured.
- [ ] Environment variables documented.
- [ ] Production build passes.
- [ ] No localhost URLs remain.
- [ ] Authentication works against production API.
- [ ] Socket.IO works in production.
- [ ] CORS configuration verified with backend developer.

---

# Phase 13 — Complete Supabase Removal

## Objective

Remove all Supabase dependencies from both frontend applications.

This phase must only begin when the backend replacements are working.

---

## `renite-app`

Remove:

- [ ] Supabase client.
- [ ] `@supabase/supabase-js`.
- [ ] Supabase authentication.
- [ ] Supabase database queries.
- [ ] Supabase storage calls.
- [ ] Supabase realtime subscriptions.
- [ ] `SUPABASE_*` environment variables.
- [ ] Supabase helper files.

---

## `renite-admin`

Remove:

- [ ] Supabase client.
- [ ] `@supabase/supabase-js`.
- [ ] Supabase authentication.
- [ ] Supabase database queries.
- [ ] Supabase environment variables.
- [ ] Supabase helper files.

---

## Final Search

Search both projects for:

```text
supabase
@supabase
SUPABASE_
createClient
auth.signIn
auth.signUp
auth.signOut
```

Expected production result:

```text
No active Supabase dependency.
```

---

# Final Frontend Architecture

## `renite-app`

```text
src/
│
├── api/
│   ├── client.js
│   ├── auth.api.js
│   ├── reports.api.js
│   ├── assets.api.js
│   ├── cases.api.js
│   └── conversations.api.js
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── forms/
│   └── feedback/
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│
├── pages/
│
├── routes/
│
├── services/
│   └── socket.service.js
│
├── utils/
│
└── constants/
```

---

## `renite-admin`

```text
src/
│
├── api/
│   ├── client.js
│   ├── auth.api.js
│   └── admin.api.js
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── tables/
│   └── feedback/
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│
├── pages/
│
├── routes/
│
├── services/
│
├── utils/
│
└── constants/
```

---

# Progress Tracker

| Phase | Enhancement | Status |
|---|---|---|
| 0 | Frontend Baseline Audit | ⬜ Not Started |
| 1 | Architecture & Code Cleanup | ⬜ Not Started |
| 2 | Shared API Integration Layer | 🟨 Partially Existing |
| 3 | Authentication Migration | 🔒 Depends on Backend |
| 4 | `renite-app` Enhancement | 🟨 Partially Existing |
| 5 | `renite-admin` Enhancement | 🟨 Partially Existing |
| 6 | Chat & Real-Time Integration | 🟨 Backend Exists / Frontend Pending |
| 7 | State Management & Data Flow | ⬜ Not Started |
| 8 | UI/UX Enhancement | ⬜ Not Started |
| 9 | Loading, Error & Empty States | 🟨 Partially Existing |
| 10 | Frontend Security & Route Protection | 🟨 Partially Existing |
| 11 | Testing & Quality Assurance | ⬜ Needs Review |
| 12 | Deployment Preparation | ⬜ Not Started |
| 13 | Complete Supabase Removal | 🔒 Final Phase |

---

# Coordination Dependencies

The frontend developer should coordinate with the backend developer at these points:

| Frontend Work | Required Backend Support |
|---|---|
| Authentication Migration | Independent Renite Auth API |
| Token Refresh | Refresh endpoint |
| Logout | Logout/session revocation endpoint |
| Staff Creation | `POST /admin/staff` |
| Chat | Conversation/message API |
| Real-Time | Socket.IO event contract |
| Notifications | Notification API/event contract |
| File Upload | Storage/upload API |
| Dashboard | Statistics API |
| Final Supabase Removal | All replacement services complete |

---

# Current Starting Point

## ACTIVE PHASE: PHASE 0 — FRONTEND BASELINE AUDIT

The frontend developer should begin by auditing:

```text
/renite-app
```

and:

```text
/renite-admin
```

The first deliverable is a **Frontend Migration Inventory** containing:

1. Every Supabase dependency.
2. Every backend API integration.
3. Every mock-data feature.
4. Every incomplete feature.
5. Every authentication dependency.
6. Every route and route guard.
7. Every Socket.IO/realtime dependency.
8. Every environment variable currently used.

---

# Working Rule

> We work phase by phase.

The frontend developer should not jump directly to Supabase removal.

The order is:

```text
Audit
   ↓
Cleanup
   ↓
Standardize API Layer
   ↓
Prepare Auth Migration
   ↓
Enhance renite-app
   ↓
Enhance renite-admin
   ↓
Integrate Chat & Real-Time
   ↓
Standardize State
   ↓
Improve UX
   ↓
Test
   ↓
Deploy
   ↓
Remove Supabase
```

---

# Final Definition of Done

The frontend enhancement is complete when:

- [ ] `renite-app` has no Supabase dependency.
- [ ] `renite-admin` has no Supabase dependency.
- [ ] Both applications communicate only with the Renite Backend.
- [ ] Authentication uses Renite's own authentication system.
- [ ] API access is centralized.
- [ ] Authentication state is centralized.
- [ ] Protected routes work.
- [ ] Police/partner routes work correctly.
- [ ] Admin routes work correctly.
- [ ] Mock chat has been replaced.
- [ ] Socket.IO is properly integrated.
- [ ] Loading states exist.
- [ ] Error states exist.
- [ ] Empty states exist.
- [ ] UI is responsive.
- [ ] Critical flows are tested.
- [ ] Production environment variables are configured.
- [ ] Production API integration is verified.
- [ ] Supabase packages are removed.
- [ ] Supabase environment variables are removed.
- [ ] No production Supabase imports remain.

> **Renite Frontend Rule:** The frontend is responsible for presentation, interaction, and user experience. The Renite Backend is the source of truth for authentication, authorization, business logic, and data.