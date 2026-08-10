# Renite Responsive Design

## 1. Purpose

This document defines how the Renite interface SHALL adapt across mobile, tablet, and desktop devices.

The Figma design is the visual baseline.

---

## 2. Responsive Principle

Renite SHALL follow a:

```text
Mobile First
     ↓
Tablet
     ↓
Desktop
```
Designs SHALL scale and reorganize existing components rather than creating completely different interfaces.

3. Breakpoint Strategy

The frontend SHALL use responsive breakpoints appropriate to the framework.

Recommended reference points:

Mobile:   < 768px
Tablet:   768px – 1023px
Desktop:  ≥ 1024px

These values MAY be adjusted during implementation when required by the actual layout.

4. Mobile Layout

Mobile SHALL prioritize the most important actions.

┌──────────────────────┐
│ Top Bar              │
├──────────────────────┤
│                      │
│ Main Content         │
│                      │
│ Single Column        │
│                      │
├──────────────────────┤
│ Home Map Chat Profile│
└──────────────────────┘

Rules:

Single-column layouts by default.
Touch-friendly controls.
Bottom navigation.
Compact cards.
Bottom sheets for secondary actions.
Important emergency actions remain immediately visible.
5. Tablet Layout

Tablet MAY use:

┌────────────────────────────┐
│ Top Bar                    │
├────────────────────────────┤
│                            │
│  2-column content where    │
│  appropriate               │
│                            │
└────────────────────────────┘

Rules:

Maintain mobile navigation where appropriate.
Use wider cards and forms.
Allow two-column layouts when content benefits from them.
Avoid excessive information density.
6. Desktop Layout

Desktop SHALL support:

┌──────────────┬─────────────────────┐
│              │ Top Bar             │
│   Sidebar    ├─────────────────────┤
│              │                     │
│              │ Main Content        │
│              │                     │
└──────────────┴─────────────────────┘

The sidebar MAY be:

Expanded
Collapsed

Desktop MAY use:

Multi-column cards.
Larger map areas.
Tables.
Side panels.
Expanded forms.
7. Navigation
Mobile
Bottom Navigation
├── Home
├── Map
├── Chat
└── Profile
Desktop
Sidebar
├── Home
├── Missing Persons
├── Asset Tracker
├── Rewards
├── Community
└── Safety Map

Navigation SHALL remain logically consistent across devices.

8. Grid System

Responsive content SHOULD use a flexible grid.

Example:

Mobile
1 column

Tablet
2 columns

Desktop
2–4 columns depending on content

Cards SHALL resize naturally rather than using fixed widths.

9. Forms
Mobile

Forms SHALL normally use one column.

Name
Phone
Email
Category
Description
Location
Photo
[Submit]
Desktop

Independent fields MAY share a row.

Name                  Phone
Email                 Category
Description
Location
Photo

Forms SHALL remain readable and accessible.

10. Asset Tracker
Mobile
Asset
──────
Photo
Name
Status
Location
[View]
Desktop
┌────────┬────────────┬──────────┬────────────┐
│ Asset  │ Status     │ Location │ Action     │
└────────┴────────────┴──────────┴────────────┘

Desktop MAY use a table while mobile uses cards.

11. Missing Person Screens

Emergency information SHALL remain prominent on every screen size.

Mobile:

Photo
Name
Status
Last Seen
Location
[Emergency Action]

Desktop MAY provide:

┌──────────────┬────────────────────────┐
│ Person Info  │ Map / Location         │
│              │                        │
├──────────────┴────────────────────────┤
│ Case Information                      │
└───────────────────────────────────────┘

Emergency actions SHALL never be hidden inside deep menus.

12. Map
Mobile

Use:

Map
 ↓
Map Controls
 ↓
Bottom Sheet
Desktop

Use:

Map Area
+
Side Information Panel

Map controls SHALL remain accessible without covering important information.

13. Chat
Mobile
Conversation List
       ↓
Conversation Screen
Desktop
┌────────────────┬─────────────────────┐
│ Conversations  │ Active Conversation │
└────────────────┴─────────────────────┘

The message composer SHALL remain accessible.

14. Profile
Mobile

Profile settings SHALL use a vertical list.

Profile
Fayda Verification
Security
Payment
Notifications
Settings
Sign Out
Desktop

Profile information MAY use:

Profile Summary
+
Settings Panel
15. Dashboard
Mobile

Priority order:

Emergency Alerts
Quick Actions
Active Reports
Recent Activity
Desktop

The dashboard MAY use:

┌────────────┬────────────┐
│ Emergency  │ Quick      │
│ Alerts     │ Actions    │
├────────────┴────────────┤
│ Reports / Activity      │
├────────────┬────────────┤
│ Map        │ Rewards    │
└────────────┴────────────┘
16. Typography

Text SHALL scale responsively.

Rules:

Do not use excessively large headings on mobile.
Preserve readable body text.
Allow translated text to wrap.
Avoid fixed-height text containers.
17. Images

Images SHALL be responsive.

Rules:

Preserve aspect ratio.
Avoid distortion.
Use appropriate cropping.
Provide placeholders while loading.
Optimize large images for mobile networks.
18. Tables

Tables SHOULD NOT force horizontal scrolling on small screens when avoidable.

Desktop:

Table

Mobile:

Card List

The information SHALL remain equivalent.

19. Modals and Dialogs

Desktop MAY use centered dialogs.

Mobile SHOULD use:

Bottom Sheet
or
Full-screen Dialog

depending on the task.

Emergency and security confirmations SHALL remain clearly visible.

20. Localization

Responsive layouts SHALL support:

English
Amharic
Oromo
Tigrinya
Somali
Swahili
Arabic

Arabic SHALL support RTL.

Layouts SHALL account for:

Longer translated strings.
Different word lengths.
RTL navigation.
RTL icons where appropriate.
Expanded buttons.
21. Accessibility

Responsive layouts SHALL maintain:

Readable text.
Sufficient contrast.
Touch-friendly controls.
Keyboard support on desktop.
Screen-reader semantics.
Visible focus states.

Accessibility SHALL not be reduced on smaller screens.

22. Offline / Poor Network

Where possible, mobile screens SHALL handle unreliable connectivity.

The UI SHOULD communicate:

Online
Offline
Connecting
Syncing
Failed to Sync

Important user-entered information SHOULD NOT disappear because of a temporary connection failure.

23. Performance

Responsive implementation SHALL prioritize mobile performance.

Developers SHOULD:

Optimize images.
Lazy-load large content.
Avoid unnecessary animations.
Minimize large network requests.
Avoid loading desktop-only resources on mobile when unnecessary.
24. Responsive Component Rule

Components SHALL adapt rather than duplicate.

Preferred:

AssetCard
   ↓
Responsive Layout

Avoid:

MobileAssetCard
DesktopAssetCard
TabletAssetCard

unless their behavior is genuinely different.

25. Final Rule

Every Renite screen SHALL be tested at minimum in:

Mobile
Tablet
Desktop

and, where applicable:

LTR
RTL

The screen SHALL remain usable, readable, and visually consistent at every supported size.

Responsive Design Checklist
 Mobile layout works
 Tablet layout works
 Desktop layout works
 Navigation adapts correctly
 Forms remain usable
 Cards resize correctly
 Maps remain usable
 Tables have mobile alternatives
 Images scale correctly
 Loading states work
 Error states work
 Long text wraps correctly
 Arabic RTL works
 Touch targets are accessible
 Poor-network behavior is handled
 No important action is hidden on mobile