# Renite UI Components

## 1. Purpose

This document defines the reusable UI components used throughout Renite.

Components SHALL be reused instead of creating separate implementations for the same purpose.

---

## 2. Component Principles

All Renite components SHALL be:

- Reusable
- Responsive
- Accessible
- Localization-ready
- Consistent with the Figma baseline
- Compatible with light/dark or future theme changes
- Independent from business logic where possible

---

# 3. App Shell

The App Shell provides the common application structure.

```text
AppShell
├── TopBar
├── Sidebar        → Desktop
├── PageContent
└── BottomNav      → Mobile
```
4. Top Bar
TopBar
├── Menu Button
├── Search
├── Language Selector
└── Notification Button
Rules
Fixed or sticky where appropriate.
Search SHALL support assets and persons.
Notification count SHALL be displayed when unread notifications exist.
Language selector SHALL support all Renite languages.
5. Bottom Navigation
BottomNavigation
├── Home
├── Map
├── Chat
└── Profile

The active destination SHALL be visually emphasized.

6. Sidebar

Desktop navigation SHALL use:

Sidebar
├── User Summary
├── Home Dashboard
├── Missing Persons
├── Asset Tracker
├── Rewards Wallet
├── Community Reports
├── Safety Zones Map
└── Volunteer Network

The sidebar SHALL support collapsed and expanded states where required.

7. Search

The global search component SHALL support:

Search
├── Assets
├── Persons
└── Relevant Reports

States:

Default
Focused
Loading
Results
No Results
Error

Search SHALL respect user permissions.

8. Buttons
Primary

Used for normal important actions.

[ Register Asset ]
[ Submit Report ]
Secondary

Used for supporting actions.

[ Cancel ]
[ View Details ]
Emergency

Used only for genuine emergency actions.

[ Report Missing Person ]
[ Dispatch Emergency Report ]
[ SOS ]
Destructive

Used for irreversible or dangerous actions.

[ Delete Account ]
[ Remove Asset ]
9. Cards

Renite SHALL use reusable cards for:

Asset Card
Missing Person Card
Alert Card
Reward Card
Report Card
Notification Card
Shipping Card
User Card

Every card SHALL have:

Header
Content
Status
Optional Action
10. Status Badge

Standard status component:

StatusBadge

Supported states include:

SAFE
ACTIVE
REGISTERED
VERIFIED
RECOVERED
PENDING
MISSING
URGENT
RESOLVED

Status SHALL use both text and visual indication.

11. Alert Banner

Used for important system information.

Types:

Info
Success
Warning
Emergency

Emergency alerts SHALL use the Renite emergency style.

Example:

⚠ 2 Active Missing Person Alerts
Ongoing investigation...
[View]
12. Form Components

Reusable form components:

TextField
PhoneField
EmailField
PasswordField
SearchField
Dropdown
DatePicker
LocationPicker
Checkbox
RadioButton
Toggle
FileUpload

All fields SHALL support:

Default
Focused
Filled
Disabled
Loading
Error
Success
13. File Upload

The upload component SHALL support:

Select File
Preview
Replace
Remove
Upload Progress
Success
Error

Supported use cases:

Profile Photo
Asset Photo
Found Item Photo
Missing Person Photo
Verification Photo
14. Asset Card

Minimum information:

Asset Image
Asset Name
Brand
Category
Status
Last Tracked Location

Sensitive information SHALL be masked.

Detailed views MAY include:

Serial Number
MAC Address
Registration Date
Hardware Token
15. Missing Person Card

Minimum information:

Photo
Name
Age where permitted
Last Seen Location
Last Seen Time
Case Status
Urgency

Sensitive information SHALL only be shown to authorized users.

16. Map Components

Reusable map components:

MapView
LocationMarker
CurrentLocation
ReportMarker
SafetyZone
MapSearch
MapControls

Map data SHALL respect privacy and authorization rules.

