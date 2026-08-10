# Renite Development Standards

## 1. Purpose

This document defines the mandatory development rules for Renite.

These rules apply to:

- Web developers
- Mobile developers
- Backend developers
- UI/UX developers working with developers
- QA and testing contributors
- DevOps contributors

The goal is to keep the codebase secure, maintainable, consistent, and easy for the team to collaborate on.

---

## 2. Technology Stack

### Web

```text
React.js
TypeScript
Mobile
Flutter
Dart
Backend

The backend framework SHALL be defined separately after the team confirms the backend technology.

Communication

Web and mobile applications SHALL communicate with the backend through documented APIs.

React + TypeScript
        │
        ├────── API ──────┐
        │                 │
Flutter + Dart            │
        │                 ↓
        └──────────→ Backend
                         │
                         ↓
                      Database
3. General Coding Rules

Code SHALL be:

Readable
Modular
Reusable
Testable
Documented where necessary
Secure by default

Developers SHALL avoid unnecessary complexity.

Prefer:

Simple + Clear + Reusable

over:

Complex + Clever + Difficult to Maintain
4. Naming Conventions
TypeScript / React
Components:     PascalCase
Functions:      camelCase
Variables:      camelCase
Constants:      UPPER_SNAKE_CASE where appropriate
Types:          PascalCase
Interfaces:     PascalCase
Files:          kebab-case or project-approved convention

Example:

AssetCard.tsx
MissingPersonCard.tsx
useAuth.ts
apiClient.ts
Dart / Flutter
Classes:        PascalCase
Variables:      camelCase
Functions:      camelCase
Constants:      camelCase / project convention
Files:          snake_case

Example:

asset_card.dart
missing_person_card.dart
auth_provider.dart
5. Project Structure

The repository SHALL keep application concerns separated.

Recommended structure:

Renite
├── apps/
│   ├── web/
│   └── mobile/
│
├── backend/
│
├── docs/
│
└── ...

Frontend code SHALL be organized by feature rather than becoming one large collection of unrelated files.

Example:

features/
├── auth/
├── assets/
├── missing_persons/
├── reports/
├── map/
├── chat/
├── rewards/
├── notifications/
├── payments/
└── profile/
6. Separation of Responsibilities

Code SHALL follow clear responsibility boundaries.

UI
 ↓
State / Controller
 ↓
Service
 ↓
API Client
 ↓
Backend

UI components SHALL NOT directly perform database operations or contain sensitive business logic.

7. React Development Rules

React applications SHALL:

Use TypeScript.
Prefer reusable components.
Keep components focused.
Avoid unnecessary prop drilling.
Separate UI from business logic.
Use centralized API handling.
Handle loading/error/empty states.
Protect authenticated routes.
Validate user input.

Example:

Page
 ↓
Feature Component
 ↓
Hook / State
 ↓
Service
 ↓
API
8. Flutter Development Rules

Flutter applications SHALL:

Use Dart.
Follow a feature-oriented structure.
Keep widgets focused.
Separate UI from business logic.
Use centralized API handling.
Handle loading/error/empty states.
Protect authenticated routes.
Validate user input.

Example:

Screen
 ↓
Widget
 ↓
State / Controller
 ↓
Repository / Service
 ↓
API
9. Reusable Components

Repeated UI patterns SHALL become reusable components.

Examples:

AssetCard
MissingPersonCard
ReportCard
AlertBanner
VerificationBadge
RewardCard
NotificationItem

Developers SHALL check the shared component library before creating a new component.

10. State Management

State SHALL be separated from presentation.

Application state MAY include:

Authentication
User Profile
Assets
Reports
Missing Persons
Notifications
Chat
Rewards
Payments
Map

The selected state-management technology SHALL be documented in the frontend architecture before implementation.

11. API Communication

Applications SHALL use a centralized API layer.

Do NOT scatter API calls throughout UI components.

Preferred:

Component
 ↓
State / Controller
 ↓
Service / Repository
 ↓
API Client

The API layer SHALL handle:

Authentication
Headers
Serialization
Error handling
Timeouts
Retries where appropriate
Response validation
12. Error Handling

Every feature SHALL consider:

Loading
Success
Empty
Error
Unauthorized
Offline

Errors shown to users SHALL be understandable.

Technical details SHALL not be exposed unnecessarily.

13. Validation

Input SHALL be validated on both:

Frontend
+
Backend

Frontend validation improves user experience.

Backend validation is mandatory for security.

Never trust frontend validation alone.

14. Security

Security SHALL be part of feature development.

Developers SHALL follow the Renite security documentation and applicable OWASP guidance.

Security considerations include:

Authentication
Authorization
Input Validation
Access Control
Secure File Upload
API Security
Rate Limiting
Secrets Management
Logging
Dependency Security
Data Protection

A feature SHALL NOT be considered complete if its required security controls are missing.

15. Sensitive Data

Developers SHALL NOT:

Hardcode passwords.
Commit API keys.
Commit private credentials.
Log passwords.
Log authentication tokens.
Expose sensitive identity information unnecessarily.
Expose private location information publicly.

Secrets SHALL be managed through approved environment/configuration mechanisms.

16. Fayda Integration

Fayda is Renite's mandatory secondary identity-verification layer.

The application SHALL distinguish:

Renite Account
        +
Fayda Verification

Fayda verification SHALL NOT be treated as a replacement for the Renite user database.

Renite SHALL maintain its own application-specific user record.

17. File Uploads

Uploaded files SHALL be treated as untrusted input.

The system SHALL consider:

File type validation
File size limits
Content validation
Secure storage
Access control
Malware scanning where appropriate
Safe filenames

Uploaded files SHALL NOT automatically become publicly accessible.

18. Logging

Applications SHALL produce useful logs without exposing sensitive information.

Logs MAY include:

Request ID
Timestamp
Event
Severity
Service
Operation
Result

Logs SHALL NOT contain:

Passwords
Authentication tokens
Private keys
Unnecessary identity information
Sensitive personal data
19. Dependencies

Before adding a dependency, developers SHOULD consider:

Maintenance status
Security history
License
Community adoption
Bundle/performance impact
Whether the dependency is actually necessary

Dependencies SHALL be kept updated according to the project's maintenance policy.

20. Environment Variables

Environment-specific configuration SHALL NOT be hardcoded.

Examples:

API_BASE_URL
AUTH_CONFIG
PAYMENT_CONFIG
MAP_CONFIG
FAYDA_CONFIG
STORAGE_CONFIG

Secret values SHALL never be committed to Git.

Provide an example configuration file:

.env.example

without real secrets.

21. Comments

Comments SHALL explain why, not simply repeat what the code does.

Bad:

// Increment counter
counter++;

Good:

// Retry once because mobile networks may temporarily drop
// during report submission.
22. Documentation

Developers SHALL update documentation when they introduce:

New architecture
New API behavior
New environment variables
New security requirements
New major dependencies
New development procedures

Documentation SHALL remain synchronized with implementation.

23. Testing Requirement

New functionality SHOULD include appropriate tests.

Testing SHALL cover, where applicable:

Unit Tests
Integration Tests
API Tests
UI Tests
Security Tests

Critical functionality SHALL receive higher test priority.

24. Pull Request Requirement

A pull request SHALL contain:

Purpose
Changes
Testing Performed
Known Limitations
Screenshots where UI changed
Security Considerations where applicable

Pull requests SHALL be reviewed before merging into protected branches.

25. Definition of Done

A feature is considered complete only when:

[ ] Requirements implemented
[ ] UI follows Renite design system
[ ] Responsive behavior implemented
[ ] Validation implemented
[ ] Error states handled
[ ] Loading states handled
[ ] Authorization considered
[ ] Security requirements implemented
[ ] Tests added where required
[ ] Documentation updated where required
[ ] Code reviewed
[ ] No known critical issues remain
26. Code Review Rules

Reviewers SHALL check:

Correctness
Architecture
Security
Performance
Readability
Testing
UI consistency
Accessibility
Localization

Reviewers SHALL not approve code merely because it works locally.

27. No Direct Production Changes

Developers SHALL NOT directly modify production systems without the approved deployment process.

Changes SHALL pass through:

Development
 ↓
Review
 ↓
Testing
 ↓
Approved Merge
 ↓
Deployment
28. Core Rule

Every Renite contributor SHALL follow:

Build it clearly, secure it properly, test it, review it, then ship it.