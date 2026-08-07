<div align="center">
   <img src="renite-logo.png" alt="Renite Logo" width="280" style="border-radius: 8px;" />

  <h1>
    <strong>RENITE</strong>
    <br>
    <sub>🛡️ Enterprise & Campus Electronics Lost and Found</sub>
  </h1>
</div>

<p align="center">
  <em>Smart, Verification-Driven Electronics Recovery Platform with AI Device Recognition, Blockchain Verification, and Loyalty-Based Logistics.</em>
</p>

<p align="center">
  <a href="#-key-features"><img src="https://img.shields.io/badge/Features-1D5061?style=for-the-badge&logo=checkmarx&logoColor=white" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tech_Stack-1D5061?style=for-the-badge&logo=codecov&logoColor=white" /></a>
  <a href="#-setup-guide"><img src="https://img.shields.io/badge/Setup-1D5061?style=for-the-badge&logo=gnu-bash&logoColor=white" /></a>
  <a href="#-unique-differentiators"><img src="https://img.shields.io/badge/USP-1D5061?style=for-the-badge&logo=star&logoColor=white" /></a>
</p>

---

## 📌 Project Overview

Losing high-value electronics like PCs, laptops, smartphones, and tablets creates serious privacy, security, and financial risks. Renite solves this with an end-to-end, security-focused Electronics Asset Recovery Platform built specifically for educational institutions (schools, colleges, universities) and corporate organizations.

Renite combines Hardware Serial & MAC Address Verification, Pre-emptive Device Tokenization, AI Computer Vision Tagging, Blockchain Ownership Ledgers, and a Loyalty-Based Shipping Engine to ensure lost devices are returned securely and efficiently.

---

## 🏆 Recommended Project Titles

- **Renite** — *Smart Enterprise & Campus Electronics Recovery Platform* (⭐ Recommended)
- **Renite Core** — *Verification-Driven Hardware Recovery Network*
- **Renite Hub** — *Unified Institutional Device Asset Recovery*
- **Renite Shield** — *Trusted Electronics Recovery with AI + Blockchain*

---

## 🔑 Key Features

### 🛡️ 1. Authentication & Security
- **Institutional Domain Validation**: Restricted registration using verified @school.edu or @company.com emails.
- **Role-Based Access Control (RBAC)**: Distinct interfaces for Students/Employees, Campus IT/Security Admins, and Logistics Coordinators.
- **Device Privacy Shield**: Personal device identifiers (Serial/MAC/IMEI) and contact info remain hidden to prevent unauthorized claims.
- **Zero-Knowledge Proofs**: Verify device ownership without revealing sensitive serial numbers.
- **End-to-End Encryption**: All communications and device data encrypted at rest and in transit.
- **Audit Trail & GDPR Compliance**: Complete immutable logs and automated data anonymization.

### 💻 2. Pre-Registration & Hardware Tokens
- **Pre-emptive Device Logging**: Users pre-register laptops, phones, and tablets before they are ever lost.
- **Hardware ID & Token Binding**: Binds devices using Serial Numbers, MAC Addresses, IMEI numbers, or unique printable QR tokens.
- **Blind Ownership Verification**: Claimants must prove ownership via serial matching, cloud device lists, or secret hardware descriptions.
- **Blockchain Registration**: Each device gets an immutable entry on a private ledger.

### 🤖 3. AI-Powered Device Recognition
- **Multi-Modal Fingerprinting**: Combines visual signatures (AI embedding from photos), hardware signatures (serial/MAC), and behavioral patterns (usage hours, network history).
- **Model & Brand Detection**: Finder uploads a photo; Computer Vision (YOLOv8/DETR) identifies category, brand, color, and distinguishing features.
- **Suspicious Activity Detection**:
  - **AI Anomaly Detection**: Flags unusual claim patterns.
  - **Image Forensics**: Detects photoshopped/doctored images using Error Level Analysis (ELA).
  - **Location Spoofing**: Cross-references GPS with WiFi triangulation.

### ⛓️ 4. Blockchain-Based Ownership Ledger
- **Immutable Device History**: Store registration, transfer, and recovery events on a private blockchain (Hyperledger Fabric).
- **Smart Contracts**: Automate reward distribution when devices are returned.
- **Tamper-Proof Verification**: Prevents false claims by maintaining cryptographic proof of ownership.

### 🗺️ 5. Geofenced Campus Map & Location Intelligence
- **Interactive Campus/Office Map**: Pinpoint exact computer labs, classrooms, libraries, or cafeteria zones.
- **Proximity Alert System**: SMS/Email notifications when entering zones where registered electronics were reported missing.
- **Heat Maps & Analytics**: Identify high-risk zones and track recovery success rates.

