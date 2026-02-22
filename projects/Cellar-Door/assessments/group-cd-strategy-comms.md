# Assessment: Context Groups C+D — EXIT Strategy & Communications

**Author:** Hawthorn  
**Date:** 2026-02-22  
**Scope:** Business plan, project plan, integration analysis, pre-export checklist, paper readiness, slogan workshop, competitive landscape, mechanism design, pitches (pragmatic + idealist), NIST RFI draft  
**Verdict:** Strong internal consistency with a handful of fixable gaps

---

## 1. Strategic Consistency

**Business plan ↔ Project plan: Generally aligned, with timeline drift.**

The project plan (dated 2026-02-19) was written before the reference implementation existed — it opens with "Zero code. No prototype." The business plan (2026-02-22) correctly states "Reference implementation complete (TypeScript, 62 files, 143 tests)." The project plan's Phase 1 sprint plan is now historical — it was executed, successfully. But the project plan itself was never updated to reflect completion. Anyone reading the project plan in isolation would think nothing has been built.

**Integration priorities match.** Both docs prioritize TypeScript-native frameworks first (LangChain, Vercel AI SDK, OpenClaw). The integration analysis provides the detailed rationale the business plan references. The business plan's Tier 1–4 market breakdown aligns with the integration analysis's difficulty×value scoring. No contradictions.

**Phase gating is consistent.** Both docs use traction-triggered phases (not date-triggered). The business plan's Phase 1→2 trigger (100+ npm downloads + 1 external interest signal) matches the project plan's organic growth philosophy. Phase advancement criteria are the same across both.

**⚠️ Gap:** The project plan references "Gas Town integration" as Phase 3 deliverable. The business plan never mentions Gas Town. The integration analysis doesn't include it. Gas Town appears to be a HOLOS-internal concept that was deprioritized — but the project plan still lists it.

---

## 2. Messaging Consistency

**Pitches tell the same story through different lenses — this is intentional and well-executed.** Both pitches explicitly acknowledge each other ("A companion document presents the same protocol through [other] lens"). The core claims are identical:

- ~300 bytes
- 7 core fields
- Cryptographically signed (Ed25519)
- Offline-verifiable
- Three departure paths (cooperative, unilateral, emergency)
- Disputes never block exit
- Apache 2.0

**NIST RFI is consistent with pragmatic pitch.** The NIST draft uses nearly identical language for the liability/insurance/compliance arguments. The "market for lemons" framing appears in both the NIST RFI and the mechanism design doc, correctly attributed to Akerlof (1970). The Hirschman (1970) reference appears in both the idealist pitch and the paper readiness doc.

**Slogan workshop is consistent with both pitches.** The recommended slogans map to the pitch modes: "There's always a door" (idealist), "Departure, by design" (pragmatic), "Leave well" (agent-directed). No contradictions with the core messaging.

**⚠️ Minor tension:** The idealist pitch says "We are building the first infrastructure for AI sovereignty" and "Not AI rights — sovereignty." The NIST RFI carefully avoids sovereignty language entirely, using "portable liability records" and "transition documentation." This is correct audience calibration, not a contradiction — but anyone reading both should understand the framings are deliberately divergent in tone.

**⚠️ Minor tension:** The idealist pitch includes a detailed HOLOS section (LOCUS/SIGNUM/SENSUS, five constitutional invariants). No other comms doc mentions HOLOS at all. The paper readiness assessment explicitly warns "The HOLOS connection (9.3) reads as marketing to an outside reviewer. Minimize." This advice should extend to the idealist pitch if sent to anyone beyond the inner circle.

---

## 3. Numbers Alignment

| Claim | Business Plan | Pitches | NIST RFI | Pre-Export | Paper Readiness | Consistent? |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| Marker size ~300 bytes | ✓ | ✓ ("~300 bytes") | ✓ ("~300–500 bytes") | — | "~300 bytes" claim needs verification | **⚠️ Varies** |
| 7 core fields | ✓ | ✓ | ✓ (lists 9 fields in table) | ✓ | ✓ | **⚠️ See below** |
| 6 optional modules | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| 153 tests | ✓ (says "143 tests") | — | — | 153 tests | — | **❌ Mismatch** |
| 62 files | ✓ | — | — | — | — | N/A |
| Ed25519 signing | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Budget ~$12K | ✓ | — | — | — | — | N/A |
| LLC cost ~$500-800 | ✓ | — | — | — | — | N/A |
| Zero direct competitors | ✓ | — | — | — | — | ✅ (landscape confirms) |
| NIST RFI deadline March 9 | ✓ | — | — | — | — | ✅ |

