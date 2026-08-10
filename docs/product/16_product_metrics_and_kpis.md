# Product Metrics & KPIs

| Property | Value |
|---|---|
| Project | Renite |
| Document | Product Metrics & KPIs |
| Document ID | PROD-014 |
| Version | 1.0.0 |
| Status | Approved |
| Owner | Renite Product Team |
| Category | Product |
| Last Updated | August 2026 |

---

# 1. Purpose

This document defines how Renite measures whether the product is actually solving its intended problem.

Renite SHALL NOT measure success only by:

- Number of features
- Number of pages
- Lines of code
- Number of users
- Number of AI models
- Number of technologies used

Renite SHALL primarily measure whether users can successfully and safely recover lost assets.

---

# 2. Product Success Definition

Renite is successful when:

```text
A legitimate user
      ↓
Can report a lost asset
      ↓
A potential matching asset can be discovered
      ↓
The relevant parties can verify ownership
      ↓
They can communicate safely
      ↓
The asset is successfully returned
      ↓
The recovery case is closed

The primary product outcome is therefore:

Successful, safe, and trustworthy recovery.

3. KPI Categories

Renite SHALL organize product metrics into:

1. Acquisition
2. Activation
3. Reporting
4. Discovery
5. Matching
6. Verification
7. Recovery
8. Retention
9. Trust & Safety
10. Performance
11. Support
12. Business
4. North Star Metric
Successful Recovery Rate

The primary Renite product metric SHALL be:

Successful Recovery Rate
=
Successfully Closed Recovery Cases
÷
Eligible Recovery Cases
× 100

This metric measures whether Renite actually helps users recover lost assets.

5. Primary KPI
KPI-001 — Successful Recovery Rate

Definition

Percentage of eligible recovery cases that result in a confirmed successful return.

Formula

Closed Successful Cases
÷
Eligible Recovery Cases
× 100

Target

Initial target SHALL be established after sufficient MVP data is collected.

Priority: P0

6. KPI-002 — Recovery Completion Time

Definition

Time between creation of a valid lost report and confirmed recovery.

Recovery Time
=
Confirmed Recovery Timestamp
-
Lost Report Creation Timestamp

The system SHOULD track:

Average
Median
P75
P90
P95

Priority: P0

7. KPI-003 — Match Rate

Definition

Percentage of active lost reports that receive at least one potentially relevant match.

Reports With Match
÷
Eligible Lost Reports
× 100

Priority: P0

8. KPI-004 — Verified Match Rate

Definition

Percentage of potential matches that progress through successful ownership verification.

Verified Matches
÷
Potential Matches
× 100

Priority: P0

9. KPI-005 — False Match Rate

Definition

Percentage of generated potential matches that are determined to be incorrect.

Rejected Matches
÷
Total Potential Matches
× 100

A high false-match rate SHALL trigger review of the matching system.

Priority: P0

10. KPI-006 — Report Completion Rate

Definition

Percentage of users who begin creating a report and successfully submit it.

Submitted Reports
÷
Started Reports
× 100

Track separately for:

Lost Reports
Found Reports

Priority: P0

11. KPI-007 — Report Abandonment Rate
Abandoned Reports
÷
Started Reports
× 100

A high abandonment rate SHALL trigger UX investigation.

12. KPI-008 — Time to Create Report

Definition

Time required for a user to complete a report.

Measure:

Median completion time
P75
P90

This SHALL help determine whether the reporting process is unnecessarily complicated.

13. KPI-009 — Search Success Rate

Definition

Percentage of search sessions resulting in a meaningful result interaction.

Possible success events:

Open result
Save result
Create match
Start verification
14. KPI-010 — Search Zero-Result Rate
Zero Result Searches
÷
Total Searches
× 100

A high rate SHALL trigger review of:

Search indexing
Categories
Search terms
Filters
Data availability
15. KPI-011 — Verification Completion Rate
Completed Verifications
÷
Started Verifications
× 100

Track:

Successful
Rejected
Expired
Abandoned
16. KPI-012 — Recovery Case Conversion
Recovery Cases
÷
Verified Matches
× 100

This indicates how often successful verification progresses into an actual recovery process.

17. KPI-013 — Recovery Success Rate
Successfully Returned Items
÷
Recovery Cases
× 100

This is one of Renite's most important outcome metrics.

18. KPI-014 — Recovery Abandonment Rate
Abandoned Recovery Cases
÷
Started Recovery Cases
× 100

The team SHALL investigate major abandonment causes.

19. KPI-015 — Notification Engagement

Track:

Notifications Sent
Notifications Delivered
Notifications Opened
Notifications Acted Upon

Primary measurement:

Notification Action Rate
=
Notifications Leading To User Action
÷
Delivered Notifications
× 100
20. KPI-016 — Chat Engagement

Track:

Chats Started
Messages Sent
Messages Received
Chats With Response
Chats Closed

The system SHOULD measure:

Median response time
21. KPI-017 — User Activation

A user SHALL be considered activated when they complete a meaningful core action.

For Renite MVP:

Registration
     ↓
Successful Login
     ↓
First Recovery Action

A recovery action may include:

Creating a lost report
Creating a found report
Searching for an item
22. KPI-018 — Activation Rate
Activated Users
÷
Registered Users
× 100
23. KPI-019 — Returning User Rate

Measure the percentage of users who return after their initial meaningful session.

Track:

7-day
14-day
30-day

This metric SHALL be interpreted carefully because Renite is a recovery product.

Users successfully recovering an item may naturally have less reason to return frequently.

24. KPI-020 — Repeat Recovery Usage

Track users who create another legitimate recovery-related case after completing a previous case.

This SHALL NOT be interpreted as requiring users to lose multiple items.

25. Trust & Safety Metrics

Trust SHALL be treated as a core product metric.

26. KPI-021 — Abuse Report Rate
Abuse Reports
÷
Active Users

Track abuse categories separately.

27. KPI-022 — Confirmed Abuse Rate
Confirmed Abuse Cases
÷
Reported Abuse Cases
× 100
28. KPI-023 — Fraudulent Report Rate
Confirmed Fraudulent Reports
÷
Total Reports
× 100

A high rate SHALL trigger additional verification and moderation review.

29. KPI-024 — Unauthorized Access Incidents

Track:

Unauthorized access attempts
Confirmed unauthorized access
Affected accounts
Affected reports

Target:

Minimize confirmed unauthorized access.
30. KPI-025 — Privacy Incidents

Track:

Location exposure
Unauthorized personal-data exposure
Unauthorized report access
Unauthorized chat access
Credential exposure

Any confirmed serious privacy incident SHALL be treated as a release-level security concern.

31. KPI-026 — Moderation Response Time

Measure:

Report Created
        ↓
Moderation Action

Track:

Median
P75
P90
32. Performance Metrics

Renite SHALL monitor technical performance because poor performance directly affects recovery success.

33. KPI-027 — Page Load Performance

Track important pages:

Homepage
Login
Dashboard
Search
Report Creation
Report Details
Chat
Admin Dashboard

Measure:

Median
P75
P95
34. KPI-028 — API Response Time

Track important endpoints.

Example:

Authentication
Reports
Search
Matching
Notifications
Chat

Track:

Median
P95
P99
35. KPI-029 — API Error Rate
Failed API Requests
÷
Total API Requests
× 100

Critical API failures SHALL be investigated immediately.

36. KPI-030 — Application Crash Rate

Track:

Application crashes
Unexpected errors
Failed sessions
37. KPI-031 — Availability

Measure service availability over time.

Availability
=
Available Time
÷
Total Expected Time
× 100

The final target SHALL be defined before production deployment.

38. Data Quality Metrics

Renite depends on accurate reports.

Track:

Incomplete reports
Invalid reports
Duplicate reports
Incorrect locations
Invalid categories
Invalid contact information
39. KPI-032 — Report Data Completeness
Complete Required Fields
÷
Expected Required Fields
× 100
40. KPI-033 — Duplicate Report Rate
Duplicate Reports
÷
Total Reports
× 100

High duplicate rates SHOULD trigger UX or detection improvements.

41. AI Metrics

AI SHALL be measured separately from overall product success.

AI performance SHALL NOT automatically equal recovery success.

42. KPI-034 — AI Match Precision
Correct AI Matches
÷
All AI-Generated Matches
× 100
43. KPI-035 — AI Match Recall
Correct Matches Found
÷
All Relevant Matches
× 100

The denominator SHALL be defined through an approved evaluation dataset.

44. KPI-036 — AI Processing Time

Measure:

Image submitted
      ↓
AI result returned

Track:

Median
P95
P99
45. KPI-037 — AI Failure Rate
AI Processing Failures
÷
AI Requests
× 100
46. Important AI Rule

AI results SHALL be treated as assistance unless an explicitly approved and legally appropriate workflow states otherwise.

AI SHALL NOT independently:

Declare someone guilty
Declare ownership with absolute certainty
Identify a person for law-enforcement action without appropriate safeguards
Trigger dangerous action solely from an uncertain prediction
47. Localization Metrics

Renite SHALL monitor whether multilingual support is actually usable.

Track:

Language selection
Language usage
Missing translations
Translation errors
Fallback occurrences
48. KPI-038 — Language Usage

Measure the proportion of active sessions using each supported language.

English
Amharic
Afaan Oromo
Tigrinya
Somali
Swahili
Arabic
49. KPI-039 — Translation Coverage
Translated UI Strings
÷
Total UI Strings
× 100

Production releases SHOULD NOT contain significant missing translations.

50. Support Metrics

Track:

Support requests
Support response time
Support resolution time
Unresolved cases
Repeated support requests
51. KPI-040 — Support Resolution Time
Support Resolution Time
=
Resolution Timestamp
-
Support Request Timestamp

Track:

Median
P75
P90
52. Business Metrics

Business metrics SHALL be introduced only when monetization becomes part of the active release scope.

Potential metrics include:

Paid recovery requests
Revenue
Platform fees
Payment success rate
Payment failure rate
Refund rate
53. Loyalty Metrics

When loyalty functionality is activated:

Points earned
Points redeemed
Points expired
Rewards claimed
Reward conversion rate

The team SHALL monitor whether loyalty incentives encourage legitimate helpful behavior rather than abuse.

54. Referral Metrics

When referral functionality is activated:

Referral codes created
Referral codes used
Successful referrals
Fraudulent referrals
Referral conversion rate
55. Dashboard Metrics

The Admin Dashboard SHOULD provide a high-level view of:

Users
Active Reports
Lost Reports
Found Reports
Potential Matches
Verified Matches
Recovery Cases
Successful Recoveries
Open Cases
Abuse Reports
System Health
56. Core Product Dashboard

The product team SHALL prioritize:

Successful Recoveries
Recovery Success Rate
Median Recovery Time
Match Rate
Verification Rate
Report Completion Rate
False Match Rate
Abuse Rate
57. Metric Ownership
Metric Area	Responsible Team
Product KPIs	Product
UX metrics	UI/UX
API metrics	Backend
Application performance	Frontend/Backend
Database metrics	Backend
Security metrics	Security/Backend
AI metrics	AI/Backend
Moderation metrics	Admin/Operations
Business metrics	Product/Business
Support metrics	Operations
58. Metric Collection Rules

Renite SHALL:

[ ] Define the event
[ ] Define the event owner
[ ] Define the data source
[ ] Define the calculation
[ ] Define the reporting frequency
[ ] Define the acceptable range

Metrics SHALL NOT be added merely because they are easy to collect.

59. Event Naming Convention

Product analytics events SHOULD follow:

<domain>_<action>

Examples:

auth_registered
auth_logged_in

report_lost_created
report_found_created
report_viewed

search_performed
search_result_opened

match_created
match_viewed

verification_started
verification_completed

recovery_started
recovery_completed

chat_started
message_sent

notification_sent
notification_opened
60. Event Data Rules

Analytics events SHALL avoid unnecessary sensitive information.

Events SHOULD NOT contain:

Passwords
Authentication tokens
Full private addresses
Private chat content
Unnecessary exact GPS coordinates
Sensitive biometric data
Payment credentials
61. Measurement Frequency
Metric Type	Frequency
Critical security	Real-time / immediate
System health	Real-time
Core product KPIs	Daily
UX metrics	Weekly
Business metrics	Weekly/Monthly
Strategic metrics	Monthly
Product review	Weekly during MVP
62. Two-Week MVP Measurement Strategy

Because the current development period is limited, the team SHALL focus on a small number of metrics.

Mandatory MVP Metrics
1. Number of registered users
2. Number of lost reports
3. Number of found reports
4. Report completion rate
5. Number of potential matches
6. Verified match rate
7. Number of recovery cases
8. Successful recovery rate
9. Median recovery time
10. Critical errors
11. Security incidents
12. User-reported problems
63. MVP Success Criteria

The MVP SHALL demonstrate that:

[ ] A user can register
[ ] A user can authenticate
[ ] A user can report a lost item
[ ] A user can report a found item
[ ] Reports can be searched
[ ] Potential matches can be identified
[ ] Ownership can be verified
[ ] Users can communicate securely
[ ] Recovery cases can be managed
[ ] A recovery can be marked successful
[ ] The system records the outcome
64. Product Review Questions

The Product Team SHALL ask:

1. Are users successfully completing reports?

2. Are users finding relevant results?

3. Are potential matches useful?

4. Are users able to verify ownership?

5. Are recovery cases actually progressing?

6. How long does recovery take?

7. Where do users abandon the workflow?

8. What causes failed recoveries?

9. Are users experiencing privacy or security problems?

10. Which feature provides the most real value?

11. Which feature creates unnecessary complexity?

12. What should be improved before adding more features?
65. Metrics SHALL Not Become the Product

The team SHALL NOT optimize the product merely to increase numbers.

Examples:

More users ≠ better recovery

More reports ≠ better recovery

More AI matches ≠ better recovery

More notifications ≠ better communication

More chat messages ≠ better recovery

More features ≠ better product

The final measure remains:

Safe + Trusted + Successful Recovery
66. KPI Review Cycle
Collect
   ↓
Validate
   ↓
Analyze
   ↓
Identify Problem
   ↓
Create Improvement
   ↓
Implement
   ↓
Measure Again
67. KPI Change Rules

A KPI SHALL NOT be changed simply because the current result is poor.

If a KPI performs poorly, the team SHALL first investigate:

Product problem
UX problem
Technical problem
Data problem
Marketing problem
User behavior
Measurement problem
68. KPI Documentation

Every production KPI SHALL have:

Metric Name
Definition
Formula
Owner
Data Source
Collection Method
Reporting Frequency
Target
Current Value
Trend
Interpretation
69. Example KPI Record
Metric:
Successful Recovery Rate

ID:
KPI-001

Owner:
Product Team

Formula:
Successful Recoveries / Eligible Recovery Cases × 100

Frequency:
Daily

Priority:
P0

Target:
Defined after MVP baseline

Current:
TBD

Trend:
TBD

Interpretation:
TBD
70. Final Product Measurement Rule

Renite SHALL continuously answer:

Are people able to recover what they lost?

Are they able to do it safely?

Are they able to do it efficiently?

Do they trust the platform?

Where does the recovery process fail?

What should we improve next?

If the metrics cannot answer these questions, the measurement system SHALL be improved.

71. Related Documents
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
│   └── 14_product_metrics_and_kpis.md
│
├── architecture/
├── design/
├── engineering/
├── security/
└── testing/
72. Change History
Version	Date	Description
1.0.0	August 2026	Initial Product Metrics & KPIs document.
Approval

Status: APPROVED

Approved By: Renite Core Team

End of Document