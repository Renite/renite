# Renite — AI & Blockchain Developer Responsibilities

## Your Role

You are responsible for **AI and Blockchain integration in Renite**.

Your work should not only be about writing code. You are also responsible for researching, designing, testing, documenting, and integrating AI and Blockchain technologies into the Renite system where they provide real value.

The goal is to make your work **visible, organized, and trackable through GitHub**.

---

## 1. AI Responsibilities

Your AI responsibilities may include:

### AI Research
- Research suitable AI models and technologies for Renite.
- Evaluate different approaches before implementation.
- Document why a particular model or approach was selected.
- Consider accuracy, performance, privacy, cost, and scalability.

### Person Matching / Recognition
Research and implement AI-assisted functionality that can help Renite with:
- Missing-person matching.
- Image/face similarity matching where legally and technically appropriate.
- Matching submitted information against existing authorized records.
- Confidence scoring and verification workflows.

### Lost Asset Intelligence
Investigate how AI can assist with:
- Identifying or classifying lost devices/assets.
- Matching uploaded images or descriptions.
- Detecting potentially duplicate reports.
- Improving recovery recommendations.

### AI Integration
- Integrate AI services/models with the Renite backend.
- Design APIs required for AI functionality.
- Handle model responses safely.
- Implement appropriate error handling.
- Test AI functionality.
- Document how other developers can use the AI services.

---

# 2. Blockchain Responsibilities

Blockchain should be used only where it provides a real benefit to Renite.

Your responsibility is to investigate and implement the **trust/verification layer**, not to put Renite's entire database on a blockchain.

Possible areas include:

### Asset Ownership Verification
Investigate how Renite can create tamper-evident proofs for:
- Registered devices.
- Ownership records.
- Important asset-registration events.

### Verification Records
Investigate how blockchain can help prove that an important verification event occurred without storing sensitive personal information directly on-chain.

### Recovery Audit Trail
Research whether important recovery events should have a tamper-evident record, for example:

```text
Asset Registered
       ↓
Ownership Verified
       ↓
Reported Lost
       ↓
Recovery Process Started
       ↓
Asset Found
       ↓
Ownership Confirmed
       ↓
Case Closed
```

### Blockchain Integration
If blockchain is approved for implementation:

- Design the blockchain architecture.
- Select an appropriate technology.
- Implement the required smart contracts, if necessary.
- Create the backend integration.
- Implement verification mechanisms.
- Test blockchain interactions.
- Document the architecture and reasoning.

---

# 3. Important Privacy Rule

Do **not** put sensitive user information directly on a public blockchain.

This includes things such as:

- Personal information
- Facial/biometric data
- Passwords
- Phone numbers
- Addresses
- Private messages
- Sensitive locations
- Fayda credentials
- Payment information

Instead, investigate approaches such as:

```text
Sensitive Data
      ↓
Renite Secure Database
      ↓
Cryptographic Hash / Proof
      ↓
Blockchain
```

The blockchain should provide **proof and integrity**, while Renite's database stores the actual application data.

---

# 4. Fayda and Blockchain

Remember the distinction:

**Fayda**
→ Identity verification

**Renite**
→ Application account, profile, reports, preferences, recovery information, etc.

**Blockchain**
→ Tamper-evident proof for selected important events

Blockchain should complement Fayda and Renite rather than replace either one.

---

# 5. GitHub Workflow

All significant work must be tracked through GitHub.

Do not simply work locally and then upload everything at the end.

Use:

```text
Issue
  ↓
Branch
  ↓
Commits
  ↓
Pull Request
  ↓
Review
  ↓
Testing
  ↓
Merge
```

---

## 6. GitHub Issues

Before starting a significant task, create or work from a GitHub Issue.

Examples:

```text
[AI] Research missing-person matching models

[AI] Design person-matching pipeline

[AI] Integrate AI matching API

[Blockchain] Research blockchain options

[Blockchain] Design asset ownership proof

[Blockchain] Implement verification service

[Blockchain] Document blockchain architecture
```

Each issue should explain:

- What needs to be done.
- Why it is needed.
- Expected result.
- Acceptance criteria.

---

# 7. Branch Naming

