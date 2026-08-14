<div align="center">
  <img src="./renite-logo.png" alt="Renite Logo" width="280" style="border-radius: 8px;" />

  <h1>
    <strong>RENITE</strong>
    <br>
    <sub>🇪🇹 Nationwide Lost & Found, Missing Persons & Civic Safety Platform</sub>
  </h1>
</div>

<p align="center">
  <em>
    A secure, verification-driven platform connecting citizens, communities,
    and authorized organizations to report, discover, verify, and recover
    lost assets and missing persons.
  </em>
</p>

<p align="center">
  <a href="#-project-overview"><img src="https://img.shields.io/badge/Overview-1D5061?style=for-the-badge&logo=readme&logoColor=white" /></a>
  <a href="#-main-features"><img src="https://img.shields.io/badge/Features-1D5061?style=for-the-badge&logo=checkmarx&logoColor=white" /></a>
  <a href="#-technology-stack"><img src="https://img.shields.io/badge/Tech_Stack-1D5061?style=for-the-badge&logo=codecov&logoColor=white" /></a>
  <a href="#-team-members"><img src="https://img.shields.io/badge/Team-1D5061?style=for-the-badge&logo=github&logoColor=white" /></a>
</p>

---

## 📌 Project Overview

**Renite** is a nationwide digital platform designed to help people **report, discover, verify, and recover lost assets and missing persons** through a secure and connected recovery network.

Unlike traditional lost-and-found systems that are limited to a campus, school, or organization, Renite is designed to operate at a **national level**, connecting citizens, communities, and authorized organizations.

The platform combines identity verification, AI-assisted matching, location intelligence, secure communication, recovery coordination, and community participation into one system.

---

## 🧩 The Problem Our Project Solves

People lose valuable belongings such as smartphones, laptops, tablets, documents, and other personal assets every day. At the same time, families and communities may struggle to coordinate information when someone goes missing.

Current recovery methods are often scattered across:

* Social media
* Messaging groups
* Local communities
* Institutions
* Informal lost-and-found systems

These approaches can make information difficult to verify, expose sensitive personal data, and reduce the chances of successful recovery.

**Renite addresses this problem by providing a centralized, secure, and verification-driven platform for nationwide recovery and civic safety.**

---

## ⚙️ Main Features We Plan to Develop

* **🛡️ Identity & Security**
  Secure Renite accounts with **Fayda as a mandatory secondary identity-verification mechanism**, while Renite maintains its own detailed user database and profile.

* **📱 Lost & Found Assets**
  Users can register valuable assets such as phones, laptops, tablets, and other belongings, then report them as lost or found.

* **👤 Missing-Person Reporting**
  Users can create missing-person reports with relevant information, photographs, locations, and case status while maintaining controlled access to sensitive data.

* **🤖 AI-Assisted Matching**
  AI and computer vision can assist in identifying potential matches between lost and found assets and help organize recovery information.

* **🗺️ National Location Intelligence**
  Map-based discovery for authorized lost-and-found activity, missing-person cases, nearby reports, and relevant safety information.

* **💬 Secure Communication**
  Controlled communication between owners, finders, communities, and authorized participants without unnecessarily exposing private contact information.

* **🚚 Recovery & Nationwide Shipping**
  Support verified handoffs, recovery coordination, delivery, and nationwide shipping for recovered assets.

* **💰 Payments & Rewards**
  Support recovery bounties, shipping payments, loyalty rewards, and community participation.

* **🌐 Multilingual Support**
  Designed to support English, Amharic, Oromo, Tigrinya, Somali, Arabic, and Swahili, including both LTR and RTL interfaces.

* **🔐 OWASP-Oriented Security**
  Security-by-design practices including authentication, authorization, input validation, rate limiting, secure file handling, privacy protection, and audit logging.

---

## 🛠️ Technology Stack

| Platform     | Technology                             |
| ------------ | -------------------------------------- |
| 🌐 Web       | React + JavaScript                     |
| 📱 Mobile    | Flutter + Dart                         |
| ⚙️ Backend   | REST API + Business Logic              |
| 🗄️ Database | Secure Persistent Data Layer           |
| 🤖 AI        | Computer Vision / Intelligent Matching |
| 🪪 Identity  | Fayda + Renite Account System          |

