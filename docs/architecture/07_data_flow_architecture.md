# Renite Data Flow Architecture

## 1. Purpose

This document defines how data moves through the Renite platform.

The goal is to ensure that every department understands:

- Where data originates.
- Where it is validated.
- Where it is stored.
- Who can access it.
- How it moves between services.
- How sensitive information is protected.

---

# 2. Core Data Flow

```text
User
 │
 ▼
Frontend
 │
 │ HTTPS
 ▼
API
 │
 ├── Authentication
 ├── Authorization
 ├── Validation
 ├── Business Logic
 │
 ▼
Database
 │
 ├── Users
 ├── Reports
 ├── Materials
 ├── Matches
 ├── Messages
 └── Transactions

Files SHALL follow a separate storage flow:

User
 │
 ▼
Frontend
 │
 ▼
API
 │
 ▼
File Validation
 │
 ▼
Secure File Storage
 │
 ▼
File Reference → Database
3. Data Ownership

Each major data object SHALL have a defined owner.

Data	Primary Owner
User Profile	User
Lost Report	Report Creator
Found Report	Finder
Material	Registered Owner
Match	Authorized System
Chat	Conversation Participants
Reward	Platform
Emergency Contact	User
Audit Log	System
Admin Data	Authorized Admin
4. User Registration Flow
User
 ↓
Registration Form
 ↓
Frontend Validation
 ↓
POST /auth/register
 ↓
Backend Validation
 ↓
Check Existing Account
 ↓
Hash Password
 ↓
Create User
 ↓
Send Verification
 ↓
User Verifies Account
 ↓
Account Activated

The frontend SHALL never directly create database records.

5. Login Flow
User
 ↓
Email / Phone + Password
 ↓
Frontend
 ↓
POST /auth/login
 ↓
Backend
 ↓
Validate Credentials
 ↓
Create Session / Token
 ↓
Return Authentication Result
 ↓
Frontend Stores Securely
 ↓
Authenticated Application
6. Lost Material Flow
Owner
 ↓
Report Lost
 ↓
Enter Material Information
 ↓
Upload Image (Optional)
 ↓
Frontend Validation
 ↓
Backend Validation
 ↓
Generate Material Token
 ↓
Create Lost Report
 ↓
Store Image
 ↓
Save Metadata
 ↓
Publish Report
7. Material Token

Every registered recovery object SHOULD receive a unique internal token.

Example:

REN-8F42-KL91

The token SHALL:

Uniquely identify the recovery case.
Not expose private database IDs.
Be safe to share when appropriate.
Not reveal sensitive ownership information.
8. Found Material Flow
Finder
 ↓
Report Found
 ↓
Enter Material Information
 ↓
Upload Image
 ↓
Backend Validation
 ↓
Create Found Report
 ↓
Matching Service
 ↓
Potential Match
 ↓
Notify Authorized Parties
9. Matching Flow
Lost Report
      │
      ▼
Matching Engine
      ▲
      │
Found Report
      │
      ▼
Potential Match
      │
      ▼
Confidence Evaluation
      │
      ▼
Human / System Verification

AI matching SHALL produce a potential match rather than automatically declaring ownership.

10. Image Recognition Flow
Uploaded Image
      ↓
File Validation
      ↓
Secure Storage
      ↓
Image Processing
      ↓
AI Service
      ↓
Feature Extraction
      ↓
Comparison
      ↓
Similarity Result
      ↓
Matching Service

AI processing SHOULD be asynchronous for expensive operations.

11. Missing Person Report Flow
Authorized Reporter
        ↓
Missing Person Report
        ↓
Identity Information
        ↓
Last Known Location
        ↓
Photo / Evidence
        ↓
Validation
        ↓
Create Case
        ↓
Authorized Review
        ↓
Search / Matching
        ↓
Potential Match / Location
        ↓
Authorized Notification

Missing-person information SHALL have stricter access controls than ordinary lost-item reports.

12. Location Data Flow
Device
 ↓
Location Permission
 ↓
Location Capture
 ↓
Secure Transmission
 ↓
Authorization Check
 ↓
Location Storage / Processing
 ↓
Authorized User

Location tracking SHALL only operate when the required permission and legal basis exist.

13. Emergency SOS Flow
User
 ↓
SOS Trigger
 ↓
Create Emergency Event
 ↓
Capture Current Location
 ↓
Validate User
 ↓
Find Emergency Contacts
 ↓
Send Authorized Notification
 ↓
Record Event

Future law-enforcement integration MAY be added after the required legal and technical requirements are established.

14. Notification Flow

Notifications SHALL be handled independently from the main request where possible.

Application Event
       ↓
Notification Service
       ↓
Queue
       ↓
Notification Worker
       ↓
 ┌─────┼─────┐
 ▼     ▼     ▼
Push  Email  SMS

This prevents slow notification providers from blocking normal application requests.

15. Chat Data Flow
User A
  ↓
Secure Chat Request
  ↓
Backend Authorization
  ↓
Conversation
  ↓
Message
  ↓
Database
  ↓
User B

Users SHALL only access conversations they are authorized to participate in.

16. Recovery Handoff Flow
Potential Match
       ↓
Verification
       ↓
Secure Chat
       ↓
Handoff Arrangement
       ↓
Physical / Authorized Handoff
       ↓
Owner Confirms Receipt
       ↓
Recovery Completed
       ↓
Reward Process
       ↓
Case Closed
17. Reward Data Flow
Recovery Completed
       ↓
Backend Verification
       ↓
Reward Calculation
       ↓
Create Reward Transaction
       ↓
Update Loyalty Balance
       ↓
Notify Finder

The frontend SHALL never directly modify a user's reward balance.

18. Payment Data Flow

Future payment flow:

User
 ↓
Payment Request
 ↓
Renite Backend
 ↓
Payment Provider
 ↓
Payment Result
 ↓
Webhook / Verification
 ↓
Transaction Record
 ↓
Update Case

Renite SHOULD avoid storing sensitive payment credentials.

19. Referral Flow
User A
 ↓
Referral Code
 ↓
User B Registers
 ↓
Backend Validates Code
 ↓
Referral Relationship Created
 ↓
Eligibility Check
 ↓
Reward Event

Referral rewards SHALL be controlled by the backend.

20. Search Flow
User
 ↓
Search Query
 ↓
Frontend
 ↓
API
 ↓
Authentication / Authorization
 ↓
Search Service
 ↓
Filtered Results
 ↓
Frontend

Search results SHALL only contain information the requesting user is allowed to see.

21. Admin Data Flow
Admin
 ↓
Admin Authentication
 ↓
Role Verification
 ↓
Admin API
 ↓
Authorization
 ↓
Requested Data
 ↓
Audit Log
 ↓
Admin Dashboard

Sensitive admin operations SHALL always be auditable.

22. Audit Flow

Important events SHALL generate audit records.

Sensitive Action
      ↓
Business Logic
      ↓
Audit Event
      ↓
Audit Storage

Example:

USER_ROLE_CHANGED
REPORT_APPROVED
REPORT_CLOSED
MATCH_CONFIRMED
ADMIN_ACTION
23. Data Lifecycle

Every major data type SHALL have a lifecycle.

Created
  ↓
Active
  ↓
Updated
  ↓
Resolved
  ↓
Archived
  ↓
Deleted / Retained

Retention requirements SHALL be defined before implementing sensitive data features.

24. Data Access Rules
Public Data
    ↓
Anyone / appropriate users

Private Data
    ↓
Owner + authorized services

Sensitive Data
    ↓
Strict authorization

Administrative Data
    ↓
Authorized administrators

Law-Enforcement Data
    ↓
Authorized integration / personnel
25. Data Minimization

Renite SHALL collect only data required for the feature.

Before adding a field, the team SHALL ask:

Why do we need it?
Who needs it?
How long do we keep it?
What happens if it leaks?
Can the feature work without it?

If data is unnecessary, it SHALL NOT be collected.

26. API Data Flow Rules

Every API request SHALL follow:

Request
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Business Logic
 ↓
Database / Service
 ↓
Response

No business-critical operation SHALL bypass this flow.

27. Error Flow
Service Error
 ↓
Error Handler
 ↓
Log Safe Information
 ↓
Generate Error Code
 ↓
Return Safe Response

Example:

{
  "success": false,
  "error": {
    "code": "REPORT_NOT_FOUND",
    "message": "The requested report could not be found."
  }
}

Internal technical information SHALL not be exposed to users.

28. External Service Flow

External services SHALL be accessed through controlled service layers.

Renite Application
       ↓
Internal Service
       ↓
External Provider
       ↓
Response
       ↓
Validation
       ↓
Renite Application

Examples:

SMS Provider
Email Provider
Payment Provider
AI Provider
Maps Provider
Future Hardware Provider
29. Data Consistency

Critical operations SHALL maintain consistent state.

Example:

Recovery Completed
      ↓
Case Updated
      ↓
Reward Created
      ↓
Notification Sent

If one step fails, the system SHALL prevent partial or duplicated results where possible.

30. Idempotency

The following operations SHOULD support idempotency:

Payment
Reward Issuance
Recovery Completion
Notification Creation
Webhook Processing

Repeated requests SHALL not accidentally create duplicate transactions.

31. Data Flow Security Rules
1. All external input is untrusted.

2. All protected requests require authentication.

3. Authorization SHALL happen on the backend.

4. Sensitive data SHALL only move through authorized channels.

5. Exact location SHALL not be exposed unnecessarily.

6. Biometric data SHALL have strict access control.

7. Files SHALL be validated before processing.

8. External service responses SHALL be validated.

9. Sensitive operations SHALL be audited.

10. The frontend SHALL never be treated as a trusted security boundary.
32. MVP Data Flow Boundary
REQUIRED
User Registration
Authentication
Lost Reports
Found Reports
Material Registration
Image Upload
Search
Notifications
Chat
Recovery Confirmation
Basic Rewards
FUTURE
AI Facial Matching
Advanced Image Recognition
Missing Person Tracking
Emergency SOS
Law Enforcement Integration
Bank Integration
Hardware Tracking
Mesh Tracking
Advanced Anomaly Detection
33. Definition of Done
[ ] User flow defined
[ ] Authentication flow defined
[ ] Lost-item flow defined
[ ] Found-item flow defined
[ ] Matching flow defined
[ ] File flow defined
[ ] Location flow defined
[ ] Notification flow defined
[ ] Chat flow defined
[ ] Reward flow defined
[ ] Payment flow defined
[ ] Admin flow defined
[ ] Audit flow defined
[ ] Data lifecycle defined
[ ] Security rules defined
Related Documents

docs/
├── planning/
├── product/
├── architecture/
│ ├── 01_system_architecture.md
│ ├── 02_application_architecture.md
│ ├── 03_database_architecture.md
│ ├── 04_api_architecture.md
│ ├── 05_security_architecture.md
│ ├── 06_deployment_and_scalability.md
│ └── 07_data_flow_architecture.md
├── design/
├── engineering/
├── security/
└── testing/

Change History
Version	Date	Description
1.0.0	August 2026	Initial Renite data-flow architecture.
Approval

Status: APPROVED

Approved By: Renite Core Team