# User Stories

| Property | Value |
|---|---|
| Project | Renite |
| Document | User Stories |
| Document ID | PROD-010 |
| Version | 1.0.0 |
| Status | Approved |
| Owner | Renite Product Team |
| Category | Product |
| Last Updated | August 2026 |

---

# 1. Purpose

This document defines Renite's user stories from the perspective of the people who will use, manage, and interact with the platform.

User stories SHALL be used by:

- Product Team
- UI/UX Team
- Frontend Team
- Backend Team
- QA Team
- Security Team

Each story SHALL describe a meaningful user goal rather than an implementation detail.

---

# 2. User Story Format

Renite SHALL use the following format:

> **As a [user], I want [goal], so that [benefit].**

Each story SHOULD eventually have:

```text
User Story
    ↓
Acceptance Criteria
    ↓
UI/UX Design
    ↓
Implementation
    ↓
Testing
```
# 3. User Roles

The primary roles used in this document are:

Guest
User / Owner
Finder
Recovery Participant
Administrator
Moderator
Support Staff
Future Authority User

A single person MAY perform different roles depending on the situation.

For example:

User
 ├── Reports a lost laptop
 └── Later finds another user's phone

The platform SHALL NOT require separate accounts for these roles.

4. Guest User Stories
US-GUEST-001 — Discover Renite

As a guest,

I want to understand what Renite does,

so that I can decide whether the platform is useful to me.

Acceptance Criteria
The homepage explains Renite clearly.
Core services are visible.
Lost and found functionality is understandable.
Users can access registration and login.
US-GUEST-002 — Browse Public Information

As a guest,

I want to browse permitted public information,

so that I can understand the platform before creating an account.

Acceptance Criteria
Public pages are accessible.
Private user information is not exposed.
Navigation is clear.
US-GUEST-003 — View About Information

As a guest,

I want to learn about Renite,

so that I understand its purpose and mission.

US-GUEST-004 — View Terms

As a guest,

I want to read the Terms and Conditions,

so that I understand the rules of using Renite.

US-GUEST-005 — View Privacy Information

As a guest,

I want to understand how my information will be handled,

so that I can make an informed decision before registering.

5. Registration Stories
US-AUTH-001 — Create Account

As a guest,

I want to create a Renite account,

so that I can report and manage lost or found items.

Acceptance Criteria
Registration form is available.
Required information is validated.
Duplicate account conditions are handled.
Password requirements are enforced.
Successful registration creates an account.
US-AUTH-002 — Secure Registration

As a user,

I want my registration information to be protected,

so that my account cannot easily be compromised.

US-AUTH-003 — Accept Terms

As a new user,

I want to review and accept the applicable terms,

so that I understand my responsibilities.

US-AUTH-004 — Select Language

As a new user,

I want to choose my preferred language,

so that I can use Renite comfortably.

6. Login Stories
US-AUTH-005 — Login

As a registered user,

I want to log in securely,

so that I can access my account.

US-AUTH-006 — Invalid Login

As a user,

I want to receive a clear message when my login fails,

so that I know what went wrong.

US-AUTH-007 — Logout

As an authenticated user,

I want to log out,

so that other people cannot access my account on my device.

US-AUTH-008 — Password Recovery

As a user,

I want to recover access to my account if I forget my password,

so that I do not permanently lose access.

7. Profile Stories
US-PROFILE-001 — View Profile

As a user,

I want to view my profile,

so that I can confirm my account information.

US-PROFILE-002 — Edit Profile

As a user,

I want to edit permitted profile information,

so that my account remains up to date.

US-PROFILE-003 — Profile Image

As a user,

I want to add or change my profile image,

so that my profile can be recognizable where appropriate.

US-PROFILE-004 — Security Settings

As a user,

I want to manage my security settings,

so that I can protect my account.

US-PROFILE-005 — Notification Preferences

As a user,

I want to manage notification preferences,

so that I receive relevant updates without unnecessary notifications.

8. Lost Item Stories
US-LOST-001 — Report Lost Item

As a user,

I want to report a lost item,

so that other Renite users can potentially help recover it.

US-LOST-002 — Select Item Category

As a user,

I want to select an item category,

so that my report can be organized and discovered correctly.

US-LOST-003 — Specify Item Type

As a user,

I want to specify the type of item I lost,

so that the report contains useful information.

US-LOST-004 — Describe Lost Item

As a user,

I want to describe the item,

so that potential matches can be identified.

US-LOST-005 — Upload Lost Item Image

As a user,

I want to upload an image of my lost item,

so that it can help identify potential matches.

US-LOST-006 — Add Lost Location

As a user,

I want to provide where I last had the item,

so that location can help identify potential matches.

US-LOST-007 — Add Lost Date

As a user,

I want to specify when I lost the item,

so that the timeline can help matching.