---

## 👥 Team Members

| 👤 Full Name     | 🆔 CTC Number | 🏫 Classroom |
| ---------------- | ------------- | -----------: |
| Chera Tolosa     | CTC-716-26    |            2 |
| Dagimawi Solomon | CTC-6567-26   |            2 |
| Dibora Sisay     | CTC-1457-26   |            2 |
| Eden Alemayehu   | CTC-1941-26   |            2 |
| Edom Anteneh     | CTC-1717-26   |            2 |

---

## 🤝 Contribution

Renite is developed collaboratively using GitHub.

Expected to follow the project's:

* Branching strategy
* Repository rulesets
* Issue tracking process
* Pull request requirements
* Code review standards
* CI requirements
* Security guidelines

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more.

<<<<<<< HEAD
## 🗺️ 8. National Map & Location Intelligence

Renite provides location-based discovery.

Depending on authorization, the map can display:

- Found assets
- Lost reports
- Missing-person activity
- Community safety information
- Recovery activity
- Relevant nearby reports

Sensitive exact locations SHALL remain protected.

## 📍 9. Location Intelligence

Location information can assist with:

- Last-known asset location
- Found-item location
- Missing-person last-seen location
- Recovery coordination
- Nearby discovery
- National activity visualization

Location data is classified as sensitive information.

## 💬 10. Secure Communication

Renite provides controlled communication between authorized participants.

```text
Asset Owner
     │
     ▼
Renite Secure Chat
     │
     ▼
Finder
```

The platform is designed to avoid unnecessarily exposing:

- Phone numbers
- Email addresses
- Private addresses
- Other sensitive contact information

## 🚚 11. Nationwide Recovery & Shipping

A recovered item does not necessarily need to be returned in person.

Example:

```text
Asset Found
    │
    ▼
Finder Location
    │
    ▼
Owner Location
    │
    ▼
Shipping Request
    │
    ▼
Payment
    │
    ▼
Delivery
    │
    ▼
Recovery Confirmation
```

Future logistics integrations may support:

- Local delivery
- Nationwide shipping
- Tracking
- Delivery confirmation
- Pickup points
- Recovery handoff locations

## 💰 12. Payments & Recovery Bounties

Renite can support financial workflows related to recovery.

Examples:

- Recovery rewards
- Shipping fees
- Delivery fees
- Optional bounties
- Supported platform services

Payment status SHALL always be verified by the backend.

The client SHALL never be trusted to declare a payment successful.

## ⭐ 13. Rewards & Community Participation

Renite encourages responsible participation through:

- Recovery rewards
- Loyalty points
- Referral programs
- Community contribution
- Verified recovery achievements

Example:

```text
Find Item
   ↓
Report Item
   ↓
Successful Recovery
   ↓
Verified Contribution
   ↓
Reward
```

## 🌐 14. Multilingual National Platform

Renite is designed for a multilingual population.

The platform is intended to support:

- English
- Amharic
- Oromo
- Tigrinya
- Somali
- Arabic
- Swahili

The UI architecture SHALL support:

- LTR
- RTL

The system should also accommodate variable text lengths across languages.

# 🔐 Security

Security is a core requirement of Renite.

Renite follows a security-by-design approach informed by:

- OWASP Top 10
- OWASP API Security
- OWASP Mobile Application Security
- Secure authentication
- Authorization
- Input validation
- Rate limiting
- Encryption
- Secure file handling
- Audit logging
- Data minimization
- Least privilege

Sensitive information includes:

- Identity information
- Fayda verification information
- Location data
- Missing-person information
- Asset identifiers
- Payment information
- Private messages

Such information SHALL receive appropriate access controls and protection.

# 🧠 Privacy by Design

Renite follows:

```text
Collect Minimum
       ↓
Protect Strongly
       ↓
Expose Minimum
       ↓
Retain Only When Necessary
       ↓
Delete When Appropriate
```

Sensitive information SHALL not be unnecessarily exposed to:

- Other users
- Finders
- Public visitors
- Administrators without authorization
- External services

