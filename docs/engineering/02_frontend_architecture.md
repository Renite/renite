# Renite Frontend Architecture

## 1. Purpose

This document defines the architecture for the two Renite client applications:

```text
Web    → React.js + TypeScript
Mobile → Flutter + Dart

Both applications SHALL use the same backend APIs and business rules.

2. Overall Architecture
                 RENITE BACKEND
                       │
                Secure REST API
                       │
          ┌────────────┴────────────┐
          │                         │
   React + TypeScript          Flutter + Dart
        Web App                  Mobile App

The frontend applications SHALL NOT communicate directly with the database.

3. Web Architecture

The web application SHALL use a feature-oriented React architecture.

Recommended:

apps/web/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── assets/
└── ...
4. Web Features

Feature modules SHOULD include:

features/
├── auth/
├── assets/
├── missing-persons/
├── reports/
├── map/
├── chat/
├── rewards/
├── notifications/
├── payments/
├── shipping/
└── profile/

Each feature SHOULD contain its own related:

Components
Hooks
Types
Services
State
Validation

where appropriate.

5. React Component Architecture

Preferred structure:

Page
 ↓
Feature Component
 ↓
Shared Component

Example:

AssetTrackerPage
 ↓
AssetList
 ↓
AssetCard

Pages SHALL compose components rather than becoming large monolithic files.

6. Web State Architecture

Separate:

UI State
Server State
Authentication State
Application State

Examples:

UI State
Modal Open
Selected Filter
Sidebar State
Server State
Assets
Reports
Notifications
Messages
Rewards
Authentication State
Authenticated User
Session
Verification Status
Permissions

The final state-management library SHALL be selected and documented before implementation.

7. Web Routing

Routes SHALL be categorized as:

Public
Authenticated
Role-Protected
Emergency / Restricted

Example:

Public
├── /
├── /login
└── /register

Authenticated
├── /dashboard
├── /assets
├── /reports
├── /map
├── /chat
└── /profile

Restricted
├── /admin
├── /law-enforcement
└── /moderation

Actual routes SHALL follow the approved product requirements.

8. Mobile Architecture

Flutter SHALL use a feature-oriented architecture.

Recommended:

apps/mobile/
├── lib/
│   ├── core/
│   ├── features/
│   ├── shared/
│   ├── routes/
│   └── main.dart
└── ...
9. Flutter Features

Recommended:

features/
├── auth/
├── assets/
├── missing_persons/
├── reports/
├── map/
├── chat/
├── rewards/
├── notifications/
├── payments/
├── shipping/
└── profile/

Each feature SHOULD contain its own screens, widgets, models, state, and data access where appropriate.

10. Flutter Layering

Preferred:

Screen
 ↓
Widget
 ↓
State / Controller
 ↓
Repository
 ↓
API Service

Business logic SHALL NOT be placed directly inside large widgets.

11. Shared Mobile Core

The core/ layer SHOULD contain:

API Client
Authentication
Storage
Configuration
Error Handling
Network Handling
Security Utilities
Routing
Theme
Localization
12. Shared UI

Reusable Flutter components SHOULD live under:

shared/
├── widgets/
├── theme/
├── components/
└── utilities/

Examples:

AssetCard
StatusBadge
PrimaryButton
AlertBanner
LoadingView
ErrorView
13. API Layer

Both applications SHALL use a centralized API layer.

React
 ↓
API Client
 ↓
Backend API

Flutter
 ↓
API Client
 ↓
Backend API

API logic SHALL NOT be scattered throughout individual screens.

14. API Models

Frontend models SHALL represent backend responses explicitly.

Examples:

User
Asset
MissingPersonCase
Report
Notification
Message
Reward
Payment
ShippingOrder

Models SHALL be validated and mapped appropriately.

15. Authentication

Authentication SHALL be centralized.

Login
 ↓
Backend Authentication
 ↓
Fayda Verification Status
 ↓
Session
 ↓
Authenticated Application

The frontend SHALL not make authorization decisions based solely on hidden UI elements.

Backend authorization remains authoritative.

16. Fayda

Frontend responsibilities:

Start Verification
Show Verification Progress
Handle Result
Display Verification Status

Backend responsibilities:

Validate Verification
Store Verification Reference/Status
Apply Identity Policies

The frontend SHALL NOT store unnecessary sensitive Fayda information.

17. Authorization

The UI SHALL hide or disable actions the user cannot perform.

However:

UI Restriction ≠ Security

Every protected operation SHALL also be authorized by the backend.

18. API Error Handling

The frontend SHALL normalize backend errors into user-friendly states.

Example:

Backend
401
 ↓
Frontend
Session Expired
 ↓
User
Please sign in again.

Technical server errors SHALL not be displayed directly to users.

19. Offline Handling

Mobile SHALL consider unreliable connectivity.

The application SHOULD support:

Offline Detection
Retry
Pending Actions
Sync

Critical emergency behavior SHALL clearly communicate whether a request was successfully transmitted.

The application SHALL never falsely report that an emergency report was sent when delivery has not been confirmed.

20. Localization

Both applications SHALL support:

English
Amharic
Oromo
Tigrinya
Somali
Swahili
Arabic

The architecture SHALL support RTL for Arabic.

Translations SHALL not be hardcoded inside reusable UI components.

21. Theme

Both applications SHALL consume the Renite design system.

The theme SHALL define:

Colors
Typography
Spacing
Radius
Elevation
Component Styles

Components SHALL not introduce arbitrary colors or spacing values without justification.

22. Responsive Web

The React application SHALL support:

Mobile
Tablet
Desktop

The implementation SHALL follow:

docs/design/05_responsive_design.md
23. Adaptive Mobile UI

Flutter SHALL adapt to different:

Screen Sizes
Orientations where supported
Text Sizes
Platform Interaction Patterns

The application SHALL maintain the Renite visual identity across supported devices.

24. Security

Frontend development SHALL follow:

docs/security/

and applicable OWASP guidance.

Frontend developers SHALL specifically consider:

XSS
CSRF where applicable
Token/session security
Sensitive data exposure
Unsafe file handling
Insecure storage
Deep links
Input validation
Dependency security

The exact controls SHALL be defined in the security documentation.

25. Performance
React

Developers SHOULD consider:

Lazy Loading
Code Splitting
Image Optimization
Caching
Memoization where justified
Avoiding unnecessary renders
Flutter

Developers SHOULD consider:

Efficient Widget Trees
Lazy Lists
Image Optimization
Avoiding unnecessary rebuilds
Efficient Network Requests

Performance optimization SHALL be based on actual bottlenecks rather than premature complexity.

26. Accessibility

Web SHALL support:

Keyboard navigation.
Screen readers.
Semantic HTML.
Visible focus.
Accessible forms.
Sufficient contrast.

Flutter SHALL support:

Semantic widgets.
Screen readers.
Accessible labels.
Appropriate touch targets.
Dynamic text sizing where practical.
27. Testing

Frontend testing SHALL include, where appropriate:

Unit Tests
Component / Widget Tests
Integration Tests
End-to-End Tests
Accessibility Tests

Critical flows:

Authentication
Fayda Verification
Asset Registration
Lost Report
Missing Person Report
Payment
Recovery Completion

SHALL receive higher testing priority.

28. Frontend Definition of Done

A frontend feature is complete when:

[ ] React implementation complete where applicable
[ ] Flutter implementation complete where applicable
[ ] Figma design followed
[ ] Responsive/adaptive behavior implemented
[ ] Loading state implemented
[ ] Error state implemented
[ ] Empty state implemented
[ ] Validation implemented
[ ] Authorization UI implemented
[ ] Localization considered
[ ] Accessibility considered
[ ] Security requirements implemented
[ ] Tests added
[ ] Code reviewed
29. Core Principle

React and Flutter are two clients of the same Renite platform.

They SHALL share:

Product Rules
API Contracts
Identity Model
Security Requirements
Data Concepts
Design Principles

They MAY differ in:

Platform-specific UI
Navigation implementation
State-management implementation
Native capabilities
Responsive behavior

The goal is:

One Renite platform, two optimized client experiences.