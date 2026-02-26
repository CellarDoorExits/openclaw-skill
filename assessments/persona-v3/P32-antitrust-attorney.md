# P32 — Antitrust / Competition Law Assessment

**Assessor:** Antitrust / Competition Law Attorney  
**Date:** 2026-02-25  
**Protocols:** EXIT_SPEC v1.1, ENTRY_SPEC v1.0 (Cellar Door — Passage Protocol)  
**Framework:** Sherman Act §§1–2, EU TFEU Art. 101–102, Digital Markets Act (DMA), Digital Services Act (DSA)

---

## Executive Summary

The Passage Protocol contains strong structural protections against lock-in (the non-blocking departure invariant is genuinely good) but introduces significant antitrust surface area on the ENTRY side — particularly through `blockedOrigins`, admission policies, and the fundamental asymmetry that "departure is a right, admission is a privilege." The spec authors clearly recognized the `blockedOrigins` risk (§4.4 antitrust warning), but the warning alone is insufficient. The protocol's design enables several anticompetitive scenarios that require structural safeguards, not just normative language.

**Overall Antitrust Risk: MODERATE-HIGH**

---

## Scenario Analysis

### Scenario 1: Selective Refusal to Honor Competitors' EXIT Markers

**Description:** A dominant platform implements ENTRY admission policies that effectively reject EXIT markers from competitors — e.g., setting `allowedExitTypes: ["voluntary"]` while knowing a competitor predominantly issues `forced` or `constructive` exits, or setting `maxDepartureAge` to an unreasonably short window that only their own integrated services can meet.

**Antitrust Theory:** Refusal to deal / exclusive dealing. Analogous to *Aspen Skiing v. Aspen Highlands* (1985) — a dominant firm refusing interoperability it previously offered. Under TFEU Art. 102, this is abuse of dominance through discriminatory trading conditions.

**Risk Rating:** 🔴 **HIGH**

**Analysis:** The admission policy structure (§4) is facially neutral but trivially weaponizable. A platform with market power can craft policies that appear objective but discriminate against specific origins. The `requiredModules` field is particularly dangerous — requiring Module D (economic) or Module A (lineage) that competitors don't implement creates a technical barrier masquerading as a quality standard.

**Key concern:** There is no obligation for ENTRY platforms to justify their admission policies. The spec says "the protocol defines the mechanism, not the threshold" (§4). This is correct as protocol design but creates an antitrust vacuum.

---

### Scenario 2: The Non-Blocking Departure Invariant vs. Lock-In

**Description:** Does EXIT's guarantee that "disputes MUST NOT block transitions" (§5.4) actually prevent anticompetitive lock-in?

**Risk Rating:** 🟡 **MODERATE** — the invariant is necessary but not sufficient.

**Analysis:**

The non-blocking invariant is the protocol's strongest antitrust feature. It maps cleanly to what competition law calls "switching costs" — by guaranteeing departure is always available, EXIT structurally prevents the most egregious form of lock-in.

However, lock-in operates on multiple dimensions:

1. **Technical lock-in:** ✅ Solved. You can always create an EXIT marker.
2. **Reputational lock-in:** ⚠️ Partially addressed. An origin can issue `disputed` status and contested `originStatus`, creating reputational damage that follows the entity. Sunset policies (§8.5) mitigate but don't eliminate.
3. **Data lock-in:** ⚠️ Module B references state by hash, not by content. The origin can refuse to make the actual state available (the hash is useless without the data). EXIT explicitly says "EXIT stores the hash, NEVER the state itself."
4. **Network effect lock-in:** ❌ Not addressed. If all your connections/reputation/history are on the origin platform, technical ability to leave is hollow without data portability.

The departure invariant prevents *Berlin Wall* scenarios but doesn't prevent *golden handcuffs* scenarios.

---

### Scenario 3: Dominant Platform Controlling Both EXIT and ENTRY — Walled Garden

**Description:** A platform like Google or Apple controls both the EXIT implementation (as origin) and the ENTRY implementation (as destination) across its ecosystem of services.

**Risk Rating:** 🔴 **HIGH**

**Analysis:**

This is the most dangerous scenario. A vertically integrated platform can:

1. **As origin:** Issue `disputed` or `forced` exit types for departing entities, poisoning their EXIT markers.
2. **As destination:** Set admission policies that favor entities arriving from its own ecosystem (e.g., `blockedOrigins` excluding competitors, `requiredModules` that only its own EXIT implementation produces).
3. **As both:** Create a closed loop where entities can only move freely within the ecosystem. EXIT markers from inside the garden are clean (`voluntary`, `good_standing`, `mutual` confirmation). EXIT markers going *out* are dirty (`disputed`, `self_only` confirmation). ENTRY policies for coming *in* require the clean markers only the ecosystem produces.

This is structurally identical to Apple's App Store / IAP ecosystem — technically open (you can leave!) but practically closed.