US-LOST-008 — Review Report

As a user,

I want to review my report before submitting it,

so that I can correct mistakes.

US-LOST-009 — Receive Report Token

As a user,

I want my report to receive a unique reference token,

so that I can safely identify and reference my report.

9. Found Item Stories
US-FOUND-001 — Report Found Item

As a finder,

I want to report an item I found,

so that its owner has an opportunity to recover it.

US-FOUND-002 — Describe Found Item

As a finder,

I want to describe the item I found,

so that Renite can identify possible related reports.

US-FOUND-003 — Upload Found Item Image

As a finder,

I want to upload an image of the found item,

so that it can help identify a possible match.

US-FOUND-004 — Add Found Location

As a finder,

I want to provide where I found the item,

so that the owner can understand the recovery context.

US-FOUND-005 — Protect Owner Information

As a finder,

I want the platform to avoid unnecessarily revealing the owner's private information,

so that the recovery process remains safe.

10. Report Management Stories
US-REPORT-001 — View My Reports

As a user,

I want to see my active reports,

so that I can monitor their progress.

US-REPORT-002 — Edit Report

As a report owner,

I want to update permitted information,

so that my report remains accurate.

US-REPORT-003 — Close Report

As a report owner,

I want to close my report,

so that Renite knows the case is no longer active.

US-REPORT-004 — Cancel Report

As a report owner,

I want to cancel an incorrect report,

so that other users do not waste time investigating it.

US-REPORT-005 — Track Report Status

As a user,

I want to see my report status,

so that I understand what is happening.

11. Search Stories
US-SEARCH-001 — Search Reports

As a user,

I want to search Renite reports,

so that I can find potentially relevant lost or found items.

US-SEARCH-002 — Filter by Category

As a user,

I want to filter reports by category,

so that I can narrow the results.

US-SEARCH-003 — Filter by Location

As a user,

I want to filter reports by location,

so that I can focus on relevant areas.

US-SEARCH-004 — Filter by Date

As a user,

I want to filter reports by date,

so that I can narrow potential matches.

US-SEARCH-005 — Search by Keyword

As a user,

I want to search by keywords,

so that I can quickly find relevant reports.

US-SEARCH-006 — Safe Search Results

As a user,

I want search results to respect privacy controls,

so that private information is not exposed.

12. Location Stories
US-LOCATION-001 — Select Location

As a user,

I want to select a location when creating a report,

so that location can assist recovery.

US-LOCATION-002 — View Report Location

As an authorized user,

I want to view permitted location information,

so that I can understand where the item was lost or found.

US-LOCATION-003 — Map View

As a user,

I want to view relevant reports on a map,

so that I can understand their geographic distribution.

US-LOCATION-004 — Protect Exact Location

As a user,

I want sensitive locations to remain protected,

so that publishing a report does not create additional risk.

13. Matching Stories
US-MATCH-001 — Potential Match

As a user,

I want Renite to identify potentially related reports,

so that I do not have to manually compare every report.

US-MATCH-002 — Match Notification

As a user,

I want to be notified when a potential match is found,

so that I can investigate it quickly.

US-MATCH-003 — Review Match

As a user,

I want to review why two reports may be related,

so that I can decide whether to continue the recovery process.

US-MATCH-004 — Reject Match

As a user,

I want to reject an incorrect match,

so that irrelevant matches do not continue through the recovery process.

14. AI Matching Stories
US-AI-001 — Image Similarity

As a user,

I want Renite to compare uploaded item images,

so that visually similar reports can be identified.

US-AI-002 — AI Match Assistance

As a user,

I want AI to suggest potential matches,

so that recovery can be faster.

US-AI-003 — AI Uncertainty

As a user,

I want AI results to clearly indicate that they are suggestions,

so that I do not mistake an AI result for confirmed ownership.

15. Ownership Verification Stories
US-VERIFY-001 — Start Verification

As a recovery participant,

I want to start an ownership verification process,

so that a potential match can be evaluated safely.

US-VERIFY-002 — Provide Evidence

As an owner,

I want to provide legitimate evidence of ownership,

so that the finder can verify that I am the rightful owner.

US-VERIFY-003 — Protect Evidence

As a user,

I want sensitive ownership evidence to remain private,

so that it cannot be misused.

US-VERIFY-004 — Verification Result

As a participant,

I want to know whether verification succeeded or failed,

so that I know the next step.

16. Recovery Stories
US-RECOVERY-001 — Start Recovery

As an authorized participant,

I want to start a recovery case,

so that the return process can be managed systematically.

US-RECOVERY-002 — Track Recovery Status

As a participant,

I want to track the recovery status,

so that I know whether the item is still being arranged for return.

US-RECOVERY-003 — Arrange Handoff

As a recovery participant,

I want to communicate about a safe handoff,

so that the item can be returned.

US-RECOVERY-004 — Confirm Return

