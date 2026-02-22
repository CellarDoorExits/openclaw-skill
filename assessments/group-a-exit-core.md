# Group A Assessment: EXIT Core Internal Consistency

**Assessor:** Hawthorn  
**Date:** 2026-02-22  
**Files reviewed:** EXIT_SPEC_v1.1.md, EXIT_SPEC_v1.md, EXIT_PAPER_v3.md, DECISIONS.md, LEGAL.md, SECURITY.md, cellar-door-benchmarks.md

---

## 1. Internal Consistency Check

### 1.1 Agreements (docs are broadly aligned)

The core schema (7 fields + proof), ceremony state machine (7 states, 3 paths), module structure (A–F), and fundamental design principles are consistent across all documents. Key decisions (D-001 through D-013) are faithfully reflected in both spec versions and the paper.

### 1.2 Contradictions and Discrepancies

**C-1: Tenure weight formula — Paper vs Spec v1.1**

- **Spec v1.1 §7.3:** `weight = min(1, log₂(days + 1) / log₂(731))`
- **Paper §4.3.2:** `tenureWeight = min(1.0, log2(days + 1) / 10)`
- These are *different formulas*. `log₂(731) ≈ 9.51`, not 10. The spec uses a calibrated denominator (731 days ≈ 2 years); the paper uses a round number. They produce different outputs for all inputs.

**C-2: Confidence scoring formula — Paper vs Spec v1.1**

- **Spec v1.1 §7.4:** Additive model with fixed weight bands: `status [0–0.4] + tenure [0–0.3] + lineage [0–0.15] + commit_reveal [0–0.15]`
- **Paper §4.3.3:** Multiplicative model: `baseScore × attestationMultiplier × tenureWeight × lineageWeight`
- These are fundamentally different mathematical structures. An additive model sums components; a multiplicative model means any zero factor zeroes the whole score.

**C-3: Test vector count — Paper vs Spec v1.1**

- **Paper §8.2:** "including all four specification test vectors" and "Table 4" lists vectors 12.1–12.4
- **Spec v1.1 §17:** Has 9 test vectors (17.1–17.9), not 4
- **Spec v1.0 §12:** Has 4 test vectors (12.1–12.4)
- The paper references the v1.0 test vector numbering (§12.x) and count (4), not the v1.1 vectors.

**C-4: Lines of code — Paper only**

- **Paper §8.1:** "approximately 2,400 lines"
- No other doc corroborates this. Not a contradiction per se, but unverifiable from the doc set.

**C-5: Module C rightOfReply — Spec v1.1 test vector inconsistency**

- **Spec v1.1 §4.3** defines Module C fields including `rightOfReply` as a sub-field
- **Spec v1.1 §17.6** test vector places `rightOfReply` inside a `dispute` object, but Module C defines the top-level field names as `disputes`, `evidenceHash`, `challengeWindow`, `counterpartyAcks`, `originStatus`, `rightOfReply` — there's no `dispute` (singular) wrapper object in the schema definition. The test vector uses `dispute.originStatus` and `dispute.rightOfReply` instead of the flat Module C structure.

**C-6: Design goals — v1.0 has 5, v1.1 has 6**

- **Spec v1.0 §1.1:** 5 goals (available, minimal, verifiable, portable, non-custodial)
- **Spec v1.1 §1.1:** 6 goals — adds "Non-weaponizable" with reference to §8.6
- **Paper §3.1:** Lists 5 goals matching v1.0
- The paper omits the v1.1 "non-weaponizable" design goal.

**C-7: SECURITY.md references deferred decision D-D01 for dispute resolution**

- **SECURITY.md §1.2:** "Future: formal dispute resolution and arbiter mechanisms (deferred decision D-D01)"
- **DECISIONS.md D-D01:** Is about "DID Method Recommendation," NOT dispute resolution
- Incorrect cross-reference.

**C-8: Proof canonicalization — Paper vs Spec**