17. Chat Components
ChatList
ChatHeader
MessageBubble
MessageInput
AttachmentButton
UnreadBadge
TypingIndicator

Chat SHALL clearly identify verified or official accounts where applicable.

18. Notification Components
NotificationList
NotificationItem
NotificationBadge
NotificationFilter
NotificationEmptyState

Notification categories:

Emergency
Recovery
System
Payment
Reward
Message
Official
19. Profile Components
ProfileHeader
VerificationBadge
IdentityCard
SettingsList
SettingsItem
SecurityCard
PaymentMethodCard

Example:

Abebe M.
Fayda ID Verified

National ID
**** **90
Active
20. Verification Components
VerificationStatus
IdentityCard
BiometricCapture
VerificationProgress
VerificationResult

Fayda SHALL be represented as the identity-verification layer.

Renite account information SHALL remain separate.

21. Reward Components
PointsBalance
RewardCard
RewardTransaction
RewardProgress
ReferralCard

Example:

280 Points
Recovery Reward
+100
22. Payment Components
PaymentMethod
PaymentSummary
TransactionCard
PaymentStatus
PaymentConfirmation

Payment credentials SHALL not be exposed unnecessarily.

23. Shipping Components
ShippingForm
AddressSelector
DeliveryStatus
ShippingSummary
ShippingTracking

Example states:

Requested
Paid
Processing
In Transit
Delivered
Cancelled
24. Modal / Dialog

Dialogs SHALL be used for:

Confirmation
Sensitive Actions
Important Warnings
Payment Confirmation
Report Review

Dialogs SHALL not be used for information that could naturally appear on the page.

25. Bottom Sheet

Use bottom sheets for mobile actions such as:

Filters
Map Details
Asset Actions
Report Actions
Language Selection
26. Loading Components
LoadingSpinner
SkeletonCard
SkeletonList
ProgressIndicator
UploadProgress

Loading states SHALL preserve the expected page layout where possible.

27. Empty States

Reusable empty-state structure:

Icon / Illustration
Title
Description
Primary Action

Example:

No Registered Assets

Register your first device to protect it.

[ Register Asset ]
28. Error Components
InlineError
ErrorBanner
ErrorState
RetryButton

Errors SHALL provide an understandable next action.

29. Toast / Snackbar

Use for short-lived feedback:

Asset registered successfully.
Report submitted.
Profile updated.
Payment completed.

Critical information SHALL not rely only on a temporary toast.

30. Component States

Interactive components SHALL define:

Default
Hover
Focus
Pressed
Disabled
Loading
Success
Error

Not every state is required visually on every component, but behavior SHALL be defined.

31. Responsive Behavior

Components SHALL adapt to:

Mobile
Tablet
Desktop

Examples:

Desktop → Sidebar
Mobile  → Bottom Navigation

Desktop → Multi-column cards
Mobile  → Single-column cards

Desktop → Full map panel
Mobile  → Map + bottom sheet
32. Accessibility

Every interactive component SHALL support:

Keyboard navigation where applicable.
Visible focus.
Appropriate labels.
Sufficient touch target size.
Screen-reader semantics.
Non-color status indicators.
33. Localization

Components SHALL support:

English
Amharic
Oromo
Tigrinya
Somali
Swahili
Arabic

Components SHALL handle:

Longer translated text.
RTL layouts.
Different text lengths.
Localized dates and numbers.
34. Component Naming

Components SHALL use clear names.

Recommended:

AssetCard
MissingPersonCard
ReportCard
AlertBanner
VerificationBadge
RewardCard
NotificationItem
ShippingStatus

Avoid vague names:

Box
Thing
Widget1
CustomCard2
35. Business Logic

UI components SHALL NOT directly contain:

Database queries.
Payment processing.
Authentication logic.
AI processing.
Direct external API credentials.
Sensitive security decisions.

Use:

UI
 ↓
State / Controller
 ↓
Service
 ↓
API
36. Component Rule

Before creating a new component, the developer SHALL check whether an existing Renite component can be reused.