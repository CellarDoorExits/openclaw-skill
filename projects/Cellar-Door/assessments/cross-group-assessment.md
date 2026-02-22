# Cross-Group Consistency Assessment

**Assessor:** Hawthorn | **Date:** 2026-02-22 | **Scope:** All 5 group assessments (A through F)

---

## 1. Cross-Group Contradictions

### X-1: Paper references v1.0 but comms docs claim v1.1 features (Groups A ↔ C/D)
Group A found the paper is a "v1.0-era document with early v1.1 trust mechanism concepts bolted on" — it references v1.0 test vector numbering (§12.x, 4 vectors) and lists 5 design goals. Meanwhile, Group C/D comms docs (pitches, NIST RFI, business plan) present EXIT as a coherent whole without distinguishing v1.0 from v1.1 features. The pitches reference commit-reveal, confidence scoring, and tenure as if they're settled — but Group A found the paper uses **different formulas** than the spec for both confidence scoring (multiplicative vs additive) and tenure weight (log₂/10 vs log₂/log₂(731)). Comms materials built on paper claims are propagating incorrect math.

### X-2: Test count — 143 vs 153 (Groups A ↔ C/D)
Group A notes the paper claims "153 passing tests" with no breakdown. Group C/D found the business plan says "143 tests" while the pre-export checklist says "153 tests." Nobody agrees. The spec v1.1 has 9 test vectors; the paper references 4 (v1.0's count). Three different numbers across four documents.

### X-3: Legal entity — Delaware LLC vs BC sole prop vs HoldCo+SPV (Groups B ↔ E ↔ F)
- Group B: RT1 and Heatmap recommend immediate Delaware LLC formation (~$500)
- Group E: Integration plan assumes "Cellar Door LLC" (Delaware); portfolio strategy says $0 legal spend, BC sole proprietorship; thesis v3 mentions HoldCo + SPV for property
- Group F: Fool-Hardy analysis budgets $1-2K for setup without specifying entity
- Three incompatible legal entity strategies exist across the corpus with no resolution.

### X-4: Budget — $12K vs $200K (Groups E ↔ F)
Group E found the portfolio strategy assumes $12K CAD total. Thesis v3 assumes ~$200K available capital. Group F showed total capital requirements across all projects range $224K–$398K. The software-only budget ($12K) and the full portfolio budget ($200K) are never explicitly distinguished, creating confusion about what's actually funded.

### X-5: Marker size — unverified claim propagated everywhere (Groups A ↔ C/D)
Group A found the paper says core unsigned = 442 bytes, signed = 586 bytes (matching benchmarks). Group C/D found every comms doc says "~300 bytes" — the pitches, business plan, and NIST RFI all use this number. The **actual measured size is 442–586 bytes** (core) or 1,294 bytes (all modules). "~300 bytes" appears to be wrong, and it's about to be submitted to NIST.

### X-6: Module D risk — Howey optimism vs everything else (Group B internal, cascades to C/D)
Group B found the Howey analysis rates Module D features as "Very Low" to "Moderate" risk, while RT1 rates it "Critical," Heatmap gives 🔴, and Battery says "Critical with financial assets." The comms docs (Group C/D) don't distinguish between constrained and unconstrained Module D deployment, inheriting whichever risk posture the reader last encountered.

### X-7: Canonicalization — JCS vs custom (Group A, cascades to B)
Group A found the paper says JCS/eddsa-jcs-2022; the spec defines custom canonical JSON. Group B's Battery crypto section references canonicalization concerns but doesn't catch this specific mismatch. Legal docs built on the assumption of standards-compliant canonicalization may overstate compliance posture.

---

## 2. Cascading Issues

### Cascade 1: Formula contradictions → paper wrong → pitches wrong → NIST submission wrong
Group A's finding that confidence scoring and tenure weight formulas differ between paper and spec means:
- Paper §4.3.2–4.3.3 contains incorrect formulas
- Pitches that reference "confidence scoring" are describing a system that doesn't match the spec
- The NIST RFI references the protocol's integrity properties — submitting with known formula inconsistencies undermines credibility
- **Fix chain:** Spec formulas (canonical) → update paper → update pitches → verify NIST RFI claims

### Cascade 2: "~300 bytes" claim → all comms materials wrong
The actual core marker is 442 bytes unsigned. Every comms doc says ~300. Fix chain:
- **Measure actual sizes** → update paper Table 3 → update business plan → update both pitches → update NIST RFI

### Cascade 3: Signamancy naming collision → confusion in all HOLOS docs
Group E found "Signamancy" means three things (repo, ontology primitive, reputation system). This pollutes:
- Integration plan's package boundaries
- Investment thesis terminology
- Any external communication mentioning "Signamancy"
- **Fix chain:** Decide canonical names → update integration plan → update thesis v3 → update compact/overview

### Cascade 4: Legal entity indecision → blocks npm publish, NIST submission, insurance, consulting
Groups B, C/D, E, and F all surface the entity question from different angles:
- Can't submit NIST RFI without a submitting entity name
- Can't get insurance without an entity
- Can't invoice consulting clients without an entity
- npm package scope (@cellar-door) implies organizational identity
- **Fix chain:** Decide entity → register → update LEGAL.md → update business plan → update NIST RFI header → file for insurance

### Cascade 5: Project plan says "zero code" → undermines credibility if anyone reads it
Group C/D found the project plan still says "Zero code. No prototype." EXIT has 62 files and 143+ tests. Anyone encountering the project plan first gets a false impression that cascades into misunderstanding the project's maturity.

---

## 3. Common Themes

### Theme 1: Stale documents
Every group found at least one stale doc:
- **A:** Paper stuck between v1.0 and v1.1
- **B:** RT1 insurance recommendation superseded by Battery
- **C/D:** Project plan says "zero code"
- **E:** TODO doesn't reflect EXIT implementation, consulting priority, or NIST deadline
- **F:** AI Property Scanner recommended in LAND but absent from thesis v3

### Theme 2: Unverified quantitative claims
- "~300 bytes" marker size (C/D) — actual is 442+
- "153 tests" vs "143 tests" (A, C/D) — nobody verified
- "approximately 2,400 lines" (A) — unverifiable from docs
- Hot Chip "10-month payback" (F) — math yields ~12 months

### Theme 3: Naming drift / terminology inconsistency
- "departure" vs "transition" (C/D)
- "agent" vs "subject" (C/D, also A)
- "Signamancy" triple-meaning (E)
- "SEAL" naming variants (E)
- "lineage" vs "lineageChain" vs "LINE" (A, E)
- v1.0 section numbers vs v1.1 section numbers (A)

### Theme 4: Audience-appropriate framing treated as inconsistency
Multiple groups noted deliberate tone shifts between internal/external docs. These are generally **correct** (NIST uses "transition," pitches use "departure") but undocumented — no style guide exists to explain which framing goes where.

### Theme 5: Synergy overclaiming
Group F found Quesnel, Pitt Meadows, and Hot Chip have weak-to-zero HOLOS synergy despite being framed as synergistic. Group E found the HOLOS vision docs describe a coherent philosophical framework but the investment docs reframe it as a portfolio with forced connections.

### Theme 6: Incompatible risk/rating scales
Group B found five different risk scales across legal docs (🟢–⚫, Critical/High/Medium/Low, narrative grades, Negligible–High, no scale). No mapping table exists.

---

## 4. Priority Matrix

### 🔴 Critical — Blocks publication or submission

| # | Issue | Source | Est. Hours |
|---|-------|--------|-----------|
| C1 | **Verify and fix marker size claim** (~300 vs 442+ bytes) before NIST submission | A, C/D | 1 |
| C2 | **Reconcile confidence scoring formula** (multiplicative vs additive) — pick spec's, update paper | A | 2 |
| C3 | **Reconcile tenure weight formula** (log₂/10 vs log₂/log₂(731)) — pick spec's, update paper | A | 1 |
| C4 | **Reconcile canonicalization** (JCS vs custom) — clarify which is normative, update paper | A | 2 |
| C5 | **Fix test count** — determine real number, update all docs | A, C/D | 1 |
| C6 | **Decide legal entity** — blocks NIST submission, npm publish, insurance, consulting | B, C/D, E, F | 3 |
| C7 | **Fill NIST RFI placeholders** (date, contact, entity) | C/D | 1 |
| C8 | **Fix NIST RFI field count** (7 vs 9 visual inconsistency) | C/D | 0.5 |

### 🟡 Important — Fix before next milestone

| # | Issue | Source | Est. Hours |
|---|-------|--------|-----------|
| I1 | **Update paper to v1.1** or explicitly label as v1.0 paper | A | 8–16 |
| I2 | **Update paper test vector references** (4 → 9, §12.x → §17.x) | A | 1 |
| I3 | **Fix spec v1.1 §17.6 test vector** (Module C dispute wrapper) | A | 1 |
| I4 | **Add "non-weaponizable" design goal to paper** | A | 0.5 |
| I5 | **Mark project plan as historical** or update it | C/D | 1 |
| I6 | **Decide npm package name** | C/D | 0.5 |
| I7 | **Update TODO** to reflect current state | E | 2 |
| I8 | **Reconcile Module D risk ratings** — add conditional framing to Howey doc | B | 1 |
| I9 | **Fix SECURITY.md cross-reference** (D-D01 ≠ dispute resolution) | A | 0.5 |
| I10 | **Update LEGAL.md and SECURITY.md version headers** to reference v1.1 | A | 0.5 |
| I11 | **Resolve budget discrepancy** ($12K vs $200K) — clarify in thesis v3 | E, F | 1 |
| I12 | **Reconcile Quesnel capital assumptions** (cash vs leveraged) | F | 1 |
| I13 | **Reconcile AI Property Scanner** — add to v3 or note deferral in LAND | F | 0.5 |
| I14 | **Standardize risk rating scales** across legal docs or add mapping table | B | 2 |
| I15 | **Resolve Signamancy naming collision** | E | 1 |
| I16 | **Confirm mechanism design implementation status** (commit-reveal, confidence, tenure in code?) | C/D | 1 |
| I17 | **Consolidate LEGAL.md amendment recommendations** from Lenses + Battery | B | 2 |
| I18 | **Add scope limitations to Battery** cross-referencing RT2/Lenses for uncovered topics | B | 1 |
| I19 | **Resolve insurance contradiction** — adopt Battery's trigger-based framework as canonical | B | 1 |

### 🟢 Nice-to-have

| # | Issue | Source | Est. Hours |
|---|-------|--------|-----------|
| N1 | Standardize departure/transition terminology with style guide | C/D | 1 |
| N2 | Standardize agent/subject terminology | A, C/D | 1 |
| N3 | Standardize proof type naming (DataIntegrityProof) | A | 0.5 |
| N4 | Add "153 tests" breakdown to benchmarks doc | A | 1 |
| N5 | Remove/label Gas Town reference in project plan | C/D | 0.25 |
| N6 | Add caveat to Hallowed Lantern section in idealist pitch | C/D | 0.25 |
| N7 | Trim HOLOS section in idealist pitch for external audiences | C/D | 0.5 |
| N8 | Amplify antitrust analysis (RT2 single-source finding) | B | 2 |
| N9 | Create cross-reference index for legal docs | B | 3 |
| N10 | Archive thesis v2 (superseded by v3) | E | 0.25 |
| N11 | Fix LAND dual scoring systems | F | 1 |
| N12 | Retire or merge portfolio strategy into v3 | E | 1 |
| N13 | Be honest about synergy claims (Quesnel, Hot Chip ≠ HOLOS) | F | 0.5 |
| N14 | Add version/date headers to competitive landscape | C/D | 0.25 |
| N15 | Temper Fool-Hardy ramp timeline in v3 | F | 0.5 |
| N16 | Address Hot Chip location logistics (Victoria vs Vancouver) | F | 0.25 |

---

## 5. Dependency Graph

```
[C6] Decide legal entity
  ├→ [C7] Fill NIST RFI placeholders
  ├→ [I10] Update LEGAL.md headers
  ├→ [I17] Consolidate LEGAL.md amendments
  └→ [I19] Resolve insurance posture

[C1] Verify marker size
  └→ Update paper Table 3 → Update pitches → Update NIST RFI

[C2] Fix confidence formula ──┐
[C3] Fix tenure formula ──────┤
[C4] Fix canonicalization ────┤
[C5] Fix test count ──────────┤
[I4] Add non-weaponizable goal ┤
[I2] Update test vector refs ──┘
  └→ [I1] Update paper to v1.1 (all above feed into paper update)
       ├→ Update pitches
       ├→ Update NIST RFI
       └→ Update business plan

[I3] Fix spec §17.6 test vector (independent)

[I15] Fix Signamancy naming
  └→ [I7] Update TODO
       └→ [N12] Retire portfolio strategy

[I11] Resolve budget discrepancy
  ├→ [I12] Reconcile Quesnel capital
  ├→ [I13] Reconcile AI Property Scanner
  └→ [N15] Temper Fool-Hardy timeline

[I8] Reconcile Module D risk ratings
  └→ [I14] Standardize risk scales
       └→ [N9] Cross-reference index

[I16] Confirm mechanism design implementation
  └→ [I5] Update project plan
```

---

## 6. Estimated Total LOE

| Priority | Item Count | Hours (Low) | Hours (High) |
|----------|-----------|-------------|-------------|
| 🔴 Critical | 8 | 11.5 | 11.5 |
| 🟡 Important | 19 | 27 | 35 |
| 🟢 Nice-to-have | 16 | 13.25 | 13.25 |
| **Total** | **43** | **~52 hours** | **~60 hours** |

At ~4 productive hours/day, that's **2–3 weeks** for everything, or **3 days** for just the critical items.

---

## 7. Recommended Fix Order

### Sprint 1: NIST Deadline Critical (Days 1–3)
*These block the March 9 NIST submission.*

1. **[C1]** Measure actual marker byte sizes. Update all docs with real numbers.
2. **[C5]** Run test suite, count tests. Record actual number.
3. **[C6]** Decide legal entity (Warren decision required).
4. **[C7]** Fill NIST RFI placeholders with entity + contact info.
5. **[C8]** Fix NIST RFI field count table.
6. **[C2+C3]** Pick spec formulas as canonical. Note in paper errata (full paper update is Sprint 2).
7. **[C4]** Decide canonical canonicalization method. Note in paper errata.

### Sprint 2: Paper & Spec Cleanup (Days 4–8)
*Makes the technical documents publication-ready.*

8. **[I1]** Update paper to v1.1 (the big task — 8–16 hours). Includes I2, I4 as subtasks.
9. **[I3]** Fix spec §17.6 Module C test vector.
10. **[I9]** Fix SECURITY.md D-D01 cross-reference.
11. **[I10]** Update LEGAL.md and SECURITY.md version headers.
12. **[I16]** Verify what's actually implemented (commit-reveal, confidence, tenure).

### Sprint 3: Legal & Strategic Alignment (Days 9–11)
*Gets the business/legal docs consistent.*

13. **[I8]** Add conditional framing to Howey doc.
14. **[I14]** Create risk scale mapping table.
15. **[I17]** Consolidate LEGAL.md amendment recommendations.
16. **[I18]** Add scope limitations to Battery.
17. **[I19]** Adopt Battery's insurance framework as canonical.
18. **[I11]** Clarify budget ($12K software vs $200K total portfolio).
19. **[I12+I13]** Reconcile Quesnel capital and AI Property Scanner status.

### Sprint 4: Housekeeping (Days 12–14)
*Cleans up stale docs and naming.*

20. **[I5]** Mark project plan as historical or update.
21. **[I7]** Rewrite TODO to reflect current state.
22. **[I15]** Resolve Signamancy naming, standardize SEAL.
23. **[I6]** Decide npm package name.
24. **[N1–N16]** Nice-to-haves as time permits.

---

## Summary

The 5 group assessments reveal a corpus that is **architecturally sound but editorially fragmented.** The core protocol design is consistent everywhere it matters. The problems are:

1. **Formula mismatches** between spec and paper (critical, blocks publication)
2. **Unverified marketing claims** propagated into a federal submission (~300 bytes)
3. **Legal entity indecision** blocking multiple workstreams
4. **Paper frozen between v1.0 and v1.1** (the single largest remediation task)
5. **Stale documents** in every group creating false impressions
6. **Naming drift** across technical, legal, vision, and comms docs

None of these are architectural failures. They're the natural result of rapid parallel document production without a sync pass. The fix order above prioritizes the NIST deadline (March 9), then publication readiness, then strategic alignment, then housekeeping.

**The single most important action is Sprint 1** — 3 days of focused work to verify claims and make decisions before the NIST RFI goes out the door.
