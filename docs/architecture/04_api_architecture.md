
```markdown
# Renite API Architecture

## 1. Purpose

This document defines the API rules and structure for Renite.

The API is the communication boundary between the frontend and backend.

All frontend applications SHALL use the API rather than accessing internal services or the database directly.

---

# 2. API Principles

Renite APIs SHALL be:

- Consistent
- Secure
- Versioned
- Predictable
- Validated
- Documented
- Resource-oriented
- Stateless where practical

---

# 3. Base URL

The API SHALL use versioned routes.

```text
/api/v1

Example:

/api/v1/auth
/api/v1/users
/api/v1/reports
/api/v1/matches
/api/v1/recovery

The production domain SHALL be configured through environment variables.

4. API Structure
/api/v1
│
├── auth
├── users
├── profiles
├── categories
├── materials
├── reports
├── search
├── matches
├── verifications
├── recovery
├── conversations
├── messages
├── notifications
├── rewards
└── admin
5. HTTP Methods

Renite SHALL use standard HTTP methods.

Method	Purpose
GET	Retrieve data
POST	Create resource/action
PATCH	Partially update resource
PUT	Replace resource where required
DELETE	Remove/cancel resource
6. Authentication Endpoints
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/auth/me
7. User Endpoints
GET   /api/v1/users/me
PATCH /api/v1/users/me
GET   /api/v1/users/:id

Public user information SHALL be limited.

Private user information SHALL require authorization.

8. Category Endpoints
GET /api/v1/categories
GET /api/v1/categories/:id

Administrative endpoints:

POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
9. Material Endpoints
GET /api/v1/materials
GET /api/v1/materials/:id

Administration:

POST   /api/v1/admin/materials
PATCH  /api/v1/admin/materials/:id
DELETE /api/v1/admin/materials/:id
10. Report Endpoints
POST   /api/v1/reports
GET    /api/v1/reports
GET    /api/v1/reports/:id
PATCH  /api/v1/reports/:id
DELETE /api/v1/reports/:id

Additional actions MAY include:

POST /api/v1/reports/:id/close
POST /api/v1/reports/:id/cancel
POST /api/v1/reports/:id/found
11. Report Creation

Example:

POST /api/v1/reports

Request:

{
  "type": "LOST",
  "materialId": "material-id",
  "title": "Black Laptop",
  "description": "Black laptop with a silver logo",
  "location": {
    "latitude": 9.03,
    "longitude": 38.74
  },
  "incidentDate": "2026-08-10"
}

The backend SHALL validate all fields.

12. Report Response

Example:

{
  "success": true,
  "data": {
    "id": "report-id",
    "token": "RNT-7F3K2A",
    "type": "LOST",
    "status": "ACTIVE",
    "createdAt": "2026-08-10T10:00:00Z"
  }
}

Private fields SHALL not be returned unnecessarily.

13. Search API

Basic search:

GET /api/v1/search/reports

Example:

/api/v1/search/reports?
query=laptop
&category=electronics
&type=FOUND
&status=ACTIVE
&page=1
&limit=20

Supported filters MAY include:

query
category
material
type
status
location
date
page
limit
sort
14. Search Response

Example:

{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "pages": 0
    }
  }
}
15. Matching API

Potential matches:

GET /api/v1/reports/:id/matches
POST /api/v1/matches
GET /api/v1/matches/:id
PATCH /api/v1/matches/:id

Possible statuses:

PENDING
ACCEPTED
REJECTED
EXPIRED
16. Matching Rule

The API SHALL describe AI/rule-based matching as a potential match.

Example:

{
  "success": true,
  "data": {
    "matchId": "match-id",
    "lostReportId": "lost-id",
    "foundReportId": "found-id",
    "score": 0.87,
    "status": "PENDING"
  }
}

A score SHALL NOT mean:

87% proof of ownership

It represents matching confidence only.

17. Verification API
POST  /api/v1/matches/:id/verify
GET   /api/v1/verifications/:id
PATCH /api/v1/verifications/:id

Verification SHALL require appropriate authorization.

18. Recovery API
POST  /api/v1/recovery
GET   /api/v1/recovery
GET   /api/v1/recovery/:id
PATCH /api/v1/recovery/:id
POST  /api/v1/recovery/:id/complete
POST  /api/v1/recovery/:id/cancel
19. Recovery State

Recommended states:

OPEN
IN_PROGRESS
HANDOFF_PENDING
COMPLETED
CANCELLED
DISPUTED

Invalid state transitions SHALL be rejected.

Example:

COMPLETED
   ↓
OPEN

SHALL NOT be allowed without an explicit administrative process.

20. Conversation API
GET  /api/v1/recovery/:id/conversation
POST /api/v1/recovery/:id/conversation

Messages:

GET  /api/v1/conversations/:id/messages
POST /api/v1/conversations/:id/messages
PATCH /api/v1/messages/:id
DELETE /api/v1/messages/:id

The backend SHALL verify conversation membership.

21. Notifications API
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
POST  /api/v1/notifications/read-all
22. Profile API
GET   /api/v1/profile
PATCH /api/v1/profile
POST  /api/v1/profile/image
23. Admin API

Administrative endpoints SHALL be separated.

Example:

GET /api/v1/admin/users
GET /api/v1/admin/reports
GET /api/v1/admin/recovery
GET /api/v1/admin/audit-logs

Admin APIs SHALL require explicit authorization.

24. Authentication

Protected endpoints SHALL require authentication.

Example:

Authorization: Bearer <access-token>

