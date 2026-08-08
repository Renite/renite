# Communication Plan

| Property | Value |
|----------|-------|
| Project | Renite |
| Document | Communication Plan |
| Document ID | PLN-010 |
| Version | 1.0.0 |
| Status | Approved |
| Owner | Renite Core Team |
| Category | Planning |
| Last Updated | August 2026 |

---

# 1. Purpose

This document defines the official communication rules for the Renite project.

The purpose is to ensure that:

- Information reaches the correct people.
- Decisions are not lost.
- Blockers are reported quickly.
- Departments remain synchronized.
- Important project information is stored permanently.
- Communication does not become dependent on private conversations.

---

# 2. Communication Principles

Renite SHALL follow these principles:

1. Important information SHALL be documented.
2. Project decisions SHALL NOT exist only in chat.
3. Tasks SHALL be tracked in the project management system.
4. Code-related discussions SHALL occur near the relevant code or pull request.
5. Urgent blockers SHALL be communicated immediately.
6. Contributors SHALL avoid unnecessary communication duplication.
7. Communication SHALL remain respectful and professional.

---

# 3. Official Communication Channels

Renite communication SHALL be divided according to purpose.

| Communication Type | Official Location |
|---------------------|-------------------|
| Source Code | GitHub |
| Issues | GitHub Issues |
| Pull Requests | GitHub Pull Requests |
| Architecture | `docs/architecture/` |
| Product Requirements | `docs/product/` |
| UI/UX | `docs/design/` |
| Decisions | `docs/planning/09_decision_log.md` |
| Risks | `docs/planning/08_risk_management.md` |
| Team Coordination | Team Chat |
| Urgent Blockers | Team Chat + Issue |
| Releases | GitHub Releases / Documentation |

---

# 4. Communication Priority

Communication SHALL use the following priority levels.

## Critical

Immediate attention required.

Examples:

- Security breach
- Production outage
- Data loss
- Critical blocker
- User safety issue

Action:

```text
Immediate Team Notification
        +
Issue / Incident Record
```

---

## High

Important but not immediately dangerous.

Examples:

- Major API failure
- Architecture blocker
- Milestone risk
- Major bug

Action:

```text
Team Channel
      +
Issue
```

---

## Normal

Routine development communication.

Examples:

- Questions
- Progress
- Code discussion
- Design feedback

Action:

```text
Relevant Team Channel
or
GitHub Issue / PR
```

---

## Low

Non-urgent information.

Examples:

- Suggestions
- Future ideas
- Documentation improvements

Action:

```text
Issue
or
Planning Documentation
```

---

# 5. Daily Standup

The team SHALL conduct a short daily synchronization.

Each contributor SHALL provide:

```text
Yesterday:
What was completed?

Today:
What will be worked on?

Blocked:
What is preventing progress?
```

The standup SHALL focus on coordination rather than long technical discussions.

Technical discussions SHALL be moved to the appropriate channel or issue.

---

# 6. Daily Progress Reporting

Each department SHALL maintain visible progress.

Example:

```text
UI/UX
✓ Authentication screens
✓ Report form
→ Search screen
⚠ Waiting for API response format
```

Progress SHALL be updated regularly during the two-week development cycle.

---

# 7. Blocker Communication

A blocker SHALL be reported immediately when it prevents work.

A blocker message SHOULD contain:

```text
BLOCKER

Task:
What is blocked?

Problem:
What happened?

Dependency:
What is required?

Impact:
Who or what is affected?

Priority:
Critical / High / Normal
```

---

# 8. Example Blocker

```text
BLOCKER

Task:
Frontend report submission

Problem:
The API returns a different field name than the documented contract.

Dependency:
Backend API clarification.

Impact:
Frontend report submission cannot be completed.

Priority:
High
```

The responsible department SHALL respond as soon as practical.

---

# 9. Department Communication

Each department SHALL maintain communication relevant to its work.

Examples:

```text
#ui-ux
#frontend
#backend
#mobile
#ai
#database
#devops
#qa
#security
```

Channels MAY be combined when the team is small.

---

# 10. Cross-Department Communication

When communication affects multiple departments, the relevant departments SHALL be included.

Example:

```text
Backend
    │
    │ API change
    ▼
Frontend
    │
    │ UI impact
    ▼
UI/UX
```

Major cross-department changes SHALL be documented.

---

# 11. Handoff Rules

A department SHALL provide enough information for another department to continue work.

A handoff SHOULD include:

- Objective
- Input
- Output
- Constraints
- Dependencies
- Status
- Known issues

---

# 12. UI/UX → Frontend Handoff

UI/UX SHALL provide:

- Final designs
- Component specifications
- Responsive behavior
- Typography
- Colors
- Spacing
- Interaction states
- Error states
- Loading states

Frontend SHALL NOT be expected to infer critical behavior from screenshots alone.

---

# 13. Backend → Frontend Handoff

Backend SHALL provide:

- Endpoint
- HTTP method
- Authentication requirements
- Request format
- Response format
- Error format
- Validation rules
- Example request/response

Example:

```text
POST /api/reports

Authentication:
Required

Request:
{
  "title": "...",
  "description": "...",
  "categoryId": "..."
}

Response:
{
  "id": "...",
  "status": "active"
}
```

---

# 14. AI → Backend Handoff

AI SHALL provide:

- Model/service purpose
- Input format
- Output format
- Confidence information
- Failure behavior
- Processing requirements
- Known limitations

Backend SHALL treat AI output as untrusted input.

---

# 15. Backend → QA Handoff