- **Paper §5.3:** "Proof canonicalization follows the JSON Canonicalization Scheme (JCS) per `eddsa-jcs-2022`"
- **Spec v1.1 §13.1:** Defines custom canonical JSON (recursive key sorting, no whitespace) — does NOT reference JCS or `eddsa-jcs-2022`
- **Spec v1.1 §3.5:** Says data signed is "the canonical JSON form (§13.1) of the marker excluding the `proof` and `id` fields"
- JCS (RFC 8785) and the spec's custom canonicalization may differ in edge cases (e.g., Unicode normalization, number serialization). The paper and spec disagree on which canonicalization is used.

---

## 2. Version Drift (v1.0 → v1.1)

### 2.1 Key Differences

| Feature | v1.0 | v1.1 |
|---|---|---|
| Trust mechanisms (§7) | Absent | StatusConfirmation, commit-reveal, tenure, confidence scoring |
| Ethics guardrails (§8) | Absent | Coercion/weaponization/laundering detection, right of reply, sunset, anti-weaponization |
| Key management (§9) | Absent | KERI KELs, pre-rotation, key compromise recovery |
| Privacy (§10) | Basic GDPR + ZK roadmap | XChaCha20-Poly1305 encryption, field redaction, minimal disclosure |
| Chain anchoring (§11) | Absent (Module F existed but no anchor record spec) | Anchor records, Merkle batch operations |
| Interop (§12) | Basic (JSON-LD, VC, DID) | Adds transport serialization, middleware, lifecycle hooks, events |
| Extended fields | None | `preRotationCommitment`, `coercionLabel`, `sunsetDate` |
| Section numbering | Legal=§7, Security=§8, Privacy=§9 | Legal=§14, Security=§15 |
| Test vectors | 4 (§12.1–12.4) | 9 (§17.1–17.9) |
| Design goals | 5 | 6 (adds non-weaponizable) |
| Proof type | `"Ed25519Signature2020"` (example) | `"Ed25519Signature2020"` (MUST) |
| Invariants | 4 | 5 (adds "States MUST only move forward") |

### 2.2 Paper Alignment

**The paper is primarily aligned with v1.0 but partially incorporates v1.1 concepts.** Evidence:

- References v1.0 test vector numbering (§12.x) and count (4) → **v1.0**
- Lists 5 design goals → **v1.0**
- Mentions commit-reveal, confidence scoring, tenure → **v1.1 concepts**, but with different formulas
- Does NOT mention: coercion detection, weaponization detection, laundering detection, right of reply, sunset policies, anti-weaponization clause, KERI KELs, encryption, redaction, anchor records, transport serialization, middleware, lifecycle hooks → **missing v1.1 features**
- Paper §7.3 mentions "coercion detection" and "weaponization detection" briefly as "ethics guardrails" but describes them differently than v1.1 §8 (paper frames them as commit-reveal + pattern tracking; spec has formal signal tables and label enums)
- Paper mentions "153 passing tests" — spec v1.1 has 9 test vectors; unclear how 153 maps

**Verdict:** Paper is a v1.0-era document with early v1.1 trust mechanism concepts bolted on. It has NOT been updated to reflect the full v1.1 spec.

---

## 3. Completeness

### 3.1 Are all 13 decisions reflected in the spec?

