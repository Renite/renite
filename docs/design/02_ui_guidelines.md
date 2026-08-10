# Renite UI Guidelines

## 1. Purpose

These rules define how Renite screens SHALL be structured and implemented.

The existing Figma screens are the baseline for visual consistency.

---

## 2. Global Layout

### Mobile

```text
┌──────────────────────────┐
│ Top App Bar              │
├──────────────────────────┤
│                          │
│ Page Content             │
│                          │
├──────────────────────────┤
│ Home Map Chat Profile    │
└──────────────────────────┘
Desktop
┌────────────┬───────────────────────┐
│ Sidebar    │ Top App Bar           │
│            ├───────────────────────┤
│            │                       │
│            │ Page Content          │
│            │                       │
└────────────┴───────────────────────┘
3. Top App Bar

The top bar SHALL support:

☰ Menu
Global Search
Language
Notifications

Search placeholder:

Search assets, persons...

The notification icon SHALL display an unread indicator when necessary.

4. Bottom Navigation

Mobile navigation SHALL contain:

Home
Map
Chat
Profile

The active destination SHALL be visually emphasized.

Navigation SHALL remain available during normal application use.

5. Sidebar

Desktop/sidebar navigation SHALL contain:

Home Dashboard
Missing Persons
Asset Tracker
Rewards Wallet

Community
Community Reports
Safety Zones Map
Volunteer Network

The sidebar SHALL also provide:

User Profile
User Statistics
Network Status
6. Home Dashboard

The home screen SHALL prioritize safety and recovery.

Recommended order:

Greeting
 ↓
Active Emergency Alert
 ↓
Quick Actions
 ↓
Shortcuts
 ↓
Active Alerts
 ↓
Recently Found

Primary actions:

Report Lost Asset
Report Missing Person
7. Lost Asset Flow

The UI SHALL provide:

Asset Information
Asset Category
Description
Photo
Serial / Identifier
Location
Contact Information

The system SHALL generate a recovery token after registration.

8. Missing Person Flow

The UI SHALL use a clear multi-step workflow:

Step 1
Personal Information
       ↓
Step 2
Identity / Biometric Verification
       ↓
Step 3
Last Seen Location
       ↓
Review
       ↓
Emergency Dispatch

The final emergency action SHALL use the approved crimson emergency style.

9. Asset Tracker

The asset screen SHALL display:

Asset Photo
Asset Name
Brand
Serial Number
MAC Address
Registration Date
Status
Last Tracked Location
Hardware Token

Sensitive identifiers SHALL be masked by default.

Example:

C02X-••••-••XJ

Users MAY reveal information when authorized.

10. Registration

Asset registration SHALL support:

Photo Upload
Name
Brand
Category
Serial Number
MAC Address where applicable

After successful registration:

Registered
 ↓
Generate Hardware / Recovery Token
11. Reporting

Report forms SHALL support image uploading.

Users SHALL be able to:

Upload
Preview
Replace
Remove
Submit

The interface SHALL clearly distinguish:

Lost
Found
Missing Person
12. Map

The map SHALL support:

Search
Current Location
Relevant Reports
Last Seen Location
Nearby Activity
Safety Zones

Sensitive locations SHALL not be exposed to unauthorized users.

13. Chat

Chat SHALL provide:

Conversation List
Unread Messages
Secure Conversation
Official / Verified Accounts
Message Status

Recovery participants SHALL communicate through Renite without unnecessarily exposing private contact information.

14. Notifications

Notifications SHALL distinguish:

Emergency
Recovery
System
Payment
Reward
Message
Official Alert

Emergency notifications SHALL receive stronger visual emphasis.

15. Profile

Profile SHALL contain:

Profile Photo
Name
Fayda Verification Status
National ID Masked
Security & Privacy
Payment Methods
Notification Preferences
Account Settings
Sign Out

Renite account information SHALL remain separate from the Fayda identity verification record.

16. Rewards

Rewards SHALL display:

Points Balance
Tier / Progress
Reward Transactions
Recovery Rewards
Referral Rewards

Future financial functionality MAY include:

Bounty
Withdrawal
Mobile Money
Bank Transfer
17. Shipping

Shipping UI SHALL support:

Origin
Destination
Shipping Cost
Delivery Status
Payment

Example:

Origin: Addis Ababa
Destination: Dire Dawa

Shipping Cost: ETB 450

[ Pay & Request Shipping ]

The exact price SHALL come from the backend, not the frontend.

18. Authentication

The login/registration interface SHALL support:

Fayda ID
Identity Verification
Profile Information
Profile Photo
Terms & Conditions
Privacy Policy
Language Selection

Fayda verification SHALL be mandatory according to the current Renite product decision.

19. Empty States

Every major list SHALL have a useful empty state.

Example:

No registered assets yet.

[ Register Asset ]

Empty states SHALL explain what the user can do next.

20. Loading States

The UI SHALL provide loading feedback for:

Login
Verification
Image Upload
Search
Map Loading
Report Submission
Payment
Shipping
AI Processing

Users SHALL never be left wondering whether an action worked.

21. Error States

Errors SHALL be:

Clear
Short
Actionable
Non-technical

Bad:

HTTP 500 DATABASE_EXCEPTION

Good:

Something went wrong.
Please try again.
22. Confirmation States

Important operations SHALL provide confirmation.

Examples:

Report submitted
Asset registered
Payment completed
Shipping requested
Recovery completed
Profile updated
23. Sensitive Actions

Sensitive actions SHOULD require confirmation.

Examples:

Dispatch Emergency Report
Mark Asset as Lost
Delete Account
Reveal Sensitive Information
Make Payment
Confirm Recovery
24. Design Consistency Rules
1. Use the same component for the same purpose.

2. Keep navigation consistent across screens.

3. Use Navy for normal primary actions.

4. Use Crimson for genuine emergency actions.

5. Use Emerald for success/recovery/verification.

6. Mask sensitive information by default.

7. Keep forms simple and progressive.

8. Always provide loading, success, and error states.

9. Support all Renite languages.

10. Design mobile-first.

11. Do not expose sensitive location or identity data unnecessarily.

12. New screens SHALL follow the existing Figma visual language.
25. Core Screen Set

The current Renite UI baseline includes:

01 Login / Registration
02 National Safety Hub
03 Missing Person Emergency Desk
04 Asset Tracker
05 Rewards Wallet
06 Map
07 Chat
08 Profile
09 Notifications
10 Sidebar
11 Asset Registration
12 Shipping / Payment