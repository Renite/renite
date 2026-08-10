# Renite Screen Specifications

## 1. Purpose

This document defines the required structure and behavior of the main Renite screens.

The approved Figma design SHALL remain the visual reference.

---

# 2. Authentication

## Login

Required:

- Fayda ID / approved authentication method
- Password or authentication credential
- Language selection
- Terms & Privacy access
- Login state
- Error state

Flow:

```text
Login
 ↓
Authentication
 ↓
Fayda Verification Check
 ↓
Renite Account
 ↓
Home
```
3. Registration

Required:

Personal information
Phone
Email where applicable
Profile photo
Fayda identity verification
Terms & Conditions
Privacy Policy
Language preference

Fayda verification SHALL be mandatory.

Renite SHALL create and maintain its own user account after verification.

4. Home — National Safety Hub

The home screen SHALL contain:

Top Bar
 ↓
Greeting
 ↓
Active Emergency Alerts
 ↓
Quick Actions
 ↓
Rewards / Tracking / Notifications
 ↓
Active Alerts
 ↓
Recently Found / Relevant Activity
 ↓
Navigation

Primary actions:

Report Lost Asset
Report Missing Person

The Missing Person action SHALL use the emergency visual style.

5. Asset Tracker

Purpose:

Allow users to register and manage protected assets.

Required:

Asset Registry
My Devices
Asset Cards
Register Asset
Asset Details
Tracking Status

Asset details MAY include:

Image
Name
Brand
Category
Serial Number
MAC Address
Registration Date
Recovery Token
Last Known Location
Status

Sensitive identifiers SHALL be masked by default.

6. Register Asset

Required fields:

Asset Category
Asset Name
Brand
Description
Serial Number
MAC Address where applicable
Photo

After submission:

Validation
 ↓
Asset Registration
 ↓
Recovery Token Generation
 ↓
Success

The frontend SHALL NOT generate trusted recovery tokens.

7. Report Lost Asset

Required:

Asset Selection / Registration
Description
Last Known Location
Date / Time
Additional Information
Photo where available

Flow:

Report Lost
 ↓
Asset Information
 ↓
Location
 ↓
Review
 ↓
Submit
 ↓
Confirmation
8. Found Asset

Required:

Found Item Information
Photo
Location
Description
Optional Recovery Token

The system SHALL attempt matching against authorized lost reports.

AI matching SHALL produce a potential match, not automatic ownership confirmation.

9. Missing Person Emergency Desk

The screen SHALL clearly communicate that it is an emergency-sensitive workflow.

Required:

Person Information
Photo
Identity Information
Fayda / Identity Verification
Last Seen Location
Last Seen Time
Description
Emergency Information

Flow:

Report Missing Person
 ↓
Person Information
 ↓
Identity Verification
 ↓
Last Seen Information
 ↓
Review
 ↓
Submit Emergency Report
 ↓
Case Created
10. Missing Person Case

Case screen SHALL display, according to authorization:

Case ID
Person Information
Photo
Last Seen Location
Last Seen Time
Case Status
Investigation Status
Relevant Updates

Possible states:

ACTIVE
INVESTIGATING
POTENTIAL MATCH
FOUND
RESOLVED
CLOSED

Sensitive information SHALL only be accessible to authorized users.

11. Map

The Map screen SHALL provide:

Map
Search
Current Location
Relevant Reports
Safety Zones
Last Seen Locations
Nearby Activity

Map markers SHALL use clear categories.

Example:

Asset
Missing Person
Found Item
Safety Zone
Emergency

Exact sensitive locations SHALL not be exposed publicly.

12. Chat

Required:

Conversation List
Conversation
Message History
Message Input
Attachments where allowed
Unread Messages

Chat SHALL support privacy-preserving communication.

Users SHALL not be required to expose their personal phone number to another party merely to communicate through Renite.

13. Notifications

Required categories:

Emergency
Recovery
Report
Message
Reward
Payment
Shipping
System
Official Alert

Notification screen SHALL support:

Read/unread state
Timestamp
Category
Navigation to related content
14. Rewards Wallet

Required:

Points Balance
Current Tier
Reward History
Recovery Rewards
Referral Rewards
Available Benefits

Future functionality:

Cash Withdrawal
Mobile Money
Bank Transfer
Shipping Discounts

Financial transactions SHALL be controlled by backend services.

15. Shipping

Required:

Pickup Location
Destination
Delivery Information
Shipping Cost
Payment Status
Delivery Status

Status:

REQUESTED
PAID
PROCESSING
IN_TRANSIT
DELIVERED
CANCELLED
16. Profile

The Profile screen SHALL contain:

Profile Header
Profile Photo
Name
Fayda Verification
Masked National ID

Security & Privacy
Payment Methods
Notification Preferences
Account Settings

Sign Out

Fayda verification SHALL be clearly presented as identity verification.

It SHALL NOT replace the Renite account model.

17. Security & Privacy

Required areas:

Authentication
Password / Credential Management
Identity Verification
Session Management
Privacy Controls
Device / Session Management
Account Protection

Sensitive operations SHALL require appropriate verification.

18. Payment Methods

Required:

Saved Payment Methods
Add Payment Method
Remove Payment Method
Default Payment Method
Payment Verification

Sensitive payment information SHALL be handled through approved payment providers where possible.

19. Notification Preferences

Users SHALL be able to control permitted notification categories.

Example:

Emergency Alerts      ON
Recovery Updates      ON
Messages              ON
Rewards               ON
Payments              ON
Marketing             OFF

Emergency notifications SHALL remain subject to safety and legal requirements.

20. Account Settings

Required:

Language
Profile Information
Privacy
Security
Notifications
Account Status
Delete / Deactivate Account

Arabic SHALL support RTL.

21. Community Reports

Community reports MAY include:

Found Asset
Safety Report
Missing Person Information
Other Approved Report

Reports SHALL pass through validation and moderation where required.

22. Volunteer Network

The Volunteer Network MAY provide:

Available Volunteers
Volunteer Status
Relevant Nearby Tasks
Volunteer History
Trust / Reputation

Exact personal information SHALL not be publicly exposed.

23. Search Results

Search SHALL categorize results:

Assets
Persons
Reports
Cases
Community

Results SHALL be filtered according to:

Authentication
Authorization
Privacy
Case status
Visibility
24. Global UI States

Every major screen SHALL define:

Loading
Success
Empty
Error
Unauthorized
Offline

Critical workflows SHALL also support:

Processing
Verification
Pending Review
25. Responsive Screen Rules
Mobile
Single-column
Bottom Navigation
Compact Cards
Bottom Sheets
Touch-first Controls
Desktop
Sidebar
Multi-column Layout
Expanded Tables
Larger Map Area
More Information Density

The workflow SHALL remain functionally equivalent across screen sizes.

26. Screen Implementation Rule

Every screen SHALL define:

Purpose
User Role
Entry Point
Required Data
Actions
Loading State
Empty State
Error State
Success State
Authorization Rules
Responsive Behavior

No production screen SHALL be implemented without these states being considered.

27. MVP Screen Priority
Priority 1
Login
Registration
Fayda Verification
Home
Profile
Asset Registration
Asset Tracker
Report Lost Asset
Report Found Asset
Notifications
Priority 2
Missing Person
Map
Chat
Rewards
Shipping
Payment
Future
AI Matching
Biometric Matching
Law Enforcement Integration
Hardware Tracking
Mesh Tracking
Movement Anomaly Detection
Automated Emergency Response