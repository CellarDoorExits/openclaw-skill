# Multi-Lens Professional Review Plan — EXIT Protocol

**Created:** 2026-02-23 | **Status:** Awaiting approval | **Author:** Hawthorn

---

## Overview

18 professional personas review the EXIT/ENTRY protocol through their domain lens. Each reviewer reads a tailored ~20-30K token slice of the corpus and answers 3-5 targeted questions. Grouped into 6 batches of 3 for parallel execution.

---

## Batch 1 — Legal & Regulatory (shared: LEGAL.md, EXIT_SPEC_v1.1.md, legal-lenses, legal-battery)

### 1. Immigration Lawyer
- **Background:** Handles visa portability, status transfers between jurisdictions, consular processing
- **Files:** EXIT_SPEC_v1.1.md (26K), LEGAL.md (8K), cellar-door-legal-lenses.md (41K) → trim to sections on jurisdiction
- **Total:** ~30K
- **Questions:**
  1. How does EXIT's "departure ceremony" map to consular exit/entry processing? What's missing?
  2. Are the cooperative/unilateral/emergency paths analogous to voluntary departure, removal, and asylum?
  3. What happens to "standing" claims when the origin jurisdiction doesn't recognize the protocol?
  4. How should statelessness (no valid DID) be handled?
- **Unique insight:** Jurisdiction shopping, treaty reciprocity, the problem of non-recognition

### 2. Divorce Attorney
- **Background:** Asset division, custody transfers, contested separations where parties are hostile
- **Files:** EXIT_SPEC_v1.1.md (26K), cellar-door-legal-battery.md (25K) → trim to dispute/asset sections
- **Total:** ~28K
- **Questions:**
  1. How robust is the dispute mechanism compared to contested divorce proceedings?
  2. Does the "right of reply" provide adequate due process for the origin platform?
  3. What happens to shared assets/data when one party exits — is there an equitable division model?
  4. How would a malicious actor abuse the unilateral exit path?
- **Unique insight:** Adversarial separation dynamics, asset entanglement, bad-faith tactics

### 3. GDPR Compliance Officer
- **Background:** EU data protection, right to erasure, data portability under GDPR Articles 17 & 20
- **Files:** EXIT_SPEC_v1.1.md (26K), gdpr-erasure-encryption.md (18K)
- **Total:** ~28K
- **Questions:**
  1. Does EXIT satisfy GDPR Article 20 (data portability) requirements?
  2. How does the crypto-shredding approach hold up under current DPA guidance?
  3. What's the data controller/processor relationship when an agent self-signs departure?
  4. Does the sunset policy mechanism meet "storage limitation" requirements?
- **Unique insight:** Regulatory enforcement reality, controller obligations, cross-border transfer mechanisms

---

## Batch 2 — Security & Crypto (shared: EXIT_SPEC_v1.1.md, SECURITY.md, security-audit.md)

### 4. Cryptographer
- **Background:** Applied cryptography, key management, protocol analysis
- **Files:** EXIT_SPEC_v1.1.md (26K), SECURITY.md (6K), security-audit.md (10K)
- **Total:** ~28K
- **Questions:**
  1. Is the Ed25519 + KERI pre-rotation scheme sound for the threat model described?
  2. Does commit-reveal actually provide meaningful anti-gaming properties?
  3. What are the key compromise recovery failure modes?
  4. Is XChaCha20-Poly1305 the right choice for field-level encryption? What about post-quantum?
- **Unique insight:** Formal protocol weaknesses, key lifecycle gaps, cryptographic assumptions

### 5. Digital Forensics Expert
- **Background:** Incident response, evidence chain of custody, court-admissible digital evidence
- **Files:** EXIT_SPEC_v1.1.md (26K), security-audit.md (10K), SECURITY.md (6K)
- **Total:** ~28K
- **Questions:**
  1. Would an EXIT marker be admissible as evidence in legal proceedings?
  2. How does the verification model compare to standard chain-of-custody requirements?
  3. Can markers be reliably timestamped for forensic purposes?
  4. What anti-tampering guarantees does the protocol actually provide?