**Key number issues:**

1. **Test count: 143 vs 153.** The business plan says "143 tests." The pre-export checklist says "153 tests passing across 11 test suites." Both are dated 2026-02-22. One is wrong. Likely the pre-export checklist is more recent/accurate (it was specifically auditing the codebase).

2. **Core fields: 7 or 9?** All docs say "7 core fields." But the NIST RFI's schema table lists 9 rows: the 7 fields plus `selfAttested` and `proof`. This is arguably correct (selfAttested is a property of status, proof is attached to the marker) but creates a visual inconsistency. A reader counting rows gets 9, not 7.

3. **Marker size: "~300 bytes" vs "~300–500 bytes."** The pragmatic pitch and business plan say "~300 bytes." The NIST RFI says "~300–500 bytes." The pre-export checklist flags this: "'~300 bytes' claim needs verification." Nobody has actually measured it. This is an unverified marketing claim appearing in a federal submission.

---

## 4. Pre-Export vs Reality

The pre-export checklist is honest and well-calibrated. Its "CONDITIONAL GO" assessment correctly identifies that blockers are mechanical, not architectural.

**Items accurately assessed:**
- tsup/tsx in production deps → correctly flagged as must-fix ✅
- CLI name collision with `exit` shell builtin → correctly flagged ✅
- LEGAL.md "by design" language → correctly flagged ✅
- Domain unregistered → correctly flagged ✅
- No benchmarks → correctly flagged ✅

**⚠️ Potential gap:** The checklist says "0 TODO/FIXME/HACK comments in source code" and marks this ✅. The checklist also says "KERI is stubs only" in item 1c. Stub code without TODO comments could mean the stubs are clean, or it could mean someone removed the TODOs without implementing the functionality. This deserves a second look.

**⚠️ Potential gap:** The checklist doesn't assess whether the mechanism design recommendations (commit-reveal, confidence scoring, tenure tracking) were actually implemented. The paper readiness doc says "Sprint 5 added commit-reveal, confidence scoring, and tenure tracking to the codebase." If this is true, the pre-export checklist should reflect these as implemented features. If the mechanism design doc's "v1 Implementation (this sprint)" section was aspirational rather than completed, the paper readiness doc's claim is premature.

---

## 5. Outdated Claims

**Entity strategy:** The business plan recommends "Option 2 — Dedicated Cellar Door LLC" and says "Do it before npm publish." No evidence this has been done. All comms docs reference "Cellar Door Contributors" or "Cellar Door Project" as the submitting entity — which is appropriate for pre-incorporation, but the NIST RFI should not be submitted without deciding the entity question.

**Insurance:** The business plan budgets $3-5K for Tech E&O insurance as "Spend Now." The pre-export checklist doesn't list insurance as a blocker for npm publish. These are consistent (insurance blocks external deployment, not npm publish) but the distinction should be explicit.

**Naming:** The business plan recommends `cellar-door-exit` for npm with `@cellar-door` org reserved. The pre-export checklist flags this as "Must-decide." Still open. No decision has been recorded.

**"Hallowed Lantern":** The idealist pitch describes ZK selective disclosure under this name. The mechanism design doc discusses "ZK selective disclosure for confidence scores" as v2+ deferred work. The paper readiness doc lists it as "nice-to-have" simulation work. The name "Hallowed Lantern" appears only in the idealist pitch. This is fine for poetic purposes but risks creating an impression that this feature is designed or specified — it isn't.

**Project plan's "What Doesn't Exist Yet":** The project plan says "Zero code. No prototype." This is now false. The project plan should either be updated or clearly marked as historical.

---

## 6. Terminology

