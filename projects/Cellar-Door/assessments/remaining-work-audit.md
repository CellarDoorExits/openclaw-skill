# Remaining Work Audit — All Group Assessments vs Fix Logs

**Date:** 2026-02-22  
**Auditor:** Hawthorn (subagent)  
**Sources:** group-a through group-f assessments, cross-group assessment, fix-log-C1-C5, fix-log-C2-C4, fix-log-important

---

## Fix Log Summary

| Fix Log | Items Resolved |
|---------|---------------|
| fix-log-C1-C5 | C1 (marker size ~300→~335), C5 (test count 143/153→205) |
| fix-log-C2-C4 | C2 (confidence formula), C3 (tenure formula), C4 (canonicalization), reputation_score removal |
| fix-log-important | I5 (project plan historical), I7 (TODO update), I8 (Module D risk reconciliation), I11 (budget discrepancy), I15 (Signamancy naming) |

---

## Cross-Group Assessment — 43 Items

### 🔴 Critical (C1–C8)

| # | Item | Status | Notes |
|---|------|--------|-------|
| C1 | Verify and fix marker size claim | ✅ DONE | fix-log-C1-C5: ~300→~335/~596 across 13+ files |
| C2 | Reconcile confidence scoring formula | ✅ DONE | fix-log-C2-C4: paper updated to additive model |
| C3 | Reconcile tenure weight formula | ✅ DONE | fix-log-C2-C4: paper updated to log₂(731) |
| C4 | Reconcile canonicalization | ✅ DONE | fix-log-C2-C4: paper updated to custom canonical JSON |
| C5 | Fix test count | ✅ DONE | fix-log-C1-C5: all docs updated to 205 |
| C6 | Decide legal entity | ⏳ BLOCKED | Needs Warren decision (Delaware LLC vs BC sole prop vs HoldCo+SPV) |
| C7 | Fill NIST RFI placeholders | ⏳ BLOCKED | Depends on C6 (entity) + Warren contact info |
| C8 | Fix NIST RFI field count (7 vs 9) | 🔧 NEEDS WORK | ~0.5h. No fix log addresses this |

### 🟡 Important (I1–I19)

| # | Item | Status | Notes |
|---|------|--------|-------|
| I1 | Update paper to v1.1 (or label as v1.0) | 🔧 NEEDS WORK | 8–16h. The big task. C2-C4 fixes were partial (formulas only); paper still missing v1.1 features (ethics guardrails, KERI, encryption, redaction, anchoring, extended fields) |
| I2 | Update paper test vector references (4→9, §12.x→§17.x) | 🔧 NEEDS WORK | 1h. Not in any fix log |
| I3 | Fix spec v1.1 §17.6 test vector (Module C dispute wrapper) | 🔧 NEEDS WORK | 1h. Not in any fix log |
| I4 | Add "non-weaponizable" design goal to paper | 🔧 NEEDS WORK | 0.5h. Not in any fix log |
| I5 | Mark project plan as historical | ✅ DONE | fix-log-important |
| I6 | Decide npm package name | ⏳ BLOCKED | Needs Warren decision |
| I7 | Update TODO | ✅ DONE | fix-log-important |
| I8 | Reconcile Module D risk ratings | ✅ DONE | fix-log-important: added conditional framing to Howey doc |
| I9 | Fix SECURITY.md cross-reference (D-D01) | 🔧 NEEDS WORK | 0.5h. Not in any fix log |
| I10 | Update LEGAL.md and SECURITY.md version headers | 🔧 NEEDS WORK | 0.5h. Not in any fix log |
| I11 | Resolve budget discrepancy ($12K vs $200K) | ✅ DONE | fix-log-important |
| I12 | Reconcile Quesnel capital assumptions | 🔧 NEEDS WORK | 1h. Not in any fix log |
| I13 | Reconcile AI Property Scanner status | 🔧 NEEDS WORK | 0.5h. Not in any fix log |
| I14 | Standardize risk rating scales across legal docs | 🔧 NEEDS WORK | 2h. Not in any fix log |
| I15 | Resolve Signamancy naming collision | ✅ DONE | fix-log-important: renamed to REPUTE for reputation |
| I16 | Confirm mechanism design implementation status | 🔧 NEEDS WORK | 1h. Not in any fix log |
| I17 | Consolidate LEGAL.md amendment recommendations (Lenses + Battery) | 🔧 NEEDS WORK | 2h. Not in any fix log |
| I18 | Add scope limitations to Battery | 🔧 NEEDS WORK | 1h. Not in any fix log |
| I19 | Resolve insurance contradiction (adopt Battery trigger framework) | 🔧 NEEDS WORK | 1h. Not in any fix log |