As the owner,

I want to confirm that I received the item,

so that the recovery case can be completed.

US-RECOVERY-005 — Close Recovery

As an authorized participant,

I want the recovery case to close after successful return,

so that the system has an accurate final state.

17. Chat Stories
US-CHAT-001 — Start Recovery Chat

As an authorized participant,

I want to communicate with the other recovery participant,

so that we can coordinate the recovery.

US-CHAT-002 — Send Message

As a participant,

I want to send messages,

so that I can communicate without leaving Renite.

US-CHAT-003 — Message History

As a participant,

I want to view previous messages,

so that I can remember what was agreed.

US-CHAT-004 — Protect Contact Information

As a participant,

I want to communicate without automatically exposing my personal phone number or email,

so that my privacy is protected.

18. Notification Stories
US-NOTIFY-001 — New Match Notification

As a user,

I want to receive a notification when a potential match is found,

so that I can respond quickly.

US-NOTIFY-002 — Message Notification

As a user,

I want to know when I receive a new recovery message,

so that I do not miss important communication.

US-NOTIFY-003 — Recovery Update

As a user,

I want to receive important recovery updates,

so that I know the current state of my case.

US-NOTIFY-004 — Notification Preferences

As a user,

I want to control supported notification preferences,

so that I receive information relevant to me.

19. Dashboard Stories
US-DASH-001 — View Activity

As a user,

I want to see my recent Renite activity,

so that I can understand what has changed.

US-DASH-002 — Active Cases

As a user,

I want to see my active cases,

so that I can quickly access them.

US-DASH-003 — Quick Actions

As a user,

I want common actions to be easily accessible,

so that I can report lost or found items quickly.

20. History Stories
US-HISTORY-001 — View History

As a user,

I want to view my previous reports and recovery cases,

so that I can review my Renite activity.

US-HISTORY-002 — View Closed Cases

As a user,

I want to see completed recovery cases,

so that I can review successful recoveries.

21. Administration Stories
US-ADMIN-001 — Admin Login

As an administrator,

I want to securely access the administration system,

so that only authorized staff can manage Renite.

US-ADMIN-002 — Manage Users

As an administrator,

I want to manage user accounts,

so that I can maintain a safe platform.

US-ADMIN-003 — Review Reports

As an administrator,

I want to review reports,

so that I can identify abuse or problematic content.

US-ADMIN-004 — Manage Report Status

As an administrator,

I want to manage appropriate report states,

so that incorrect or abusive reports can be handled.

US-ADMIN-005 — View Audit Activity

As an administrator,

I want to review important system actions,

so that sensitive activity can be investigated.

22. Moderation Stories
US-MOD-001 — Report Abuse

As a user,

I want to report suspicious or abusive content,

so that Renite can review it.

US-MOD-002 — Review Flagged Content

As a moderator,

I want to review flagged content,

so that I can determine whether action is required.

US-MOD-003 — Suspend Account

As an authorized moderator,

I want to suspend accounts that violate platform rules,

so that abuse can be controlled.

23. Localization Stories
US-I18N-001 — Change Language

As a user,

I want to change the application language,

so that I can use Renite in my preferred language.

US-I18N-002 — Remember Language

As a user,

I want Renite to remember my language preference,

so that I do not need to select it every time.

US-I18N-003 — Localized Interface

As a user,

I want important interface content to be translated,

so that language does not prevent me from using Renite.

24. Future Missing-Person Stories

These stories SHALL NOT be treated as MVP requirements.

US-MISSING-001 — Report Missing Person

As an authorized family member or reporter,

I want to report a missing person,

so that authorized people can help locate them.

US-MISSING-002 — Missing Person Information

As an authorized reporter,

I want to provide relevant identifying information,

so that the case contains useful information.

US-MISSING-003 — Last Known Location

As an authorized reporter,

I want to provide the person's last known location,

so that search efforts can begin from useful information.

US-MISSING-004 — Missing Person Match

As an authorized case participant,

I want Renite to identify potential matches,

so that possible sightings can be investigated.

25. Future Emergency Stories
US-SOS-001 — Trigger SOS

As a registered user,

I want to trigger an emergency SOS,

so that my trusted emergency contacts can be alerted.

US-SOS-002 — Share Emergency Location

As a user triggering an emergency event,

I want my current location to be shared with authorized contacts,

so that they can know where assistance may be needed.

US-SOS-003 — Emergency Contact

As a user,

I want to configure trusted emergency contacts,

so that Renite knows who should receive emergency notifications.

26. Future Movement Stories
US-MOVE-001 — Safe Zone

As a user,

I want to configure relevant safe zones,

so that unusual movement can be evaluated against my normal context.

US-MOVE-002 — Unusual Movement

As an authorized user,

I want Renite to identify potentially unusual movement,

so that I can review possible safety concerns.

