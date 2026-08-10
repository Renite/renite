# Renite Backend Architecture

## 1. Purpose

This document defines the backend architecture that connects the Renite web and mobile applications.

The backend SHALL be responsible for:

- Business logic
- Authentication
- Authorization
- Fayda verification
- User management
- Asset management
- Missing-person cases
- Lost & found reports
- AI processing
- Location services
- Chat
- Notifications
- Rewards
- Payments
- Shipping
- Audit and security controls

---

## 2. Overall Architecture

```text
React + TypeScript
        │
        │
Flutter + Dart
        │
        ▼
   Secure API Layer
        │
        ▼
    Backend Server
        │
 ┌──────┼─────────────────────────┐
 │      │       │       │         │
Auth   Users   Assets  Reports   Cases
 │      │       │       │         │
 └──────┴───────┴───────┴─────────┘
                 │
        ┌────────┼─────────┐
        │        │         │
     Database  Storage   External Services
                          │
              ┌───────────┼───────────┐
              │           │           │
            Fayda       Maps       Payments

The frontend SHALL never connect directly to the database.

3. Backend Layers

The backend SHALL use clear responsibility boundaries.

Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Repository / Data Access
   ↓
Database / External Service
Route

Defines the API endpoint.

Middleware

Handles cross-cutting concerns such as:

Authentication
Authorization
Validation
Rate limiting
Request identification
Security controls
Controller

Receives the request and returns the response.

Controllers SHALL remain thin.

Service

Contains business rules.

Examples:

AssetService
RecoveryService
MissingPersonService
RewardService
PaymentService
Repository

Handles data access.

Business logic SHALL NOT be placed directly inside database queries.

4. Recommended Backend Modules
backend/
├── auth/
├── users/
├── identity/
├── assets/
├── reports/
├── missing-persons/
├── recovery/
├── matching/
├── locations/
├── chat/
├── notifications/
├── rewards/
├── payments/
├── shipping/
├── files/
├── moderation/
├── admin/
└── audit/

Modules MAY be reorganized when the backend framework is finalized.

5. Authentication

Authentication SHALL be centralized.

Basic flow:

Client
 ↓
Login
 ↓
Backend Authentication
 ↓
Identity Verification Status
 ↓
Session / Token
 ↓
Authenticated User

The backend SHALL determine whether the authentication request is valid.

The frontend SHALL never be the final authority for authentication.

6. Fayda Identity Verification

Fayda SHALL be treated as a mandatory secondary identity-verification service.

Flow:

User
 ↓
Renite Registration
 ↓
Fayda Verification
 ↓
Verification Result
 ↓
Renite User Account

Renite SHALL maintain its own user database.

Conceptually:

Renite User
├── Renite User ID
├── Profile Data
├── Account Settings
├── Preferences
├── Security Data
└── Fayda Verification Reference

The system SHALL store only the Fayda information required for Renite's legitimate operations.

7. Authorization

Authentication answers:

"Who are you?"

Authorization answers:

"What are you allowed to do?"

The backend SHALL enforce authorization on every protected operation.

Possible roles include:

USER
VOLUNTEER
MODERATOR
ADMIN
LAW_ENFORCEMENT
SUPPORT

Actual roles SHALL be finalized according to product requirements.

8. Users

The User module SHALL manage:

Account
Profile
Preferences
Language
Security
Fayda Verification Status
Notification Preferences
Payment References
Reward Information

Sensitive information SHALL have restricted access.

9. Asset Management

The Asset module SHALL manage:

Register Asset
View Asset
Update Asset
Report Lost
Report Found
Asset Status
Recovery Token
Tracking Information

Possible states:

REGISTERED
ACTIVE
LOST
FOUND
RECOVERED
ARCHIVED
10. Lost & Found Reports

Reports SHALL contain appropriate information such as:

Report ID
Reporter
Asset / Person
Description
Images
Location
Date / Time
Status
Verification Information

Possible states:

DRAFT
SUBMITTED
UNDER_REVIEW
ACTIVE
POTENTIAL_MATCH
RECOVERED
RESOLVED
CLOSED
11. Missing Person Cases

Missing-person functionality SHALL be isolated from ordinary asset reporting because of its higher sensitivity.

A case MAY contain:

Case ID
Person Reference
Reporter
Photo
Last Seen Location
Last Seen Time
Description
Emergency Information
Case Status
Authorized Investigation Data

Access SHALL be strictly controlled.

12. Recovery Workflow

General recovery flow:

Lost Report
     ↓
Potential Match
     ↓
Verification
     ↓
Secure Communication
     ↓
Handoff
     ↓
Owner Confirmation
     ↓
Recovery Completed

AI matching SHALL assist the workflow.

AI SHALL NOT independently establish legal ownership.

13. AI Matching

AI services MAY process:

Asset Images
Person Images
Potential Matches

The backend SHALL treat AI results as:

Potential Match

rather than automatically:

Confirmed Owner

Human or authorized verification SHALL be required where appropriate.

14. Location Services

Location functionality SHALL support:

Current Location
Last Known Location
Report Location
Safety Zones
Tracking Events

Location data SHALL be:

Access-controlled
Minimized
Protected
Logged where required
Shared only with authorized parties
15. Emergency Workflow

Emergency functionality SHALL follow:

SOS / Missing Report
        ↓
Validate Request
        ↓
Create Emergency Case
        ↓
Notify Authorized Contacts
        ↓
Notify Authorized Authorities
        ↓
Track Case

The system SHALL clearly distinguish:

Notification Sent

from:

Notification Delivered

The application SHALL never falsely claim that authorities received an emergency report unless delivery is confirmed.

16. Notifications

The backend SHALL support:

Push Notifications
Email
SMS

Categories:

Emergency
Recovery
Report
Message
Reward
Payment
Shipping
System
Official Alert

Notification delivery SHALL be handled asynchronously where appropriate.

17. Chat

Chat SHALL use authenticated users and authorization rules.

The backend SHALL manage:

Conversations
Participants
Messages
Attachments
Read Status
Message Timestamps

Private contact information SHALL not be exposed unnecessarily.

18. Rewards

The Reward module SHALL manage:

Points
Recovery Rewards
Referral Rewards
Transactions
Reward History
Redemption

Example:

Successful Recovery
        ↓
Backend Confirmation
        ↓
Reward Calculation
        ↓
Points Added
        ↓
Transaction Recorded

Reward balances SHALL be calculated and validated server-side.

19. Referral System

Referral functionality MAY use:

Referral Code
Referrer
Referred User
Eligibility
Reward
Referral Status

The backend SHALL prevent:

Self-referrals
Duplicate rewards
Automated abuse
Manipulated reward requests
20. Payments

Payment processing SHALL be server-controlled.

Flow:

Client
 ↓
Create Payment Request
 ↓
Backend
 ↓
Payment Provider
 ↓
Verification
 ↓
Payment Result
 ↓
Database
 ↓
Client

The client SHALL not determine whether a payment succeeded.

Payment credentials SHOULD be handled by trusted payment providers whenever possible.

21. Shipping

Shipping SHALL be treated as a backend-managed process.

Recovery Confirmed
 ↓
Shipping Request
 ↓
Payment
 ↓
Shipping Provider
 ↓
Tracking
 ↓
Delivery
 ↓
Confirmation
22. File Storage

Uploaded files SHALL NOT be stored directly inside application source code.

The backend SHALL use controlled file storage.

Examples:

Profile Images
Asset Images
Missing Person Images
Report Images
Verification Documents
Chat Attachments

Access SHALL be controlled using authorization policies.

23. API Design

API endpoints SHALL follow consistent naming.

Example:

/api/v1/auth
/api/v1/users
/api/v1/assets
/api/v1/reports
/api/v1/missing-persons
/api/v1/recovery
/api/v1/notifications
/api/v1/rewards
/api/v1/payments
/api/v1/shipping

API versions SHALL be introduced when breaking changes require them.

24. Request Validation

Every external request SHALL be treated as untrusted input.

Validation SHALL occur on the backend.

Validate:

Types
Required Fields
Formats
Ranges
Permissions
Relationships
File Metadata
25. API Security

The backend SHALL implement appropriate controls for:

Authentication
Authorization
Rate Limiting
Input Validation
Secure Headers
CORS
CSRF where applicable
Injection Prevention
Secure File Upload
Session Security
Secrets Management
Audit Logging

Detailed OWASP requirements SHALL be defined in:

docs/security/02_owasp_requirements.md
26. Database Access

Application code SHALL access data through controlled data-access layers.

Preferred:

Controller
 ↓
Service
 ↓
Repository
 ↓
Database

Avoid:

Controller
 ↓
Raw Database Query

unless explicitly justified.

27. Transactions

Database transactions SHALL be used when multiple operations must succeed or fail together.

Example:

Recovery Confirmed
 ↓
Update Case
 ↓
Update Asset
 ↓
Create Reward Transaction
 ↓
Commit

If a required operation fails, the transaction SHALL be rolled back where supported.

28. Audit Logging

Security-sensitive actions SHOULD generate audit events.

Examples:

Login
Identity Verification
Permission Change
Report Creation
Report Access
Location Access
Case Update
Recovery Confirmation
Payment
Reward Adjustment
Administrative Action

Audit logs SHALL be protected from unauthorized modification.

29. Background Jobs

Long-running operations SHOULD use background processing.

Examples:

AI Image Processing
SMS Sending
Email Sending
Push Notifications
Image Processing
Reward Processing
Shipping Updates
Periodic Tracking

The API SHOULD return quickly rather than keeping users waiting for long-running operations.

30. External Services

External integrations SHALL be isolated behind service interfaces.

Examples:

FaydaService
PaymentService
MapService
NotificationService
AIService
ShippingService

This allows services to be replaced without rewriting the entire application.

31. Error Handling

Backend errors SHALL use consistent response structures.

Example:

{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found."
  }
}

Internal stack traces SHALL NOT be exposed to clients.

32. Observability

The backend SHOULD provide:

Request Logs
Application Logs
Error Logs
Performance Metrics
Health Checks
Audit Events

Logs SHALL not contain unnecessary sensitive information.

33. Environment Separation

The project SHALL maintain separate environments:

Development
Testing / Staging
Production

Production credentials SHALL never be used in local development.

34. Backend Definition of Done

A backend feature is complete when:

[ ] API implemented
[ ] Validation implemented
[ ] Authentication considered
[ ] Authorization implemented
[ ] Business logic implemented
[ ] Error handling implemented
[ ] Database changes completed
[ ] Security requirements implemented
[ ] Audit requirements considered
[ ] Tests added
[ ] API documentation updated
[ ] Code reviewed
35. Core Principle

The backend is the trusted core of Renite.

Therefore:

Never trust the client. Validate, authorize, and verify important operations on the server.