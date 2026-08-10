# Renite System Architecture

## 1. Purpose

This document defines the high-level technical architecture of Renite.

It establishes how the major parts of the system communicate and defines the boundaries that all development teams SHALL follow.

This document does not define implementation-specific code. It defines the system structure that implementation SHALL follow.

---

# 2. Architecture Principle

Renite SHALL use a **modular architecture** that keeps the system simple enough for the MVP while allowing future expansion.

The MVP SHALL NOT introduce unnecessary microservices or infrastructure.

The architecture SHALL prioritize:

1. Security
2. Privacy
3. Reliability
4. Maintainability
5. Clear module boundaries
6. Testability
7. Future extensibility

---

# 3. High-Level Architecture

```text
                         RENITE USERS
                              │
                              ▼
                  ┌──────────────────────┐
                  │     Web Frontend     │
                  │                      │
                  │  User App / Admin    │
                  └──────────┬───────────┘
                             │
                         HTTPS / API
                             │
                             ▼
                  ┌──────────────────────┐
                  │      API Layer       │
                  │                      │
                  │ Routes / Controllers │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Business Layer     │
                  │                      │
                  │ Auth                 │
                  │ Users                │
                  │ Reports              │
                  │ Matching             │
                  │ Recovery             │
                  │ Chat                 │
                  │ Notifications        │
                  │ Administration       │
                  └──────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌───────────┐  ┌────────────┐  ┌──────────────┐
        │ Database  │  │ File       │  │ External     │
        │           │  │ Storage    │  │ Services     │
        └───────────┘  └────────────┘  └──────────────┘
                                          │
                             ┌────────────┼────────────┐
                             ▼            ▼            ▼
                           Maps         Email         AI
4. Core Architecture Decision

Renite MVP SHALL use a:

Modular Monolith + REST API + Central Database

This means the backend is deployed as one application while internally being divided into clearly separated modules.

Renite Backend
│
├── Auth
├── Users
├── Reports
├── Materials
├── Search
├── Matching
├── Verification
├── Recovery
├── Chat
├── Notifications
├── Rewards
└── Administration

The modules SHALL NOT be treated as unrelated applications.

They SHALL communicate through defined internal services and business rules.

5. Main System Components

Renite consists of the following major components.

5.1 Web Application

Responsible for:

User interface
Authentication screens
Reports
Search
Matching results
Recovery workflow
Chat
Notifications
Profile
Administration

The frontend SHALL communicate with the backend through APIs.

The frontend SHALL NOT connect directly to the database.

5.2 API Layer

Responsible for:

Receiving requests
Authentication
Request validation
Routing
Calling business services
Returning responses
Handling API errors

Example:

POST /api/v1/reports
GET  /api/v1/reports
GET  /api/v1/reports/:id
PATCH /api/v1/reports/:id
5.3 Business Layer

Contains Renite's actual business rules.

Examples:

Can this user create this report?
Can this user see this report?
Can these reports become a potential match?
Can this recovery case be closed?
Can this user access this conversation?

Business rules SHALL NOT be implemented only in the frontend.

5.4 Database

The database stores persistent application data.

Core data includes:

Users
Profiles
Reports
Materials
Categories
Matches
Verifications
Recovery Cases
Messages
Notifications
Rewards
Audit Logs
5.5 File Storage

Images and other uploaded files SHALL be stored separately from normal relational/application data where practical.

Examples:

Lost Item Image
Found Item Image
Profile Image
Verification Evidence

The database SHALL store references and metadata rather than unnecessarily storing large files.

5.6 External Services

Renite MAY communicate with external services for:

Maps
Email
SMS
AI
Payment
Cloud Storage

External integrations SHALL be isolated behind service interfaces.

6. Core Renite Modules
Authentication

Responsible for:

Registration
Login
Logout
Session/token handling
Password management
Users

Responsible for:

User profile
User preferences
Account information
Language preference
Notification preference
Reports

Responsible for:

Lost reports
Found reports
Report status
Report ownership
Report evidence
Materials

Responsible for:

Material categories
Material types
Material metadata
Search

Responsible for:

Keyword search
Category filtering
Material filtering
Location filtering
Status filtering
Pagination
Matching

Responsible for identifying potential relationships between:

Lost Report
       +
Found Report

Matching MAY use:

Description
Category
Material type
Location
Image similarity
AI assistance

AI SHALL be considered an additional signal, not automatic ownership proof.

Verification

Responsible for establishing whether a potential match is sufficiently supported.

Verification SHALL occur before final recovery confirmation.

Recovery

Responsible for:

Recovery case
Case participants
Recovery status
Handoff
Owner confirmation
Case closure
Chat

Responsible for secure communication between authorized participants in a recovery process.

Notifications

Responsible for:

In-app notifications
Email notifications
SMS notifications where enabled
Administration

Responsible for:

User management
Report moderation
Recovery review
Abuse reports
System monitoring
Administrative actions

Administrative actions SHOULD be audited.

7. Core Recovery Flow

The primary Renite workflow SHALL be:

                 USER
                   │
                   ▼
              REGISTER/LOGIN
                   │
                   ▼
            CREATE LOST REPORT
                   │
                   ▼
              REPORT STORED
                   │
                   ▼
             SEARCH / MATCH
                   │
                   ▼
             POTENTIAL MATCH
                   │
                   ▼
              VERIFICATION
                   │
                   ▼
             RECOVERY CASE
                   │
                   ▼
             SECURE CHAT
                   │
                   ▼
              SAFE HANDOFF
                   │
                   ▼
          OWNER CONFIRMS RECEIPT
                   │
                   ▼
             CASE COMPLETED
8. Found Item Flow
Finder
  │
  ▼
Create Found Report
  │
  ▼
Upload Information/Image
  │
  ▼
Report Stored
  │
  ▼
Matching Engine
  │
  ▼
Potential Match
  │
  ▼
Verification
  │
  ▼
Recovery Case
9. Matching Architecture

Matching SHALL operate as an independent capability.

Lost Report
     │
     ├── Category
     ├── Material Type
     ├── Description
     ├── Location
     └── Image
            │
            ▼
       MATCHING ENGINE
            ▲
            │
     ┌──────┴───────┐
     │              │
Found Report     AI Service

The matching engine SHALL return a potential match.

It SHALL NOT automatically declare:

"This person owns this item."

Final verification SHALL be a separate step.

10. Location Architecture

Location information SHALL be treated as sensitive data.

The system MAY use location for:

Report location
Search
Nearby matching
Recovery coordination

Exact locations SHALL NOT automatically be public.

Access SHALL depend on:

User authorization
Recovery status
Privacy rules
Administrative permissions
11. Missing Persons Architecture

Missing-person functionality SHALL use stricter security and privacy controls than normal lost-item recovery.

Conceptual flow:

Missing Person Report
        │
        ▼
Verification / Review
        │
        ▼
Authorized Matching
        │
        ▼
Last Known Location
        │
        ▼
Authorized Response

Missing-person functionality SHALL NOT be treated as an ordinary marketplace/search feature.

Direct law-enforcement integration is a future capability and SHALL require appropriate authorization and cooperation.

12. Notification Architecture

Renite SHALL use an abstraction around notification providers.

Application Event
       │
       ▼
Notification Service
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
In-App Email SMS

Example events:

PotentialMatchCreated
VerificationCompleted
NewMessage
RecoveryUpdated
RecoveryCompleted
13. Future AI Architecture

AI SHALL be isolated from the core business logic.

Renite Backend
      │
      ▼
AI Service Interface
      │
      ▼
AI Model / Provider

This allows the model/provider to be changed without redesigning the entire system.

Possible future AI capabilities:

Image similarity
Object recognition
Face similarity
Report classification
Anomaly detection

AI output SHALL always be validated before being used in sensitive workflows.

14. Future Hardware Architecture

Hardware tracking is NOT part of the MVP core.

Future architecture MAY be:

Renite
  │
  ▼
Device Registry
  │
  ▼
Tracking Hardware
  │
  ▼
Gateway / Network
  │
  ▼
Location Data

The system SHALL NOT assume that hardware can track a device without independent power and communication capability.

15. Future Payment Architecture

Payment functionality SHALL be isolated from recovery logic.

Recovery
   │
   ▼
Payment Interface
   │
   ▼
Payment Provider

Potential future services:

Priority Recovery Fee
Shipping
Referral Rewards
Loyalty Points
Mobile Money
Bank Integration

Payment functionality SHALL NOT be required for the basic recovery workflow.

16. Future Law Enforcement Integration

Future architecture:

Renite
   │
   ▼
Authority Integration Layer
   │
   ▼
Authorized External System

The system SHALL NOT send sensitive information to authorities without appropriate authorization and operational/legal agreements.

17. Data Flow Rules

All normal application data SHALL follow:

Client
  ↓
API
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Business Service
  ↓
Data Access
  ↓
Database

The following SHALL NOT occur:

Frontend → Database
Frontend → Private Storage
Frontend → Internal Admin APIs without authorization
18. Security Boundaries

Security SHALL exist at multiple levels:

Browser
   ↓
HTTPS
   ↓
API
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Business Logic
   ↓
Database / Storage

A frontend restriction SHALL never be considered sufficient security.

19. Scalability Strategy

Renite SHALL scale progressively.

MVP
Frontend
   ↓
Modular Backend
   ↓
Database
   ↓
Storage
Future
CDN
 ↓
Load Balancer
 ↓
Application Instances
 ↓
Database
 ↓
Cache / Queue / Search
 ↓
External Services

Services SHALL only be separated when there is a demonstrated reason.

20. Architecture Rules

The following rules are mandatory:

1. Frontend SHALL NOT access the database directly.

2. Authentication SHALL be separated from authorization.

3. Authorization SHALL be enforced server-side.

4. Business logic SHALL not depend directly on UI components.

5. External providers SHALL be isolated.

6. Sensitive information SHALL be protected by default.

7. AI SHALL not be treated as absolute truth.

8. Missing-person functionality SHALL receive stricter controls.

9. Hardware, banking, blockchain, and law-enforcement integrations
   SHALL remain future modules unless explicitly approved.

10. Architecture SHALL favor simplicity during MVP development.
21. MVP Architecture Boundary
INCLUDED
Authentication
Users
Profiles
Lost Reports
Found Reports
Materials
Search
Matching
Verification
Recovery
Chat
Notifications
Admin
OPTIONAL / EXPERIMENTAL
Basic AI-assisted image matching
Basic map functionality
Basic loyalty points
FUTURE
Biometric identification
Bank integration
Mobile money
Hardware tracking
Blockchain
Direct police integration
Advanced SOS
Advanced anomaly detection
Cash reward withdrawal
22. Definition of Done

The system architecture is considered ready for MVP implementation when:

[ ] Major components are defined
[ ] Module boundaries are defined
[ ] Data flow is defined
[ ] Core recovery flow is defined
[ ] Security boundaries are defined
[ ] External dependencies are identified
[ ] MVP scope is separated from future scope
[ ] Frontend/backend communication is defined
[ ] Future integrations have clear boundaries
23. Related Documents
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
24. Change History
Version	Date	Description
1.0.0	August 2026	Initial Renite system architecture.
Approval

Status: APPROVED

Approved By: Renite Core Team