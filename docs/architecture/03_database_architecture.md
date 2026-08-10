# Renite Database Architecture

## 1. Purpose

This document defines the database architecture for Renite.

The database SHALL provide a reliable and secure source of truth for users, reports, recovery cases, communication, notifications, and related system data.

The database design SHALL support the MVP without creating unnecessary complexity.

---

# 2. Database Principles

Renite database development SHALL follow these rules:

1. Data SHALL have a clearly defined owner.
2. Sensitive data SHALL be protected.
3. Relationships SHALL be explicit.
4. Duplicate data SHALL be minimized.
5. Database access SHALL occur through the backend.
6. Application modules SHALL not directly expose database access.
7. Important actions SHALL be auditable.
8. Schema changes SHALL be version-controlled.
9. Deleted records SHALL follow an intentional retention strategy.
10. The database SHALL be designed for future expansion without implementing unused features prematurely.

---

# 3. Database Architecture

```text
                    Renite Backend
                          │
                          ▼
                 Repository / Data Layer
                          │
                          ▼
                    Database
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
        Users           Reports         Recovery
          │               │               │
          └───────────────┼───────────────┘
                          │
                 Other Application Data

The frontend SHALL never connect directly to the production database.

4. Recommended Database

The MVP SHOULD use a relational database such as:

PostgreSQL

The exact database provider MAY change.

The application SHALL avoid depending unnecessarily on provider-specific features.

5. Core Entities

The MVP database SHALL contain the following major entities:

users
profiles
materials
categories
reports
report_images
matches
verifications
recovery_cases
recovery_participants
conversations
messages
notifications
rewards
audit_logs
6. Users

The users table represents authenticated accounts.

Example fields:

users
├── id
├── email
├── phone
├── password_hash
├── role
├── status
├── email_verified
├── phone_verified
├── created_at
└── updated_at

Rules:

Passwords SHALL never be stored in plaintext.
User IDs SHALL be unique.
Authentication data SHALL be separated from optional profile data.
Sensitive fields SHALL have controlled access.
7. User Roles

The MVP MAY support:

USER
ADMIN
MODERATOR

Future roles MAY include:

LAW_ENFORCEMENT
ORGANIZATION_ADMIN
SUPPORT_AGENT

Roles SHALL be enforced by backend authorization.

8. Profiles

The profiles table contains user-facing information.

Example:

profiles
├── id
├── user_id
├── first_name
├── last_name
├── display_name
├── profile_image
├── language
├── location
├── bio
├── created_at
└── updated_at

The profile SHALL NOT unnecessarily contain authentication secrets.

9. Categories

Categories classify materials and reports.

Example:

categories
├── id
├── name
├── description
├── icon
├── status
├── created_at
└── updated_at

Examples:

Electronics
Documents
Bags
Clothing
Keys
Accessories
Other

Categories SHOULD be database-driven rather than hardcoded throughout the frontend.

10. Materials

Materials represent the type of object being reported.

Example:

materials
├── id
├── category_id
├── name
├── description
├── status
├── created_at
└── updated_at

Examples:

Laptop
Phone
Tablet
Backpack
Wallet
ID Card
11. Reports

Reports are the central entity of the lost-and-found system.

Example:

reports
├── id
├── user_id
├── material_id
├── type
├── title
├── description
├── status
├── location
├── incident_date
├── token
├── created_at
└── updated_at

type MAY contain:

LOST
FOUND

status MAY contain:

ACTIVE
MATCHED
IN_VERIFICATION
RECOVERED
CLOSED
CANCELLED
12. Report Ownership

Every report SHALL have an owning user.

Relationship:

User
  │
  └── has many Reports

A user SHALL only modify their own reports unless an authorized administrator performs the action.

13. Report Token

Each report MAY have a public-safe identifier/token.

Example:

RNT-7F3K2A

The token SHALL NOT expose:

Database ID
Password
Private information
User credentials

Tokens MAY be used for:

Reference
Sharing
Support
Recovery identification
14. Report Images

Images SHALL be represented separately.

report_images
├── id
├── report_id
├── storage_key
├── file_name
├── mime_type
├── size
├── created_at
└── uploaded_by

The database SHOULD store the file reference rather than the complete image binary.

15. Location Data

Location MAY be represented using:

latitude
longitude
address
place_name

For sensitive reports, exact coordinates SHALL have restricted visibility.

Example:

Public:
Addis Ababa

Authorized user:
Exact location

Location data SHALL NOT automatically become public.

16. Matches

The matches table represents potential relationships between reports.

Example:

matches
├── id
├── lost_report_id
├── found_report_id
├── score
├── source
├── status
├── created_at
└── updated_at

source MAY include:

RULE_BASED
AI_ASSISTED
MANUAL

status MAY include:

PENDING
ACCEPTED
REJECTED
EXPIRED
17. Match Rule

A match SHALL represent a potential match, not automatic ownership.

Lost Report
     +
Found Report
     ↓
Potential Match
     ↓
Verification

AI confidence scores SHALL not automatically grant ownership rights.

18. Verifications

The verifications table records verification activity.

Example:

verifications
├── id
├── match_id
├── initiated_by
├── method
├── status
├── evidence_reference
├── notes
├── verified_at
└── created_at

Possible methods:

MANUAL
IMAGE
SERIAL_NUMBER
OWNERSHIP_PROOF
ADMIN_REVIEW
19. Recovery Cases

A recovery case represents an active recovery process after a potential match has progressed.

Example:

recovery_cases
├── id
├── match_id
├── status
├── opened_at
├── completed_at
└── updated_at

Possible statuses:

OPEN
IN_PROGRESS
HANDOFF_PENDING
COMPLETED
CANCELLED
DISPUTED
20. Recovery Participants

Participants SHALL be stored separately from the recovery case.

recovery_participants
├── id
├── recovery_case_id
├── user_id
├── role
└── joined_at

Possible roles:

OWNER
FINDER
MODERATOR
ADMIN
21. Conversations

Conversations SHALL normally be associated with a recovery case.

conversations
├── id
├── recovery_case_id
├── status
├── created_at
└── updated_at

A conversation SHALL NOT automatically expose the personal contact information of participants.

22. Messages

Messages SHALL belong to a conversation.

messages
├── id
├── conversation_id
├── sender_id
├── content
├── message_type
├── created_at
├── edited_at
└── deleted_at

The backend SHALL verify that the sender is authorized to participate in the conversation.

23. Notifications

Notifications SHALL be stored for in-app delivery.

notifications
├── id
├── user_id
├── type
├── title
├── message
├── data
├── read_at
├── created_at
└── expires_at

External email/SMS delivery status MAY be stored separately in the future.

24. Rewards

Rewards SHALL be isolated from the core recovery data.

Example:

rewards
├── id
├── user_id
├── recovery_case_id
├── points
├── type
├── status
└── created_at

Possible reward types:

FINDER_REWARD
REFERRAL
BONUS
ADJUSTMENT

Cash withdrawal SHALL NOT be part of the MVP unless separately approved.

25. Audit Logs

Security-sensitive operations SHOULD generate audit records.

audit_logs
├── id
├── user_id
├── action
├── entity_type
├── entity_id
├── metadata
├── ip_address
├── user_agent
└── created_at

Examples:

LOGIN
REPORT_CREATED
REPORT_UPDATED
REPORT_DELETED
MATCH_ACCEPTED
VERIFICATION_COMPLETED
RECOVERY_COMPLETED
ADMIN_ACTION

Sensitive values SHALL not be unnecessarily stored in logs.

26. Main Relationships
User
 │
 ├── Profile
 │
 ├── Reports
 │      │
 │      ├── Material
 │      ├── Category
 │      └── Images
 │
 ├── Notifications
 │
 ├── Rewards
 │
 └── Audit Logs


Lost Report
      │
      └── Match
             │
             ├── Found Report
             │
             └── Verification
                    │
                    ▼
              Recovery Case
                    │
              ┌─────┴─────┐
              ▼           ▼
        Participants   Conversation
                           │
                           ▼
                        Messages
27. Referential Integrity

Database relationships SHALL use appropriate foreign keys.

Example:

reports.user_id
       ↓
users.id

Deleting a parent record SHALL use an intentional strategy.

Possible strategies:

CASCADE
RESTRICT
SET NULL
SOFT DELETE

The choice SHALL depend on the entity.

28. Soft Deletion

Entities containing valuable historical or audit information SHOULD use soft deletion when appropriate.

Example:

deleted_at

A deleted report SHOULD NOT automatically disappear from recovery history or audit records.

29. Timestamps

Important entities SHALL include:

created_at
updated_at

Entities requiring lifecycle tracking MAY include:

deleted_at
completed_at
verified_at

Timestamps SHALL use a consistent timezone strategy, preferably UTC at the backend/database layer.

30. Indexing

Indexes SHALL be created for frequently queried fields.

Potential indexes:

users.email
users.phone
reports.user_id
reports.status
reports.type
reports.material_id
reports.created_at
reports.location
matches.lost_report_id
matches.found_report_id
messages.conversation_id
notifications.user_id
audit_logs.user_id

Indexes SHALL be added based on actual query requirements.

The team SHALL avoid excessive indexing.

31. Search

Basic MVP search MAY use database queries.

Example filters:

Category
Material
Report Type
Status
Location
Date
Keyword

A dedicated search engine SHALL only be introduced when database search becomes insufficient.

32. Data Privacy

Sensitive information SHALL be classified.

Public / Low Sensitivity
Category
General material type
Public report token
Generalized location
Private
Email
Phone
Exact location
Private messages
Ownership evidence
Highly Sensitive
Biometric data
Identity documents
Emergency information
Law-enforcement information

Highly sensitive data SHALL require additional controls.

33. Missing Persons Data

Missing-person functionality SHOULD use dedicated entities or clearly separated fields rather than forcing all data into normal lost-item reports.

Future entities MAY include:

missing_person_cases
emergency_contacts
location_events
sos_events

These SHALL be introduced when the feature is implemented.

34. Future Hardware Data

Future device tracking MAY introduce:

devices
device_identifiers
tracking_events
device_locations

This SHALL NOT be added to the MVP database until hardware functionality is actually implemented.

35. Future Payment Data

Future payment functionality MAY introduce:

payments
transactions
payment_providers
wallets

Financial information SHALL NOT be stored unnecessarily.

Payment provider tokens/identifiers SHOULD be preferred over storing sensitive financial credentials.

36. Database Access Rules

Only the backend data-access layer SHALL communicate with the database.

Frontend
   ↓
API
   ↓
Service
   ↓
Repository
   ↓
Database

The following SHALL NOT be allowed:

Frontend → Database
Controller → Large raw SQL logic
External Service → Direct Database Access
37. Migration Rules

All schema changes SHALL be made through migrations.

Developers SHALL NOT rely on manually modifying production tables.

Every migration SHALL be:

Versioned
Reviewable
Reproducible
Tested
38. Backup

Production database backups SHALL be configured before production launch.

Backup strategy SHOULD include:

Regular automated backups
Retention policy
Recovery testing
Secure backup storage

A backup that has never been tested SHALL NOT be considered reliable.

39. Database Security

The database SHALL:

Use strong credentials
Restrict network access
Encrypt connections
Use least-privilege accounts
Avoid exposing public database ports unnecessarily

Database credentials SHALL never be committed to Git.

40. Environment Separation

The project SHALL maintain separate environments:

Development
Testing
Production

Production data SHALL NOT be casually copied into development environments.

41. MVP Database Boundary
REQUIRED
Users
Profiles
Categories
Materials
Reports
Report Images
Matches
Verifications
Recovery Cases
Recovery Participants
Conversations
Messages
Notifications
Audit Logs
OPTIONAL
Rewards
Basic location history
FUTURE
Missing Person Cases
Emergency Contacts
SOS Events
Payments
Wallets
Hardware Devices
Tracking Events
Blockchain Records
Law Enforcement Records
Advanced Biometric Data
42. Database Rules
1. The backend is the only application layer allowed to access the database.

2. Passwords SHALL never be stored in plaintext.

3. Sensitive information SHALL have restricted access.

4. Foreign keys SHALL maintain valid relationships.

5. Important operations SHALL be auditable.

6. Database migrations SHALL be version-controlled.

7. Production credentials SHALL never be committed.

8. Exact location SHALL not automatically be public.

9. AI results SHALL not be treated as ownership proof.

10. Future features SHALL not create unnecessary MVP tables.
43. Definition of Done

The database architecture is ready when:

[ ] Core entities defined
[ ] Relationships defined
[ ] Report lifecycle defined
[ ] Matching structure defined
[ ] Recovery structure defined
[ ] Chat structure defined
[ ] Notification structure defined
[ ] Security-sensitive data identified
[ ] Indexing strategy defined
[ ] Migration strategy defined
[ ] Backup requirements defined
[ ] MVP and future data separated
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
1.0.0	August 2026	Initial Renite database architecture.
Approval

Status: APPROVED

Approved By: Renite Core Team