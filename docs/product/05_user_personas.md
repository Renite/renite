# User Personas

| Property | Value |
|----------|-------|
| Project | Renite |
| Document | User Personas |
| Document ID | PROD-005 |
| Version | 1.0.0 |
| Status | Approved |
| Owner | Renite Product Team |
| Category | Product |
| Last Updated | August 2026 |

---

# 1. Purpose

This document defines the primary users Renite is designed to serve.

Personas SHALL help the Product, UI/UX, Engineering, QA, Security, and Architecture teams understand:

- Who uses Renite.
- Why they use it.
- What they need.
- What problems they face.
- What they are allowed to do.
- What risks must be considered.

Personas SHALL be used as representative user models, not as assumptions about every individual user.

---

# 2. Persona Principles

Renite SHALL design around real user needs rather than around technical features.

Every major user-facing feature SHOULD answer:

```text
Who needs this?
      ↓
What problem are they experiencing?
      ↓
What are they trying to accomplish?
      ↓
What information do they need?
      ↓
What could go wrong?
      ↓
How should Renite help?
3. Primary User Groups

Renite's user ecosystem SHALL be divided into:

                    RENITE USERS
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      Owners           Finders          Guests
        │                │                │
        └────────────────┼────────────────┘
                         │
                    Administrators
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Moderators       Institutions     Authorities

Not every role SHALL be implemented in the MVP.

4. Persona P-001 — Lost Item Owner
4.1 Persona Overview

Role: Person who lost an item

Priority: P0

MVP: YES

This is one of Renite's primary users.

The user has lost an item and wants to recover it.

4.2 Typical Situation

The user may have lost:

Smartphone
Laptop
Tablet
Bag
Electronic equipment
Personal belongings

The user may not know where the item currently is.

4.3 Goals

The user wants to:

Report the lost item quickly.
Provide useful information.
Search for matching found reports.
Receive potential match notifications.
Verify ownership.
Communicate safely.
Recover the item.
Close the case.
4.4 Pain Points

The user may experience:

Anxiety about losing valuable property.
Lack of centralized reporting.
Difficulty finding relevant information.
Fear of scams.
Difficulty proving ownership.
Exposure of personal information.
Uncertainty about whether someone found the item.
4.5 Needs

Renite SHOULD provide:

Simple reporting.
Clear forms.
Image upload.
Location support.
Search.
Matching.
Verification.
Secure communication.
Notifications.
Recovery status.
4.6 Key User Journey
Login
  ↓
Report Lost
  ↓
Describe Item
  ↓
Upload Image
  ↓
Add Location
  ↓
Submit
  ↓
Monitor Report
  ↓
Receive Potential Match
  ↓
Verify
  ↓
Communicate
  ↓
Recover
  ↓
Confirm Return
4.7 Important UX Considerations

The interface SHOULD:

Minimize unnecessary fields.
Clearly identify required information.
Provide progress feedback.
Prevent accidental report loss.
Explain privacy implications.
Make report status obvious.
5. Persona P-002 — Finder
5.1 Persona Overview

Role: Person who finds lost property

Priority: P0

MVP: YES

The finder discovers an item and wants to return it to its legitimate owner.

5.2 Typical Situation

The user finds:

Phone
Laptop
Tablet
Bag
Electronic equipment
Other personal property

The user may not know who owns it.

5.3 Goals

The finder wants to:

Report the found item.
Check whether it has already been reported.
Find the owner safely.
Avoid scams.
Protect their own identity.
Complete a safe handoff.
Receive recognition or future rewards.
5.4 Pain Points

The finder may experience:

Uncertainty about ownership.
Fear of dealing with strangers.
Difficulty contacting the owner.
Concern about accusations.
Lack of incentive.
No centralized recovery system.
5.5 Needs

Renite SHOULD provide:

Found-item reporting.
Search.
Potential matching.
Secure communication.
Verification workflow.
Recovery status.
Future reward mechanisms.
5.6 Key User Journey
Login
  ↓
Report Found
  ↓
Describe Item
  ↓
Upload Image
  ↓
Add Location
  ↓
Submit
  ↓
Potential Owner Match
  ↓
Verification
  ↓
Secure Communication
  ↓
Safe Handoff
  ↓
Recovery Completed
6. Persona P-003 — Guest / Unauthenticated Visitor
6.1 Persona Overview

Role: Visitor who has not created an account

Priority: P1

MVP: YES

A guest may visit Renite before deciding to register.

6.2 Goals

The guest wants to:

Understand what Renite does.
Search publicly available reports where permitted.
Learn how recovery works.
Understand safety and privacy policies.
Register if they need full functionality.
6.3 Needs

Renite SHOULD provide:

Clear homepage.
Search/discovery where appropriate.
About information.
FAQ.
Terms and conditions.
Privacy information.
Registration entry point.
6.4 Restrictions

Guests SHALL NOT be able to:

Create reports.
Access private reports.
Access private messages.
Access verification information.
Modify system data.
7. Persona P-004 — Administrator
7.1 Persona Overview

Role: System administrator

Priority: P0

MVP: YES

The administrator manages the platform and maintains system integrity.

7.2 Goals

The administrator wants to:

Monitor system activity.
Manage users.
Review reports.
Handle abuse.
Manage inappropriate content.
Maintain platform safety.
Investigate system issues.
7.3 Needs

The administrator SHOULD have:

Administrative dashboard.
User management.
Report management.
Moderation tools.
Audit logs.
System status information.
Security controls.
7.4 Security Requirements

Administrator access SHALL require stronger protection than ordinary user access.

Administrative actions SHOULD be logged.

8. Persona P-005 — Moderator
8.1 Persona Overview

Role: Content/recovery moderator

Priority: P2

MVP: Optional / Limited

A moderator helps maintain the quality and safety of platform content.

8.2 Goals

The moderator wants to:

Review flagged reports.
Identify inappropriate content.
Detect suspicious activity.
Escalate serious cases.
Protect users from abuse.
8.3 Needs

Potential capabilities:

Moderation queue.
Report review.
User reports.
Content flags.
Escalation workflow.
Moderation history.
9. Persona P-006 — Institutional User
9.1 Persona Overview

Role: Authorized representative of a school, workplace, organization, or institution

Priority: P2

MVP: Future / Limited

Institutions may manage lost property belonging to their communities.

9.2 Examples

Potential institutions include:

Schools
Universities
Companies
Offices
Campuses
Organizations
9.3 Goals

The institutional user wants to:

Manage organizational lost-and-found cases.
Verify organizational property.
Help users recover property.
Maintain records.
Manage authorized staff.
9.4 Future Capabilities

Potential functionality:

Institution Profile
       ↓
Staff Accounts
       ↓
Institution Reports
       ↓
Verification
       ↓
Recovery
       ↓
Institutional History
10. Persona P-007 — Missing-Person Reporter
10.1 Persona Overview

Role: Person reporting a missing individual

Priority: P3

MVP: NO

This persona belongs to the long-term missing-person capability.

The reporter may be:

Family member
Guardian
Authorized representative
Institution
Other legally appropriate reporter
10.2 Goals

The reporter wants to:

Report a missing person.
Provide accurate information.
Provide a photograph.
Record last known location.
Receive updates.
Coordinate with authorized parties.
Help locate the person safely.
10.3 Critical Considerations

Missing-person workflows involve highly sensitive information.

Renite SHALL apply stronger controls to:

Identity information.
Location.
Photographs.
Emergency contacts.
Case details.

This capability SHALL require additional security, privacy, legal, and operational design before implementation.

11. Persona P-008 — Law Enforcement / Authorized Authority
11.1 Persona Overview

Role: Authorized government or law-enforcement representative

Priority: P3

MVP: NO

This persona represents a future integration.

11.2 Goals

The authorized authority may need to:

Receive authorized reports.
Review verified information.
Coordinate official cases.
Access information under appropriate authorization.
Update official case status.
11.3 Restrictions

Authority access SHALL:

Require verified organizational identity.
Use strict authorization.
Log sensitive access.
Follow applicable laws and policies.
Avoid unnecessary disclosure.

Renite SHALL NOT assume that every user claiming to represent an authority is legitimate.

12. Persona P-009 — Delivery / Recovery Partner
12.1 Persona Overview

Role: Authorized logistics or recovery partner

Priority: P3

MVP: NO

This persona belongs to the future shipping and delivery ecosystem.

12.2 Goals

The partner may need to:

Accept delivery requests.
Collect an item.
Transport an item.
Update delivery status.
Confirm handoff.
13. Persona P-010 — Trust / Reward Participant
13.1 Persona Overview

Role: User participating in Renite's future reward ecosystem

Priority: P3

MVP: NO

This persona represents users interested in:

Loyalty points.
Referral rewards.
Recovery recognition.
Discounts.
Future monetary rewards.
14. Persona Comparison
Persona	MVP	Primary Goal	Main Capability
Lost Item Owner	YES	Recover property	Lost report
Finder	YES	Return property	Found report
Guest	YES	Understand/discover	Public access
Administrator	YES	Maintain platform	Administration
Moderator	LIMITED	Maintain safety	Moderation
Institution	FUTURE	Manage organizational recovery	Institutional tools
Missing-Person Reporter	FUTURE	Locate missing person	Missing-person case
Authority	FUTURE	Handle authorized cases	Official integration
Delivery Partner	FUTURE	Transport recovered items	Logistics
Reward Participant	FUTURE	Earn/use rewards	Loyalty system
15. Primary MVP Personas

The MVP SHALL prioritize:

1. Lost Item Owner
2. Finder
3. Guest
4. Administrator

These personas are sufficient to demonstrate the core recovery workflow.

16. Secondary Personas

The following MAY influence MVP design but SHALL NOT drive MVP complexity:

Moderator
Institutional User

Their future requirements SHOULD be considered when designing the architecture.

17. Future Personas

The following SHALL remain future scope:

Missing-Person Reporter
Law Enforcement / Authorized Authority
Delivery Partner
Reward Participant

Their existence SHALL be considered during long-term planning but SHALL NOT be implemented prematurely.

18. Persona Interaction Model

The core MVP interaction is:

             RENITE
                │
       ┌────────┴────────┐
       │                 │
      OWNER            FINDER
       │                 │
       │                 │
       └───────┬─────────┘
               ↓
        Potential Match
               ↓
          Verification
               ↓
         Communication
               ↓
           Recovery
               ↓
         Case Closure

Administrative oversight exists around the workflow:

                 ADMIN
                   │
                   ↓
    ┌──────────── RENITE ────────────┐
    │                                │
  OWNER                            FINDER
    │                                │
    └──────────── RECOVERY ──────────┘
19. User Needs Priority

Renite SHALL prioritize user needs in the following order:

1. Safety
2. Privacy
3. Successful Recovery
4. Trust
5. Clear Information
6. Ease of Use
7. Speed
8. Rewards

Rewards SHALL never be prioritized above safety or privacy.

20. Accessibility Considerations

The design team SHOULD consider:

Different technical skill levels.
Mobile-first usage.
Different screen sizes.
Language preferences.
Readability.
Clear error messages.
Simple navigation.
Accessible controls.
Low-bandwidth conditions where practical.
21. Persona-Based Design Rule

Every major user-facing feature SHOULD identify its target persona.

Example:

Feature:
Lost Report

Primary Persona:
Lost Item Owner

Secondary Persona:
Administrator

User Need:
Report lost property quickly.

Success:
A valid report is created and becomes discoverable.
22. Persona-Based Requirement Rule

A requirement SHOULD be traceable to at least one user or operational need.

Persona
   ↓
Need
   ↓
Problem
   ↓
Goal
   ↓
Requirement
   ↓
Feature
   ↓
User Story
   ↓
Acceptance Criteria
23. Persona Privacy Rules

Different personas SHALL have different access levels.

Example:

Guest
 ↓
Public Information

User
 ↓
Own Data + Authorized Data

Matched User
 ↓
Recovery-Related Data

Administrator
 ↓
Authorized Administrative Data

Authority
 ↓
Legally Authorized Data

No persona SHALL automatically receive access to all system information.

24. Persona Evolution

Personas MAY evolve as Renite gains real users.

The Product Team SHOULD update personas when:

New user research becomes available.
A new major user group is identified.
Existing behavior significantly differs from assumptions.
New product capabilities are introduced.

Changes SHALL be documented.

25. Persona Validation

Before developing a major feature, the Product Team SHOULD verify:

Who uses it?
       ↓
What problem do they have?
       ↓
What do they need?
       ↓
What information do they provide?
       ↓
What information do they receive?
       ↓
What permissions do they have?
       ↓
What could harm them?
26. Design Implications

The UI/UX team SHALL use these personas when creating:

User flows.
Wireframes.
Navigation.
Forms.
Dashboards.
Report pages.
Search interfaces.
Communication interfaces.
Administrative interfaces.

The design SHOULD remain centered on recovery rather than on displaying unnecessary features.

27. Architecture Implications

The architecture team SHOULD consider the distinction between:

User
Role
Permission
Organization
Case
Report

These concepts SHOULD NOT be treated as identical.

The final authorization model SHALL be defined in the architecture and security documentation.

28. Testing Implications

QA SHALL test the application from the perspective of each supported MVP persona.

Minimum MVP scenarios:

Guest
 ├── Browse
 └── Register

Owner
 ├── Report Lost
 ├── Search
 ├── Match
 ├── Verify
 └── Recover

Finder
 ├── Report Found
 ├── Match
 ├── Verify
 └── Recover

Administrator
 ├── Review
 ├── Moderate
 └── Manage
29. Definition of Persona Coverage

Persona documentation SHALL be considered sufficient when:

MVP users are clearly identified.
Their goals are documented.
Their pain points are documented.
Their needs are documented.
Their main journeys are documented.
Their permissions are understood.
Privacy implications are identified.
Future personas are separated from MVP personas.
30. Related Documents
01_problem_statement.md
02_product_goals.md
03_product_scope.md
04_mvp_definition.md
06_user_roles.md
07_functional_requirements.md
08_non_functional_requirements.md
09_feature_specifications.md
10_user_stories.md
11_acceptance_criteria.md
12_requirements_traceability.md

../planning/
../design/
../architecture/
../engineering/
../governance/
31. Change History
Version	Date	Description
1.0.0	August 2026	Initial User Personas document.
Approval

Status: APPROVED

Approved By: Renite Core Team

End of Document