The exact authentication mechanism SHALL be selected by the backend team.

Tokens SHALL:

Expire
Be securely stored by the client
Never be logged
Never be included in URLs
25. Authorization

Authentication answers:

Who are you?

Authorization answers:

What are you allowed to do?

Example:

GET /reports/:id

The backend SHALL check whether the requester is authorized to view that report.

26. Ownership Checks

For user-owned resources:

Request
   ↓
Authenticated User
   ↓
Resource Owner?
   ↓
Allowed / Denied

The API SHALL NOT trust a userId sent by the frontend as proof of ownership.

27. Validation

Every API endpoint receiving input SHALL validate:

Required fields
Data types
Length
Allowed values
Formats
File type
File size

Invalid requests SHALL return an appropriate 4xx response.

28. HTTP Status Codes

Renite SHALL use appropriate status codes.

Code	Meaning
200	Successful request
201	Resource created
204	Successful request with no content
400	Invalid request
401	Not authenticated
403	Not authorized
404	Resource not found
409	Conflict
422	Validation failure
429	Rate limited
500	Server error
29. Error Format

Errors SHOULD follow:

{
  "success": false,
  "error": {
    "code": "REPORT_NOT_FOUND",
    "message": "The requested report could not be found."
  }
}

Internal stack traces SHALL NOT be returned in production.

30. Error Codes

Error codes SHALL be predictable.

Examples:

AUTH_INVALID_CREDENTIALS
AUTH_UNAUTHORIZED
USER_NOT_FOUND
REPORT_NOT_FOUND
REPORT_FORBIDDEN
REPORT_INVALID_STATUS
MATCH_NOT_FOUND
VERIFICATION_REQUIRED
RECOVERY_NOT_FOUND
RECOVERY_FORBIDDEN
VALIDATION_ERROR
RATE_LIMITED
INTERNAL_ERROR
31. Pagination

List endpoints SHOULD support pagination.

Example:

?page=1&limit=20

The backend SHALL enforce a maximum limit.

Example:

limit <= 100
32. Sorting

Sorting SHALL only accept approved fields.

Example:

?sort=createdAt
&order=desc

The backend SHALL reject arbitrary database field expressions.

33. Filtering

Filters SHALL be validated against allowed values.

Bad:

?sort=DROP TABLE...

Preferred:

?sort=createdAt

The API SHALL never directly pass arbitrary client input into database queries.

34. File Upload API

Example:

POST /api/v1/reports/:id/images

The backend SHALL validate:

File type
File size
File extension
Content type
Ownership
Upload permissions

Uploaded files SHALL NOT automatically become publicly accessible.

35. Rate Limiting

Rate limiting SHOULD apply to sensitive endpoints.

Especially:

Login
Registration
Password reset
Search
Messaging
File upload
Verification
36. API Security

The API SHALL:

Use HTTPS
Validate input
Authenticate protected requests
Authorize resource access
Rate-limit sensitive operations
Avoid exposing secrets
Avoid leaking private information
37. API Versioning

Breaking API changes SHALL use a new version.

Example:

/api/v1/reports
/api/v2/reports

The team SHALL avoid silently changing the meaning of existing API responses.

38. API Documentation

Every production API endpoint SHALL eventually be documented using an API documentation format/tool such as OpenAPI.

Documentation SHALL include:

Endpoint
Method
Authentication
Parameters
Request body
Response
Errors
Authorization requirements
39. API Logging

API logs SHOULD include:

Request ID
HTTP method
Path
Status
Response time
Authenticated user ID where appropriate

Logs SHALL NOT contain:

Passwords
Access tokens
Private messages
Unnecessary biometric data
Sensitive payment credentials
40. Request IDs

Each API request SHOULD receive a unique request ID.

Example:

X-Request-ID: req_abc123

This allows frontend, backend, and monitoring systems to correlate errors.

41. API Flow

Normal request:

Client
  ↓
HTTPS
  ↓
Router
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
  ↓
Response
42. API Rules
1. All production API routes SHALL be versioned.

2. Protected endpoints SHALL require authentication.

3. Authorization SHALL be checked server-side.

4. Input SHALL be validated.

5. Controllers SHALL remain thin.

6. Business logic SHALL live in services.

7. Database access SHALL be isolated.

8. Errors SHALL use consistent formats.

9. Sensitive information SHALL never be returned unnecessarily.

10. Tokens SHALL never be logged or placed in URLs.

11. Pagination SHALL be used for potentially large collections.

12. Rate limiting SHALL protect sensitive endpoints.

13. Breaking changes SHALL require API versioning.

14. The frontend SHALL never bypass the API.
43. MVP API Boundary
REQUIRED
Auth
Users
Profiles
Categories
Materials
Reports
Search
Matches
Verification
Recovery
Conversations
Messages
Notifications
Admin
FUTURE
Payments
Banking
Hardware
SOS
Law Enforcement
Advanced Biometrics
Blockchain
44. Definition of Done

The API architecture is ready when:

[ ] API version defined
[ ] Authentication strategy defined
[ ] Authorization strategy defined
[ ] Core endpoints defined
[ ] Report workflow defined
[ ] Matching workflow defined
[ ] Recovery workflow defined
[ ] Chat workflow defined
[ ] Notification endpoints defined
[ ] Error format defined
[ ] Validation rules defined
[ ] Pagination defined
[ ] Rate limiting identified
[ ] API documentation strategy defined
Related Documents
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
1.0.0	August 2026	Initial Renite API architecture.
Approval

Status: APPROVED

Approved By: Renite Core Team