# 🏗️ Technology Stack

## 🌐 Web

- React
- TypeScript

The web application will serve:

- Citizens
- Communities
- Authorized organizations
- Moderators
- Administrators
- Operational teams

## 📱 Mobile

- Flutter
- Dart

The mobile application focuses on:

- Reporting
- Location
- Notifications
- Map interaction
- Asset management
- Recovery
- Community participation

## ⚙️ Backend

The backend provides:

- Authentication
- Authorization
- Business logic
- REST API
- Database access
- Identity verification
- Matching
- Notifications
- Recovery
- Payments
- Security
- Audit logging

## 🗄️ Database

The database architecture supports:

- Users
- Identity verification
- Assets
- Lost reports
- Found reports
- Missing-person cases
- Recovery cases
- Locations
- Conversations
- Messages
- Notifications
- Rewards
- Payments
- Audit logs

## 🏛️ System Architecture

```text
                    RENITE
                       │
          ┌────────────┴────────────┐
          │                         │
      Web Client               Mobile Client
   React + TypeScript         Flutter + Dart
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
                  REST API
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
 Authentication     Core Services    Security
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                    Database
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      Fayda          AI/ML        External Services
   Verification     Matching       Maps / Payment /
                                  Notifications
```

# 📱 Application Experience

The primary navigation is designed around:

- Home
- Map
- Messages
- Profile

The main dashboard can provide access to:

- Report lost
- Report found
- Report missing person
- Nearby activity
- National alerts
- Recovery cases
- Notifications
- Rewards
- Community activity

# 🔄 Core Recovery Flow

## Lost Asset

```text
Register Asset
      ↓
Report Lost
      ↓
Matching
      ↓
Potential Match
      ↓
Verification
      ↓
Recovery
      ↓
Shipping / Handoff
      ↓
Recovered
```

## Found Asset

```text
Find Item
    ↓
Report Found
    ↓
Upload Information
    ↓
Matching
    ↓
Owner Verification
    ↓
Recovery Coordination
    ↓
Handoff / Shipping
    ↓
Recovered
```

## Missing Person

```text
Report Missing
      ↓
Required Verification
      ↓
Case Created
      ↓
Authorized Visibility
      ↓
Community / Organization Coordination
      ↓
Potential Information
      ↓
Person Located
      ↓
Case Resolution
```

# 🧭 Product Areas

```text
Renite
│
├── Authentication
│   ├── Registration
│   ├── Login
│   └── Fayda Verification
│
├── Home
│   ├── National Safety Hub
│   ├── Alerts
│   └── Community Activity
│
├── Lost & Found
│   ├── My Assets
│   ├── Report Lost
│   ├── Report Found
│   └── Matching
│
├── Missing Persons
│   ├── Report
│   ├── Cases
│   └── Case Coordination
│
├── Map
│   ├── Lost Assets
│   ├── Found Assets
│   └── Safety Activity
│
├── Recovery
│   ├── Verification
│   ├── Handoff
│   └── Shipping
│
├── Communication
│   ├── Secure Chat
│   └── Notifications
│
├── Community
│   ├── Rewards
│   └── Referrals
│
└── Profile
    ├── Personal Information
    ├── Verification
    ├── Security
    └── Privacy
```

# 🗃️ Core Data Model

```text
User
 ├── IdentityVerification
 ├── Assets
 ├── Lost/Found Reports
 ├── Missing Person Cases
 ├── Recovery Cases
 ├── Conversations
 ├── Notifications
 ├── Reward Wallet
 └── Payments

Asset
 └── Recovery Reports

Recovery Report
 └── Recovery Case

Recovery Case
 └── Conversation

Conversation
 └── Messages
```

Sensitive information such as identity references, exact locations, private contact information, asset identifiers, and payment information SHALL receive additional protection.

# 🔄 Enhanced Reporting Flow

```text
Report Lost / Found
        ↓
Input Validation
        ↓
AI Categorization
        ↓
Asset / Person Classification
        ↓
Potential Matching
        ↓
Notification
        ↓
Verification
        ↓
Recovery Coordination
        ↓
Handoff / Shipping
        ↓
Recovery Complete
```