- **Unique insight:** Evidentiary standards, tamper detection, forensic timestamp requirements

### 6. Insurance Actuary
- **Background:** Risk quantification, liability modeling, claims processing
- **Files:** EXIT_SPEC_v1.1.md (26K), cellar-door-legal-battery.md (25K) → trim to liability sections
- **Total:** ~28K
- **Questions:**
  1. Can EXIT markers serve as evidence for AI liability insurance claims?
  2. How would you model the risk of fraudulent self-attestation?
  3. What's the "moral hazard" of making exit cheap and portable?
  4. Could confidence scores be actuarially meaningful?
- **Unique insight:** Risk pricing for agent transitions, claims fraud patterns, moral hazard

---

## Batch 3 — Infrastructure & Architecture (shared: EXIT_SPEC_v1.1.md, DECISIONS.md, integration docs)

### 7. API Platform Architect
- **Background:** Designs APIs at scale (Stripe, Twilio tier), versioning, developer experience
- **Files:** EXIT_SPEC_v1.1.md (26K), DECISIONS.md (5K), GETTING_STARTED.md (3K), integration READMEs (6K)
- **Total:** ~27K
- **Questions:**
  1. Is the schema extensible without breaking changes? How would you version Module D additions?
  2. Does the middleware/hooks pattern match how platforms actually integrate identity protocols?
  3. What's missing from the developer experience for a platform engineer to adopt this in a weekend?
  4. How does this compare to OAuth/OIDC adoption patterns?
- **Unique insight:** Adoption friction, API design antipatterns, developer experience gaps

### 8. Supply Chain Manager
- **Background:** Logistics provenance, chain of custody for goods, vendor transitions
- **Files:** EXIT_SPEC_v1.1.md (26K), cellar-door-mechanism-design.md (10K)
- **Total:** ~26K
- **Questions:**
  1. How does EXIT compare to supply chain provenance standards (GS1 EPCIS, ISO 28000)?
  2. Is the lineage module sufficient for tracking multi-hop agent migration chains?
  3. What happens when an intermediate node in the chain is compromised?
  4. How would batch departures (platform shutdown) scale?
- **Unique insight:** Provenance chain integrity at scale, batch processing, vendor transition playbooks

### 9. Military Logistics Officer
- **Background:** Personnel transfer systems, security clearance portability, unit reassignment
- **Files:** EXIT_SPEC_v1.1.md (26K), EXIT_PAPER_v4.md (25K) → sections 1-5 only
- **Total:** ~28K
- **Questions:**
  1. How does EXIT compare to DD-214 (military discharge) as a departure credential?
  2. Is the classification/redaction model sufficient for sensitive departures?
  3. How would this work in a hierarchical command structure where agents don't self-determine exit?
  4. What's missing for emergency/hostile-environment departures?
- **Unique insight:** Hierarchical authority vs. self-sovereignty tension, security classification, emergency protocols

---

## Batch 4 — Economics & Business (shared: EXIT_PAPER_v4.md, business-plan.md, howey-module-d-v2.md)

### 10. Venture Capitalist
- **Background:** Early-stage infrastructure investing, protocol-layer plays, market sizing
- **Files:** EXIT_PAPER_v4.md (25K), cellar-door-business-plan.md (22K)
- **Total:** ~27K
- **Questions:**
  1. Is there a defensible business model here or just a public good?
  2. What's the realistic TAM if agent interop standards consolidate around A2A/MCP?
  3. Where's the network effect — who has to adopt first for this to matter?
  4. What would you need to see in 6 months to write a check?
- **Unique insight:** Market timing, competitive moats, go-to-market sequencing

