# Renite OWASP Security Requirements

## 1. Purpose

This document defines the mandatory OWASP-based security requirements for Renite.

OWASP guidance SHALL be considered across:

```text
Web
Mobile
Backend
APIs
Authentication
File Uploads
Data Protection

The project SHALL use the applicable current OWASP guidance during implementation and security review.

2. OWASP Areas

Renite SHALL specifically consider:

OWASP Top 10
OWASP API Security Top 10
OWASP Mobile Security guidance
OWASP Application Security Verification guidance

The exact controls SHALL be adapted to the technology and feature being implemented.

3. Broken Access Control

Renite SHALL prevent users from accessing resources they do not own or have permission to access.

Every protected operation SHALL verify:

User
+
Role
+
Resource Ownership
+
Required Permission

Never rely only on frontend route protection.

4. Cryptographic Failures

Sensitive data SHALL be appropriately protected.

Requirements:

TLS for network communication
Secure password hashing
Secure key management
No plaintext passwords
No unnecessary sensitive data storage

Weak or obsolete cryptographic mechanisms SHALL NOT be introduced.

5. Injection

Renite SHALL protect against:

SQL Injection
NoSQL Injection
Command Injection
LDAP Injection where applicable
Template Injection
Other Input-Based Injection

Use:

Parameterized Queries
Safe ORM Methods
Validation
Encoding
6. Insecure Design

Security SHALL be considered during feature design.

Before implementing sensitive functionality, define:

Threats
Trust Boundaries
Actors
Permissions
Sensitive Data
Failure Modes
Abuse Cases

Examples:

Missing Person
→ Who can see the case?

Location
→ Who can access historical locations?

Recovery
→ Who can confirm ownership?

Rewards
→ Who can create or modify rewards?
7. Security Misconfiguration

Production systems SHALL avoid insecure defaults.

Examples:

Debug Mode Disabled
Default Credentials Removed
Unnecessary Services Disabled
Secure CORS
Secure Headers
Restricted Admin Access
Proper Error Handling

Development configuration SHALL NOT accidentally become production configuration.

8. Vulnerable Components

Dependencies SHALL be monitored.

The team SHALL:

Review Dependencies
Update Vulnerable Packages
Remove Unnecessary Packages
Monitor Security Advisories

Critical vulnerabilities SHALL be prioritized.

9. Authentication Failures

Authentication SHALL be protected against:

Credential Stuffing
Brute Force
Session Theft
Weak Recovery
Account Enumeration
Token Abuse

Controls MAY include:

Rate Limiting
Secure Sessions
Account Protection
MFA where required
Secure Recovery
10. Integrity Failures

Renite SHALL protect critical operations from unauthorized modification.

Examples:

Payment Status
Reward Balance
Recovery Confirmation
Identity Verification
Administrative Actions

The client SHALL NOT be allowed to determine trusted values.

11. Logging & Monitoring Failures

Security events SHALL be logged appropriately.

Important events include:

Failed Login
Successful Login
Permission Failure
Admin Action
Sensitive Data Access
Fayda Verification
Payment Events
Security Events

Logs SHALL be protected and monitored.

12. Server-Side Request Forgery

Where Renite accepts URLs or requests that cause the server to contact external resources, SSRF protections SHALL be applied.

Controls SHOULD include:

Allowlist
URL Validation
Private Network Blocking
Protocol Restrictions
Redirect Controls
API Security Requirements
13. API Authorization

Every protected API endpoint SHALL enforce authorization.

Example:

GET /api/v1/assets/:id

The backend SHALL verify whether the requester is authorized to access that specific asset.

14. Object-Level Authorization

Renite SHALL protect against unauthorized object access.

Example attack:

User A

GET /assets/USER_B_ASSET_ID

Expected:

403 Forbidden

or an appropriate non-disclosing response.

15. Broken Authentication

API authentication SHALL be:

Centralized
Validated
Rate Limited
Protected
Logged appropriately

Tokens SHALL NOT be accepted merely because they are present.

16. Excessive Data Exposure

API responses SHALL return only necessary data.

Bad:

User API
→ returns all private identity information

Good:

User API
→ returns only information required by the current client
17. Resource Consumption

APIs SHALL limit expensive operations.

Examples:

File Upload
AI Processing
Search
Map Queries
Chat
Reports
Notifications

Controls MAY include:

Rate Limits
Pagination
Request Size Limits
Timeouts
Quotas
18. Function-Level Authorization

Administrative endpoints SHALL be protected.

Example:

POST /admin/users/:id/disable

A normal user SHALL NOT be able to access the operation even if they know the endpoint.

19. Unrestricted Access to Sensitive Flows

Sensitive operations SHALL require appropriate authentication and authorization.

Examples:

Fayda Verification
Missing Person Case Access
Emergency Information
Payment
Reward Withdrawal
Account Security
20. Security Misconfiguration in APIs

Production APIs SHALL:

Disable Debug Responses
Use Secure Headers
Restrict CORS
Validate Requests
Limit Request Size
Use Safe Error Responses
Web Security Requirements
21. XSS

React applications SHALL avoid unsafe HTML rendering.

User-generated content SHALL be safely rendered.

Avoid unnecessary:

dangerouslySetInnerHTML

If raw HTML is genuinely required, it SHALL be sanitized using an approved security mechanism.

22. CSRF

Cookie-based authentication SHALL implement appropriate CSRF protection.

The chosen authentication mechanism SHALL be documented.

23. Clickjacking

Renite SHALL prevent unauthorized framing of sensitive pages using appropriate security headers.

24. Content Security Policy

The web application SHOULD implement an appropriate Content Security Policy.

The policy SHALL be tested carefully so that required application functionality remains operational without unnecessarily allowing unsafe sources.

Mobile Security Requirements
25. Secure Storage

Flutter SHALL NOT store sensitive credentials in ordinary unprotected local storage.

Sensitive values SHOULD use platform-secure storage mechanisms.

Examples:

Authentication Tokens
Sensitive Session Data
Security Credentials
26. Network Security

Mobile applications SHALL:

Use HTTPS
Validate API communication
Avoid plaintext sensitive traffic
Handle certificate/security configuration appropriately
27. Sensitive Screens

Sensitive information SHOULD be protected against unnecessary exposure.

Examples:

Identity Information
Missing Person Data
Location
Payment Information
Security Settings
28. Deep Links

Deep links SHALL be validated.

A malicious link SHALL NOT allow a user to bypass:

Authentication
Authorization
Verification
Renite-Specific Security Requirements
29. Fayda

Fayda verification SHALL:

Use approved integration
Protect verification data
Minimize stored information
Restrict access
Audit sensitive actions
30. Missing Persons

Missing-person cases SHALL have stricter access controls than ordinary lost-property reports.

The system SHALL distinguish:

Public Information
Restricted Case Information
Sensitive Investigation Information
31. Location Tracking

Location SHALL be protected against unauthorized access.

Historical location data SHALL receive stronger controls than ordinary profile information.

32. Emergency SOS

SOS SHALL be protected against abuse.

The system SHALL consider:

Authentication
Rate Limiting
False Alarm Prevention
Duplicate Events
Notification Reliability
Audit Trail

Emergency workflows SHALL prioritize reliability without sacrificing authorization.

33. AI Matching

AI matching SHALL NOT automatically establish legal ownership or identity.

The system SHALL record:

Potential Match
Confidence / Result
Verification Status
Final Human / Authorized Decision
34. Payments

Payment status SHALL be verified server-side.

The client SHALL NOT be trusted to report:

Payment Successful
Reward Earned
Refund Completed
Withdrawal Completed

Webhook events SHALL be authenticated and validated.

35. Rewards

Reward systems SHALL prevent:

Self-Referral Abuse
Duplicate Rewards
Balance Manipulation
Unauthorized Withdrawal
Replay Attacks

Reward transactions SHALL be recorded server-side.

36. Security Testing Checklist

Before release:

[ ] Access control tested
[ ] Authentication tested
[ ] Authorization tested
[ ] Injection tested
[ ] File upload tested
[ ] API security tested
[ ] Rate limiting tested
[ ] Session security tested
[ ] Sensitive data exposure checked
[ ] Dependency vulnerabilities checked
[ ] XSS checked
[ ] CSRF checked where applicable
[ ] Mobile storage checked
[ ] Deep links checked
[ ] Payment security checked
[ ] Missing-person access tested
[ ] Location access tested
37. Security Review Rule

Any change involving:

Authentication
Fayda
Location
Missing Persons
Payments
Rewards
File Uploads
Admin Functions
External APIs

SHALL receive security review.

38. Core Rule

OWASP requirements SHALL guide Renite's implementation and testing from the beginning. Security SHALL NOT be postponed until the final stage of development.