### 🚚 6. Logistics, Shipping & Loyalty Rewards

**Tiered Loyalty Program:**
| Tier | Points | Benefits |
|------|--------|----------|
| **Bronze** | 0-100 pts | Basic matching alerts |
| **Silver** | 101-500 pts | Priority matching + 10% shipping discount |
| **Gold** | 501-2000 pts | Free shipping + 24hr expedited processing |
| **Platinum** | 2000+ pts | Insurance coverage + dedicated support |

**Smart Logistics:** Off-campus shipping integration (DHL/UPS/FedEx), Smart Locker pickups, and Drone Delivery options for advanced campuses.

### 💬 7. Secure In-App Communication & Device Handoff
- **Anonymized In-App Chat**: Encrypted messaging without exposing phone numbers/emails.
- **Unlock & Proof-of-Access Test**: Requires claimant to unlock the device screen (passcode/biometrics) in front of admins or the finder.
- **Trust Score & Testimonials**: User reputation system and a "Trust Wall" showcasing successfully recovered devices.

### 📊 8. Predictive Analytics Dashboard (For Admins)
- **Heat Maps**: Identify high-risk zones.
- **Recovery Rate Analytics**: Track success rates by category, location, and time.
- **Predictive Alerts**: AI predicts which devices are likely to be lost based on user behavior patterns.
- **Anomaly Reports**: Automated flagging of potential theft rings.

### 📱 9. Real-Time Features
- **BLE Beacons**: Optional Bluetooth tags for real-time device proximity alerts.
- **Last Seen Notifications**: Push notifications when a device is detected on campus WiFi.
- **Find My Integration**: Optional integration with Apple/Google Find My network.

---

## 🌐 Application Architecture & UI Structure

```text
├── 🧭 Navigation Bar
│   ├── Dynamic Global Search (w/ Search History)
│   ├── QR Scanner & Voice Input
│   ├── Electronics Categories
│   └── User Profile Quick-Menu
│
├── 🏠 Showcase Homepage
│   ├── Real-Time Electronics Recovery Counter
│   ├── Personalized Feed & Trending Lost Items
│   ├── Quick "Report Lost/Found" Action Modals
│   └── Trust & Testimonials Carousel
│
├── 🗺️ Interactive Map View
│   ├── Zone-based Incident Mapping
│   └── Location Pinning (Labs, Libraries, Cafeteria)
│
├── 🔐 Device Vault
│   ├── Pre-registered Devices with Status
│   └── Auto-sync from Cloud Accounts
│
├── 📊 Analytics Hub
│   ├── Personal Stats: Recovery Rate, Points Earned
│   └── Recovery Timeline Visualization
│
├── 💬 In-App Chat Center
│   └── Secure messaging threads for item claims
│
├── 📦 Order & Delivery History
│   ├── Tracking off-campus shipping status
│   └── Point redemption logs
│
├── ℹ️ About & Information Hub
│   ├── Institutional Bio & Device Inventory Metrics
│   ├── Comprehensive FAQ & Hardware Verification Protocols
│   └── Trust Score Display
│
└── 👤 User Profile & Settings
    ├── Edit Profile & Contact Info
    ├── My Registered Electronics & Hardware Tokens
    ├── Loyalty Points Wallet & Reward History
    └── Privacy & Security Preferences
🗄️ Database Schema (Core Tables)
sql
-- Core Users & Organizations
User: id, name, email, phone, role, organization_id, loyalty_points, trust_score, created_at
Organization: id, name, domain, type (campus/enterprise), address, created_at

-- Device Management
ElectronicDevice: id, user_id, serial_number, mac_address, category, brand, model, 
  token_hash, description, distinguishing_features, images[], blockchain_hash, 
  status (registered, lost, found, claimed, returned), created_at
DeviceFingerprint: id, device_id, visual_embedding, hardware_signature, behavioral_pattern, created_at

-- Reporting & Matching
LostReport: id, device_id, user_id, location_lat, location_lng, zone, description, reported_at, status
FoundReport: id, device_id, user_id, location_lat, location_lng, zone, description, image, reported_at, status
Match: id, lost_report_id, found_report_id, verification_score, match_type (ai_visual, serial, manual), status, created_at
Claim: id, match_id, claimant_id, proof_type, verification_status, handoff_status, created_at

-- Blockchain & Logistics
BlockchainRecord: id, device_id, transaction_hash, event_type, timestamp, block_number
ShippingOrder: id, claim_id, origin_address, destination_address, loyalty_points_redeemed, carrier, tracking_number, delivery_status
LoyaltyTransaction: id, user_id, points_amount, type (earn/redeem), reference_id, description, created_at

-- Communication & Compliance
ChatMessage: id, match_id, sender_id, receiver_id, message, encrypted, created_at
Testimonial: id, user_id, device_id, content, rating, created_at
AuditLog: id, user_id, action, resource_type, resource_id, details, ip_address, created_at
```
🛠️ Tech Stack
Layer	Technology
Frontend (Mobile)	React Native (iOS & Android)
Frontend (Web)	Next.js (Dashboard) + PWA Support
Backend (API)	Node.js + Express / NestJS (GraphQL Federation)
AI/ML Microservices	Python Flask (YOLOv8 / DETR, FaceNet, CLIP, LLaMA-3 / GPT-4)
High-Performance Engine	Go (Matching engine)
Blockchain	Hyperledger Fabric, Solidity, Web3.js
Database & Cache	MongoDB, PostgreSQL, Redis, Elasticsearch
Messaging Queue	RabbitMQ / Kafka (Event-driven architecture)
Infrastructure	Kubernetes, Docker
Security	HashiCorp Vault, OAuth 2.0 + OIDC, WebAuthn, AWS KMS
🚀 Setup Guide
Prerequisites
Node.js (v18.x or higher)