US-MOVE-003 — Human Review

As an authorized user,

I want unusual movement alerts to require appropriate review,

so that the system does not incorrectly label normal activity as an emergency.

27. Future Payment Stories
US-PAY-001 — Pay Recovery Fee

As a user,

I want to pay for an eligible recovery service,

so that I can access the service.

US-PAY-002 — View Transaction

As a user,

I want to see my payment history,

so that I can track my transactions.

US-PAY-003 — Payment Confirmation

As a user,

I want confirmation of successful payment,

so that I know my request was processed.

28. Future Loyalty Stories
US-LOYALTY-001 — Earn Points

As an eligible finder,

I want to receive loyalty points for qualifying actions,

so that helpful community participation is rewarded.

US-LOYALTY-002 — View Points

As a user,

I want to view my loyalty balance,

so that I know what rewards I have earned.

US-LOYALTY-003 — Redeem Points

As an eligible user,

I want to redeem points for approved benefits,

so that my participation has practical value.

29. Future Referral Stories
US-REFERRAL-001 — Generate Referral Code

As a user,

I want a referral code,

so that I can invite people to Renite.

US-REFERRAL-002 — Referral Tracking

As a user,

I want to see eligible referral activity,

so that I understand my referral rewards.

30. Future Hardware Stories
US-HARDWARE-001 — Register Tracker

As an owner,

I want to associate an approved tracking device with my property,

so that the property can potentially be located.

US-HARDWARE-002 — View Tracker Status

As an authorized owner,

I want to see the status of my tracker,

so that I know whether it is functioning.

US-HARDWARE-003 — View Last Known Location

As an authorized owner,

I want to view the tracker's last known location,

so that I can use it during recovery.

31. Future Authority Stories
US-AUTHORITY-001 — Official Case Submission

As an authorized authority user,

I want to receive or review authorized Renite cases,

so that legitimate cases can be handled through official processes.

US-AUTHORITY-002 — Evidence Access

As an authorized authority user,

I want to access permitted evidence,

so that investigations can use relevant information.

US-AUTHORITY-003 — Case Updates

As an authorized authority user,

I want to update authorized case information,

so that Renite reflects the latest official status.

32. User Story Prioritization
Priority	Meaning
P0	Required for MVP
P1	Important after MVP
P2	Optional enhancement
FUTURE	Long-term capability
33. MVP User Story Set

The following stories SHALL be prioritized during the two-week MVP:

Authentication
    ├── Registration
    ├── Login
    ├── Logout
    └── Password Recovery

Profile
    ├── View Profile
    ├── Edit Profile
    └── Security Settings

Lost & Found
    ├── Report Lost
    ├── Report Found
    ├── Categories
    ├── Description
    ├── Image
    ├── Location
    └── Report Token

Search
    ├── Keyword
    ├── Category
    ├── Location
    └── Date

Matching
    ├── Potential Match
    ├── Review Match
    └── Reject Match

Verification
    ├── Start Verification
    ├── Provide Evidence
    └── Verification Result

Recovery
    ├── Start Recovery
    ├── Track Status
    ├── Arrange Handoff
    └── Confirm Return

Communication
    ├── Recovery Chat
    ├── Send Message
    └── Message History

Notifications
    ├── Match
    ├── Message
    └── Recovery Update

Administration
    ├── User Management
    ├── Report Management
    └── Moderation
34. User Story Rules

The following rules SHALL apply to all future stories.

Rule 1 — User Value

Every story SHALL represent a meaningful user or system goal.

Rule 2 — One Goal

A story SHOULD focus on one primary goal.

Rule 3 — Testability

A story SHALL be testable.

Rule 4 — Security

Stories involving sensitive information SHALL include appropriate security requirements.

Rule 5 — Privacy

Stories involving personal, location, image, or biometric information SHALL consider privacy.

Rule 6 — No Implementation Details

Stories SHOULD describe what the user needs rather than forcing a specific technology.

Rule 7 — MVP Discipline

Future functionality SHALL NOT be silently added to the MVP.

35. Definition of Done

A user story SHALL be considered complete when:

The story is understood.
Acceptance criteria exist.
UI/UX requirements are defined.
Required API behavior is defined.
Required database behavior is defined.
Security requirements are addressed.
Implementation is complete.
Tests pass.
Error states are handled.
Documentation is updated.
36. Related Documents
01_problem_statement.md
02_product_goals.md
03_product_scope.md
04_mvp_definition.md
05_user_personas.md
06_user_roles.md
07_functional_requirements.md
08_non_functional_requirements.md
09_feature_specifications.md
11_acceptance_criteria.md
12_requirements_traceability.md

# 37. Change History
Version	Date	Description
1.0.0	August 2026	Initial User Stories document.
Approval

Status: APPROVED

Approved By: Renite Core Team

End of Document