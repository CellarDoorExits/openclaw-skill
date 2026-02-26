# P23 — Data Protection Impact Assessment (DPIA)
## EXIT Protocol v1.1 — GDPR & Privacy Analysis

**Assessor:** P23 — Data Protection Officer (GDPR Specialist)  
**Date:** 2026-02-25  
**Spec Version:** EXIT_SPEC_v1.1  
**Classification:** Confidential  

---

## Executive Summary

The EXIT protocol creates cryptographically signed departure markers containing DIDs, behavioral attestations, reputation signals, and identity claims. **EXIT markers constitute personal data under GDPR** in most deployment scenarios. The protocol demonstrates strong privacy awareness (encryption, redaction, sunset policies, dedicated GDPR deletion method) but has **structural tensions** with the right to erasure that require architectural remediation before EU deployment.

**Overall Risk Rating: HIGH**

The rating reflects the fundamental conflict between cryptographic immutability and erasure rights, combined with cross-border transfer risks inherent in a decentralized, portable credential system.

---

## 1. Does an EXIT Marker Constitute Personal Data?

### Analysis under GDPR Article 4(1)

**Personal data** = "any information relating to an identified or identifiable natural person."

| Data Element | Personal Data? | Reasoning |
|---|---|---|
| `subject` (DID) | **Yes** | A DID is a persistent pseudonymous identifier. Per CJEU *Breyer* (C-582/14), even dynamic IP addresses are personal data when linkage to identity is possible. DIDs are *designed* for linkability. |
| `origin` (URI) | **Contextual** | A platform URI alone is not personal data, but combined with `subject` it reveals behavioral patterns (which platforms a person uses). |
| `exitType` | **Yes (in context)** | `forced`, `constructive`, `directed` reveal information about a person's relationship with a platform — analogous to employment termination records. |
| `status` | **Yes (in context)** | `good_standing`, `disputed` are reputational judgments about a natural person. |
| `proof` (signature) | **Yes** | Cryptographic signature uniquely derived from private key material — biometric-adjacent uniqueness. |
| Module A: `lineage`, `predecessor`, `successor` | **Yes** | Creates a linkable identity graph across incarnations. |
| Module C: `disputes`, `originStatus`, `rightOfReply` | **Yes** | Dispute records are clearly personal data — they are *about* a person's conduct. |
| Module E: `reason`, `narrative` | **Yes** | Explicitly acknowledged in spec §4.5: "Module E content is personal data under GDPR." |
| Trust Enhancers: `identityClaims` | **Yes — Special category risk** | Links DIDs to external identities (X.509 certs, OAuth tokens). May bridge pseudonymity to real-world identity. |
| Trust Enhancers: `witnesses` | **Yes** | Witness DIDs + attestations about a subject's departure are personal data about *both* the witness and the subject. |
| `TenureAttestation` | **Yes** | Reveals duration of affiliation — employment-analogous behavioral data. |
| `coercionLabel` | **Yes — Sensitive** | Labels like `possible_retaliation` or `pattern_of_abuse` are allegations about conduct that could constitute profiling under Art. 22. |

### Determination

**EXIT markers are personal data under GDPR in virtually all scenarios involving natural persons.** Even where subjects are AI agents, if a natural person controls the DID or can be identified through it, GDPR applies.

The combination of persistent identifiers + behavioral signals + reputation judgments + identity claims creates a **high-risk processing profile** under Art. 35(3).

**Risk Rating: HIGH**

---

## 2. Immutable Cryptographic Records vs. Right to Erasure (Art. 17)

### The Core Tension

The EXIT protocol creates cryptographically signed, content-addressed records (`urn:exit:{sha256}`). The spec explicitly warns about this in §4.6 (Module F):

> "On-chain anchoring creates indelible records. This is fundamentally incompatible with GDPR right to erasure."

But the tension extends beyond on-chain anchoring:

| Feature | Erasure Conflict |
|---|---|
| Content-addressed `id` (`urn:exit:{sha256}`) | Changing any field changes the ID — you can't "edit" a marker |
| `proof.proofValue` (signature) | Signature is over canonical content — erasure invalidates the proof |
| Lineage chains (Module A) | Deleting one marker breaks chain integrity for all successors |
| Merkle batch anchoring (§11.2) | Deleting a leaf invalidates Merkle proofs for co-batched markers |
| Git ledger (§11.4) | Git history is append-only by design |
| TSA receipts (§11.3) | RFC 3161 timestamps are issued by third parties — controller cannot erase them |
| Distributed/portable nature | Markers are designed to be carried across systems — no single point of deletion |

### Art. 17 Exceptions Assessment

Art. 17(3) provides exceptions. Potentially applicable:

- **(b) Legal obligation:** If markers serve regulatory compliance functions (e.g., AML/KYC departure records), retention may be justified. **Weak — EXIT is voluntary infrastructure.**
- **(d) Archiving in public interest / scientific research:** Possibly applicable for protocol research. **Marginal.**
- **(e) Legal claims:** Dispute records (Module C) may be retained while disputes are active. **Applicable but time-limited.**

### Art. 17(1) Grounds for Erasure

A data subject can invoke erasure when:
- Consent is withdrawn (if consent is the lawful basis)
- Data is no longer necessary for original purpose
- Subject objects to processing under Art. 21

**For EXIT markers, none of the Art. 17(3) exceptions reliably cover indefinite retention of departure records.**

### Recommended Approach: "Functional Erasure"

The spec already gestures toward this with encryption (§10.1) and redaction (§10.2):

1. **Encryption-based erasure:** Encrypt markers with a subject-controlled key. Erasure = destroy the key. Ciphertext without key is not personal data (per UK ICO guidance on crypto-shredding).
2. **Field-level redaction:** Replace personal fields with `redacted:sha256:{hash}`. The hash alone is not personal data (one-way).
3. **Sunset policies (§8.5):** Time-bound markers with automatic expiry.

**Risk Rating: HIGH** — The protocol *enables* functional erasure but does not *require* it. Deployments using Module F (chain anchoring) or git ledger without encryption face **CRITICAL** risk.

---

## 3. Is `deleteBySubject` in ClaimStore Sufficient?

### Code Analysis

```typescript
/** GDPR Article 17 — delete all claims for a subject. Returns count deleted. */
deleteBySubject(subject: string): number {
  let count = 0;
  for (const [id, claim] of this.claims) {
    if (claim.subject === subject) {
      this.claims.delete(id);
      count++;
    }
  }
  return count;
}
```

### Assessment

| Criterion | Status | Gap |
|---|---|---|
| Deletes all claims for a subject | ✅ | — |
| Returns deletion count (audit trail) | ✅ | — |
| Covers derived data (trust enhancers) | ⚠️ Partial | `claimsFromTrustEnhancers()` creates claims with the subject's DID — these are caught. But witness claims where the subject is the *witness* (not the `subject` field) are missed. |
| Handles cross-references | ❌ | Claims referencing the subject via `markerRef` pointing to other subjects' claims are not cleaned. |
| Covers backup/replica stores | ❌ | `MemoryClaimStore` is in-memory only. No guidance for persistent backends. |
| Audit logging of erasure | ❌ | No record that erasure was performed (required for accountability under Art. 5(2)). |
| Response timeframe | ❌ | No mechanism to track the 30-day response deadline (Art. 12(3)). |
| Third-party notification (Art. 19) | ❌ | No mechanism to notify recipients who received the data. |
| Anchored/distributed copies | ❌ | Deletion from local ClaimStore does not affect TSA receipts, git ledger entries, chain anchors, or markers held by other parties. |

### Verdict

**`deleteBySubject` is necessary but NOT sufficient for GDPR compliance.**

It handles the local claim store correctly but ignores the distributed nature of EXIT markers. A compliant implementation needs:

1. **Erasure cascade:** Delete from all controlled storage (claim store + git ledger + local anchor records)
2. **Crypto-shredding fallback:** For data that cannot be deleted (chain anchors, TSA receipts), destroy encryption keys
3. **Third-party notification:** Best-effort notification to known recipients (Art. 19)
4. **Erasure audit log:** Record that erasure was requested and performed (without retaining the erased data)
5. **Witness data handling:** Delete claims where the subject appears as a witness, not just as `subject`

**Risk Rating: HIGH**

---

## 4. DPIA for EXIT Deployment