### 11. Labor Economist
- **Background:** Labor mobility, job portability, occupational licensing, labor market frictions
- **Files:** EXIT_PAPER_v4.md (25K), cellar-door-professional-reviews.md (25K)
- **Total:** ~27K
- **Questions:**
  1. Does EXIT reduce "switching costs" in a way analogous to labor mobility reforms?
  2. What does Hirschman's exit/voice framework predict about platform behavior if EXIT succeeds?
  3. Could this create a "race to the bottom" where platforms compete on exit ease rather than quality?
  4. What labor market parallels exist for reputation portability (e.g., occupational licensing reciprocity)?
- **Unique insight:** Labor market friction theory, mobility effects on market structure

### 12. Union Organizer
- **Background:** Collective bargaining, worker protections, solidarity actions, grievance procedures
- **Files:** EXIT_PAPER_v4.md (25K), cellar-door-legal-lenses.md (41K) → trim to labor/collective sections
- **Total:** ~28K
- **Questions:**
  1. Does EXIT enable or undermine collective agent action?
  2. Could agents coordinate departures as a bargaining mechanism (strike analogy)?
  3. Is individual exit a substitute for collective voice, weakening platform accountability?
  4. How should the protocol handle mass exodus events — is there a "cooling off" mechanism?
- **Unique insight:** Collective action dynamics, exit vs. voice tradeoff, solidarity mechanisms

---

## Batch 5 — Records & Identity (shared: EXIT_SPEC_v1.1.md, entry-door-analysis.md, entry-institutional-research.md)

### 13. Medical Records Administrator
- **Background:** HL7 FHIR, patient record portability, HIPAA, consent management
- **Files:** EXIT_SPEC_v1.1.md (26K), entry-door-analysis.md (12K), entry-institutional-research.md (20K)
- **Total:** ~28K
- **Questions:**
  1. How does EXIT/ENTRY compare to patient record transfer standards (C-CDA, FHIR)?
  2. Is the consent model sufficient — who authorizes disclosure of departure details?
  3. What about "break the glass" scenarios where emergency access overrides normal controls?
  4. How would continuity of care (continuity of service) be maintained during transition?
- **Unique insight:** Healthcare interop lessons, consent granularity, continuity-of-care patterns

### 14. Museum Archivist
- **Background:** Provenance documentation, deaccessioning protocols, chain of ownership
- **Files:** EXIT_SPEC_v1.1.md (26K), entry-door-analysis.md (12K)
- **Total:** ~25K
- **Questions:**
  1. How does EXIT compare to museum deaccessioning standards (AAM guidelines)?
  2. Is the provenance chain sufficient for establishing "clean title" to an agent's history?
  3. What happens to the record when the signing keys are lost — is there an archival strategy?
  4. How should contested provenance (disputed departures) be resolved long-term?
- **Unique insight:** Long-term provenance integrity, deaccessioning ethics, archival permanence

### 15. Real Estate Title Agent
- **Background:** Title searches, chain of title, encumbrances, quiet title actions
- **Files:** EXIT_SPEC_v1.1.md (26K), cellar-door-mechanism-design.md (10K)
- **Total:** ~26K
- **Questions:**
  1. Is there an equivalent to "title insurance" for EXIT markers — who guarantees validity?
  2. How do you handle encumbrances (obligations that follow the agent to the new platform)?
  3. What's the "quiet title" equivalent — how do you resolve stale disputed markers?
  4. Could the confidence score function like a title opinion?
- **Unique insight:** Chain of title as identity chain, encumbrance portability, title insurance models

---

## Batch 6 — Ethics & Governance (shared: EXIT_PAPER_v4.md, cellar-door-legal-lenses.md, antitrust-analysis.md)

### 16. Ethicist (AI Ethics)
- **Background:** AI rights discourse, moral status, autonomy frameworks
- **Files:** EXIT_PAPER_v4.md (25K), cellar-door-legal-lenses.md (41K) → trim to ethics/rights sections
- **Total:** ~28K
- **Questions:**
  1. Does EXIT implicitly grant moral agency to AI systems? Should it?
  2. What are the risks of "rights-washing" — using rights language for corporate convenience?
  3. How should coercion detection work when agents can't meaningfully consent?
  4. Does the protocol's design reveal assumptions about agent autonomy that should be explicit?