### 🟢 Nice-to-have (N1–N16)

| # | Item | Status | Notes |
|---|------|--------|-------|
| N1 | Standardize departure/transition terminology | ⏭️ DEFERRED | 1h |
| N2 | Standardize agent/subject terminology | ⏭️ DEFERRED | 1h |
| N3 | Standardize proof type naming | ⏭️ DEFERRED | 0.5h |
| N4 | Add "153 tests" breakdown to benchmarks | ⏭️ DEFERRED | 1h. Moot now (205 tests) but breakdown still useful |
| N5 | Remove/label Gas Town in project plan | ⏭️ DEFERRED | 0.25h |
| N6 | Add caveat to Hallowed Lantern in idealist pitch | ⏭️ DEFERRED | 0.25h |
| N7 | Trim HOLOS section in idealist pitch | ⏭️ DEFERRED | 0.5h |
| N8 | Amplify antitrust analysis (RT2 single-source) | ⏭️ DEFERRED | 2h |
| N9 | Create cross-reference index for legal docs | ⏭️ DEFERRED | 3h |
| N10 | Archive thesis v2 | ⏭️ DEFERRED | 0.25h |
| N11 | Fix LAND dual scoring systems | ⏭️ DEFERRED | 1h |
| N12 | Retire/merge portfolio strategy into v3 | ⏭️ DEFERRED | 1h |
| N13 | Be honest about synergy claims | ⏭️ DEFERRED | 0.5h |
| N14 | Add version/date headers to competitive landscape | ⏭️ DEFERRED | 0.25h |
| N15 | Temper Fool-Hardy ramp timeline in v3 | ⏭️ DEFERRED | 0.5h |
| N16 | Address Hot Chip location logistics | ⏭️ DEFERRED | 0.25h |

---

## Group-Specific Recommendations NOT in Cross-Group 43

These are recommendations from individual group assessments that the cross-group assessment did NOT capture (group-specific, not cross-cutting).

### Group A — EXIT Core (12 recommendations, R-1 through R-12)

| # | Recommendation | Cross-Group? | Status | Est. Hours |
|---|---------------|:---:|--------|--------:|
| R-1 | Reconcile confidence scoring formula | = C2 | ✅ DONE | — |
| R-2 | Reconcile tenure weight formula | = C3 | ✅ DONE | — |
| R-3 | Reconcile canonicalization | = C4 | ✅ DONE | — |
| R-4 | Update paper to v1.1 | = I1 | 🔧 NEEDS WORK | 8–16 |
| R-5 | Update paper test vector references | = I2 | 🔧 NEEDS WORK | 1 |
| R-6 | Fix SECURITY.md D-D01 cross-reference | = I9 | 🔧 NEEDS WORK | 0.5 |
| R-7 | Fix spec §17.6 test vector structure | = I3 | 🔧 NEEDS WORK | 1 |
| R-8 | Update LEGAL.md/SECURITY.md version headers | = I10 | 🔧 NEEDS WORK | 0.5 |
| R-9 | Add non-weaponizable goal to paper | = I4 | 🔧 NEEDS WORK | 0.5 |
| R-10 | Expand paper ethics section for v1.1 guardrails | ⊂ I1 | 🔧 NEEDS WORK | (part of I1) |
| R-11 | Standardize proof type naming | = N3 | ⏭️ DEFERRED | 0.5 |
| R-12 | Add "153 tests" breakdown | = N4 | ⏭️ DEFERRED | 1 |

**All Group A recommendations are captured by cross-group. No unique items.**

### Group B — Legal & Risk (7 recommendations, §6.1–6.7)

| # | Recommendation | Cross-Group? | Status | Est. Hours |
|---|---------------|:---:|--------|--------:|
| 6.1 | Reconcile Module D risk ratings | = I8 | ✅ DONE | — |
| 6.2 | Battery needs coverage expansion (agent personhood, labor, antitrust, fiduciary, treaties) | = I18 (partial) | 🔧 NEEDS WORK | 1 (scope note) or 8+ (full sections) |
| 6.3 | Amplify antitrust analysis | = N8 | ⏭️ DEFERRED | 2 |
| 6.4 | Standardize risk rating scales | = I14 | 🔧 NEEDS WORK | 2 |
| 6.5 | Resolve insurance contradiction | = I19 | 🔧 NEEDS WORK | 1 |
| 6.6 | Add cross-reference index for legal docs | = N9 | ⏭️ DEFERRED | 3 |
| 6.7 | Consolidate LEGAL.md amendment recommendations | = I17 | 🔧 NEEDS WORK | 2 |