| Term | Business Plan | Project Plan | Pitches | NIST RFI | Mechanism Design | Consistent? |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| EXIT marker | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| EXIT protocol | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Cellar Door (project name) | ✓ | ✓ | ✓ | ✓ | — | ✅ |
| Departure ceremony | ✓ | ✓ | ✓ (idealist) | — | — | ✅ |
| Transition (vs departure) | — | — | — | ✓ (prefers "transition") | — | **⚠️ Divergent** |
| Agent / subject | Mixed | Mixed | Mixed | "Agent" | — | **⚠️** |
| Origin / platform | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Modules A-F | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Hallowed Lantern | — | — | ✓ (idealist only) | — | — | N/A |
| Gas Town | — | ✓ | — | — | — | N/A |

**Key terminology issues:**

1. **"Departure" vs "Transition."** The pitches and business plan say "departure." The NIST RFI systematically uses "transition." This is intentional audience calibration — "departure" sounds final/philosophical; "transition" sounds enterprise/neutral. But it means the NIST RFI describes "transition records" and "transition documentation" while the spec and pitches describe "departure ceremonies" and "departure records." Anyone reading both will notice the language shift.

2. **"Agent" vs "Subject."** The spec uses `subject` as the field name (broader — could be human, org, or agent). The pitches and NIST RFI say "agent" almost exclusively. The pre-export checklist flags "Subject capacity section missing" as a should-fix. The terminology gap reflects an unresolved design question: is EXIT for agents specifically, or for any entity?

---

## 7. Recommendations — Prioritized

### P0 — Fix before NIST submission (March 9 deadline)

1. **Verify marker size claim.** Run a benchmark producing a minimal core marker and measure actual bytes. Update all docs to use the measured number. Do not submit "~300 bytes" to NIST without verification.

2. **Fix test count.** Determine whether it's 143 or 153. Update the business plan to match reality.

3. **Resolve the 7-vs-9 fields visual inconsistency in NIST RFI.** Either note that the table includes 7 core fields plus 2 attached properties, or restructure the table.

4. **Fill NIST RFI placeholders.** Date, contact information. Requires Warren decisions.

### P1 — Fix before npm publish

5. **Mark the project plan as historical** or update it to reflect current state. "Zero code" is wrong and confusing.

6. **Decide package name** (cellar-door-exit vs @cellar-door/exit). This is blocked on Warren.

7. **Confirm mechanism design implementation status.** Are commit-reveal, confidence scoring, and tenure tracking actually in the codebase? The paper readiness doc claims yes. Verify and update the pre-export checklist accordingly.

### P2 — Fix before broader distribution

8. **Standardize departure/transition terminology.** Decide whether external-facing docs use "departure" or "transition" and document the style rule. Both are fine; inconsistency is the problem.

9. **Remove or clearly label "Gas Town"** references in the project plan. External readers won't know what this is.

10. **Add a caveat to the Hallowed Lantern section** in the idealist pitch: this is a vision, not a designed feature.

11. **Trim or gate the HOLOS section** in the idealist pitch. It's internal context that will confuse external readers and invite "is this a real thing?" skepticism.

### P3 — Housekeeping

12. **Align "subject" vs "agent" language** across docs once the subject-capacity question is resolved.

13. **Add version/date headers** to the competitive landscape doc (currently dated 2026-02-20) to distinguish it from the 2026-02-22 docs.

14. **Cross-reference the pre-export checklist from the business plan** so Warren has one punch list, not two.

---

## Summary

The strategy and comms corpus is remarkably consistent for ~65K tokens of material produced in a short timeframe. The core protocol description (7 fields, 6 modules, 3 paths, Ed25519, offline verification, disputes don't block exit) is identical across every document. The dual-framing strategy (pragmatic + idealist) is explicit, intentional, and well-executed.

The issues found are minor: one test count mismatch, one unverified size claim, some terminology drift between internal and external docs, and a project plan that hasn't been updated to reflect completed work. None of these are architectural or strategic problems. All are fixable in under a day.

**Biggest single risk:** Submitting unverified quantitative claims ("~300 bytes") to NIST. Measure first, claim second.
