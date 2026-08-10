# Renite Environment & Development Setup

## 1. Purpose

This document defines the standard local development environment for Renite.

Every contributor SHALL be able to clone the repository, configure the required environment, run their assigned application, and begin development without modifying project architecture.

---

## 2. Required Development Tools

Developers SHOULD have:

```text
Git
GitHub Account
VS Code or approved IDE
Node.js
npm / approved package manager
Flutter SDK
Dart SDK
Android Studio
Android SDK
Web Browser
```
Backend-specific tools SHALL be added after the backend stack is finalized.

# 3. Applications

Renite contains:

Web
React.js + TypeScript

Mobile
Flutter + Dart

Backend
API Server

Each application SHALL maintain its own dependencies and configuration.

4.Repository Setup

Clone the repository:
```
git clone https://github.com/Renite/renite.git
```
Enter the project:
```
cd Renite
```
Check Git:
```
git status
```
5. Web Setup

Enter the web application:
```
cd apps/web
```
Install dependencies:
```
npm install
```
Start development:
```
npm run dev
```
The exact commands SHALL follow the final React project configuration.

6. Mobile Setup

Enter the Flutter application:
```
cd apps/mobile
```
Install dependencies:
```
flutter pub get
```
Check Flutter:
```
flutter doctor
```
Run the application:
```
flutter run
```
Available devices can be checked with:
```
flutter devices
```
7. Backend Setup

Backend setup SHALL be documented after the backend technology is finalized.

The final setup SHALL include:

Runtime
Package Manager
Database
Environment Variables
External Services
Migration Commands
Seed Data
Development Server
Testing
8. Environment Files

Each application MAY have environment-specific configuration.

Example:
```
.env
.env.example
```
.env.example SHALL contain variable names without secrets.

Example:
```
API_BASE_URL=
MAP_API_KEY=
PAYMENT_PROVIDER=
```
Actual credentials SHALL be provided through the approved team secret-management process.

9. Never Commit Secrets

The following SHALL NEVER be committed:

Passwords
Private Keys
API Secrets
Database Passwords
Fayda Credentials
Payment Credentials
Cloud Credentials
Production Tokens

If a secret is accidentally committed, it SHALL be revoked and replaced immediately.

10. Development Environment

Local development SHALL use development services.

Developer Machine
       │
       ├── React Web
       ├── Flutter Mobile
       └── Backend
              │
              ↓
       Development Database

Production services SHALL NOT be used for ordinary development.

11. Environment Separation

Renite SHALL maintain:

Development
Testing / Staging
Production

Each environment SHALL have separate:

Credentials
Database
API Configuration
Storage
External Service Configuration
12. Local Database

Developers SHALL use a local or dedicated development database where practical.

Development data SHALL NOT contain unnecessary real personal information.

Use:

Synthetic Data
Test Accounts
Mock Data

for development.

13. Fayda Development

Real Fayda identity information SHALL NOT be used casually during development.

Development SHALL use the approved:

Sandbox
Test Environment
Mock Integration

when available.

The exact Fayda integration procedure SHALL be documented once the official integration is established.

14. Payment Development

Payment functionality SHALL use a test/sandbox environment during development.

Never use real payment credentials for local testing.

Test:

Successful Payment
Failed Payment
Cancelled Payment
Timeout
Duplicate Request
Webhook Verification
15. Map Development

Map services SHALL use development credentials and appropriate usage limits.

Developers SHALL avoid exposing private API keys in client-side source code where the provider's architecture does not permit it.

16. API Configuration

The frontend SHALL obtain the backend API base URL through configuration.

Example:

Development
API → localhost / development server

Staging
API → staging server

Production
API → production server

The API URL SHALL NOT be hardcoded throughout application code.

17. Code Formatting

Every application SHALL use an agreed formatter.

Developers SHALL format code before committing.

Examples:

React/TypeScript → Project-configured formatter
Flutter/Dart     → dart format
18. Linting

Linting SHALL be enabled.

Developers SHALL resolve:

Errors
Security warnings
Important lint warnings

before opening a pull request.

19. Testing Locally

Before creating a PR:

Web

Run the project's:

Lint
Type Check
Tests
Build
Mobile

Run:

Flutter Analyze
Tests
Build where applicable
Backend

Run:

Lint
Tests
Build
Migration Validation

according to the backend stack.

20. Clean Build

When dependency or generated-code issues occur, developers MAY perform the appropriate clean procedure.

Flutter:

flutter clean
flutter pub get

React:

rm -rf node_modules
npm install

On Windows, use the equivalent PowerShell/CMD command where necessary.

Do not use cleaning commands as the first solution to unrelated errors.

21. Dependency Management

Dependencies SHALL be added deliberately.

Before adding a package:

Check necessity
Check maintenance
Check security
Check license
Check compatibility

Dependency versions SHALL be committed through the project's lock files.

22. Local Development Services

If Renite requires local services, the team SHOULD document them in one place.

Example:

Backend
Database
Cache
Object Storage
Message Queue

The final list depends on the backend architecture.

23. Ports

Development services SHALL use documented ports.

Example:

Web       → documented frontend port
Backend   → documented API port
Database  → documented database port

The final values SHALL be recorded in the project README once the infrastructure is finalized.

24. Git Before Development

Before starting work:

git checkout develop
git pull origin develop
git checkout -b feature/your-feature

Developers SHALL avoid building features directly on main or develop.

25. First-Time Setup Checklist
[ ] Clone repository
[ ] Install Git
[ ] Install Node.js
[ ] Install Flutter
[ ] Configure Dart
[ ] Configure Android/iOS development where required
[ ] Install dependencies
[ ] Configure .env
[ ] Start development backend
[ ] Start web application
[ ] Start mobile application
[ ] Verify API connection
[ ] Run tests
[ ] Confirm Git workflow
26. New Developer Checklist

A new contributor is ready when they can:

[ ] Clone Renite
[ ] Create a branch
[ ] Run the web application
[ ] Run the mobile application
[ ] Connect to development API
[ ] Run tests
[ ] Create a commit
[ ] Push a branch
[ ] Create a Pull Request
27. Troubleshooting Rule

When encountering an issue:

1. Read the error
2. Reproduce the issue
3. Check project documentation
4. Check existing GitHub Issues
5. Search official documentation
6. Ask the responsible team member
7. Document the solution if it is reusable

Do not randomly modify project configuration until the issue disappears.

28. Development Data Privacy

Development data SHALL follow the same security principles as production.

Developers SHALL avoid placing real:

Identity Data
Location Data
Phone Numbers
Emails
Payment Data
Missing-Person Information

into repositories, screenshots, test fixtures, or logs.

29. Device Testing

Mobile developers SHOULD test on:

Android Physical Device
Android Emulator

where available.

Web developers SHOULD test:

Mobile viewport
Tablet viewport
Desktop viewport

and supported browsers.

30. Final Setup Principle

Every developer SHALL be able to reproduce the project environment from documented instructions.

If a developer needs undocumented personal knowledge to run Renite, the setup documentation is incomplete.