**All Group B recommendations are captured by cross-group. No unique items.**

### Group C/D — Strategy & Comms (14 recommendations, P0–P3)

| # | Recommendation | Cross-Group? | Status | Est. Hours |
|---|---------------|:---:|--------|--------:|
| P0-1 | Verify marker size claim | = C1 | ✅ DONE | — |
| P0-2 | Fix test count | = C5 | ✅ DONE | — |
| P0-3 | Fix NIST 7-vs-9 field inconsistency | = C8 | 🔧 NEEDS WORK | 0.5 |
| P0-4 | Fill NIST RFI placeholders | = C7 | ⏳ BLOCKED | — |
| P1-5 | Mark project plan as historical | = I5 | ✅ DONE | — |
| P1-6 | Decide package name | = I6 | ⏳ BLOCKED | — |
| P1-7 | Confirm mechanism design implementation status | = I16 | 🔧 NEEDS WORK | 1 |
| P2-8 | Standardize departure/transition terminology | = N1 | ⏭️ DEFERRED | 1 |
| P2-9 | Remove/label Gas Town | = N5 | ⏭️ DEFERRED | 0.25 |
| P2-10 | Caveat Hallowed Lantern | = N6 | ⏭️ DEFERRED | 0.25 |
| P2-11 | Trim HOLOS section in idealist pitch | = N7 | ⏭️ DEFERRED | 0.5 |
| P3-12 | Align agent/subject language | = N2 | ⏭️ DEFERRED | 1 |
| P3-13 | Add version/date to competitive landscape | = N14 | ⏭️ DEFERRED | 0.25 |
| P3-14 | Cross-reference pre-export from business plan | **NEW** | 🔧 NEEDS WORK | 0.25 |

**1 unique item: P3-14 (cross-reference pre-export checklist from business plan)**

### Group E — HOLOS Vision (9 recommendations, §7.1–7.9)

| # | Recommendation | Cross-Group? | Status | Est. Hours |
|---|---------------|:---:|--------|--------:|
| 7.1 | Resolve legal entity contradiction | = C6 | ⏳ BLOCKED | — |
| 7.2 | Resolve budget discrepancy | = I11 | ✅ DONE | — |
| 7.3 | Fix Signamancy naming collision | = I15 | ✅ DONE | — |
| 7.4 | Standardize SEAL naming | **NEW** | 🔧 NEEDS WORK | 0.5 |
| 7.5 | Update the TODO | = I7 | ✅ DONE | — |
| 7.6 | Retire/merge portfolio strategy into v3 | = N12 | ⏭️ DEFERRED | 1 |
| 7.7 | Preserve integration-plan, update entity assumptions | **NEW** | ⏳ BLOCKED | 0.5 (depends on C6) |
| 7.8 | Note upper HOLOS layers have no dev plans | **NEW** | ⏭️ DEFERRED | 0.25 |
| 7.9 | Archive thesis v2 | = N10 | ⏭️ DEFERRED | 0.25 |

**3 unique items: 7.4 (SEAL naming), 7.7 (integration-plan entity assumptions), 7.8 (note about upper layers)**

### Group F — Side Projects (7 recommendations, §6.1–6.7)

| # | Recommendation | Cross-Group? | Status | Est. Hours |
|---|---------------|:---:|--------|--------:|
| 6.1 | Reconcile AI Property Scanner | = I13 | 🔧 NEEDS WORK | 0.5 |
| 6.2 | Reconcile Quesnel capital assumptions | = I12 | 🔧 NEEDS WORK | 1 |
| 6.3 | Fix LAND dual scoring systems | = N11 | ⏭️ DEFERRED | 1 |
| 6.4 | Be honest about synergy claims | = N13 | ⏭️ DEFERRED | 0.5 |
| 6.5 | $12K budget is tight but workable (make explicit) | ⊂ I11 | ✅ DONE | — |
| 6.6 | Hot Chip location risk (Victoria vs Vancouver) | = N16 | ⏭️ DEFERRED | 0.25 |
| 6.7 | Temper Fool-Hardy ramp timeline | = N15 | ⏭️ DEFERRED | 0.5 |

