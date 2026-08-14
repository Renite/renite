<div align="center">
  <img src="renite-logo.png" alt="Renite Logo" width="280" style="border-radius: 8px;" />

  <h1>
    <strong>RENITE</strong>
    <br>
    <sub>🛡️ Nationwide Lost & Found, Missing Persons & Civic Safety Platform</sub>
  </h1>
</div>

<p align="center">
  <em>
    A secure, verification-driven national platform connecting citizens,
    communities, and authorized organizations to report, discover,
    verify, and recover lost assets and missing persons.
  </em>
</p>

<p align="center">
  <a href="#-key-features">
    <img src="https://img.shields.io/badge/Features-1D5061?style=for-the-badge&logo=checkmarx&logoColor=white" />
  </a>
  <a href="#-technology-stack">
    <img src="https://img.shields.io/badge/Tech_Stack-1D5061?style=for-the-badge&logo=codecov&logoColor=white" />
  </a>
  <a href="#-development">
    <img src="https://img.shields.io/badge/Development-1D5061?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="#-security">
    <img src="https://img.shields.io/badge/Security-1D5061?style=for-the-badge&logo=owasp&logoColor=white" />
  </a>
</p>

---

# 🇪🇹 Project Overview

Renite is a **nationwide digital recovery and civic safety platform** designed to connect citizens, communities, and authorized organizations through one trusted system.

Renite addresses two major problems:

- Lost and stolen assets that are difficult to recover.
- Missing-person cases that lack a unified digital coordination layer.

Instead of limiting recovery to a single school, company, campus, or institution, Renite is designed as a **national network** where a lost item or missing-person report can be discovered and acted upon regardless of where it was originally reported.

```text
Citizen
   │
   ├── Register Material/device
   ├── Report Lost Asset
   ├── Report Found Asset
   ├── Report Missing Person
   ├── Search
   ├── Verify
   └── Request Recovery
          │
          ▼
       RENITE
          │
    ┌─────────┬─────────────────┐
    ▼         ▼                 ▼
 Citizens Communities Authorized Organizations
              │
              ▼
     National Recovery Network
```

Renite combines:

- Fayda-assisted identity verification
- Secure user accounts
- Lost & found asset registration
- Missing-person reporting
- AI-assisted matching
- Location intelligence
- Secure communication
- Recovery verification
- Nationwide shipping
- Payments and recovery bounties
- Rewards and referrals
- Multilingual accessibility
- Security based on OWASP principles

# 🎯 Vision

Build a trusted national digital infrastructure where people can report, discover, verify, and safely recover lost assets or missing persons.

Renite aims to transform fragmented recovery activities into a connected national recovery network.

# 🚨 The Problems Renite Solves

## Lost Assets

People regularly lose:

- Smartphones
- Laptops
- Tablets
- Documents
- Electronics
- Personal belongings
- Other valuable assets

Existing recovery methods are often fragmented across social media, messaging groups, local communities, institutions, and informal networks.

Renite provides a centralized recovery workflow.

## Missing Persons

Families and communities can struggle to:

- Report missing persons quickly
- Share reliable information
- Coordinate searches
- Discover relevant reports
- Track case progress
- Connect with authorized organizations

Renite provides a digital coordination layer for these processes.

## Fragmented Recovery Information

Information can become scattered across:

- Social media
- Messaging apps
- Community groups
- Institutions
- Local organizations
- Authorities

Renite brings relevant information into one structured platform.

# 🔑 Key Features

## 🛡️ 1. Identity & Security

Renite maintains its own application user database while using Fayda as a mandatory secondary identity-verification mechanism.

```text
Renite Registration
        │
        ▼
Renite User Account
        │
        ▼
Fayda Verification
        │
        ▼
Verified Renite Account
```

Features include:

- Secure authentication
- Fayda verification
- Role-based access control
- Session protection
- Data minimization
- Privacy controls
- Audit logging
- Secure API access
- OWASP-aligned security practices

Sensitive identity information SHALL only be collected and stored when required.

## 💻 2. Digital Asset Registration

Users can register their valuable belongings before or after they are lost.

Supported assets may include:

- Smartphones
- Laptops
- Tablets
- Electronics
- Documents
- Other registered belongings

Asset information can include:

- Brand
- Model
- Category
- Serial number
- IMEI / MAC
- Photos
- Description
- Distinguishing features
- QR / recovery token

Sensitive identifiers are protected and are not publicly exposed.

## 🔴 3. Report Lost Asset

Users can report an asset as lost.

A report may contain:

- Asset information
- Photos
- Description
- Last known location
- Date and time
- Relevant identifying information

The report enters the Renite recovery and matching workflow.

```text
Report Lost
     ↓
Verification
     ↓
Matching
     ↓
Potential Match
     ↓
Ownership Verification
     ↓
Recovery
```

## 🟢 4. Report Found Asset

Anyone who finds an item can submit a found-item report.

A found report can include:

- Photos
- Category
- Description
- Found location
- Date and time
- Distinguishing characteristics

The finder does not need access to the owner's private information.

## 🤖 5. AI-Assisted Matching

Renite can use AI to identify potential relationships between lost and found reports.

Potential matching signals include:

- Images
- Asset category
- Brand
- Model
- Description
- Location
- Time
- Identifiers
- Distinguishing features

AI may assist with:

- Image classification
- Object recognition
- Similarity matching
- Report categorization
- Potential duplicate detection
- Fraud/anomaly detection

> **Important**
> AI matching is not automatic proof of ownership.
> Final recovery decisions require an appropriate verification process.

## 👤 6. Missing-Person Reporting

Renite provides a dedicated missing-person workflow.

Reports may include:

- Name
- Photograph
- Description
- Last-known location
- Last-seen time
- Relevant identifying information
- Case status

```text
Report
  ↓
Verification
  ↓
Case Creation
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

Sensitive information is restricted according to authorization.

## 🚨 7. Emergency & Safety Coordination

Renite can support emergency-oriented reporting and coordination.

Depending on authorization and future integrations, relevant cases may involve:

- Emergency contacts
- Community responders
- Authorized investigators
- Local organizations
- Government or law-enforcement organizations

Renite does not replace official emergency or law-enforcement systems.

It provides a digital coordination and information layer.

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

<p align="center">
  <strong>RENITE</strong>
  <br>
  Reclaim What's Yours. Help Bring Them Home.
  <br><br>
  <img src="https://img.shields.io/badge/Status-Development-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Version-v1.0.0--alpha-blue?style=flat-square" />
</p>