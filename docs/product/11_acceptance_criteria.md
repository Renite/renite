# Acceptance Criteria

| Property | Value |
|---|---|
| Project | Renite |
| Document | Acceptance Criteria |
| Document ID | PROD-011 |
| Version | 1.0.0 |
| Status | Approved |
| Owner | Renite Product Team |
| Category | Product |
| Last Updated | August 2026 |

---

# 1. Purpose

This document defines the conditions that SHALL be satisfied before a Renite feature or user story can be considered complete.

Acceptance criteria SHALL provide a shared agreement between:

- Product Team
- UI/UX Team
- Frontend Team
- Backend Team
- Database Team
- Security Team
- QA Team

A feature SHALL NOT be considered complete merely because its code has been written.

---

# 2. Acceptance Criteria Format

Acceptance criteria SHALL describe observable behavior.

The preferred format is:

```text
Given [initial condition]

When [user/system action]

Then [expected result]

Example:

Given a registered user

When the user submits valid login credentials

Then Renite SHALL authenticate the user
and redirect them to the authenticated area.
3. General Acceptance Rules

Every MVP feature SHALL satisfy the following:

The intended user can access the feature.
Unauthorized users cannot access protected functionality.
Required input is validated.
Invalid input produces understandable feedback.
Successful actions produce the expected result.
Errors are handled gracefully.
Loading states are handled.
Empty states are handled where applicable.
Sensitive information is protected.
The feature works on supported screen sizes.
The feature does not break related functionality.
QA has verified the expected behavior.
4. Authentication
AC-AUTH-001 — Registration
Given

A guest is on the registration page.

When

The guest provides valid required information and submits the form.

Then
Renite SHALL validate the information.
The account SHALL be created.
The user SHALL receive appropriate confirmation.
The user SHALL be able to authenticate.
AC-AUTH-002 — Invalid Registration
Given

A guest provides invalid or incomplete information.

When

The registration form is submitted.

Then
Registration SHALL NOT complete.
The invalid fields SHALL be identified.
Clear validation messages SHALL be displayed.
AC-AUTH-003 — Duplicate Account
Given

An account already exists using a unique registration identifier.

When

A new registration attempts to use the same identifier.

Then
The duplicate account SHALL NOT be created.
The user SHALL receive an appropriate message.
AC-AUTH-004 — Login
Given

A valid registered account exists.

When

The user enters valid credentials.

Then
Authentication SHALL succeed.
The user SHALL receive an authenticated session.
The user SHALL be redirected to the appropriate authenticated area.
AC-AUTH-005 — Invalid Login
Given

A user enters invalid credentials.

When

The login form is submitted.

Then
Authentication SHALL fail.
The account SHALL remain protected.
The user SHALL receive an appropriate error message.
AC-AUTH-006 — Logout
Given

A user is authenticated.

When

The user selects logout.

Then
The session SHALL be terminated.
Protected pages SHALL no longer be accessible through the expired session.
AC-AUTH-007 — Protected Route
Given

A user is not authenticated.

When

The user attempts to access a protected resource.

Then

Renite SHALL deny access and direct the user to authentication.

5. User Profile
AC-PROFILE-001 — View Profile
Given

A user is authenticated.

When

The user opens their profile.

Then

Renite SHALL display permitted profile information.

AC-PROFILE-002 — Edit Profile
Given

A user is authenticated.

When

The user updates valid editable information.

Then
The changes SHALL be validated.
The updated information SHALL be saved.
The updated information SHALL be displayed.
AC-PROFILE-003 — Invalid Profile Data
Given

A user enters invalid profile information.

When

The user submits the changes.

Then

The invalid information SHALL NOT be saved.

6. Lost Report
AC-LOST-001 — Create Lost Report
Given

A registered user is authenticated.

When

The user submits a valid lost-item report.

Then
Renite SHALL create the report.
The report SHALL receive a unique reference token.
The report SHALL receive an appropriate status.
The user SHALL be able to view the report.
AC-LOST-002 — Required Information
Given

A user is creating a lost report.

When

Required information is missing.

Then

The report SHALL NOT be submitted until required information is provided.

AC-LOST-003 — Lost Item Image
Given

A user is creating a lost report.

When

The user uploads a supported image.

Then
The image SHALL be accepted.
The user SHALL see an appropriate preview.
The image SHALL be associated with the report.
AC-LOST-004 — Invalid Image
Given

A user attempts to upload an unsupported or invalid image.

When

The upload is processed.

Then
The image SHALL be rejected.
The report SHALL remain valid.
The user SHALL receive an understandable error.
AC-LOST-005 — Location
Given

A user creates a lost report.

When

The user provides a valid location.

Then

The location SHALL be associated with the report according to the platform's privacy rules.

7. Found Report
AC-FOUND-001 — Create Found Report
Given

A registered user is authenticated.

When

The user submits a valid found-item report.

Then
The report SHALL be created.
A unique report token SHALL be generated.
The report SHALL become available according to visibility rules.
AC-FOUND-002 — Found Item Information
Given

A finder creates a report.

When

The finder provides valid item information.

Then

The information SHALL be stored and associated with the found report.

AC-FOUND-003 — Finder Privacy
Given

A found report is visible to another user.

When

The report is displayed.

Then

Renite SHALL NOT expose protected private information belonging to another user.

8. Report Management
AC-REPORT-001 — View Own Reports
Given

A user has created one or more reports.

When

The user opens their reports.

Then

Renite SHALL display the reports the user is authorized to view.

AC-REPORT-002 — Edit Report
Given

A user owns an editable report.

When

The user updates permitted information.

Then

The changes SHALL be validated and saved.

AC-REPORT-003 — Close Report
Given

A user owns an active report.

When

The user closes the report.

Then
The report SHALL change to the appropriate closed state.
The report SHALL no longer behave as an active recovery case.
AC-REPORT-004 — Unauthorized Modification
Given

A user does not own a report and does not have administrative authorization.

When

The user attempts to modify the report.

Then

The operation SHALL be denied.

9. Search
AC-SEARCH-001 — Keyword Search
Given

Reports exist within the permitted search scope.

When

A user searches using a keyword.

Then

Renite SHALL return relevant permitted results.

AC-SEARCH-002 — Category Filter
Given

Multiple report categories exist.

When

A user selects a category.

Then

Only matching permitted reports SHALL be displayed.

AC-SEARCH-003 — Location Filter
Given

Reports contain searchable location information.

When

A user applies a location filter.

Then

Relevant reports SHALL be displayed.

AC-SEARCH-004 — Empty Results
Given

No reports match the search criteria.

When

The search is performed.

Then

Renite SHALL display a clear empty-state message.

10. Matching
AC-MATCH-001 — Potential Match
Given

A lost report and a found report contain sufficiently similar information.

When

The matching process evaluates them.

Then

Renite MAY identify them as a potential match.

AC-MATCH-002 — Match Is Not Ownership
Given

The system identifies a potential match.

When

The result is displayed.

Then

Renite SHALL clearly indicate that the result is a potential match and not confirmed ownership.

AC-MATCH-003 — Match Review
Given

A potential match exists.

When

An authorized user opens the match.

Then

The user SHALL be able to review permitted information and decide whether to continue.

AC-MATCH-004 — Reject Match
Given

A potential match is incorrect.

When

An authorized participant rejects it.

Then

The match SHALL no longer be treated as an active potential match.

11. AI Matching
AC-AI-001 — AI Suggestion
Given

An image is available for AI processing.

When

The AI matching service processes the image.

Then

The service MAY return similarity suggestions.

AC-AI-002 — AI Disclaimer
Given

AI produces a potential match.

When

The result is shown to a user.

Then

The interface SHALL communicate that the result is not definitive proof of ownership or identity.

AC-AI-003 — AI Failure
Given

The AI service is unavailable or fails.

When

A matching operation is attempted.

Then

The core application SHALL fail gracefully without corrupting the report.

12. Ownership Verification
AC-VERIFY-001 — Start Verification
Given

A potential match exists.

When

An authorized participant begins verification.

Then

A verification process SHALL be created.

AC-VERIFY-002 — Evidence Submission
Given

A participant is authorized to provide evidence.

When

Valid evidence is submitted.

Then

The evidence SHALL be stored according to security and privacy requirements.

AC-VERIFY-003 — Verification Decision
Given

Required evidence has been reviewed.

When

An authorized decision is recorded.

Then

The verification status SHALL be updated.

AC-VERIFY-004 — Evidence Privacy
Given

Sensitive evidence exists.

When

An unauthorized user attempts to access it.

Then

Access SHALL be denied.

13. Recovery Case
AC-RECOVERY-001 — Create Recovery Case
Given

A valid recovery workflow exists.

When

An authorized participant initiates recovery.

Then

Renite SHALL create a recovery case.

AC-RECOVERY-002 — Recovery Status
Given

A recovery case exists.

When

The participant views the case.

Then

The current recovery status SHALL be displayed.

AC-RECOVERY-003 — Confirm Return
Given

The item has been returned.

When

The authorized owner confirms receipt.

Then

The recovery case SHALL transition to the appropriate completed state.

AC-RECOVERY-004 — Case Closure
Given

All required recovery actions are complete.

When

The case is closed.

Then

The system SHALL record the final state.

14. Chat
AC-CHAT-001 — Authorized Chat
Given

Two users are authorized participants in a recovery workflow.

When

A chat is created.

Then

Only authorized participants SHALL access it.

AC-CHAT-002 — Send Message
Given

A user has access to a conversation.

When

The user sends a valid message.

Then

The message SHALL be stored and delivered to authorized participants.

AC-CHAT-003 — Unauthorized Chat Access
Given

A user is not a participant in a conversation.

When

The user attempts to access it.

Then

Access SHALL be denied.

15. Notifications
AC-NOTIFY-001 — Match Notification
Given

A potential match is created for a user's report.

When

The notification event is triggered.

Then

The user SHALL receive the configured notification.

AC-NOTIFY-002 — Message Notification
Given

A user receives a new recovery message.

When

The message is delivered.

Then

An appropriate notification SHALL be generated.

AC-NOTIFY-003 — Notification Read State
Given

A user has unread notifications.

When

The user opens them.

Then

The notification state SHALL be updated appropriately.

16. Dashboard
AC-DASH-001 — Dashboard Access
Given

A user is authenticated.

When

The user opens the dashboard.

Then

The dashboard SHALL load the user's permitted information.

AC-DASH-002 — Active Reports
Given

A user has active reports.

When

The dashboard loads.

Then

Relevant active reports SHALL be visible.

AC-DASH-003 — Quick Actions
Given

A user is on the dashboard.

When

The user selects a quick action.

Then

Renite SHALL navigate to the corresponding workflow.

17. History
AC-HISTORY-001 — View History
Given

A user has previous activity.

When

The user opens history.

Then

Authorized historical activity SHALL be displayed.

AC-HISTORY-002 — Historical Privacy
Given

Historical records contain private information.

When

A user views history.

Then

Only information the user is authorized to access SHALL be displayed.

18. Administration
AC-ADMIN-001 — Admin Authentication
Given

An administrator has valid administrative credentials.

When

The administrator authenticates.

Then

Administrative access SHALL be granted according to assigned permissions.

AC-ADMIN-002 — Unauthorized Admin Access
Given

A normal user is authenticated.

When

The user attempts to access administrative resources.

Then

Access SHALL be denied.

AC-ADMIN-003 — User Management
Given

An administrator has permission to manage users.

When

The administrator performs an allowed user-management action.

Then

The action SHALL be executed and recorded appropriately.

AC-ADMIN-004 — Report Moderation
Given

A report requires administrative review.

When

An authorized administrator reviews it.

Then

The administrator SHALL be able to take permitted moderation actions.

19. Moderation
AC-MOD-001 — Report Abuse
Given

A user sees potentially abusive content.

When

The user submits a report.

Then

A moderation record SHALL be created.

AC-MOD-002 — Review Flag
Given

A moderation record exists.

When

An authorized moderator opens it.

Then

The relevant content and available moderation information SHALL be displayed.

AC-MOD-003 — Moderation Action
Given

A moderator has reviewed a violation.

When

The moderator takes an authorized action.

Then

The action SHALL be recorded.

20. Localization
AC-I18N-001 — Language Selection
Given

A user is using Renite.

When

The user selects another supported language.

Then

The interface SHALL switch to that language where translations are available.

AC-I18N-002 — Language Persistence
Given

A user selects a language.

When

The user returns to Renite.

Then

The selected language SHALL be preserved according to the application's preference system.

AC-I18N-003 — Missing Translation
Given

A translation is unavailable.

When

The interface attempts to display the content.

Then

A defined fallback language SHALL be used rather than displaying broken UI.

21. Report Token
AC-TOKEN-001 — Generate Token
Given

A report is successfully created.

When

The report is stored.

Then

Renite SHALL generate a unique public-safe token.

AC-TOKEN-002 — Token Uniqueness
Given

Multiple reports exist.

When

Tokens are generated.

Then

No two active reports SHALL unintentionally share the same token.

AC-TOKEN-003 — Internal ID Protection
Given

A user sees a report token.

When

The token is displayed.

Then

The token SHALL NOT expose sensitive internal database identifiers.

22. Privacy
AC-PRIVACY-001 — Private Information
Given

A report contains private information.

When

Another user views the report.

Then

Private information SHALL remain hidden unless disclosure is explicitly authorized.

AC-PRIVACY-002 — Location Privacy
Given

A report contains sensitive location information.

When

The report is displayed publicly.

Then

Renite SHALL apply the configured location privacy rules.

AC-PRIVACY-003 — Account Data
Given

A user is authenticated.

When

The user requests account information.

Then

Only information belonging to or authorized for that user SHALL be returned.

23. Security
AC-SEC-001 — Authorization

Every protected operation SHALL verify that the requesting user has permission.

AC-SEC-002 — Input Validation

User-controlled input SHALL be validated before being processed or stored.

AC-SEC-003 — Sensitive Data

Sensitive information SHALL be protected during storage and transmission.

AC-SEC-004 — Session Security

Authentication sessions SHALL be managed securely.

AC-SEC-005 — Auditability

Important security-sensitive actions SHALL be auditable where required.

24. Responsive UI
AC-UI-001 — Desktop

The application SHALL function correctly on supported desktop screen sizes.

AC-UI-002 — Tablet

The application SHALL remain usable on supported tablet-sized screens.

AC-UI-003 — Mobile

Core workflows SHALL remain usable on mobile-sized screens.

AC-UI-004 — Loading State

Long-running operations SHALL provide an appropriate loading state.

AC-UI-005 — Error State

Failures SHALL provide understandable user feedback.

AC-UI-006 — Empty State

Pages with no available records SHALL provide meaningful empty states.

25. Accessibility
AC-A11Y-001 — Keyboard Navigation

Core web workflows SHOULD be usable with keyboard navigation.

AC-A11Y-002 — Form Labels

Input fields SHALL have understandable labels.

AC-A11Y-003 — Contrast

Text and interactive elements SHALL maintain appropriate visual contrast.

AC-A11Y-004 — Error Communication

Validation and error states SHALL be communicated clearly.

26. Performance
AC-PERF-001 — Page Loading

Core pages SHALL load within an acceptable timeframe under normal development conditions.

AC-PERF-002 — Search

Search SHALL provide appropriate feedback while results are being retrieved.

AC-PERF-003 — Image Processing

Large image operations SHALL not freeze the entire interface.

27. Future Missing-Person Acceptance Criteria

These criteria SHALL NOT be used as MVP blocking requirements.

AC-MISSING-001 — Authorized Reporting

Only authorized workflows SHALL permit creation of missing-person cases.

AC-MISSING-002 — Identity Information

Sensitive identity information SHALL be protected.

AC-MISSING-003 — Potential Match

AI or system-generated matches SHALL be clearly identified as potential matches.

AC-MISSING-004 — Official Escalation

Authority notifications SHALL only occur through approved and authorized workflows.

28. Future SOS Acceptance Criteria
AC-SOS-001 — Manual SOS

A configured user SHALL be able to trigger an SOS through the supported interface.

AC-SOS-002 — Emergency Contact

An SOS event SHALL notify configured authorized emergency contacts according to the defined policy.

AC-SOS-003 — Location

Where permitted, the emergency event SHALL include the user's current or last known location.

AC-SOS-004 — False Alarm

The system SHOULD provide an appropriate cancellation mechanism where safe and appropriate.

29. Future Payment Acceptance Criteria
AC-PAY-001 — Payment Creation

A valid payment request SHALL create a transaction with an identifiable status.

AC-PAY-002 — Payment Failure

Failed payments SHALL NOT incorrectly mark a service as paid.

AC-PAY-003 — Transaction History

Users SHALL be able to view authorized transaction information.

30. Future Hardware Acceptance Criteria
AC-HARDWARE-001 — Device Registration

An authorized owner SHALL be able to associate a supported tracker with an eligible asset.

AC-HARDWARE-002 — Authorization

Only authorized users SHALL access tracker information.

AC-HARDWARE-003 — Location Integrity

Hardware location information SHALL clearly indicate its source and timestamp.

31. Definition of Accepted

A feature SHALL be marked:

ACCEPTED

only when:

All required acceptance criteria
        ↓
Implementation complete
        ↓
QA verified
        ↓
Security checked where applicable
        ↓
Product owner approved
32. Rejection Conditions

A feature SHALL be rejected if:

A critical acceptance criterion fails.
Unauthorized access is possible.
Important user data is exposed.
Core workflow is broken.
Validation is missing where required.
Critical errors are unhandled.
The feature cannot be tested reliably.
The implementation contradicts an approved requirement.
33. MVP Acceptance Gate

Before the Renite MVP is declared complete, the team SHALL verify:

[ ] Authentication works
[ ] Registration works
[ ] Login works
[ ] Logout works
[ ] Profiles work
[ ] Lost reports work
[ ] Found reports work
[ ] Images work
[ ] Categories work
[ ] Location works
[ ] Search works
[ ] Basic matching works
[ ] Verification workflow works
[ ] Recovery workflow works
[ ] Chat works
[ ] Notifications work
[ ] Dashboard works
[ ] History works
[ ] Admin access works
[ ] Moderation works
[ ] Privacy controls work
[ ] Terms are accessible
[ ] Responsive UI works
[ ] Error states work
[ ] Loading states work
[ ] Empty states work
[ ] Security checks pass
[ ] Critical bugs are resolved
34. Final Product Acceptance

The Renite MVP SHALL be considered ready for demonstration/release when:

All P0/MVP user stories have been implemented.
Required acceptance criteria have passed.
Critical security issues have been resolved.
Critical data-loss issues have been resolved.
Core user journeys work from beginning to end.
The UI/UX implementation follows the approved design system.
The application can recover gracefully from expected failures.
The team has completed final QA.
Product ownership has approved the release.
35. Related Documents
01_problem_statement.md
02_product_goals.md
03_product_scope.md
04_mvp_definition.md
05_user_personas.md
06_user_roles.md
07_functional_requirements.md
08_non_functional_requirements.md
09_feature_specifications.md
10_user_stories.md
12_requirements_traceability.md
36. Change History
Version	Date	Description
1.0.0	August 2026	Initial Acceptance Criteria document.
Approval

Status: APPROVED

Approved By: Renite Core Team

End of Document