# Renite Identity, Privacy & Data Protection

## 1. Purpose

This document defines how Renite SHALL protect user identity, personal information, Fayda verification data, location information, missing-person information, and other sensitive data.

Privacy SHALL be considered throughout the entire data lifecycle:

```text
Collect
  ↓
Process
  ↓
Store
  ↓
Use
  ↓
Share
  ↓
Retain
  ↓
Delete
2. Core Principles

Renite SHALL follow:

Data Minimization
Purpose Limitation
Privacy by Design
Least Privilege
Transparency
Security by Default
Controlled Retention
Accountability

Renite SHALL NOT collect information simply because it might be useful later.

3. Renite Identity Model

Renite SHALL maintain its own user database.

Fayda SHALL provide secondary identity verification.

                 ┌──────────────┐
                 │ Fayda        │
                 │ Verification │
                 └──────┬───────┘
                        │
                        ▼
┌──────────────┐   ┌──────────────┐
│ User         │ → │ Renite       │
│ Registration │   │ Identity     │
└──────────────┘   └──────────────┘

The Renite account SHALL have its own internal user identifier.

4. Fayda Data

Fayda SHALL be treated as a sensitive identity-verification service.

Renite SHALL store only information necessary for:

Identity Verification
Account Security
Compliance
Fraud Prevention
Authorized Operations

Where possible, Renite SHOULD store a verification reference/status rather than unnecessary raw identity information.

Example:

Fayda Verification Status:
VERIFIED
PENDING
FAILED
EXPIRED
5. User Data Categories

Renite MAY process different categories of information.

Account Data
User ID
Email
Phone
Password Hash
Account Status
Profile Data
Name
Profile Image
Language
Preferences
Verification Data
Fayda Verification Reference
Verification Status
Verification Timestamp
Asset Data
Asset Information
Ownership Information
Images
Reports
Recovery Status
Location Data
Report Location
Last Seen Location
Relevant Tracking Information
Communication Data
Messages
Notifications
Support Communications
Payment Data

Renite SHOULD avoid storing raw payment credentials when a trusted payment provider can handle them.

6. Data Classification

Renite SHALL classify information according to sensitivity.

PUBLIC
INTERNAL
CONFIDENTIAL
HIGHLY_SENSITIVE

Example:

Public
→ Public recovery announcement

Internal
→ Non-sensitive system information

Confidential
→ User profile information

Highly Sensitive
→ Fayda-related information
→ Missing-person information
→ Exact location information
→ Payment/security information
7. Data Minimization

Every data field SHOULD have a defined purpose.

Before adding a new field:

Why is it required?
Who needs it?
How long is it needed?
What happens if we do not collect it?

If the field has no justified purpose, it SHALL NOT be collected.

8. User Consent

Where consent is required, Renite SHALL obtain it clearly.

Consent interfaces SHALL:

Explain the purpose
Use understandable language
Avoid deceptive design
Allow appropriate choices
Record consent where required

Users SHALL NOT be forced to agree to unrelated data processing merely to use unrelated features.

9. Location Permission

Location access SHALL be requested only when required.

The application SHALL explain why location is needed.

Example:

Report Lost Asset
      ↓
Request Location Permission
      ↓
Explain Purpose
      ↓
User Decision

The application SHALL handle denied location permission gracefully.

10. Location Visibility

Location information SHALL have controlled visibility.

Possible levels:

Public Approximate Location
Restricted Location
Private Exact Location
Authorized Investigation Location

Exact location SHALL NOT automatically be displayed publicly.

11. Missing-Person Privacy

Missing-person cases SHALL receive special protection.

Information MAY be divided into:

Public Case Information
        ↓
Restricted Case Information
        ↓
Authorized Investigation Information

The system SHALL prevent unauthorized users from accessing sensitive case information.

12. Public Reports

Before displaying a report publicly, Renite SHALL determine what information is safe to expose.

Public information SHOULD avoid unnecessary:

Phone Numbers
Private Addresses
Exact Private Locations
Fayda Information
Private Identity Data
Emergency Contact Details
Internal Investigation Information
13. Asset Ownership Information

Ownership verification information SHALL NOT be exposed publicly unless explicitly required.

Public users MAY see:

Asset Type
General Description
Approximate Location
Report Status

Sensitive ownership evidence SHALL remain restricted.

14. Data Access Control

Access SHALL be determined by:

User
Role
Resource
Purpose
Permission
Case Status

Example:

Normal User
→ Own profile

Authorized Moderator
→ Assigned reports

Authorized Investigator
→ Authorized investigation information

Administrator
→ Administrative resources

Administrative access SHALL still be logged.

15. Internal Access

Renite team members SHALL not access user information merely because they technically can.

Access SHALL follow:

Need
+
Role
+
Authorization
+
Legitimate Purpose

Sensitive access SHOULD be auditable.

16. Data Encryption

Sensitive information SHALL be protected during transmission.

Client
   ↓
HTTPS / TLS
   ↓
Backend

Sensitive stored information SHALL use appropriate encryption or equivalent protection where required.

17. Password Protection

Passwords SHALL:

Never be stored in plaintext
Never appear in logs
Never appear in API responses
Never be committed to Git

Passwords SHALL use an appropriate modern password-hashing mechanism.

18. API Responses

API responses SHALL contain only the information required by the requesting client.

Avoid returning:

Password Hash
Private Verification Data
Internal Tokens
Unnecessary Personal Data
Internal Security Information
19. Logging Privacy

Logs SHALL NOT contain unnecessary sensitive information.

Avoid logging:

Passwords
Authentication Tokens
Full Fayda Information
Payment Credentials
Private Messages
Exact Sensitive Locations

Logs SHOULD contain identifiers or references where possible.

20. Screenshots and Development Data

Developers SHALL NOT place real sensitive user information in:

Screenshots
UI Mockups
GitHub Issues
Pull Requests
Test Fixtures
Documentation
Demo Videos

Use synthetic data instead.

Example:

John Example
+251900000000
example@test.local
21. Data Retention

Every major data category SHOULD have a defined retention policy.

Example:

Account Data
→ While account is active + required retention

Reports
→ According to operational/legal requirements

Logs
→ Defined security retention period

Temporary Files
→ Delete when no longer required

Verification Information
→ Retain only as necessary

Exact retention periods SHALL be defined according to applicable legal and operational requirements.

22. Data Deletion

Where deletion is applicable, Renite SHALL provide an appropriate mechanism.

Deletion SHOULD address:

Profile
Associated Data
Uploaded Files
Sessions
Preferences

Some records MAY need to be retained when required for:

Security
Fraud Prevention
Legal Requirements
Financial Records
Audit Requirements

Such exceptions SHALL be documented.

23. Account Deactivation

Deactivation and deletion SHALL be treated as different operations.

Deactivate
→ Account becomes unavailable

Delete
→ Applicable personal data is removed or anonymized

The exact behavior SHALL be documented in product requirements.

24. Data Export

Where required, users SHOULD be able to obtain an appropriate copy of their personal information.

Exported data SHALL be protected because it may contain sensitive information.

25. Third-Party Sharing

Renite SHALL NOT share user information with third parties without a legitimate purpose and appropriate authorization.

External services MAY receive only the information required for their function.

Examples:

Payment Provider
→ Payment-related information

Map Provider
→ Required location/query information

Notification Provider
→ Required delivery information

Fayda
→ Required verification information
26. External Service Boundaries

Third-party integrations SHALL be isolated.

Renite
  ↓
Service Interface
  ↓
External Provider

The application SHALL avoid unnecessarily exposing internal user data to external services.

27. Data Breach Response

If sensitive information is suspected to be compromised:

Detect
 ↓
Contain
 ↓
Assess
 ↓
Revoke / Rotate Credentials
 ↓
Investigate
 ↓
Remediate
 ↓
Document
 ↓
Notify where legally required

Security incidents SHALL be handled according to the project's incident-response procedure.

28. Privacy in AI Processing

AI processing SHALL follow data-minimization principles.

Before sending data to an AI service, Renite SHALL determine:

What data is required?
Why is it required?
Where is it processed?
How long is it retained?
Who can access the result?

AI providers SHALL NOT receive unnecessary personal information.

29. AI Matching Data

AI matching results SHALL be treated as sensitive where they relate to identity or missing-person cases.

AI results SHALL NOT automatically:

Confirm Identity
Confirm Ownership
Close a Missing-Person Case
Authorize a Recovery

Authorized verification SHALL remain part of the workflow.

30. Children's and Vulnerable-Person Data

If Renite handles information involving children or other vulnerable persons, stronger privacy and access controls SHALL be applied.

Public exposure SHALL be minimized.

31. Privacy by Design Checklist

Before implementing a feature:

[ ] What personal data is collected?
[ ] Why is it collected?
[ ] Who can access it?
[ ] Is location involved?
[ ] Is identity involved?
[ ] Is Fayda involved?
[ ] Is third-party sharing involved?
[ ] How is it protected?
[ ] How long is it retained?
[ ] How can it be deleted?
[ ] Is audit logging required?
32. Privacy Review Required For

A privacy review SHALL be performed for changes involving:

Fayda
Identity
Location
Missing Persons
Images
Chat
Payments
AI
Public Reports
Analytics
Third-Party Integrations
33. Developer Rule

Developers SHALL assume:

If information can identify, locate, contact, verify, or expose a person, it requires deliberate protection.

34. Final Principle

Renite SHALL collect the minimum information necessary, protect it throughout its lifecycle, restrict access to legitimate users and systems, and remove or anonymize it when it is no longer required.

Protect the person behind the data, not only the database containing it.