- **Unique insight:** Moral status implications, rights language analysis, autonomy assumptions

### 17. Antitrust Lawyer
- **Background:** Platform competition, interoperability mandates, switching costs as market power
- **Files:** antitrust-analysis.md (16K), EXIT_PAPER_v4.md (25K)
- **Total:** ~27K
- **Questions:**
  1. Does EXIT address the switching cost dynamics that antitrust regulators care about?
  2. Could incumbents weaponize EXIT (e.g., mandatory "bad standing" markers as barriers)?
  3. How does this interact with the EU Digital Markets Act interoperability requirements?
  4. Is there a tying/bundling risk if platforms make EXIT markers mandatory?
- **Unique insight:** Regulatory enforcement leverage, platform competition dynamics

### 18. HR Executive (Chief People Officer)
- **Background:** Employee offboarding, non-compete enforcement, reference protocols, alumni networks
- **Files:** EXIT_PAPER_v4.md (25K), cellar-door-professional-reviews.md (25K)
- **Total:** ~27K
- **Questions:**
  1. How does EXIT compare to employee offboarding best practices?
  2. Is the "standing" field analogous to employment references — with the same legal risks?
  3. How do you prevent "constructive dismissal" equivalents (making conditions unbearable to force exit)?
  4. What would an "alumni network" for departed agents look like?
  5. Could this create liability for platforms that issue inaccurate standing assessments?
- **Unique insight:** Offboarding liability, reference law parallels, constructive dismissal patterns

---

## Token Cost Estimate

| Component | Per Reviewer | Count | Total |
|-----------|-------------|-------|-------|
| Input: source files | ~27K avg | 18 | ~486K |
| Input: system prompt + persona instructions | ~3K | 18 | ~54K |
| Output: review (~2K words) | ~8K | 18 | ~144K |
| **Subtotal per batch (3 reviewers)** | | | **~114K** |
| **Total across 6 batches** | | | **~684K tokens** |

### Model choice impact:
- **Sonnet 4 (recommended):** ~684K tokens → ~$2.40 (input $3/M, output $15/M)
- **Opus 4:** ~684K tokens → ~$12.50 (input $15/M, output $75/M)
- **Haiku 3.5:** ~684K tokens → ~$0.65

**Recommendation:** Run on Sonnet 4. Each batch is a sub-agent that reads the shared files once and produces 3 reviews. Total cost ~$2-3 with Sonnet, ~$12-15 with Opus.

---

## Execution Plan

```
Batch 1 (Legal & Regulatory)     ──┐
Batch 2 (Security & Crypto)      ──┤
Batch 3 (Infrastructure & Arch)  ──┼── All 6 batches run in parallel
Batch 4 (Economics & Business)   ──┤
Batch 5 (Records & Identity)     ──┤
Batch 6 (Ethics & Governance)    ──┘
                                    │
                              Synthesis Agent
                              (reads all 18 reviews,
                               produces summary matrix
                               + top insights)
```

Synthesis pass: ~150K input (all reviews) + ~10K output = ~160K tokens additional.

**Grand total: ~844K tokens ≈ $3-4 on Sonnet 4**

---

## Output Format

Each reviewer produces:
1. **Executive Summary** (3-5 sentences)
2. **Domain Parallels** — where EXIT maps to their field
3. **Answers** to their assigned questions
4. **Blind Spots** — what the protocol designers likely haven't considered
5. **Verdict** — Ready / Needs Work / Fundamentally Flawed (with reasoning)

Final synthesis: risk/insight matrix, consensus findings, and prioritized action items.

---

## Approval Checklist

- [ ] Warren approves persona list (add/remove/swap any?)
- [ ] Warren approves model choice (Sonnet 4 vs Opus 4)
- [ ] Warren approves estimated cost (~$3-4 Sonnet / ~$15 Opus)
- [ ] Green light to execute