### 4.1 Processing Description

| Element | Detail |
|---|---|
| **Nature** | Collection, storage, cryptographic signing, and distribution of departure records |
| **Scope** | Any entity (natural persons, AI agents controlled by natural persons) departing digital systems |
| **Context** | Decentralized identity/reputation infrastructure — no central controller |
| **Purpose** | Enable verifiable, portable departure records for continuity and reputation across systems |

### 4.2 Necessity and Proportionality (Art. 35(7)(b))

| Principle | Assessment |
|---|---|
| **Lawful basis (Art. 6)** | Likely **legitimate interest** (Art. 6(1)(f)) — subjects have interest in portable reputation. Consent (Art. 6(1)(a)) also viable but problematic for immutable records (consent can be withdrawn). **Recommendation: Use Art. 6(1)(f) with documented balancing test.** |
| **Purpose limitation (Art. 5(1)(b))** | Anti-weaponization clause (§8.6) helps — markers MUST NOT be used as blacklists. But enforcement is normative-only, not technical. |
| **Data minimization (Art. 5(1)(c))** | Core schema is minimal (8 fields). Modules are optional. Minimal disclosure (§10.3) is available. **Good design.** |
| **Storage limitation (Art. 5(1)(e))** | Sunset policies (§8.5) address this. But they are OPTIONAL, not default. |
| **Accuracy (Art. 5(1)(d))** | `selfAttested` flag is honest. Right of reply (§8.4) allows correction. But immutable signatures prevent rectification of the original record. |

### 4.3 Risk Assessment

| Risk | Likelihood | Severity | Overall | Mitigation in Spec |
|---|---|---|---|---|
| Re-identification via DID linkage | High | High | **CRITICAL** | Encryption (§10.1), redaction (§10.2) — optional |
| Inability to erase anchored data | High | High | **CRITICAL** | Sunset policies, encryption — optional |
| Reputation weaponization | Medium | High | **HIGH** | Anti-weaponization clause (§8.6), coercion detection (§8.1) |
| Cross-border transfer without safeguards | High | Medium | **HIGH** | None in spec |
| Profiling via coercion labels | Medium | Medium | **MEDIUM** | Labels are advisory only |
| Identity claim aggregation | Medium | High | **HIGH** | Conduit-only disclaimer — shifts liability but not GDPR obligation |
| Witness privacy violation | Medium | Medium | **MEDIUM** | No specific protection |
| Special category data inference | Low | High | **MEDIUM** | Possible via departure patterns (e.g., leaving a health platform) |

### 4.4 Residual Risk After Mitigations

Even with all spec-provided mitigations enabled:
- **Chain-anchored markers remain indelible** — crypto-shredding is the only option
- **Distributed markers cannot be recalled** — the portable design is inherently at odds with centralized erasure
- **No supervisory authority consultation mechanism** — Art. 36 requires prior consultation when residual risk is high

**DPIA Outcome: HIGH residual risk. Prior consultation with supervisory authority recommended under Art. 36.**

---

## 5. Trust Enhancers and Privacy Obligations

### 5.1 Identity Claims (`IdentityClaimAttachment`)

The spec's conduit disclaimer is notable:

> "Cellar Door does NOT verify, resolve, or store these claims. They are accepted as opaque blobs."

**This does not eliminate GDPR obligations.** Under Art. 4(2), "processing" includes collection, storage, and transmission — even of opaque blobs. The controller processes personal data regardless of whether they "verify" it.

| Trust Enhancer | Privacy Impact | GDPR Obligation |
|---|---|---|
| `identityClaims` (scheme + value) | Bridges pseudonymous DID to real identity (X.509, OAuth) — **destroys pseudonymity** | Art. 6 lawful basis required. Art. 9 may apply if identity reveals protected characteristics. DPIA mandatory. |
| `witnesses` (witnessDid + attestation) | Third-party personal data about both witness and subject | Joint controller analysis needed (Art. 26). Witness must have lawful basis to attest. |
| `timestamps` (TSA receipts) | Low privacy impact — hash + timestamp, no personal content | Minimal — but TSA URL may reveal processing location. |
| `TenureAttestation` | Employment-analogous data | May trigger labor law protections in some jurisdictions. |

