# Product Analytics Events

| Property | Value |
|---|---|
| Project | Renite |
| Document | Product Analytics Events |
| Document ID | PROD-015 |
| Version | 1.0.0 |
| Status | Approved |
| Owner | Renite Product Team |
| Category | Product |
| Last Updated | August 2026 |

---

# 1. Purpose

This document defines the analytics events that Renite MAY collect to understand product usage, identify failures, measure recovery performance, and improve the user experience.

Analytics SHALL support product decisions.

Analytics SHALL NOT become a reason to collect unnecessary personal or sensitive information.

---

# 2. Analytics Principles

Renite SHALL follow these principles:

```text
Necessary
Privacy-conscious
Minimal
Consistent
Auditable
Useful
Secure

The team SHALL NOT collect information simply because it is technically possible to collect it.

3. Analytics Architecture

The conceptual flow SHALL be:

User Action
    ↓
Application Event
    ↓
Analytics Service
    ↓
Event Storage
    ↓
Aggregation
    ↓
Product Dashboard
    ↓
Product Decision
4. Event Naming Convention

All product events SHALL use:

<domain>_<action>

Examples:

auth_registered
auth_logged_in
report_created
search_performed
match_detected
recovery_completed

Event names SHALL:

use lowercase
use underscores
describe an action
remain stable after implementation
5. Event Domains

Renite events SHALL use the following domains:

auth
profile
report
search
location
match
verification
recovery
chat
notification
admin
moderation
settings
i18n
payment
loyalty
referral
missing
sos
hardware

Future domains SHALL NOT be implemented until their corresponding product features exist.

6. Common Event Properties

Where appropriate, events MAY contain:

event_id
event_name
timestamp
session_id
platform
application_version
language

The following SHALL NOT be included automatically:

passwords
authentication tokens
private chat content
raw biometric data
unnecessary exact GPS coordinates
payment credentials
government identification numbers
7. Authentication Events
auth_registration_started

Triggered when a user begins registration.

Properties:

platform
language
registration_method
auth_registered

Triggered after successful registration.

Properties:

user_role
platform
language
auth_registration_failed

Triggered when registration fails.

Properties:

failure_reason_category
platform

The actual password or sensitive form values SHALL NOT be recorded.

auth_logged_in

Triggered after successful login.

Properties:

login_method
platform
auth_login_failed

Triggered after unsuccessful login.

Properties:

failure_reason_category
platform
auth_logged_out

Triggered after logout.

Properties:

platform
auth_password_reset_started

Triggered when password reset begins.

Properties:

platform
auth_password_reset_completed

Triggered when password reset completes.

Properties:

platform
8. Profile Events
profile_viewed

Triggered when a user opens their profile.

Properties:

platform
profile_updated

Triggered after permitted profile information is updated.

Properties:

fields_changed_count
platform

The actual sensitive values SHALL NOT be recorded.

9. Report Events
report_creation_started

Triggered when a user begins creating a report.

Properties:

report_type
platform
report_created

Triggered after a report is successfully created.

Properties:

report_type
category
material_type
has_image
has_location
platform
report_creation_failed

Triggered when report creation fails.

Properties:

report_type
failure_reason_category
platform
report_viewed

Triggered when a report is viewed.

Properties:

report_type
viewer_role
platform
report_updated

Triggered when a report is updated.

Properties:

report_type
fields_changed_count
platform
report_closed

Triggered when a report is closed.

Properties:

report_type
closure_reason
platform
10. Report Lifecycle Events

Renite SHALL monitor the main report lifecycle:

created
    ↓
active
    ↓
potential_match
    ↓
verification
    ↓
recovery
    ↓
returned
    ↓
closed

Important lifecycle events:

report_activated
report_matched
report_verification_started
report_recovery_started
report_returned
report_closed
11. Search Events
search_started

Triggered when the user begins a search.

Properties:

search_type
platform
search_performed

Triggered after a search request is executed.

Properties:

search_type
filter_count
result_count
platform
search_no_results

Triggered when a search returns no results.

Properties:

search_type
filter_count
platform
search_result_opened

Triggered when the user opens a search result.

Properties:

result_type
result_position
platform
12. Location Events
location_permission_requested

Triggered when location permission is requested.

location_permission_granted

Triggered when permission is granted.

location_permission_denied

Triggered when permission is denied.

location_selected

Triggered when a user selects a location for a report.

Properties:

location_method
platform

Renite SHALL prefer generalized geographic information for analytics.

13. Matching Events
match_search_started

Triggered when the matching process begins.

Properties:

matching_method
match_candidate_created

Triggered when a potential match is generated.

Properties:

matching_method
match_viewed

Triggered when a potential match is opened.

Properties:

viewer_role
match_accepted

Triggered when a user accepts a potential match for further verification.

match_rejected

Triggered when a potential match is rejected.

Properties:

rejection_category
14. AI Matching Events
ai_matching_started

Triggered when AI-assisted matching begins.

Properties:

model_version
ai_matching_completed

Triggered when AI matching completes.

Properties:

model_version
candidate_count
processing_time_ms
ai_matching_failed

Triggered when AI matching fails.

Properties:

model_version
failure_category
15. AI Safety Rules

Analytics SHALL NOT store:

raw face embeddings
raw biometric vectors
unnecessary facial images
private biometric information

AI analytics SHALL preferably use aggregate or anonymized information.

16. Verification Events
verification_started

Triggered when verification begins.

Properties:

verification_type
verification_submitted

Triggered when verification evidence is submitted.

Properties:

verification_type
verification_completed

Triggered after successful verification.

Properties:

verification_type
verification_failed

Triggered after failed verification.

Properties:

verification_type
failure_category
17. Recovery Events
recovery_started

Triggered when a recovery case begins.

Properties:

recovery_method
recovery_contact_started

Triggered when authorized parties begin recovery communication.

recovery_arrangement_created

Triggered when recovery arrangements are recorded.

Properties:

arrangement_type
recovery_return_confirmed

Triggered when the owner confirms receipt.

recovery_completed

Triggered when the recovery case is successfully closed.

Properties:

recovery_method
duration_seconds
recovery_cancelled

Triggered when a recovery case is cancelled.

Properties:

cancellation_category
18. Recovery Funnel Events

The minimum recovery funnel SHALL be:

report_created
      ↓
search_performed
      ↓
match_candidate_created
      ↓
verification_started
      ↓
verification_completed
      ↓
recovery_started
      ↓
recovery_return_confirmed
      ↓
recovery_completed

The Product Team SHALL use this funnel to identify where users are losing progress.

19. Chat Events
chat_started

Triggered when an authorized recovery chat is created.

Properties:

context_type
message_sent

Triggered when a message is successfully submitted.

Properties:

message_type

The message body SHALL NOT be stored in analytics.

message_delivered

Triggered when message delivery succeeds.

message_failed

Triggered when message delivery fails.

Properties:

failure_category
20. Notification Events
notification_created

Triggered when a notification is generated.

Properties:

notification_type
notification_sent

Triggered when a notification is sent.

Properties:

notification_type
delivery_channel
notification_delivered

Triggered when delivery is confirmed.

Properties:

notification_type
delivery_channel
notification_opened

Triggered when the user opens the notification.

Properties:

notification_type
21. Settings Events
settings_opened

Triggered when the settings page is opened.

preference_updated

Triggered when a user updates a preference.

Properties:

preference_category

The actual sensitive preference value SHALL NOT be unnecessarily collected.

22. Language Events
language_selector_opened

Triggered when the language selector is opened.

language_changed

Triggered after a language change.

Properties:

previous_language
new_language
23. Admin Events

Administrative actions SHALL be logged carefully.

Possible events:

admin_user_viewed
admin_user_updated
admin_report_viewed
admin_report_updated
admin_report_restricted
admin_case_reviewed

Administrative analytics SHALL NOT expose unnecessary personal information.

24. Moderation Events
moderation_report_created
moderation_case_opened
moderation_case_resolved
moderation_action_taken

Properties MAY include:

moderation_category
action_type
25. Future Payment Events

These events SHALL remain disabled until payment functionality is implemented.

payment_started
payment_completed
payment_failed
payment_refund_started
payment_refunded

Analytics SHALL NEVER contain:

card number
CVV
bank password
authentication PIN
full payment credentials
26. Future Loyalty Events
loyalty_points_earned
loyalty_points_redeemed
reward_claimed

Properties:

reward_type
point_category
27. Future Referral Events
referral_code_created
referral_code_used
referral_completed
referral_reward_issued
28. Future Missing Person Events

These SHALL only be implemented after the missing-person module is approved.

missing_report_created
missing_report_updated
sighting_reported
sighting_reviewed
missing_case_resolved

Because missing-person information is sensitive, event collection SHALL be strictly controlled.

29. Future SOS Events
sos_started
sos_cancelled
sos_sent
sos_delivered
sos_acknowledged

The system SHALL distinguish:

event_created
event_sent
event_delivered
event_acknowledged

Renite SHALL NOT assume that sending an alert means that an authority received or acted upon it.

30. Future Hardware Events

Potential events:

hardware_registered
hardware_activated
hardware_signal_received
hardware_location_updated
hardware_disconnected
hardware_reconnected

Hardware telemetry SHALL follow approved privacy and legal requirements.

31. Session Events
session_started

Triggered when a user starts an application session.

session_ended

Triggered when a session ends where technically meaningful.

Properties:

session_duration_seconds
32. Error Events

Renite MAY collect structured application errors.

application_error
api_error
network_error
upload_error
authentication_error
permission_error

Properties:

error_category
screen
operation
platform
application_version

Raw secrets, tokens, or personal content SHALL NOT be included.

33. Performance Events

The platform SHOULD collect technical timing information.

Examples:

page_load_completed
api_request_completed
image_upload_completed
search_completed
ai_matching_completed

Properties:

duration_ms
operation
34. Event Severity

Events SHALL be classified where appropriate:

INFO
WARNING
ERROR
CRITICAL

Example:

application_error → ERROR
security_violation → CRITICAL
search_performed → INFO
notification_failed → WARNING
35. Event ID

Every stored analytics event SHOULD have a unique event identifier.

Example:

event_id:
evt_01JXXXXXXXXXXXX

The exact ID-generation mechanism SHALL be defined by the engineering architecture.

36. Timestamp Rules

Events SHALL use a consistent timestamp format.

Preferred:

UTC
ISO 8601

Example:

2026-08-09T20:33:00Z

Client-local display time MAY be generated separately.

37. Platform Property

Supported values SHOULD include:

web
android
ios

Future platforms MAY be added.

38. Application Version

Events SHOULD include the application version where practical.

Example:

application_version:
1.0.0

This helps identify regressions between releases.

39. Language Property

Events MAY contain:

language

Example:

en
am
om
ti
so
sw
ar
40. Analytics Privacy Rules

Renite SHALL NOT use analytics to circumvent application privacy controls.

For example:

Private report
    ↓
Private report data
    ↓
Private analytics data

A report being private SHALL NOT become public simply because it enters an analytics pipeline.

41. Sensitive Data Rules

The following SHALL NOT be sent to general product analytics:

Passwords
Authentication tokens
Private messages
Full phone numbers
Private email addresses
Government IDs
Raw biometric templates
Bank credentials
Payment credentials
Private exact GPS history
Emergency contact details
42. Data Minimization

Each analytics event SHALL answer:

Why are we collecting this?

If the team cannot provide a clear product, security, or operational reason, the event SHOULD NOT be collected.

43. Analytics Access Control

Analytics access SHALL be role-based.

Potential roles:

Product Analyst
Product Manager
Technical Lead
Admin
Security Reviewer

Sensitive operational analytics SHALL have stricter access.

44. Analytics Retention

Analytics retention SHALL be defined according to:

Purpose
Sensitivity
Legal requirements
Storage requirements
Operational needs

Data SHALL NOT be retained indefinitely without a justified reason.

45. Analytics Quality Rules

Events SHALL be reviewed for:

Correct naming
Correct triggering
Correct properties
Duplicate events
Missing events
Incorrect values
Privacy violations
46. Duplicate Event Prevention

The application SHOULD avoid firing the same event multiple times unintentionally.

Example:

User clicks "Create Report"
       ↓
One successful request
       ↓
One report_created event

Retries SHALL be designed carefully so analytics does not incorrectly count multiple reports.

47. Event Validation

Before an event is accepted into analytics, the system SHOULD validate:

event_name
timestamp
required properties
property types
allowed values

Invalid events SHOULD be rejected or safely handled.

48. Example Event

Conceptual structure:

{
  "event_id": "evt_example",
  "event_name": "report_created",
  "timestamp": "2026-08-09T20:33:00Z",
  "platform": "web",
  "language": "en",
  "properties": {
    "report_type": "lost",
    "category": "electronics",
    "material_type": "laptop",
    "has_image": true,
    "has_location": true
  }
}

This example is illustrative.

The final event schema SHALL be defined by the engineering team.

49. Core MVP Event List

The following events SHALL be prioritized for the MVP:

auth_registered
auth_logged_in
auth_logged_out

profile_updated

report_creation_started
report_created
report_updated
report_closed

search_performed
search_no_results
search_result_opened

match_candidate_created
match_viewed
match_accepted
match_rejected

verification_started
verification_completed
verification_failed

recovery_started
recovery_return_confirmed
recovery_completed
recovery_cancelled

chat_started
message_sent
message_delivered
message_failed

notification_created
notification_sent
notification_delivered
notification_opened

language_changed

application_error
api_error
50. MVP Analytics Dashboard

The MVP dashboard SHOULD display:

Users
├── Registered Users
├── Active Users
└── Activation Rate

Reports
├── Lost Reports
├── Found Reports
├── Active Reports
└── Closed Reports

Matching
├── Potential Matches
├── Verified Matches
└── Rejected Matches

Recovery
├── Recovery Cases
├── Successful Recoveries
├── Recovery Success Rate
└── Average Recovery Time

Technical
├── API Errors
├── Application Errors
└── Notification Failures
51. Product Decision Rules

Analytics SHALL be used to answer questions such as:

Where are users abandoning the recovery process?

Are search results useful?

Are potential matches accurate enough?

Are users completing verification?

How long does recovery take?

Are notifications reaching users?

Which workflows generate errors?

Which features are actually being used?
52. Analytics Anti-Patterns

Renite SHALL avoid:

Tracking everything
Collecting raw personal information
Collecting data without a purpose
Creating metrics that nobody uses
Optimizing vanity metrics
Ignoring privacy
Counting technical events as user success
53. Definition of Analytics Ready

A feature is analytics-ready when:

Event definitions exist
        +
Event triggers are documented
        +
Properties are defined
        +
Privacy rules are defined
        +
Events are tested
        +
Dashboard usage is defined
54. Product Analytics Review Checklist
[ ] Event name defined
[ ] Trigger defined
[ ] Required properties defined
[ ] Optional properties defined
[ ] Sensitive data reviewed
[ ] Privacy implications reviewed
[ ] Event tested
[ ] Duplicate firing tested
[ ] Dashboard requirement defined
[ ] Owner assigned
55. Final Analytics Rule

Analytics SHALL help Renite answer:

"Is Renite actually helping people recover what they lost?"

If an analytics implementation does not help answer this question or support security, reliability, or product decisions, it SHALL be treated as lower priority.

56. Related Documents
docs/
│
├── planning/
│
├── product/
│   ├── 01_product_overview.md
│   ├── 02_product_goals.md
│   ├── 03_product_scope.md
│   ├── 04_mvp_definition.md
│   ├── 05_user_personas.md
│   ├── 06_user_roles.md
│   ├── 07_functional_requirements.md
│   ├── 08_non_functional_requirements.md
│   ├── 09_feature_specifications.md
│   ├── 10_user_stories.md
│   ├── 11_acceptance_criteria.md
│   ├── 12_requirements_traceability.md
│   ├── 13_product_readiness_checklist.md
│   ├── 14_product_metrics.md
│   └── 15_product_analytics_events.md
│
├── architecture/
├── design/
├── engineering/
├── security/
└── testing/
57. Change History
Version	Date	Description
1.0.0	August 2026	Initial Product Analytics Events document.
Approval

Status: APPROVED

Approved By: Renite Core Team

End of Document