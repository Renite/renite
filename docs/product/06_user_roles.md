# User Roles & Permissions

| Property | Value |
|----------|-------|
| Project | Renite |
| Document | User Roles & Permissions |
| Document ID | PROD-006 |
| Version | 1.0.0 |
| Status | Approved |
| Owner | Renite Product Team |
| Category | Product |
| Last Updated | August 2026 |

---

# 1. Purpose

This document defines the roles that exist within Renite and establishes what each role is permitted to do.

The purpose is to ensure that:

- Users receive only the permissions they need.
- Sensitive information is protected.
- Administrative functions are separated from normal user functions.
- Future institutional integrations can be added safely.
- Backend authorization and frontend UI behavior follow the same permission model.

> Authentication determines **who the user is**.  
> Authorization determines **what the user is allowed to do**.

---

# 2. Role Design Principle

Renite SHALL use **role-based access control (RBAC)** as the foundation of authorization.

The basic model is:

```text
User
  ↓
Role
  ↓
Permissions
  ↓
Allowed Actions

A user SHALL NOT receive permission simply because a UI control is visible.

The backend SHALL enforce permissions.

3. Core MVP Roles

The MVP SHALL prioritize these roles:

1. Guest
2. User
3. Administrator

The following roles MAY be implemented in limited form:

4. Moderator

Future roles SHALL NOT be implemented until their requirements are approved.

4. Role Hierarchy

Renite SHALL NOT treat roles as a simple hierarchy where a higher role automatically receives every permission.

Instead, permissions SHALL be explicitly assigned.

Conceptually:

                 SYSTEM
                   │
              ADMINISTRATOR
                   │
        ┌──────────┴──────────┐
        │                     │
    MODERATOR                USER
                              │
                       ┌──────┴──────┐
                       │             │
                     OWNER         FINDER

Owner and Finder SHALL be treated primarily as user behaviors, not necessarily separate authentication roles.

5. Role R-001 — Guest
5.1 Description

A guest is an unauthenticated visitor.

Guests may access public portions of Renite.

5.2 Allowed Actions

Guests MAY:

View the homepage.
View public information.
Read About information.
Read FAQ.
Read Terms and Conditions.
Read Privacy information.
Access registration.
Access login.
Search publicly available information where enabled.
5.3 Restricted Actions

Guests SHALL NOT:

Create reports.
Edit reports.
Access private reports.
Access private messages.
Access verification information.
Access user dashboards.
Manage account settings.
Perform recovery actions requiring authentication.
6. Role R-002 — Authenticated User
6.1 Description

The authenticated user is the primary Renite account type.

A normal user may act as either:

Lost Item Owner

or

Finder

depending on the action they perform.

6.2 Account Permissions

A user MAY:

View their profile.
Edit permitted profile information.
Manage account preferences.
Manage security settings.
View their own activity.
Manage their own reports.
6.3 Report Permissions

A user MAY:

Create lost reports.
Create found reports.
View their own reports.
Edit their own active reports.
Update permitted report fields.
Close their own recovery case.
View permitted public reports.

A user SHALL NOT be able to modify another user's report unless explicitly authorized.

7. User as Lost Item Owner

The system SHALL support the following behavior:

User
 ↓
Creates Lost Report
 ↓
Receives Potential Match
 ↓
Participates in Verification
 ↓
Communicates
 ↓
Confirms Recovery

The user SHALL have access to recovery information associated with their own case.

8. User as Finder

The same authenticated user may act as a finder.

User
 ↓
Creates Found Report
 ↓
Receives Potential Owner Match
 ↓
Participates in Verification
 ↓
Communicates
 ↓
Completes Handoff

No separate account SHALL be required to switch between these behaviors.

9. Role R-003 — Administrator
9.1 Description

An administrator is a highly trusted platform operator responsible for managing Renite.

Administrator privileges SHALL be tightly controlled.

9.2 Administrator Capabilities

An administrator MAY:

View users.
Review reports.
Moderate content.
Manage inappropriate reports.
Suspend accounts where authorized.
Restore accounts where authorized.
Review system activity.
Review audit events.
Manage selected platform settings.
Investigate operational issues.
9.3 Administrator Restrictions

Administrators SHALL NOT automatically have unrestricted access to all user content.

Access to sensitive information SHALL follow:

Business Need
      +
Authorization
      +
Auditability
      =
Permitted Access

Administrative access SHALL be logged where appropriate.

10. Role R-004 — Moderator
10.1 Description

A moderator manages user-generated content and safety-related reports.

This role is lower privilege than the administrator.

10.2 Moderator Capabilities

A moderator MAY:

Review flagged reports.
Review reported content.
Hide inappropriate content where authorized.
Escalate serious cases.
Review suspicious activity.
Record moderation decisions.
10.3 Moderator Restrictions

A moderator SHALL NOT:

Modify system configuration.
Manage administrator accounts.
Access unnecessary financial information.
Access private information without authorization.
Permanently delete critical system records without appropriate authority.
11. Role R-005 — Institution Administrator
Status
FUTURE

This role is intended for schools, companies, organizations, and other approved institutions.

11.1 Potential Capabilities

An institution administrator MAY eventually:

Manage organization profile.
Manage authorized organization users.
Create institutional reports.
View organization cases.
Manage organizational assets.
Review recovery cases.
Access organization analytics.
11.2 Isolation Rule

Institutional users SHALL only access information belonging to their organization unless additional authorization exists.

Organization A
      ↓
Organization A Data

Organization B
      ↓
Organization B Data

Cross-organization access SHALL NOT be granted by default.

12. Role R-006 — Authority / Law Enforcement
Status
FUTURE

This role represents a verified government or law-enforcement organization.

12.1 Potential Capabilities

Depending on legal agreements, an authorized authority MAY:

Receive official reports.
Review authorized cases.
Access authorized evidence.
Communicate with authorized users.
Update official case information.
12.2 Verification Requirement

Renite SHALL NOT grant authority permissions based solely on a user claiming to be law enforcement.

Authority accounts SHALL require an approved verification process.

13. Role R-007 — Delivery Partner
Status
FUTURE

This role is intended for authorized recovery and logistics partners.

Potential permissions:

View assigned delivery jobs.
Accept delivery requests.
Update delivery status.
Confirm pickup.
Confirm delivery.
Submit delivery evidence.

Delivery partners SHALL NOT receive unrestricted access to user data.

14. Role R-008 — Support Agent
Status
FUTURE / OPTIONAL

A support agent may assist users with account and platform issues.

Potential permissions:

View limited account information.
Respond to support requests.
Help users understand platform workflows.
Escalate technical or safety issues.

Support agents SHALL NOT automatically access sensitive recovery evidence.

15. Role R-009 — System Service
Status
SYSTEM ROLE

This is not a human role.

It represents trusted backend processes such as:

Notification service.
Matching service.
Image processing.
Scheduled jobs.
Audit processing.
File processing.

System services SHALL use service-level authentication and authorization.

16. Permission Categories

Permissions SHALL be grouped into logical categories.

AUTH
PROFILE
REPORT
SEARCH
MATCH
VERIFICATION
CHAT
NOTIFICATION
MEDIA
LOCATION
RECOVERY
MODERATION
ADMINISTRATION
AUDIT
ORGANIZATION
PAYMENT
EMERGENCY
HARDWARE

Future categories SHALL be added only when required.

17. Core Permission Naming

Permissions SHOULD follow a consistent pattern:

resource:action

Examples:

report:create
report:read
report:update
report:delete

profile:read
profile:update

match:read
match:create

message:create
message:read

notification:read

admin:user:read
admin:user:suspend
18. MVP Permission Matrix
Permission	Guest	User	Moderator	Admin
View public pages	YES	YES	YES	YES
Register	YES	NO	NO	NO
Login	YES	YES	YES	YES
Manage own profile	NO	YES	YES	YES
Create report	NO	YES	YES*	YES*
View public reports	YES	YES	YES	YES
View own reports	NO	YES	YES	YES
Edit own reports	NO	YES	YES	YES
Delete own draft/report	NO	YES	YES*	YES
Search	YES	YES	YES	YES
View authorized matches	NO	YES	YES	YES
Participate in verification	NO	YES	LIMITED	YES
Use recovery chat	NO	YES	LIMITED	YES
View notifications	NO	YES	YES	YES
Flag content	NO	YES	YES	YES
Moderate reports	NO	NO	YES	YES
Suspend users	NO	NO	NO	YES
View audit logs	NO	NO	LIMITED	YES
Manage system settings	NO	NO	NO	YES

* Only when required by the moderator/administrative workflow.

19. Ownership Rules

Renite SHALL distinguish between:

Resource Ownership

and

Role Permission

For example:

User A
  ↓
Owns Report A

User A MAY edit Report A.

But:

User A
  ↓
Does NOT own Report B

User A SHALL NOT automatically edit Report B.

20. Resource-Level Authorization

Authorization SHALL consider both:

Role
+
Resource Ownership
+
Resource State

Example:

User
+
Own Report
+
Report Active
=
Can Edit

But:

User
+
Another User's Report
+
Any State
=
Cannot Edit

unless explicitly authorized.

21. Recovery Case Permissions

Recovery cases SHALL have controlled access.

Possible participants:

Case Owner
Case Finder
Authorized Moderator
Authorized Administrator

A user outside the case SHALL NOT automatically access private recovery information.

22. Chat Permissions

Chat access SHALL be tied to the relevant recovery case.

Example:

Potential Match
      ↓
Authorized Participants
      ↓
Private Conversation

A random user SHALL NOT be able to access the conversation.

23. Location Permissions

Location data SHALL be treated as sensitive.

The system SHALL distinguish between:

Public Approximate Location
Private Exact Location
Restricted Location

Users SHALL only receive the level of location information required for the task.

24. Verification Permissions

Verification information SHALL receive stronger access control.

Examples:

Serial number.
Ownership evidence.
Private photographs.
Unique identifying details.

These SHOULD only be visible to authorized participants and authorized personnel.

25. Administrative Access Rule

Administrative privilege SHALL NOT mean:

"The administrator can see everything at all times."

Instead:

Admin Role
   ↓
Authorized Administrative Action
   ↓
Specific Resource
   ↓
Audit Event

This reduces unnecessary internal access.

26. Sensitive Permission Rules

The following permissions SHALL receive additional security controls:

user:suspend
user:delete
report:delete
verification:read
location:read
audit:read
payment:read
emergency:read
authority:access

These permissions SHOULD require additional authorization depending on implementation.

27. Future Payment Permissions

Payment functionality is outside the MVP.

Future permissions MAY include:

payment:create
payment:read
payment:refund
wallet:read
wallet:withdraw
reward:earn
reward:redeem

Financial permissions SHALL be isolated from ordinary user permissions.

28. Future Emergency Permissions

Potential permissions:

emergency:create
emergency:read
emergency:update
emergency:notify
emergency:location:read

Emergency permissions SHALL require dedicated safety and security design.

29. Future Hardware Permissions

Potential permissions:

device:register
device:read
device:track
device:update
device:unlink

Hardware tracking permissions SHALL be subject to strict ownership verification.

30. Role Assignment Rules

Roles SHALL NOT be assigned casually.

Guest

Automatically assigned to unauthenticated visitors.

User

Assigned after successful registration and account activation.

Moderator

Assigned only by an authorized administrator.

Administrator

Assigned only through a protected administrative process.

Institution

Assigned only after organization verification.

Authority

Assigned only after official verification.

Delivery Partner

Assigned only after partner approval.

31. Role Escalation Rule

A user SHALL NOT be able to:

Promote themselves.
Assign themselves administrator permissions.
Modify their own authorization level.
Create an authority account without verification.

Role changes SHALL be controlled by authorized processes.

32. Frontend Authorization Rule

The frontend MAY hide controls based on permissions.

However:

Frontend permission checks SHALL NEVER be considered sufficient security.

Example:

Frontend
   ↓
Hide Admin Button

is useful for UX.

But the backend SHALL still enforce:

API
 ↓
Authentication
 ↓
Authorization
 ↓
Permission Check
 ↓
Action
33. Backend Authorization Rule

Every protected API operation SHALL verify:

1. Is the request authenticated?
2. What user is making the request?
3. What role does the user have?
4. Does the role have the required permission?
5. Does the user have access to this specific resource?
6. Is the resource in a valid state?

Only after these checks SHALL the operation proceed.

34. Least Privilege

Renite SHALL follow the principle of least privilege.

Every role SHALL receive only the permissions required to perform its responsibilities.

Minimum Permission
        ↓
Minimum Data
        ↓
Minimum Exposure
        ↓
Minimum Risk
35. Separation of Duties

Critical operations SHOULD require separation of responsibilities where practical.

Examples:

User
   ↓
Creates Report

System
   ↓
Matches

User
   ↓
Verifies

Administrator
   ↓
Moderates when necessary

A single role SHOULD NOT silently control every stage of sensitive workflows.

36. Audit Requirements

Important permission-related actions SHOULD be logged.

Examples:

Role Assigned
Role Removed
Permission Changed
Account Suspended
Report Removed
Sensitive Record Accessed
Administrative Action
Verification Decision

Audit records SHOULD include sufficient information to investigate the action.

37. Permission Failure Behavior

When a user lacks permission, the system SHALL:

Deny the action.
Avoid exposing sensitive information.
Return an appropriate error.
Log the event when appropriate.
Provide a useful user-facing message.

The system SHOULD NOT reveal unnecessary authorization details.

38. Example Authorization Flow
User Request
     ↓
Authenticate
     ↓
Identify User
     ↓
Load Role
     ↓
Check Permission
     ↓
Check Resource Ownership
     ↓
Check Resource State
     ↓
ALLOW / DENY
39. Example
Request

User A attempts to edit Report B.

Evaluation
Authenticated?
YES

Role:
User

Permission:
report:update
YES

Owns Report B?
NO

Authorized?
NO
Result
REQUEST DENIED
40. MVP Role Strategy

For the two-week MVP, the implementation SHOULD remain simple.

Recommended roles:

guest
user
admin

Optional:

moderator

The team SHALL NOT create dozens of roles before there is a real requirement for them.

41. Future Expansion Strategy

The authorization system SHOULD be designed so that future roles can be added without rewriting the entire security model.

Future expansion may introduce:

institution_admin
authority
delivery_partner
support_agent

without changing the fundamental model:

User
 ↓
Role
 ↓
Permission
 ↓
Resource Access
42. Role & Persona Relationship

Personas describe why someone uses Renite.

Roles describe what the system allows them to do.

Example:

Persona:
Lost Item Owner

Role:
User

Behavior:
Creates Lost Report

Another example:

Persona:
Finder

Role:
User

Behavior:
Creates Found Report

Therefore:

Owner and Finder SHALL NOT automatically become separate system roles.

43. Definition of Done

The role and permission model SHALL be considered complete when:

MVP roles are defined.
Future roles are separated.
Permissions are documented.
Ownership rules are defined.
Resource-level authorization is defined.
Sensitive access is restricted.
Administrative access is controlled.
Frontend/backend authorization responsibilities are clear.
Least privilege is established.
Audit requirements are established.
44. Related Documents
01_problem_statement.md
02_product_goals.md
03_product_scope.md
04_mvp_definition.md
05_user_personas.md
07_functional_requirements.md
08_non_functional_requirements.md
09_feature_specifications.md
10_user_stories.md
11_acceptance_criteria.md
12_requirements_traceability.md

../planning/
../architecture/
../security/
../engineering/
45. Change History
Version	Date	Description
1.0.0	August 2026	Initial User Roles & Permissions document.
Approval

Status: APPROVED

Approved By: Renite Core Team

End of Document