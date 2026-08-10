# Renite Design System

## 1. Purpose

This document defines the mandatory visual rules for the Renite UI.

The Figma screens are the visual baseline. New screens SHALL follow this system unless the team formally approves a change.

---

## 2. Design Direction

Renite SHALL be:

- Modern
- Clean
- Accessible
- Security-focused
- Government-grade
- Mobile-first
- Community-oriented
- Multilingual

The interface SHALL use generous whitespace, clear hierarchy, and simple navigation.

---

## 3. Color System

### Base

| Token | Color | Usage |
|---|---|---|
| Background | `#F8FAFC` | Main page background |
| Surface | `#FFFFFF` | Cards and panels |
| Navy | `#1E293B` | Primary actions, headers, asset recovery |
| Charcoal | `#0F172A` | Emergency/missing-person mode |
| Crimson | `#EF4444` | Emergency, missing, urgent |
| Emerald | `#10B981` | Safe, recovered, verified |
| Border | Light neutral | Dividers and input borders |

### Modes

**Asset Recovery**

```text
Navy → Trust / Security
Emerald → Safe / Recovered / Verified

Missing Person / Emergency

Charcoal → Emergency interface
Crimson → Urgent / Missing / SOS

Red SHALL be reserved primarily for genuine emergency states.

4. Typography

The interface SHALL use a clean, highly readable sans-serif font.

Hierarchy:

Page Title
Section Title
Card Title
Body
Caption / Metadata

Rules:

Titles SHALL be visually distinct.
Body text SHALL remain readable on mobile.
Metadata SHALL use smaller, lighter text.
Long text SHALL wrap naturally.
Text containers SHALL support longer translated strings.
5. Spacing

Use a consistent spacing scale.

4px
8px
12px
16px
24px
32px
48px

Default screen padding:

16px

Cards and major sections MAY use larger spacing when necessary.

6. Cards

Cards SHALL:

Use white surfaces.
Have subtle borders or shadows.
Have consistent corner radius.
Contain clear information hierarchy.
Avoid excessive decoration.

Primary action cards may use:

Navy → Lost Asset
Crimson → Missing Person
7. Buttons

Primary actions:

Navy

Emergency actions:

Crimson

Success/recovery actions:

Emerald

Buttons SHALL:

Clearly describe the action.
Have sufficient touch area.
Show disabled/loading states.
Never rely only on color to communicate meaning.
8. Navigation
Mobile

Renite SHALL use:

Home
Map
Chat
Profile

as the primary bottom navigation.

Desktop

Renite SHALL support a collapsible left sidebar.

The top bar SHALL contain:

Menu
Global Search
Language
Notifications
9. Icons

Icons SHALL:

Have consistent visual style.
Support the accompanying text.
Never be the only way to communicate an important action.
Use familiar symbols for common actions.
10. Status System

Standard statuses:

SAFE
REGISTERED
RECOVERED
ACTIVE
MISSING
URGENT
PENDING
VERIFIED
RESOLVED

Status badges SHALL use consistent colors and text.

11. Forms

Forms SHALL:

Clearly label every field.
Show validation errors near the field.
Support keyboard and touch input.
Provide upload previews where applicable.
Support multilingual text.
Avoid unnecessarily long forms.

Sensitive fields SHALL have appropriate privacy controls.

12. Images & Uploads

Renite SHALL support image uploads for relevant workflows.

Examples:

Profile Photo
Asset Photo
Found Item Photo
Missing Person Photo
ID Photo
Live Verification Photo

Upload components SHALL show:

Upload
Preview
Replace
Remove
Validation Error
Upload Progress
13. Responsive Design

The UI SHALL be designed mobile-first.

Mobile
   ↓
Tablet
   ↓
Desktop

Desktop layouts MAY introduce:

Sidebar
Multi-column cards
Larger maps
Expanded tables

The core workflow SHALL remain usable on mobile.

14. Accessibility

The interface SHALL provide:

Sufficient contrast.
Readable typography.
Keyboard accessibility where applicable.
Touch-friendly controls.
Visible focus states.
Text labels for important actions.
Screen-reader-friendly semantic structure.

Color SHALL NOT be the only indicator of status.

15. Localization

The UI SHALL support:

English
Amharic
Oromo
Tigrinya
Somali
Swahili
Arabic

Arabic SHALL support RTL layouts.

Layouts SHALL not depend on fixed text widths.

16. Identity UI

Fayda SHALL appear as a verified identity layer.

Example:

Fayda ID Verified
National ID **** **90
Active

Fayda verification status SHALL be visually distinguishable from the Renite account itself.

17. Profile UI

The profile area SHALL support:

Profile
Fayda Verification
Security & Privacy
Payment Methods
Notification Preferences
Account Settings
Sign Out
18. Design Rules
1. Follow the approved Figma design baseline.

2. Do not introduce arbitrary colors.

3. Do not create inconsistent navigation patterns.

4. Do not overload screens with information.

5. Emergency actions SHALL be visually obvious.

6. Sensitive actions SHALL require appropriate confirmation.

7. All screens SHALL support localization.

8. Mobile usability SHALL be considered first.

9. Components SHALL be reusable.

10. New designs SHALL extend the existing system rather than create a new visual language.
19. Design Source of Truth
Figma UI
   ↓
Renite Design System
   ↓
Reusable Components
   ↓
Application Screens

The design team SHALL keep the Figma implementation and documentation synchronized.