### 5.2 The "Conduit" Defense

The spec repeatedly positions Cellar Door as a "conduit" for trust enhancers. This echoes the EU e-Commerce Directive's intermediary liability framework (Art. 12–14). However:

- GDPR has **no conduit exemption**. Art. 4(7) defines "controller" based on determination of *purposes and means* — not on verification of content.
- If the EXIT protocol *defines the schema* for identity claims, it determines the means of processing.
- Deployments using trust enhancers must conduct a **joint controller assessment** with identity claim issuers.

**Risk Rating: HIGH** for deployments with identity claims. **LOW** for markers without trust enhancers.

---

## 6. Cross-Border Data Transfer Implications

### 6.1 The Portability Problem

EXIT markers are *designed* to be portable across system boundaries. This is the core value proposition. It is also a GDPR Chapter V nightmare.

| Scenario | Transfer Mechanism Needed |
|---|---|
| Subject carries marker from EU platform to US platform | Art. 46 — SCCs or adequacy decision required |
| Marker anchored to public blockchain | Transfer to *every jurisdiction where nodes operate* — no practical SCC mechanism |
| Git ledger pushed to GitHub (US) | Art. 46 — SCCs with GitHub (or rely on EU-US Data Privacy Framework) |
| TSA timestamp from non-EU TSA | Data transfer to TSA jurisdiction |
| Witness in non-EU jurisdiction countersigns | Art. 49 derogations (explicit consent) may apply |

### 6.2 Schrems II Implications

Post-*Schrems II* (C-311/18), transfers to countries without adequacy decisions require supplementary measures. For EXIT markers:

- **Encryption (§10.1)** qualifies as a supplementary measure if keys remain in the EU
- **Redacted markers** reduce transfer risk (less personal data crosses borders)
- **Chain anchoring** to public blockchains effectively makes data globally available — **no supplementary measure is sufficient** for unencrypted personal data on public chains

### 6.3 EDPB Guidance on Blockchain

The EDPB has not issued specific blockchain guidance, but CNIL (France) published guidance in 2018:
- Store personal data off-chain; store only hashes on-chain
- Use commitment schemes (hash of data, not data itself)
- Implement crypto-shredding for erasure compliance

The EXIT spec's `MinimalAnchorRecord` (hash + timestamp only) aligns with CNIL guidance. Full `AnchorRecord` (includes `subjectDid`) does not.

**Risk Rating: CRITICAL** for chain-anchored markers with personal data. **MEDIUM** for encrypted/redacted portable markers. **LOW** for hash-only anchors.

---

## 7. Remediation Recommendations

### Priority 1 — CRITICAL (Before Any EU Deployment)

| # | Recommendation | Addresses |
|---|---|---|
| R1 | **Make encryption mandatory for markers containing personal data**, not optional. §10.1 should be MUST, not MAY. | Art. 17, Art. 32, Art. 25 |
| R2 | **Implement crypto-shredding as the primary erasure mechanism.** Subject-controlled key destruction = functional erasure. Document this in the spec. | Art. 17 |
| R3 | **Prohibit `subjectDid` in `AnchorRecord` for chain anchoring.** Only `MinimalAnchorRecord` (hash + timestamp) should be used on-chain. | Art. 17, Chapter V |
| R4 | **Add an erasure cascade API** that propagates deletion across claim store, git ledger, and local anchor records. Extend `deleteBySubject`. | Art. 17, Art. 19 |
| R5 | **Conduct Art. 26 joint controller assessment** for deployments using trust enhancers (identity claims, witness attestations). | Art. 26 |

### Priority 2 — HIGH (Within 3 Months of Deployment)

| # | Recommendation | Addresses |
|---|---|---|
| R6 | **Make sunset policies default-on** with configurable duration. Suggested default: 730 days for voluntary exits, 365 days for forced exits. | Art. 5(1)(e), §8.5 |
| R7 | **Add erasure audit logging** to ClaimStore — record that erasure was requested/performed without retaining erased data. | Art. 5(2) accountability |
| R8 | **Add Art. 19 notification mechanism** — best-effort notification to known marker recipients when erasure is performed. | Art. 19 |
| R9 | **Document lawful basis guidance** for deployers — recommend Art. 6(1)(f) legitimate interest with balancing test template. | Art. 6 |
| R10 | **Add witness consent mechanism** — witnesses must consent to their DID and attestation being included in the marker. | Art. 6, Art. 14 |