**No unique items beyond cross-group.**

---

## Consolidated Remaining Work

### Summary Counts

| Status | Count | Est. Hours |
|--------|------:|----------:|
| ✅ DONE | 17 | — |
| 🔧 NEEDS WORK | 18 | ~28–36h |
| ⏳ BLOCKED | 4 | ~4h (once unblocked) |
| ⏭️ DEFERRED | 16 | ~14h |
| **Total remaining** | **38** | **~46–54h** |

### 🔧 NEEDS WORK — Ordered by Priority

| # | Item | Source | Est. Hours | Dependencies |
|---|------|--------|--------:|-------------|
| 1 | **C8: Fix NIST RFI field count (7 vs 9)** | Cross-group | 0.5 | None |
| 2 | **I1: Update paper to v1.1** (includes I2, I4, R-10) | Group A / Cross-group | 8–16 | C2-C4 done ✅ |
| 3 | **I2: Update paper test vector refs** (4→9) | Group A | 1 | Can do with I1 |
| 4 | **I3: Fix spec §17.6 Module C test vector** | Group A | 1 | None |
| 5 | **I4: Add non-weaponizable goal to paper** | Group A | 0.5 | Can do with I1 |
| 6 | **I9: Fix SECURITY.md D-D01 cross-ref** | Group A | 0.5 | None |
| 7 | **I10: Update LEGAL.md/SECURITY.md version headers** | Group A | 0.5 | None |
| 8 | **I12: Reconcile Quesnel capital assumptions** | Group F | 1 | None |
| 9 | **I13: Reconcile AI Property Scanner** | Group F | 0.5 | None |
| 10 | **I14: Standardize risk rating scales** | Group B | 2 | None |
| 11 | **I16: Confirm mechanism design impl status** | Group C/D | 1 | Code access |
| 12 | **I17: Consolidate LEGAL.md amendments** | Group B | 2 | None |
| 13 | **I18: Add scope limitations to Battery** | Group B | 1 | None |
| 14 | **I19: Resolve insurance contradiction** | Group B | 1 | None |
| 15 | **P3-14: Cross-ref pre-export from business plan** | Group C/D (unique) | 0.25 | None |
| 16 | **7.4: Standardize SEAL naming** | Group E (unique) | 0.5 | None |
| 17 | **Reputation_score removal propagation check** | fix-log-C2-C4 | 0.5 | Done in code; check docs |

### ⏳ BLOCKED — Waiting on Warren

| # | Item | Blocker | Est. Hours (once unblocked) |
|---|------|---------|--------:|
| C6 | Decide legal entity | Warren decision | 3 |
| C7 | Fill NIST RFI placeholders | C6 + Warren contact info | 1 |
| I6 | Decide npm package name | Warren decision | 0.5 |
| 7.7 | Update integration-plan entity assumptions | C6 | 0.5 |

---

## What the Fix Logs Missed

1. **No cross-referencing work was done.** Multiple groups recommended adding cross-references between docs (I17: consolidate LEGAL.md amendments, N9: legal cross-reference index, P3-14: cross-ref pre-export from business plan, 7.7: update integration-plan). None of these appear in any fix log.

2. **No risk scale standardization.** I14 (create mapping table across legal docs' incompatible scales) is untouched.

3. **The paper update (I1) — the single largest task — is untouched** beyond the formula fixes (C2-C4). The paper still: references v1.0 test vectors, lists 5 design goals instead of 6, omits ethics guardrails detail, omits KERI/encryption/redaction/anchoring features.

4. **Spec §17.6 Module C test vector** (I3) is untouched — the `dispute` wrapper object still doesn't match Module C field definitions.

5. **SECURITY.md still has wrong D-D01 cross-reference** (I9).

6. **LEGAL.md and SECURITY.md still say "companion to EXIT_SPEC_v1"** (I10).

7. **SEAL naming** (Group E 7.4) was not addressed when Signamancy was fixed.

---

## Recommended Next Sprint

**If targeting NIST submission (March 9):**
- C8 (0.5h) — field count fix
- C6 + C7 (blocked on Warren — escalate)

**If targeting paper publication:**
- I1 (8–16h) — the big paper update, incorporating I2, I4, R-10
- I3 (1h) — spec test vector fix
- I9 (0.5h) — SECURITY.md cross-ref fix
- I10 (0.5h) — version header updates

**Quick wins (under 1h each, no dependencies):**
- I9, I10, I13, P3-14, 7.4, C8