Backend SHALL provide:

- API documentation
- Test environment
- Authentication requirements
- Test accounts where necessary
- Expected responses
- Known limitations

---

# 16. Design Feedback

Design feedback SHALL be specific.

Bad:

```text
The UI doesn't look good.
```

Good:

```text
The report form does not clearly indicate which fields are required.
Add a visible required indicator and validation message.
```

Feedback SHALL identify the problem rather than only expressing preference.

---

# 17. Code Communication

Technical code discussions SHOULD occur in:

- Pull Requests
- Issues
- Code review comments

Important implementation decisions SHALL be transferred into the appropriate documentation.

---

# 18. Pull Request Communication

A Pull Request SHALL contain:

```text
Summary
Changes
Reason
Testing
Screenshots if UI-related
Known Issues
Related Issue
```

Example:

```text
## Summary

Implemented lost-item reporting.

## Changes

- Added report form
- Added image upload
- Added API integration

## Testing

- Registration
- Report creation
- Validation

## Related

Closes #42
```

---

# 19. Issue Communication

Issues SHALL be used for:

- Bugs
- Features
- Tasks
- Improvements
- Research
- Documentation work

Issues SHOULD contain:

- Title
- Description
- Expected behavior
- Actual behavior where applicable
- Acceptance criteria
- Priority
- Assignee
- Milestone

---

# 20. Meeting Rules

Meetings SHALL have:

- Purpose
- Participants
- Agenda
- Time limit
- Decisions
- Action items

A meeting SHALL NOT be used when asynchronous communication is sufficient.

---

# 21. Meeting Notes

Important meetings SHALL produce notes containing:

```text
Date:
Participants:

Agenda:

Discussion:

Decisions:

Action Items:

Owners:

Deadlines:
```

Major decisions SHALL also be transferred to the Decision Log.

---

# 22. Communication During the Two-Week Sprint

The minimum communication cycle SHALL be:

```text
Morning
  ↓
Daily Planning

During Work
  ↓
Department Communication

Blocker
  ↓
Immediate Escalation

End of Day
  ↓
Progress Update

Milestone
  ↓
Review
```

---

# 23. Response Expectations

Contributors SHOULD respond to normal project communication within a reasonable working period.

Critical blockers SHALL receive immediate attention when the responsible person is available.

No contributor SHALL be expected to provide continuous availability outside agreed working periods.

---

# 24. Respectful Communication

Renite communication SHALL remain:

- Professional
- Constructive
- Clear
- Respectful
- Evidence-based

Personal attacks, harassment, insults, or hostile communication SHALL NOT be accepted.

Technical disagreement SHALL focus on the work, not the person.

---

# 25. Avoiding Communication Overload

Contributors SHOULD avoid:

- Repeating the same message across multiple channels.
- Tagging unrelated team members.
- Sending unnecessary notifications.
- Starting duplicate discussions.
- Keeping important decisions only in temporary chat.

---

# 26. Information Classification

Information SHALL be classified when appropriate.

| Level | Example |
|-------|---------|
| Public | General project information |
| Internal | Development discussions |
| Confidential | Credentials, private user information |
| Restricted | Security incidents, sensitive personal data |

Confidential and Restricted information SHALL NOT be posted in public repositories or public communication channels.

---

# 27. Secrets

The following SHALL NEVER be shared through normal team communication:

- Passwords
- API secrets
- Private keys
- Authentication tokens
- Database credentials
- Production credentials

Secrets SHALL use an approved secure mechanism.

---

# 28. Communication Escalation

Communication SHALL follow:

```text
Contributor
    ↓
Department Lead
    ↓
Project / Product / Technical Lead
    ↓
Core Team
```

Security incidents SHALL bypass normal escalation delays when immediate action is required.

---

# 29. Communication Failure

If a communication failure causes:

- Missed deadlines
- Duplicate work
- Broken integration
- Security problems
- Incorrect implementation

The team SHALL document the cause and improve the communication process.

---

# 30. Documentation Rule

If information is important enough to affect future work, it SHALL be stored somewhere permanent.

Examples:

```text
Decision
→ Decision Log

Architecture
→ Architecture Documentation

Requirement
→ Product Documentation

Risk
→ Risk Register

Bug
→ Issue

Code Discussion
→ Pull Request / Issue
```

---

# 31. Communication During Release

Before release, the following SHALL be communicated:

- Release version
- Changes
- Known issues
- Testing status
- Deployment status
- Rollback plan
- Responsible person

---

# 32. Emergency Communication

For critical incidents:

```text
Detect
  ↓
Notify
  ↓
Contain
  ↓
Investigate
  ↓
Recover
  ↓
Document
  ↓
Review
```

Contributors SHALL NOT conceal incidents to protect project reputation.

---

# 33. Communication Ownership

| Communication | Owner |
|---------------|-------|
| Project updates | Project Lead |
| Product updates | Product Lead |
| Technical updates | Technical Lead |
| UI/UX updates | UI/UX Lead |
| Release updates | DevOps + Project Lead |
| Security incidents | Security Lead |
| QA status | QA Lead |
| Documentation | Documentation Lead |

---

# 34. Related Documents

- `01_project_charter.md`
- `05_team_structure.md`
- `06_roles_and_responsibilities.md`
- `07_project_timeline.md`
- `08_risk_management.md`
- `09_decision_log.md`
- `13_change_management.md`

---

# 35. Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | August 2026 | Initial Communication Plan. |

---

# Approval

**Status:** APPROVED

**Approved By:** Renite Core Team

---

**End of Document**