### Priority 3 — MEDIUM (Ongoing)

| # | Recommendation | Addresses |
|---|---|---|
| R11 | **Publish a privacy notice template** for EXIT deployers covering Art. 13/14 requirements. | Art. 13, Art. 14 |
| R12 | **Add DPIA template** to the spec for deployers (the spec already recommends DPIA in §10.4 and §11.1 — provide tooling). | Art. 35 |
| R13 | **Address the `coercionLabel` profiling risk** — labels like `pattern_of_abuse` could constitute automated profiling under Art. 22. Add human review requirement. | Art. 22 |
| R14 | **Add data protection contact field** to markers or claim stores so subjects know who to contact for erasure requests. | Art. 13(1)(b) |

---

## 8. Article-by-Article GDPR Compliance Summary

| Article | Topic | Compliance | Rating |
|---|---|---|---|
| Art. 4(1) | Personal data definition | EXIT markers are personal data | ⚠️ Acknowledged |
| Art. 5(1)(a) | Lawfulness, fairness, transparency | No privacy notice template provided | 🔴 Gap |
| Art. 5(1)(b) | Purpose limitation | Anti-weaponization clause helps | 🟡 Partial |
| Art. 5(1)(c) | Data minimization | Minimal core schema, optional modules | 🟢 Good |
| Art. 5(1)(d) | Accuracy | Right of reply, selfAttested flag | 🟡 Partial — immutability limits rectification |
| Art. 5(1)(e) | Storage limitation | Sunset policies available but optional | 🟡 Partial |
| Art. 5(1)(f) | Integrity & confidentiality | Encryption available, signatures ensure integrity | 🟢 Good |
| Art. 5(2) | Accountability | No erasure audit logging | 🔴 Gap |
| Art. 6 | Lawful basis | No guidance for deployers | 🔴 Gap |
| Art. 13–14 | Information obligations | No privacy notice template | 🔴 Gap |
| Art. 17 | Right to erasure | `deleteBySubject` exists but insufficient for distributed data | 🔴 Critical Gap |
| Art. 19 | Notification re: erasure | No mechanism | 🔴 Gap |
| Art. 20 | Data portability | Inherent — markers are portable by design | 🟢 Excellent |
| Art. 22 | Automated profiling | Coercion labels risk profiling without human review | 🟡 Risk |
| Art. 25 | Data protection by design | Privacy module exists but is optional | 🟡 Partial |
| Art. 26 | Joint controllers | No joint controller assessment for trust enhancers | 🔴 Gap |
| Art. 32 | Security of processing | XChaCha20-Poly1305, Ed25519/P-256 — strong crypto | 🟢 Good |
| Art. 35 | DPIA | Spec recommends DPIA but provides no template | 🟡 Partial |
| Art. 44–49 | International transfers | No transfer mechanism for portable markers | 🔴 Critical Gap |

---

## 9. Positive Observations

The spec demonstrates unusual privacy sophistication for a protocol specification:

1. **Explicit GDPR awareness** — §4.5, §4.6, §10.4 all call out GDPR obligations
2. **Privacy module (§10)** — Encryption, redaction, minimal disclosure are well-designed
3. **Sunset policies (§8.5)** — Time-limiting reputation effects is privacy-protective
4. **Anti-weaponization clause (§8.6)** — Normative prohibition on blacklist use
5. **`deleteBySubject` in ClaimStore** — Shows intent to support erasure
6. **Conduit architecture for trust enhancers** — Minimizes protocol-level liability (even if not a complete GDPR defense)
7. **`selfAttested` honesty flag** — Transparency about data reliability
8. **Right of reply (§8.4)** — Enables data subjects to contest inaccurate records

The protocol is significantly more privacy-aware than most decentralized identity specifications. The gaps identified are addressable.

---

*Assessment prepared by P23 (DPO/GDPR Specialist). This assessment is advisory and does not constitute legal advice. Organizations deploying EXIT should engage qualified data protection counsel in their jurisdiction.*