**The confidence scoring system (§7.4) amplifies this.** A platform that controls origin attestation can manipulate every input to the confidence score: status confirmation level, tenure attestation, lineage depth. A departing entity gets `self_only` (0.05 weight) while entities moving within the ecosystem get `mutual` or `witnessed` (0.40 weight).

---

### Scenario 4: `blockedOrigins` as Antitrust Landmine

**Description:** The ENTRY admission policy's `blockedOrigins` field allows destinations to categorically deny admission to entities from specific origin platforms.

**Risk Rating:** 🔴 **HIGH** (unilateral) / 🔴🔴 **CRITICAL** (coordinated)

**Analysis:**

The spec authors included an antitrust warning (ENTRY §4.4) — credit where due. But the warning is a speed limit sign, not a speed bump. There's no structural enforcement.

**Unilateral `blockedOrigins`:** A single dominant platform blocking a competitor's origins raises TFEU Art. 102 / Sherman Act §2 concerns if the blocking platform has market power. Analogy: *Microsoft v. Commission* (tying/interoperability). A platform refusing to accept entities from a competitor is functionally equivalent to refusing interoperability.

**Coordinated `blockedOrigins`:** This is the nuclear scenario. If platforms share or coordinate blocklists — even informally — it's a textbook Sherman Act §1 / TFEU Art. 101 horizontal agreement to exclude competitors. Analogy: *United States v. Apple (e-books)* — coordinated action through a common infrastructure. The protocol itself becomes the mechanism of coordination.

**The field name itself is problematic.** `blockedOrigins` invites categorical thinking. A field called `securityExclusions` with mandatory justification would be marginally better, but the real issue is structural.

---

### Scenario 5: Comparison to DMA/DSA Data Portability Requirements

**Risk Rating:** 🟡 **MODERATE** — significant gaps vs. regulatory requirements.

**Analysis:**

The Digital Markets Act (Regulation 2022/1925) Art. 6(9) requires gatekeepers to provide "effective portability of data generated through the activity of a business user or end user." The DSA complements with transparency requirements.

**Where EXIT/ENTRY aligns with DMA:**
- Non-blocking departure maps to Art. 6(9) portability rights
- Content-addressed markers provide verifiable records
- The protocol is non-custodial (no central gatekeeper)

**Where EXIT/ENTRY falls short:**
- **No actual data portability.** EXIT markers reference state by hash (Module B) but don't transport data. DMA requires *effective* portability — the data itself, not a hash of it. This is a critical gap.
- **No continuous real-time access.** DMA Art. 6(9) requires ongoing access, not just departure snapshots.
- **No interoperability obligation.** The protocol is voluntary. DMA Art. 7 requires gatekeepers to enable interoperability. Nothing in EXIT/ENTRY compels a platform to implement the protocol.
- **Admission asymmetry undermines portability.** Even if you can leave with a clean EXIT marker, if destinations can freely deny ENTRY, the portability right is theoretical.

**Assessment:** EXIT/ENTRY is a *complement* to DMA, not a substitute. It provides the cryptographic infrastructure for portability but lacks the mandatory participation and actual data transfer that DMA requires.

---

### Scenario 6: Consortium Exclusion via EXIT

**Description:** A consortium of platforms adopts EXIT/ENTRY as a standard, then uses the protocol's mechanisms to collectively exclude non-members.

**Risk Rating:** 🔴🔴 **CRITICAL**

**Analysis:**

This is the *VISA/Mastercard* scenario. A group of platforms could:

1. **Form a "trust ring":** All members implement EXIT/ENTRY and extend `mutual` or `witnessed` status confirmations to each other. Non-members only get `self_only`.
2. **Coordinate admission policies:** Members set `requiredModules` that only member platforms produce, or require minimum confidence scores that non-member EXIT markers can't achieve.
3. **Share blocklists:** Coordinate `blockedOrigins` lists that exclude non-member platforms (§4.4 warning notwithstanding).
4. **Control the spec:** As "Cellar Door Contributors," the consortium controls spec evolution. They can add required fields, change confidence scoring weights, or introduce new modules that only members implement.

This is a per se illegal horizontal restraint under Sherman Act §1. *Fashion Originators' Guild v. FTC* (1941) — a group boycott through a shared infrastructure is anticompetitive regardless of justification.

The anti-weaponization clause (EXIT §8.6) says markers "MUST NOT be used as blacklists." But the exclusion doesn't happen at the EXIT layer — it happens at ENTRY, where admission is explicitly a "privilege." The anti-weaponization clause has no jurisdiction over ENTRY admission policies.

---

## Risk Summary