Create a separate branch for each meaningful task.

Examples:

```text
feature/ai-person-matching
feature/ai-matching-api
feature/blockchain-asset-proof
feature/blockchain-verification
docs/ai-architecture
docs/blockchain-architecture
research/ai-model-evaluation
research/blockchain-evaluation
```

Do not use vague names such as:

```text
my-branch
test
update
new
ai-work
```

---

# 8. Commit Messages

Use meaningful commit messages.

Avoid:

```text
update
fix
done
changes
final
```

Prefer:

```text
feat(ai): add person matching service

feat(ai): integrate matching API

test(ai): add matching confidence tests

feat(blockchain): add asset verification hash

feat(blockchain): implement proof verification

docs(ai): document matching architecture

docs(blockchain): document verification workflow
```

Your commits should make it possible for another developer to understand what you actually changed.

---

# 9. Pull Requests

When a task is complete, open a Pull Request instead of directly merging into `main`.

Your PR should explain:

```text
## What was implemented?

## Why was it implemented?

## What files/components were changed?

## How was it tested?

## What remains to be done?

## Related Issue
```

A team member should review the PR before it is merged.

---

# 10. Research Is Also Work

AI and Blockchain involve significant research.

If you spend time evaluating technologies, don't let that work disappear.

Create research issues such as:

```text
[Research] Evaluate AI models for person matching

[Research] Evaluate blockchain technologies for Renite

[Research] Evaluate privacy implications of biometric AI

[Research] Evaluate blockchain storage strategies
```

Document:

- Technologies considered.
- Advantages.
- Disadvantages.
- Performance.
- Cost.
- Security.
- Privacy.
- Scalability.
- Your recommendation.

This allows the team to understand **why** we chose a particular technology.

---

# 11. Documentation

You are also responsible for keeping the AI and Blockchain documentation updated.

Relevant documentation may include:

```text
docs/
├── ai_architecture.md
├── ai_integration.md
├── blockchain_architecture.md
├── blockchain_integration.md
└── security_considerations.md
```

The exact file structure can be adjusted by the team.

Documentation should explain the system clearly enough that another developer can understand and continue your work.

---

# 12. Testing

You are responsible for testing your integrations.

For AI:

- Test normal cases.
- Test incorrect inputs.
- Test low-confidence results.
- Test failure cases.
- Evaluate accuracy where possible.
- Consider false positives and false negatives.

For Blockchain:

- Test successful transactions.
- Test invalid data.
- Test verification failures.
- Test transaction failures.
- Test hash/proof consistency.
- Test backend ↔ blockchain communication.

---

# 13. Security

Because Renite deals with identity, missing persons, and lost assets, security is extremely important.

Pay attention to:

- Sensitive data protection.
- API authentication.
- Authorization.
- Secure handling of AI inputs.
- Biometric-data privacy.
- Blockchain key management.
- Smart-contract security.
- Prevention of unauthorized verification.
- Avoiding sensitive information on-chain.

If you identify a security concern, create an issue and inform the team rather than silently ignoring it.

---

# 14. What We Expect From Your GitHub Activity

We are not measuring your contribution simply by the number of commits.

We want to see:

```text
Research
   ↓
Design
   ↓
Implementation
   ↓
Testing
   ↓
Documentation
   ↓
Pull Request
   ↓
Review
   ↓
Integration
```

A well-designed feature with a few high-quality commits is more valuable than many meaningless commits.

---

# 15. Your Main Deliverables

As the AI & Blockchain developer, your work should eventually produce:

### AI

- AI technology evaluation.
- AI architecture.
- Person/missing-person matching approach.
- AI service/API integration.
- Testing and evaluation.
- AI documentation.

### Blockchain

- Blockchain feasibility study.
- Blockchain architecture.
- Selected blockchain technology and justification.
- Asset verification/proof mechanism.
- Backend integration.
- Verification testing.
- Blockchain documentation.

### Overall

Your final work should be something the rest of the Renite team can actually integrate into the main system.

**Your responsibility is not simply "use AI and Blockchain." Your responsibility is to determine where they genuinely solve Renite's problems, prove that they work, integrate them properly, and document the decisions so the whole team can understand and maintain them.**