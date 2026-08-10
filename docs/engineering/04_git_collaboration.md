# Renite Git & GitHub Collaboration

## 1. Purpose

This document defines the mandatory Git and GitHub workflow for Renite.

The goal is to allow multiple developers to work simultaneously without overwriting each other's work or destabilizing the project.

---

## 2. Repository Structure

The repository SHALL contain the major project areas:

```text
Renite/
├── apps/
│   ├── web/              # React + TypeScript
│   └── mobile/           # Flutter + Dart
│
├── backend/
├── docs/
└── ...
```
Developers SHALL work only in the area assigned to them unless coordinated with the responsible team.

3. Main Branches

Renite SHALL use:

main
develop
feature/*
fix/*
hotfix/*
docs/*
main

Production-ready code only.

Direct pushes SHALL NOT be allowed.

develop

Integration branch for completed and reviewed development work.

Feature branches

Used for new functionality.

Example:

feature/authentication
feature/asset-reporting
feature/missing-person
feature/map
feature/chat
Fix branches

Used for bug fixes.

fix/login-validation
fix/map-loading
fix/report-upload
Documentation branches
docs/api-documentation
docs/security-guidelines
4. Branch Flow

Standard workflow:

main
  │
  └── develop
         │
         ├── feature/auth
         ├── feature/assets
         ├── feature/map
         └── feature/chat
                │
                ↓
             Pull Request
                │
                ↓
             Code Review
                │
                ↓
             develop
                │
                ↓
              Testing
                │
                ↓
               main
5. Creating a Branch

Always update your local develop first.

git checkout develop
git pull origin develop

Create your feature branch:

git checkout -b feature/your-feature

Example:

git checkout -b feature/asset-registration
6. Branch Naming

Use:

feature/<name>
fix/<name>
hotfix/<name>
docs/<name>
refactor/<name>
test/<name>

Use lowercase and hyphens.

Good:

feature/missing-person-report
fix/auth-token-refresh
docs/api-design

Avoid:

MyBranch
new-feature-final
test123
john-work
7. Commits

Commits SHALL describe one logical change.

Recommended format:

type: description

Examples:

feat: add asset registration
fix: resolve login validation error
docs: update API documentation
refactor: simplify authentication service
test: add asset service tests
chore: update dependencies

Avoid vague commits:

update
changes
final
done
stuff
8. Small Commits

Prefer several meaningful commits over one enormous commit.

Good:

feat: create asset model
feat: add asset registration API
test: add asset registration tests

Avoid:

feat: complete everything
9. Pull Before Push

Before pushing:

git pull --rebase origin develop

Resolve conflicts locally before creating a pull request.

10. Push

Push the branch:

git push -u origin feature/your-feature

After the first push:

git push
11. Pull Requests

All significant changes SHALL use Pull Requests.

A PR SHALL include:

Title
Description
Changes
Testing
Screenshots if UI changed
Security considerations where applicable
Known limitations
12. Pull Request Example
Title:
feat: add missing person reporting

Description:

### Changes
- Added missing person form
- Added image upload
- Added location selection
- Added API integration

### Testing
- Tested form validation
- Tested image upload
- Tested API response handling

### Security
- Added authorization checks
- Added upload validation
13. Code Review

At least one appropriate team member SHOULD review normal changes.

Critical areas SHOULD receive additional review:

Authentication
Authorization
Fayda
Payments
Location
Missing-person data
Security
Database migrations
Infrastructure

Reviewers SHALL check:

Correctness
Security
Architecture
Readability
Testing
Performance
Requirements
14. Never Merge Broken Code

A PR SHALL NOT be merged when:

Build fails
Critical tests fail
Security checks fail
Required review is missing
Major conflicts exist
15. Protected Branches

GitHub SHALL protect:

main
develop

Recommended rules:

No direct push.
Pull request required.
Required review.
CI checks required.
Force push disabled.
Branch deletion restrictions where appropriate.
16. Conflict Resolution

When a conflict occurs:

git fetch origin
git checkout develop
git pull origin develop

Update the feature branch:

git checkout feature/your-feature
git rebase develop

Resolve conflicts carefully.

Then:

git add .
git rebase --continue

After a rebase, push safely:

git push --force-with-lease

Never use:

git push --force

on shared branches.

17. Before Opening a PR

Every developer SHALL verify:

[ ] Latest develop merged/rebased
[ ] Project builds
[ ] Tests pass
[ ] No debug code
[ ] No secrets
[ ] No unnecessary files
[ ] Formatting applied
[ ] Linting passes
[ ] Security requirements checked
18. Secrets

NEVER commit:

.env
Private Keys
Passwords
API Secrets
Database Credentials
Fayda Credentials
Payment Secrets
Cloud Credentials

Use:

.env.example

for required variable names without actual secret values.

19. Git Ignore

The repository SHALL maintain an appropriate .gitignore.

Sensitive and generated files SHALL be excluded.

Examples:

.env
.env.*
node_modules/
build/
dist/
.dart_tool/
.flutter-plugins
coverage/
*.log

Project-specific rules SHALL be added as required.

20. Commit Security

Before committing, developers SHALL check for:

Passwords
Tokens
API Keys
Private URLs
Personal Data
Credentials

If a secret is accidentally committed:

Treat it as compromised immediately.

The secret SHALL be revoked/rotated rather than simply deleting it from the latest commit.

21. Work Ownership

Team members SHALL communicate before modifying another developer's active feature.

Avoid simultaneous conflicting edits to:

Core authentication
Database schema
Global configuration
Shared API contracts
Design system
Infrastructure

Changes to shared systems SHALL be coordinated.

22. API Contract Changes

When changing an API:

Backend Developer
        ↓
Update API Contract
        ↓
Notify Web + Mobile Developers
        ↓
Update Clients
        ↓
Test

Breaking API changes SHALL NOT be introduced without coordination.

23. Database Changes

Database schema changes SHALL be:

Documented
Versioned
Reviewed
Tested

Developers SHALL NOT manually modify production databases without an approved procedure.

24. UI Collaboration

When implementing Figma designs:

Figma
 ↓
UI/UX Specification
 ↓
Frontend Implementation
 ↓
Review

If implementation differs from the design because of technical limitations, the developer SHALL communicate the difference rather than silently changing the design.

25. Issue Tracking

Each significant task SHOULD have a GitHub Issue.

Example:

[Feature] Asset Registration
[Bug] Login token expires incorrectly
[Security] Validate report image uploads
[Docs] Update API documentation

Issues SHOULD contain:

Description
Requirements
Acceptance Criteria
Priority
Assignee
Related PR
26. Labels

Recommended labels:

feature
bug
security
frontend
backend
mobile
web
documentation
ui/ux
database
urgent
good-first-issue
27. Development Ownership

The team SHOULD assign ownership for major areas.

Example:

Web
├── Authentication
├── Assets
├── Reports
└── Dashboard

Mobile
├── Authentication
├── Assets
├── Missing Persons
└── Notifications

Backend
├── API
├── Database
├── Authentication
└── Integrations

Security
├── OWASP
├── Identity
└── Security Testing

Ownership does not prevent collaboration.

28. Emergency Hotfix

For critical production problems:

main
 ↓
hotfix/<issue>
 ↓
Fix
 ↓
Review
 ↓
Deploy
 ↓
Merge back into main
 ↓
Merge back into develop

Hotfixes SHALL be used only for urgent issues.

29. Release Flow

Standard release:

feature/*
    ↓
Pull Request
    ↓
develop
    ↓
Integration Testing
    ↓
Release Candidate
    ↓
main
    ↓
Production
30. Definition of Team Responsibility

Every developer is responsible for:

Their Code
Their Tests
Their Security
Their Documentation
Their Branch
Their Pull Request

"Someone else will fix it" is not an acceptable development workflow.

31. Final Rule

Renite SHALL prioritize:

Small Changes
Clear Commits
Reviewed Code
Protected Branches
No Secrets
Tested Features
Secure Collaboration

Never sacrifice repository stability for development speed.