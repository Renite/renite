# Renite Application Architecture

## 1. Purpose

This document defines how the Renite frontend and backend applications SHALL be organized internally.

The objective is to prevent developers from putting unrelated logic into the same files, modules, or layers.

The architecture SHALL remain simple enough for the MVP while maintaining clear boundaries for future development.

---

# 2. Application Architecture

Renite consists of two primary applications:

```text
Renite
│
├── Frontend
│   └── Web Application
│
└── Backend
    └── API Application

Communication:

Frontend
    │
    │ HTTPS / REST API
    ▼
Backend
    │
    ▼
Database / Storage / External Services
3. Frontend Architecture

The frontend SHALL use a feature-oriented structure.

Recommended structure:

frontend/
└── src/
    ├── app/
    ├── core/
    ├── shared/
    └── features/
        ├── auth/
        ├── dashboard/
        ├── reports/
        ├── search/
        ├── matching/
        ├── verification/
        ├── recovery/
        ├── chat/
        ├── notifications/
        ├── profile/
        └── admin/
4. Frontend Responsibilities

The frontend is responsible for:

Displaying information
Collecting user input
Client-side validation
Navigation
Managing UI state
Calling APIs
Displaying API results
Handling loading states
Handling error states

The frontend SHALL NOT contain sensitive business rules that must be enforced by the backend.

5. Frontend Layers

The frontend SHOULD follow:

UI
 ↓
State / Controller
 ↓
API / Repository
 ↓
Backend

Example:

ReportPage
    ↓
ReportController
    ↓
ReportRepository
    ↓
POST /api/v1/reports
6. Frontend core

The core layer contains application-wide functionality.

Examples:

API client
Authentication state
Routing
Environment configuration
Error handling
Localization
Storage
Constants
Utilities

Example:

core/
├── api/
├── auth/
├── config/
├── localization/
├── routing/
├── storage/
└── utils/
7. Frontend shared

The shared layer contains reusable UI and utility components.

Examples:

Buttons
Inputs
Cards
Dialogs
Loading indicators
Error views
Empty states
Pagination
Common layouts

A component SHOULD be placed in shared only when it is genuinely reusable across features.

8. Frontend Features

Each feature SHOULD own its UI and feature-specific logic.

Example:

features/
└── reports/
    ├── pages/
    ├── widgets/
    ├── models/
    ├── services/
    └── state/

The exact naming MAY change depending on the frontend framework.

9. Authentication Feature

The authentication feature SHALL contain:

Login
Registration
Logout
Password recovery
Session handling
Authentication UI

Conceptual structure:

auth/
├── pages/
├── widgets/
├── models/
├── services/
└── state/
10. Reports Feature

The reports feature SHALL handle:

Lost reports
Found reports
Report creation
Report editing
Report details
Report status
Report images

Conceptual structure:

reports/
├── pages/
├── widgets/
├── models/
├── services/
└── state/
11. Search Feature

The search feature SHALL handle:

Search
Filters
Results
Pagination
Sorting
Empty results

It SHALL communicate with the backend search API rather than directly querying the database.

12. Matching Feature

The matching feature SHALL display:

Potential matches
Match confidence
Match details
Verification action

The frontend SHALL treat matching results as potential matches.

It SHALL NOT independently decide ownership.

13. Verification Feature

The verification feature SHALL handle:

Verification requests
Evidence submission
Verification status
Verification results

Sensitive verification data SHALL only be displayed to authorized users.

14. Recovery Feature

The recovery feature SHALL handle:

Recovery case
Participants
Status
Handoff
Owner confirmation
Completion

Conceptual flow:

Potential Match
      ↓
Verification
      ↓
Recovery Case
      ↓
Handoff
      ↓
Confirmation
      ↓
Completed
15. Chat Feature

The chat feature SHALL be associated with authorized recovery contexts.

Recovery Case
     │
     ▼
Authorized Conversation
     │
     ▼
Messages

The frontend SHALL not allow users to access arbitrary conversations.

16. Notification Feature

The frontend SHALL support:

Notification list
Unread count
Read/unread state
Notification details

Notification delivery itself SHALL be controlled by the backend.

17. Profile Feature

The profile feature SHALL handle:

Profile information
Profile image
Language
Preferences
Notification settings
Security settings
18. Admin Feature

The admin interface SHALL be separated from normal user functionality.

admin/
├── dashboard/
├── users/
├── reports/
├── recovery/
├── moderation/
└── audit/

Every admin operation SHALL be authorized by the backend.

19. Backend Architecture

The backend SHALL use a modular structure.

Recommended:

backend/
└── src/
    ├── config/
    ├── middleware/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── reports/
    │   ├── materials/
    │   ├── search/
    │   ├── matching/
    │   ├── verification/
    │   ├── recovery/
    │   ├── chat/
    │   ├── notifications/
    │   ├── rewards/
    │   └── admin/
    ├── shared/
    └── app/
20. Backend Module Structure

Each major module SHOULD follow:

module/
├── controller
├── service
├── repository
├── model
├── validation
└── routes

Example:

reports/
├── report.controller
├── report.service
├── report.repository
├── report.model
├── report.validation
└── report.routes
21. Controller Layer

Controllers SHALL:

Receive requests
Read validated input
Call services
Return responses

Controllers SHALL NOT contain large amounts of business logic.

Bad:

Controller
 └── 300 lines of recovery rules

Preferred:

Controller
    ↓
Service
    ↓
Business Rules
22. Service Layer

Services SHALL contain business logic.

Example:

RecoveryService

may determine:

Whether a match can start verification
Whether a recovery case can be opened
Whether a case can be closed
23. Repository Layer

Repositories SHALL handle data access.

Example:

ReportService
      ↓
ReportRepository
      ↓
Database

Services SHOULD NOT contain large amounts of raw database logic.

24. Validation Layer

Input validation SHALL happen before business logic.

Example:

Request
  ↓
Validation
  ↓
Controller
  ↓
Service

Validation SHALL cover:

Required fields
Data types
Length
Allowed values
File constraints
Formats
25. Middleware

Backend middleware MAY handle:

Authentication
Authorization
Logging
Rate limiting
Request IDs
Error handling
Security headers

Middleware SHALL remain focused on cross-cutting concerns.

26. Shared Backend Services

Shared services MAY include:

Email Service
SMS Service
File Storage Service
Notification Service
AI Service
Map Service
Audit Service

These services SHALL provide clean interfaces to the rest of the application.

27. Authentication Flow
User
 │
 ▼
Login
 │
 ▼
Frontend
 │
 ▼
Authentication API
 │
 ▼
Auth Service
 │
 ▼
User Repository
 │
 ▼
Database
 │
 ▼
Authentication Result
 │
 ▼
Frontend Session
28. Authorization Flow

Every protected backend request SHALL follow:

Request
   ↓
Authenticate
   ↓
Identify User
   ↓
Check Role / Ownership
   ↓
Validate Input
   ↓
Business Logic
   ↓
Response
29. Report Creation Flow
Frontend
   │
   ▼
POST /reports
   │
   ▼
Validation
   │
   ▼
Report Controller
   │
   ▼
Report Service
   │
   ├── Store image
   │
   ├── Generate report identifier
   │
   └── Save report
           │
           ▼
        Database
30. Matching Flow
Lost Report
     │
     ▼
Matching Service
     │
     ├── Category
     ├── Material Type
     ├── Description
     ├── Location
     └── Optional AI Signal
             │
             ▼
      Potential Match
             │
             ▼
       Verification
31. Recovery Flow
Potential Match
      │
      ▼
Verification
      │
      ▼
Recovery Service
      │
      ├── Create Case
      ├── Authorize Participants
      └── Enable Chat
              │
              ▼
          Handoff
              │
              ▼
      Owner Confirmation
              │
              ▼
         Case Closed
32. Chat Architecture

Chat SHALL be scoped to authorized participants.

User
 │
 ▼
Chat API
 │
 ▼
Authorization
 │
 ▼
Conversation Service
 │
 ▼
Message Repository
 │
 ▼
Database

Realtime delivery MAY be added using WebSockets or another appropriate technology.

33. Notification Architecture

Application modules SHALL generate notification events.

Example:

MatchingService
      │
      ▼
PotentialMatchCreated
      │
      ▼
NotificationService
      │
 ┌────┼────┐
 ▼    ▼    ▼
In-App Email SMS
34. File Upload Architecture
Frontend
   │
   ▼
Upload API
   │
   ▼
Validation
   │
   ▼
File Storage Service
   │
   ▼
Storage Provider

The database stores:

File ID
Reference
Type
Size
Owner
Created At
35. AI Integration

AI SHALL be accessed through a dedicated service.

MatchingService
      │
      ▼
AIService
      │
      ▼
AI Provider

The rest of the application SHALL NOT depend directly on a specific AI provider.

36. Location Integration

Location services SHALL be isolated.

Application
     │
     ▼
LocationService
     │
     ▼
Map / Geolocation Provider

The service SHALL control how location information is collected and returned.

37. External Provider Rule

The following SHALL NOT be directly called throughout the codebase:

Specific AI SDK
Specific SMS SDK
Specific Payment SDK
Specific Map SDK

Instead:

Application
    ↓
Internal Interface
    ↓
Provider Adapter
    ↓
External Provider
38. Error Handling

Backend errors SHALL be standardized.

Example:

{
  "success": false,
  "error": {
    "code": "REPORT_NOT_FOUND",
    "message": "The requested report could not be found."
  }
}

Internal technical details SHALL NOT be exposed to users.

39. API Response Rule

Successful responses SHOULD follow a consistent structure.

Example:

{
  "success": true,
  "data": {}
}

Errors:

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Safe user-facing message"
  }
}
40. State Management

Frontend state SHALL be divided into appropriate categories:

Authentication State
Server/Data State
UI State
Form State

Developers SHALL avoid putting all application state into a single global store.

41. Server State

Server state includes:

Reports
Matches
Recovery cases
Messages
Notifications
Profiles

It SHOULD be synchronized with the backend rather than treated as permanent local state.

42. UI State

UI state includes:

Modal open/closed
Selected tab
Loading state
Filter visibility
Temporary form state

UI state SHOULD remain local to the feature when possible.

43. Feature Dependency Rule

Features SHALL communicate through defined interfaces.

Preferred:

RecoveryService
      ↓
VerificationService

Avoid:

RecoveryPage
      ↓
Directly modifies
      ↓
VerificationPage internal state
44. Shared Code Rule

Code SHOULD be moved into shared modules only when it is genuinely reusable.

Do not create:

utils/
    everything.js

Instead use focused modules:

utils/
├── date.ts
├── validation.ts
├── formatting.ts
45. Naming Rules

Names SHALL describe their responsibility.

Preferred:

ReportService
RecoveryService
NotificationService
UserRepository

Avoid vague names:

Helper
Manager
Stuff
CommonService
Misc
46. MVP Application Boundary

The MVP SHALL prioritize:

Auth
Users
Reports
Materials
Search
Matching
Verification
Recovery
Chat
Notifications
Admin

The following SHALL remain isolated future modules:

Banking
Payments
Hardware
Blockchain
Law Enforcement
Advanced Biometrics
Advanced SOS
47. Application Architecture Rules
1. Frontend SHALL communicate with backend through APIs.

2. Frontend SHALL NOT access the database directly.

3. Controllers SHALL remain thin.

4. Business logic SHALL live in services.

5. Database access SHALL be isolated in repositories/data-access modules.

6. Input SHALL be validated before business logic.

7. Authorization SHALL be checked server-side.

8. External providers SHALL be accessed through adapters/interfaces.

9. Features SHALL not directly manipulate another feature's internal state.

10. Shared code SHALL only be created when reuse is justified.

11. Sensitive operations SHALL be auditable.

12. MVP implementation SHALL favor simplicity over premature abstraction.
48. Definition of Done

Application architecture is considered ready when:

[ ] Frontend structure defined
[ ] Backend structure defined
[ ] Feature boundaries defined
[ ] Backend layers defined
[ ] Authentication flow defined
[ ] Authorization flow defined
[ ] Report flow defined
[ ] Matching flow defined
[ ] Recovery flow defined
[ ] Chat flow defined
[ ] Notification flow defined
[ ] External integrations isolated
[ ] Error handling defined
[ ] State management strategy defined
49. Related Documents
docs/
├── planning/
├── product/
├── architecture/
│   ├── README.md
│   ├── 01_system_architecture.md
│   ├── 02_application_architecture.md
│   ├── 03_database_architecture.md
│   ├── 04_api_architecture.md
│   ├── 05_security_architecture.md
│   └── 06_deployment_and_scalability.md
├── design/
├── engineering/
├── security/
└── testing/
Change History
Version	Date	Description
1.0.0	August 2026	Initial Renite application architecture.
Approval

Status: APPROVED

Approved By: Renite Core Team