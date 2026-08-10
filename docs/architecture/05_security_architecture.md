# Renite Security Architecture

## 1. Purpose

This document defines the mandatory security architecture and security rules for Renite.

Renite handles potentially sensitive information including user accounts, locations, recovery reports, private communication, ownership evidence, and future missing-person information.

Security SHALL be treated as a core system requirement, not as an optional feature.

---

# 2. Security Principles

Renite SHALL follow these principles:

1. Security by design.
2. Least privilege.
3. Zero trust between application components.
4. Server-side authorization.
5. Minimum necessary data collection.
6. Secure storage of sensitive information.
7. Encryption in transit.
8. Encryption at rest where appropriate.
9. Complete auditability of important actions.
10. Privacy by default.

---

# 3. Security Architecture

```text
                    Client
                      │
                      ▼
                   HTTPS
                      │
                      ▼
              API Gateway / Server
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Auth        Security     Rate Limit
       Layer       Middleware     Layer
          │           │           │
          └───────────┼───────────┘
                      ▼
               Application Layer
                      │
             Authorization
                      │
                      ▼
                 Data Layer
                      │
                      ▼
                  Database

No external client SHALL directly access the database.

4. Authentication

Authentication SHALL establish the identity of the user.

Supported authentication MAY include:

Email + Password
Phone + Password
Email Verification
Phone Verification
Password Reset
Session / Token Authentication

Future authentication MAY include:

OAuth
Passkeys
Biometric device authentication
Multi-factor authentication
5. Password Security

Passwords SHALL:

Never be stored in plaintext.
Never be logged.
Never be returned by APIs.
Be hashed using a modern password hashing algorithm.
Follow minimum complexity and length requirements.

Recommended algorithms:

Argon2id
bcrypt

The backend team SHALL select and configure one appropriately.

6. Authentication Tokens

Authentication tokens SHALL:

Expire
Be securely generated
Be securely stored on the client
Be transmitted only over HTTPS
Never appear in URLs
Never be logged

Refresh-token handling SHALL use secure storage and rotation where appropriate.

7. Authorization

Every protected operation SHALL perform server-side authorization.

Example:

User A
  ↓
Requests Report B
  ↓
Backend checks ownership/access
  ↓
Allowed / Denied

The frontend SHALL never be trusted to determine whether an operation is permitted.

8. Role-Based Access Control

Renite SHALL use role-based access control where appropriate.

Initial roles:

USER
ADMIN
MODERATOR

Future roles:

LAW_ENFORCEMENT
ORGANIZATION_ADMIN
SUPPORT_AGENT

Roles SHALL be checked by the backend.

9. Resource-Level Authorization

Role checks alone are insufficient.

The backend SHALL also verify resource ownership and permissions.

Example:

User
 ├── owns Report A
 └── does NOT own Report B

The user SHALL not be allowed to modify Report B simply because they are authenticated.

10. Data Classification

Renite data SHALL be classified.

Public

Examples:

General category
Material type
Public report token
Public application information
Private

Examples:

Email
Phone
Private messages
Exact recovery information
Precise location
Highly Sensitive

Examples:

Biometric information
Identity documents
Emergency contacts
Missing-person information
Law-enforcement information
Ownership evidence

Access to highly sensitive information SHALL be strictly controlled.

11. Location Privacy

Location data SHALL be treated as sensitive.

The system SHALL avoid exposing exact coordinates unnecessarily.

Example:

Public user:

Addis Ababa

Instead of:

9.0340, 38.7468

Exact coordinates MAY be revealed only to authorized parties when necessary for the recovery process.

12. Missing-Person Privacy

Missing-person functionality SHALL receive stronger privacy controls than ordinary lost-item reports.

The system SHALL avoid publicly exposing:

Exact live location
Emergency contact information
Private identity information
Sensitive biometric information
Private investigation information

Law-enforcement access SHALL require explicit authorization and appropriate legal procedures.

13. Biometric Data

Biometric functionality is a future/high-security feature.

Renite SHALL NOT treat an AI face match as definitive proof of identity.

AI matching SHALL produce:

Potential Match
Confidence Score

It SHALL NOT automatically produce:

Verified Identity

Human or authorized verification SHALL remain part of sensitive identity workflows.

14. Biometric Storage

If biometric technology is implemented:

Raw biometric data SHALL be minimized.
Access SHALL be highly restricted.
Data retention SHALL be defined.
Processing SHALL have a legitimate purpose.
Biometric templates SHOULD be preferred over unnecessary raw images where technically appropriate.
Biometric information SHALL NOT be exposed through normal user APIs.
15. Image Security

Uploaded images SHALL be treated as untrusted input.

The backend SHALL validate:

File type
File size
File extension
MIME type
Storage path
Uploader permissions

Images SHOULD be scanned and sanitized where appropriate.

16. File Storage

Files SHOULD be stored outside the main database.

Application
    ↓
Secure File Storage
    ↓
Private File Reference

The database SHALL store references/metadata rather than unnecessarily storing large binary files.

Private files SHALL require authorization before access.

17. Encryption

All network communication SHALL use HTTPS/TLS.

Sensitive stored data SHOULD use encryption at rest.

Examples:

Database
File Storage
Backups
Secrets

Encryption keys SHALL not be committed to Git.

18. Secrets Management

Secrets SHALL never be hardcoded.

Bad:

const password = "mypassword";

Good:

Environment Variables
Secret Manager
Secure Deployment Configuration

Sensitive configuration includes:

Database credentials
JWT secrets
API keys
Payment keys
SMS credentials
Email credentials
Cloud credentials
Encryption keys
19. Environment Separation

Renite SHALL maintain:

Development
Testing
Production

Each environment SHALL have separate secrets and credentials.

Production credentials SHALL never be used casually in development.

20. API Security

All API endpoints SHALL:

Validate input
Authenticate protected requests
Authorize actions
Use HTTPS
Rate-limit sensitive operations
Return safe errors
Avoid leaking internal information
21. Input Validation

All external input SHALL be considered untrusted.

Input SHALL be validated for:

Type
Length
Format
Range
Allowed values
Encoding

Validation SHALL happen on the backend even if frontend validation exists.

22. Injection Protection

The backend SHALL protect against:

SQL Injection
NoSQL Injection
Command Injection
Template Injection
Path Traversal
Header Injection

Database queries SHALL use parameterized queries or safe ORM/query-builder mechanisms.

23. XSS Protection

User-generated content SHALL be treated as untrusted.

The application SHALL prevent malicious scripts from being executed through:

Report descriptions
User profiles
Messages
Search parameters
Uploaded content
24. CSRF Protection

If browser-based cookie authentication is used, appropriate CSRF protection SHALL be implemented.

If token-based authentication is used, the implementation SHALL still follow secure browser storage and request practices.

25. Rate Limiting

Rate limiting SHALL protect high-risk endpoints.

At minimum:

Login
Registration
Password reset
Verification
Search
Messaging
File upload
Recovery actions

Abusive requests SHALL be throttled or blocked.

26. Account Protection

The system SHOULD detect:

Repeated failed logins
Suspicious login attempts
Unusual authentication behavior
Repeated password resets

Future security enhancements MAY include:

Login notifications
Device management
MFA
Risk-based authentication
27. Session Security

Sessions/tokens SHALL have defined expiration.

The system SHOULD support:

Logout
Token revocation
Refresh token rotation
Session invalidation
Password-change invalidation
28. Chat Security

Recovery conversations SHALL be private.

The system SHALL:

Verify conversation membership
Prevent unauthorized message access
Protect message transport
Restrict message attachments
Log appropriate security events

Personal phone numbers and email addresses SHALL not automatically be exposed between parties.

29. Recovery Handoff Security

The recovery process SHALL avoid unsafe direct contact.

Recommended flow:

Potential Match
      ↓
Verification
      ↓
Secure Chat
      ↓
Handoff Arrangement
      ↓
Recovery Confirmation
      ↓
Case Closed

The platform SHOULD encourage safe public or authorized handoff locations.

30. Ownership Verification

Ownership SHALL be verified using appropriate evidence.

Possible evidence:

Serial Number
Purchase Evidence
Unique Device Information
Device Unlock
Original Report Details
Manual Verification

The system SHALL avoid exposing the owner's secret evidence to the finder.

31. Reward Security

Rewards SHALL only be issued after an appropriate recovery state is reached.

Example:

Recovery Completed
       ↓
Ownership Confirmed
       ↓
Reward Issued

Users SHALL not be able to manipulate frontend requests to grant themselves rewards.

All reward issuance SHALL be server-controlled.

32. Audit Logging

Security-sensitive operations SHALL be logged.

Examples:

LOGIN
LOGOUT
PASSWORD_CHANGE
REPORT_CREATED
REPORT_UPDATED
MATCH_CREATED
MATCH_ACCEPTED
VERIFICATION_STARTED
VERIFICATION_COMPLETED
RECOVERY_COMPLETED
ADMIN_ACTION
ROLE_CHANGED

Logs SHALL not contain unnecessary sensitive information.

33. Administrative Security

Administrative functionality SHALL require elevated authorization.

Admin operations SHOULD include:

User management
Report moderation
Case management
Security review
Audit review
Content management

Administrative actions SHALL be auditable.

34. Law Enforcement Integration

Law-enforcement functionality SHALL NOT automatically grant unrestricted access to Renite data.

Future integrations SHALL require:

Authenticated agency
Authorized personnel
Access control
Audit logs
Data minimization
Legal compliance

The exact integration model SHALL be defined before implementation.

35. Emergency SOS

Future SOS functionality SHALL have strict safeguards.

Possible flow:

SOS Trigger
    ↓
Verify User / Device
    ↓
Determine Emergency Contacts
    ↓
Generate Emergency Event
    ↓
Send Authorized Notifications
    ↓
Record Audit Event

The system SHALL avoid automatically sending sensitive information to arbitrary recipients.

36. Suspicious Movement Detection

Future anomaly detection SHALL be treated as an alert mechanism, not as proof of kidnapping or criminal activity.

Example:

Unusual Movement
       ↓
Risk Evaluation
       ↓
Alert
       ↓
Human / User Confirmation
       ↓
Emergency Action if required

AI-generated alerts SHALL not automatically accuse or identify someone as a criminal.

37. Hardware Tracking Security

Future tracking hardware SHALL require:

Device authentication
Secure device registration
Encrypted communication
Ownership verification
Access control
Tracking consent
Audit logging

Hardware tracking SHALL comply with applicable laws and platform policies.

38. Payment Security

Future payments SHALL use trusted payment providers.

Renite SHOULD NOT store:

Bank passwords
Card PINs
Full card secrets
Mobile-money credentials

The application SHOULD store provider transaction identifiers instead.

39. Dependency Security

Dependencies SHALL be reviewed regularly.

The team SHALL:

Keep dependencies updated
Review security advisories
Remove unused dependencies
Avoid untrusted packages
Lock dependency versions where appropriate
40. Git Security

The following SHALL never be committed:

.env
.env.production
API keys
Passwords
Private certificates
Private encryption keys
Database credentials
Authentication secrets

A .gitignore file SHALL be configured before development begins.

41. Error Security

Production errors SHALL not expose:

Stack traces
Database queries
Passwords
Tokens
Internal server paths
Infrastructure information

Users SHALL receive safe error messages.

42. Security Headers

The web application SHOULD implement appropriate security headers, including protections for:

Content Security Policy
Clickjacking
MIME sniffing
Transport security
Referrer policy

The exact configuration SHALL depend on the frontend/backend deployment architecture.

43. Backup Security

Backups SHALL:

Be encrypted
Have restricted access
Use separate credentials
Have defined retention
Be periodically tested

Backup files SHALL not be publicly accessible.

44. Incident Response

Security incidents SHALL follow a defined process:

Detect
  ↓
Contain
  ↓
Investigate
  ↓
Recover
  ↓
Document
  ↓
Improve

The team SHALL maintain an internal record of serious incidents.

45. Security Testing

Before production release, the team SHALL test:

Authentication
Authorization
Input validation
File uploads
API security
Session handling
Rate limiting
Access control
Data exposure

Future releases SHOULD include automated security testing.

46. Security Rules
1. Never trust client-side authorization.

2. Never store plaintext passwords.

3. Never commit secrets.

4. Never expose exact sensitive locations unnecessarily.

5. Never treat AI matching as absolute identity proof.

6. Never expose private user information without authorization.

7. Never allow frontend requests to directly control rewards.

8. Never allow arbitrary file uploads without validation.

9. Never expose internal errors in production.

10. Never give administrative access without explicit authorization.

11. Never collect sensitive data without a defined purpose.

12. Never introduce high-risk features without reviewing their security and legal requirements.
47. MVP Security Boundary
REQUIRED
Authentication
Authorization
Password security
Input validation
HTTPS
Rate limiting
Secure file uploads
Role-based access
Resource ownership checks
Audit logging
Secret management
Database security
Privacy controls
FUTURE
MFA
Advanced biometric protection
Law enforcement integration
Hardware security
SOS infrastructure
Payment security
Advanced fraud detection
Device tracking
48. Definition of Done

Security architecture is ready when:

[ ] Authentication rules defined
[ ] Authorization rules defined
[ ] Roles defined
[ ] Sensitive data classified
[ ] Location privacy defined
[ ] File security defined
[ ] API security defined
[ ] Secret management defined
[ ] Audit logging defined
[ ] Rate limiting defined
[ ] Admin security defined
[ ] Backup security defined
[ ] Incident response defined
[ ] Security testing requirements defined
Related Documents
docs/
├── planning/
├── product/
├── architecture/
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
1.0.0	August 2026	Initial Renite security architecture.
Approval

Status: APPROVED

Approved By: Renite Core Team