Python (v3.9+)

MongoDB Atlas or PostgreSQL

Docker & Kubernetes (optional)

Installation Steps
```
bash
# 1. Clone the repository
git clone https://github.com/ReniteHQ/renite-backend.git
cd renite-backend
```
# 2. Install dependencies (API Gateway)
```
npm install
```
# 3. Install Python dependencies (for AI microservices)
```
pip install -r requirements.txt
```
# 4. Configure Environment Variables
# Create a .env file in the root directory:
```
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
BLOCKCHAIN_NODE_URL=your_blockchain_node_url
AI_VISION_API_KEY=your_vision_api_key
SMS_API_KEY=your_sms_gateway_key
EMAIL_SMTP_HOST=smtp.mailtrap.io
```
# 5. Run Development Server
```
npm run dev
```
🔄 Enhanced Reporting Flow
```
graph TD
    A[Report Lost/Found] --> B[AI Auto-Categorization]
    B --> C{Device Type?}
    C -->|Electronics| D[Serial/MAC/IMEI Extraction]
    C -->|Other| E[Standard Category]
    D --> F[AI Visual Fingerprinting]
    F --> G[Blockchain Registration]
    G --> H[Automated Matching Engine]
    H --> I[Instant Notifications]
    I --> J[Smart Escalation]
    J --> K[Verification Process]
    K --> L[Handoff & Testimonial]
```
💡 Unique Differentiators
"Device DNA": Combination of hardware + software + behavioral signatures for unique identification.

"Campus Mesh": Peer-to-peer device detection using Bluetooth/WiFi mesh networks.

"Reward Auto-Execution": Smart contracts automatically release rewards when verification conditions are met.

"Privacy-Preserving Matching": Match devices without exposing sensitive data to finders.

"Cross-Institution Network": Connect multiple campuses/organizations for lost devices found off-campus.

"Zero-Knowledge Proofs": Verify ownership without revealing sensitive data.

📊 Success Metrics
Metric	Target
Recovery Rate	> 85% within 72 hours
False Claim Rate	< 1% through verification
User Trust Score	Average > 4.5/5 star reviews
Time to Recover	Reduce from days to hours
User Adoption	60%+ device pre-registration rate
📜 Terms & Conditions
Ownership Verification Mandate: High-value electronics require hardware serial verification, cloud device list proof, or physical screen unlock upon handover.

Data Privacy & Zero-Access: Finders and admins must not attempt to access or extract personal data from found devices.

Fraudulent Claims: Intentional false claims on electronic assets will result in immediate account suspension.

Campus Drop-Off Policy: Recovered electronics must be delivered to designated secure IT or Security drop-off stations.

Blockchain Immutable Record: All transactions are permanently recorded on the blockchain for auditability.

🤝 Contributing
We welcome contributions from the community!

Fork the repository.

Create a feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.

🌐 GitHub Organization Structure
We recommend organizing your repositories under Renite:
```
text
Renite/
├── renite-backend/          # Node.js + Express API
├── renite-frontend/         # React Native + Next.js
├── renite-ai-services/      # Python AI/ML microservices
├── renite-blockchain/       # Smart contracts & blockchain integration
├── renite-mobile/           # React Native mobile app
├── renite-docs/             # Documentation
└── renite-devops/           # Kubernetes & infrastructure configs
```
<p align="center"> <strong>Reclaim What's Yours, Securely.</strong><br> <img src="https://img.shields.io/badge/Status-Development-blue?style=flat-square" /> <img src="https://img.shields.io/badge/Version-v1.0.0--alpha-blue?style=flat-square" /> </p> 