# 🧠 Future AI Capabilities

Renite's architecture can later support:

- Computer vision
- Image similarity
- Object recognition
- Facial recognition where legally and ethically permitted
- Semantic search
- Fraud detection
- Anomaly detection
- Duplicate case detection
- Intelligent matching
- Location-based prediction

AI SHALL remain an assistive system and SHALL NOT independently make high-impact identity or ownership decisions.

# 🔌 Future Integrations

Renite can progressively integrate with:

- Fayda
- Maps & location services
- Payment providers
- SMS providers
- Email providers
- Push notification services
- Logistics providers
- Government / authorized organizations
- IoT devices
- Hardware recovery tags

Integrations SHALL follow appropriate authorization, privacy, security, and legal requirements.

# 📂 Repository Structure

```text
Renite/
│
├── apps/
│   ├── web/                  # React + JavaScript
│   └── mobile/               # Flutter + Dart
│
├── backend/                  # Backend API
│
├── docs/
│   ├── planning/
│   ├── product/
│   ├── architecture/
│   ├── engineering/
│   └── security/
│
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── CODEOWNERS
│
├── README.md
└── LICENSE
```

# 🛠️ Development Principles

Renite follows:

- Security by design
- Privacy by design
- API-first development
- Feature-based architecture
- Strong typing
- Automated testing
- Code review
- Continuous integration
- Least privilege
- Data minimization

All production code SHALL pass the project's required CI and review checks.

# 🚀 Development Status

Renite is currently under active development.

Current implementation priorities:

```text
Authentication
      ↓
Fayda Verification
      ↓
Database
      ↓
Backend API
      ↓
React Web
      ↓
Flutter Mobile
      ↓
Lost & Found
      ↓
Matching
      ↓
Recovery
      ↓
Missing Persons
      ↓
Security & Testing
      ↓
National MVP
```

# 🤝 Contribution

Renite is developed through structured team collaboration.

Contributors are expected to follow:

- Branching strategy
- Repository rulesets
- Pull request requirements
- Code review requirements
- CI requirements
- Security requirements
- Commit conventions
- Architecture guidelines

Security-sensitive changes require appropriate review.

# 🛡️ Security Reporting

Security vulnerabilities SHALL NOT be disclosed through ordinary public GitHub issues.

Security reports should use the organization's private security-reporting process.

# ⚠️ Important Scope

Renite is a civic technology, safety, and recovery platform.

It does not replace:

- Police systems
- Emergency services
- Government identity systems
- Courts
- Official investigations
- Existing financial institutions

Renite provides a digital coordination, reporting, discovery, verification, and recovery layer that can work alongside authorized services.

# 📊 Initial Success Metrics

The MVP will measure:

| Metric | Goal |
|---|---|
| Successful recovery | Increase over time |
| Time to recovery | Reduce |
| False claims | Minimize |
| Successful identity verification | High reliability |
| Matching accuracy | Continuously improve |
| Report processing time | Reduce |
| Platform availability | High |
| Security incidents | Minimize |

Exact numerical targets SHALL be established after the MVP baseline is available.

# 🇪🇹 National Impact

Renite is designed to grow from an initial MVP into a nationwide recovery network.

```text
Citizen
   ↓
Community
   ↓
City
   ↓
Region
   ↓
Nationwide Network
```

The long-term goal is to make recovery information more accessible while maintaining strong privacy, security, and verification controls.

# ❤️ Our Mission

A lost item should not have to remain lost, and a missing person should not become a forgotten case.

Renite connects people, information, technology, and services to move from:

```text
REPORT
   ↓
DISCOVER
   ↓
VERIFY
   ↓
RECOVER
```

🇪🇹 One platform. One recovery network. A safer connected nation.
=======
---
>>>>>>> d601a63703fbe370741f68ae4f7214782b9c6e35

<p align="center">
  <strong>RENITE</strong>
  <br>
  <em>Reclaim What's Yours. Help Bring Them Home.</em>
  <br><br>
  <img src="https://img.shields.io/badge/Status-Development-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Version-v1.0.0--alpha-blue?style=flat-square" />
</p>