| Decision | In v1.0? | In v1.1? | Notes |
|---|---|---|---|
| D-001 (Dual format) | ✅ §10.2/1.2 | ✅ §12.3/1.2 | |
| D-002 (Layered verification) | ✅ §6 | ✅ §6 | |
| D-003 (Multi-source status) | ✅ §3.1, §4.3 | ✅ §3.1, §4.3 | |
| D-004 (TypeScript first) | ❌ Not in spec | ❌ Not in spec | Implementation decision, appropriate to omit |
| D-005 (Standalone package) | ❌ Not in spec | ❌ Not in spec | Repo decision, appropriate to omit |
| D-006 (Contests don't block) | ✅ §5.3, §5.4 | ✅ §5.3, §5.4 | |
| D-007 (Apache 2.0) | ✅ Header | ✅ Header | |
| D-008 (Legal hold) | ✅ §3.3 | ✅ §3.3 | |
| D-009 (Self-attestation clarity) | ✅ §3.2 | ✅ §3.2 | |
| D-010 (Emergency justification) | ✅ §3.2, §5.3 | ✅ §3.2, §5.3 | |
| D-011 (Key compromise type) | ✅ §3.5 | ✅ §3.6 | |
| D-012 (No public registry) | ✅ §11 | ✅ §16 | |
| D-013 (Status non-authoritative) | ✅ §7 (via LEGAL ref) | ✅ §14 (via LEGAL ref) | |

All decisions appropriately reflected.

### 3.2 Does the paper cover all spec features?

**Missing from paper (v1.1 features):**
- StatusConfirmation levels and derivation rules
- Coercion label enum and signal table
- Weaponization detection patterns/thresholds
- Laundering detection
- Right of reply structure
- Sunset policies
- Anti-weaponization clause (normative)
- KERI key event logs (inception, rotation)
- Pre-rotation commitments
- Key compromise recovery / CompromiseLink
- XChaCha20-Poly1305 encryption
- Field-level redaction
- Minimal disclosure
- Anchor records / minimal anchors
- Merkle batch operations (described in benchmarks but not formally in paper)
- Transport serialization format
- Express middleware
- Lifecycle hooks
- Event emission
- Extended fields (`preRotationCommitment`, `coercionLabel`, `sunsetDate`)
- `keyCompromise` as exit type (listed in schema but not discussed in paper's key decisions section — wait, it IS in D-011 discussion §3.5)

**Present in paper but underspecified relative to v1.1:**
- Commit-reveal (paper has it, but different detail level)
- Confidence scoring (paper has it, but different formula)
- Tenure (paper has it, but different formula)

---

## 4. Accuracy — Benchmark Numbers

### 4.1 Paper §8.2 vs cellar-door-benchmarks.md

| Metric | Paper | Benchmarks | Match? |
|---|---|---|---|
| Core unsigned size | 442 bytes | 442 bytes | ✅ |
| Core signed size | 586 bytes | 586 bytes | ✅ |
| All modules size | 1,294 bytes | 1,294 bytes | ✅ |
| Ed25519 sign raw | 0.46 ms (2,176 ops/s) | 0.460 ms (2,176 ops/s) | ✅ |
| Ed25519 verify raw | 0.004 ms (227,790 ops/s) | 0.004 ms (227,790 ops/s) | ✅ |
| signMarker full | 0.46 ms (2,199 ops/s) | 0.455 ms (2,199 ops/s) | ✅ |
| verifyMarker full | 1.9 ms (525 ops/s) | 1.903 ms (525 ops/s) | ✅ |
| Cooperative path | 0.91 ms | 0.905 ms | ✅ (rounded) |
| Unilateral path | 0.91 ms | 0.913 ms | ✅ (rounded) |
| Emergency path | 1.0 ms | 1.000 ms | ✅ |
| quickExit() | 0.74 ms (1,355 ops/s) | 0.738 ms (1,355 ops/s) | ✅ |
| Merkle 10 build | 2.7 ms | 2.683 ms | ✅ (rounded) |
| Merkle 1000 build | 22.7 ms | 22.747 ms | ✅ (rounded) |
| Merkle 10 proof gen | 1.1 ms | 1.099 ms | ✅ (rounded) |
| Merkle 1000 proof gen | 18.4 ms | 18.372 ms | ✅ (rounded) |
| Merkle proof verify | "under 0.55 ms" | 0.547/0.071/0.374 ms | ✅ |
| Schema validation valid | 813,436 ops/s | 813,436 ops/s | ✅ |
| Schema validation invalid | 773,633 ops/s | 773,633 ops/s | ✅ |

**All benchmark numbers match** (paper uses rounded values from the raw benchmark data). No discrepancies.

---

## 5. Terminology Consistency

### 5.1 Consistent Terms (good)
- "EXIT marker" — used consistently everywhere
- "subject" / "origin" / "verifier" / "witness" — consistent
- "ceremony" — consistent
- Module letters (A–F) — consistent
- Exit types and status values — consistent enums everywhere

### 5.2 Inconsistencies

**T-1: "lineage" vs "lineageChain" vs "lineage chain"**
- Spec: Module A field is `lineageChain` (camelCase); prose uses "lineage chain" and "lineage"
- Paper: Uses "lineage chain," "lineage chains," "lineage verification"
- No issue with "LINE" vs "LINEAGE" — the term "LINE" does not appear in any doc

**T-2: "Confidence Score" vs "confidence scoring"**
- Spec v1.1 §2: Defines "Confidence Score" as a term
- Paper §4.3.3: Uses "confidence score" (lowercase) and "confidence scoring"
- Minor — acceptable variation

**T-3: "DataIntegrityProof" vs "proof"**
- Spec v1.1 §7.2 ExitCommitment table: calls the proof field type `DataIntegrityProof`
- Spec v1.1 §3.5 core: calls it just `proof` object
- §18 TypeScript appendix: lists `DataIntegrityProof` as a type alias
- Minor inconsistency in naming the proof type

**T-4: "exit-marker" vs "exit-door" — neither term appears**
- These terms from the task prompt do not appear in any document. Not an issue.

**T-5: "Module C" field naming**
- Spec v1.1 §4.3: Module C has `rightOfReply` as a top-level module field
- Spec v1.1 §8.4: Defines `RightOfReply` structure separately
- Spec v1.1 §17.6: Nests it inside a `dispute` object — introduces an undeclared wrapper

**T-6: LEGAL.md and SECURITY.md version references**
- Both say "Version: 1.0-draft" and "companion document to EXIT_SPEC_v1"
- But they cover concepts from v1.1 (e.g., LEGAL.md §7.2 mentions ZK selective disclosure roadmap, which is in both versions)
- They have NOT been updated to say "companion to v1.1"

---

## 6. Recommendations (Prioritized)

### Priority 1: Critical (blocks publication)

**R-1: Reconcile confidence scoring formula between paper and spec.**
The paper uses a multiplicative model; the spec uses an additive model. These produce fundamentally different results. Pick one, update the other. *Recommendation: the spec's additive model is better-specified with explicit weight bands. Update the paper.*

**R-2: Reconcile tenure weight formula between paper and spec.**
`log₂(days+1)/10` ≠ `log₂(days+1)/log₂(731)`. Update the paper to match the spec's calibrated formula, or vice versa.

**R-3: Reconcile canonicalization approach.**
Paper says JCS/`eddsa-jcs-2022`; spec defines custom canonical JSON. These are different standards. Clarify which is normative. If the implementation uses the spec's custom approach, update the paper.

### Priority 2: High (should fix before publication)

**R-4: Update paper to reflect v1.1.**
The paper is stuck between v1.0 and v1.1. It should either: (a) be explicitly labeled as describing v1.0 with forward references to v1.1, or (b) be updated to cover v1.1 features (ethics guardrails, KERI, encryption, redaction, anchoring). Given v1.1 is the current spec, option (b) is recommended.

**R-5: Update paper test vector references.**
Paper says "four specification test vectors" (§12.x numbering). Spec v1.1 has 9 vectors with §17.x numbering. Update paper to reference v1.1 vectors.

**R-6: Fix SECURITY.md cross-reference to D-D01.**
§1.2 says dispute resolution is "deferred decision D-D01" but D-D01 is DID Method Recommendation. Either create a new deferred decision for dispute resolution or fix the reference.

**R-7: Fix Spec v1.1 §17.6 test vector structure.**
The `dispute` wrapper object doesn't match the Module C field definitions. Either update Module C to define a `dispute` wrapper, or fix the test vector to use flat Module C fields.

### Priority 3: Medium (should fix)

**R-8: Update LEGAL.md and SECURITY.md version headers.**
They say "companion to EXIT_SPEC_v1" — should reference v1.1 now.

**R-9: Add "non-weaponizable" design goal to paper.**
Paper lists 5 goals (matching v1.0). Spec v1.1 has 6. Update paper to include the anti-weaponization goal.

**R-10: Expand paper ethics section for v1.1 guardrails.**
Paper §7.3 briefly mentions coercion and weaponization detection. Spec v1.1 §8 has formal signal tables, label enums, laundering detection, right of reply, and sunset policies. Paper should cover these.

### Priority 4: Low (nice to have)

**R-11: Standardize proof type naming.**
Use `DataIntegrityProof` consistently as the type name where referring to the structure, `proof` as the field name.

**R-12: Add "153 tests" breakdown.**
Paper claims 153 tests. No doc provides a breakdown. Consider adding a test summary to the benchmarks doc or an appendix.