| # | Scenario | Risk | Primary Theory |
|---|---|---|---|
| 1 | Selective refusal to honor competitors' markers | 🔴 HIGH | Refusal to deal / Art. 102 |
| 2 | Non-blocking invariant vs. lock-in | 🟡 MODERATE | Switching costs / essential facility |
| 3 | Vertical control of EXIT + ENTRY | 🔴 HIGH | Vertical foreclosure / Art. 102 |
| 4a | Unilateral `blockedOrigins` | 🔴 HIGH | Art. 102 / §2 Sherman |
| 4b | Coordinated `blockedOrigins` | 🔴🔴 CRITICAL | §1 Sherman / Art. 101 |
| 5 | DMA/DSA compliance gaps | 🟡 MODERATE | Regulatory non-compliance |
| 6 | Consortium exclusion | 🔴🔴 CRITICAL | Group boycott / per se illegal |

---

## Recommended Structural Safeguards

### S1: Non-Discrimination Obligation for ENTRY (HIGH PRIORITY)

Add a normative requirement: platforms with significant market share (or designated gatekeepers under DMA) MUST NOT discriminate in admission policies based on origin identity. `blockedOrigins` SHOULD be restricted to documented security threats, not competitive exclusion.

**Proposed language:** *"Admission policies MUST be origin-agnostic for platforms serving as general-purpose destinations. Security-motivated origin restrictions MUST be documented, proportionate, and subject to review."*

### S2: Rename and Constrain `blockedOrigins` (HIGH PRIORITY)

- Rename to `securityExclusions` to signal intended use
- Require a `justification` field for each blocked origin
- Add a sunset/review requirement (blocked origins must be re-evaluated periodically)
- Add a normative prohibition on sharing or coordinating exclusion lists between platforms

### S3: Mandatory Minimum Interoperability (MEDIUM PRIORITY)

Define a "minimum viable admission" — a floor below which ENTRY platforms cannot go for spec-compliant implementations. Any valid, cryptographically verified EXIT marker with `voluntary` type MUST be accepted for at least `reviewed` admission. Platforms can impose probation, capability restrictions, etc., but cannot categorically deny.

### S4: Data Portability Layer (HIGH PRIORITY for DMA alignment)

Module B (State Snapshot) needs a data retrieval obligation, not just a hash reference. Origins SHOULD be required to make state data available for a reasonable period post-departure (90 days minimum). Without this, EXIT is a receipt without the goods.

### S5: Confidence Score Transparency (MEDIUM PRIORITY)

Require that confidence scoring models be published and auditable. Proprietary scoring models that systematically disadvantage certain origins are the antitrust equivalent of Google's search algorithm favoritism (*Google Shopping* case, 2017).

### S6: Anti-Coordination Clause for ENTRY (HIGH PRIORITY)

The anti-weaponization clause (EXIT §8.6) applies only to EXIT markers. ENTRY needs its own:

**Proposed language:** *"Destination platforms MUST NOT coordinate admission policies, share blocklists, or collectively agree on admission criteria with other destination platforms for the purpose of excluding competitors. Such coordination constitutes a violation of this specification and may constitute an illegal agreement in restraint of trade."*

### S7: Independent Governance (LONG-TERM)

If EXIT/ENTRY becomes infrastructure, governance cannot rest with a consortium of implementing platforms. An independent standards body (analogous to W3C, IETF) should steward the spec. This prevents the *VISA/Mastercard* capture scenario.

### S8: Regulatory Safe Harbor Mapping (MEDIUM PRIORITY)

Document explicit mappings between EXIT/ENTRY mechanisms and DMA/DSA obligations. This helps platforms demonstrate compliance and helps regulators evaluate the protocol's adequacy.

---

## Conclusion

The Passage Protocol's authors have built something architecturally sound with genuine protections against the most obvious forms of abuse. The non-blocking departure invariant, the anti-weaponization clause, the coercion detection heuristics, and the `blockedOrigins` antitrust warning all demonstrate awareness of competition concerns.

However, **the fundamental asymmetry — "departure is a right, admission is a privilege" — creates a structural vulnerability.** In competition law, the right to leave is worthless if no one will let you in. The protocol correctly identifies this as philosophically intentional, but philosophy doesn't override antitrust law when infrastructure becomes essential.

The most dangerous scenarios (coordinated `blockedOrigins`, consortium exclusion, vertical walled gardens) are not hypothetical — they are predictable outcomes when dominant platforms adopt infrastructure protocols. Every interoperability standard in history has faced this: SMTP, HTTP, OAuth, VISA, MLS. The ones that survived as open infrastructure had structural safeguards built in, not just normative warnings.

**Bottom line:** The EXIT side is well-designed from an antitrust perspective. The ENTRY side needs structural constraints to prevent the admission privilege from becoming a weapon of exclusion. Add them now, before adoption creates path dependency.

---

*This assessment is legal analysis for protocol design purposes. It does not constitute legal advice. Specific antitrust liability depends on market definition, market power analysis, and jurisdiction-specific enforcement.*
