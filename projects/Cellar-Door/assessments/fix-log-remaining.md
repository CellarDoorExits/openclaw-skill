# Fix Log — Remaining Important & Nice-to-Have Items

**Date:** 2026-02-22  
**Agent:** Subagent (batch fix run)

## Important Items

| ID | Description | Status | Action Taken |
|----|-------------|--------|--------------|
| I2 | Update paper test vector references | ✅ Fixed | Updated EXIT_PAPER_v3.md: changed §12.x (4 vectors) → §17.x (9 vectors) with correct v1.1 descriptions |
| I3 | Fix spec §17.6 test vector | ✅ Verified OK | §17.6 is well-formed: valid Module C fields (originStatus, rightOfReply), correct coercionLabel/sunsetDate. No changes needed. |
| I4 | Add non-weaponizable design goal | ✅ Fixed | Added 6th design goal referencing guardrails, coercion labeling, anti-coercion scoring |
| I6 | Confirm npm package name | ✅ Verified OK | package.json already has `"name": "cellar-door-exit"` |
| I12 | Reconcile Quesnel capital assumptions | ✅ Fixed | Added blockquote clarifying cash-purchase assumption with leverage alternative note |
| I13 | Reconcile AI Property Scanner | ✅ Fixed | Added "⚠️ Deferred" note to §7 in LAND-analysis-v2.md |
| I16 | Confirm mechanism design implementation | ✅ Fixed | All three features (commit-reveal, confidence scoring, tenure weight) confirmed implemented in `src/modules/trust.ts`. Added Implementation Status table to README.md |

## Nice-to-Have Items

| ID | Description | Status | Action Taken |
|----|-------------|--------|--------------|
| N1 | Style guide: departure vs transition | ✅ Created | `docs/style-guide.md` with terminology table |
| N2 | Style guide: agent vs subject | ✅ Created | Same file, second terminology table |
| N3 | Style guide: proof type | ✅ Created | Documented `DataIntegrityProof` as canonical, noted current Ed25519Signature2020 usage |
| N4 | Test breakdown in benchmarks | ✅ Created | `projects/cellar-door-exit/benchmarks/results.md` — 205 tests, 13 files listed |
| N5 | Label Gas Town as historical | ✅ Fixed | 4 references in `cellar-door-project-plan.md` labeled as historical/no longer active |
| N6 | Hallowed Lantern caveat | ✅ Fixed | Added aspirational/future work warning box in PITCH_IDEALIST.md |
| N7 | HOLOS section caveat | ✅ Fixed | Added external audience note clarifying EXIT stands alone |
| N10 | Supersede v2 thesis | ✅ Fixed | Added "⚠️ SUPERSEDED by v3" header to `holos-investment-thesis-v2.md` |
| N13 | HOLOS synergy caveat | ✅ Fixed | Added indirect/aspirational caveat to Hot Chip analysis. LAND-analysis-v2.md doesn't claim direct HOLOS synergy. |
| N14 | Version header on competitive landscape | ✅ Fixed | Added `Version: 1.0` to header |

## Files Modified

1. `EXIT_PAPER_v3.md` — I2 (test vectors), I4 (design goal)
2. `LAND-analysis-v2.md` — I12 (capital note), I13 (scanner deferral)
3. `projects/cellar-door-exit/README.md` — I16 (implementation status)
4. `projects/cellar-door-exit/docs/PITCH_IDEALIST.md` — N6, N7
5. `projects/cellar-door-exit/docs/analysis/cellar-door-project-plan.md` — N5
6. `projects/cellar-door-exit/docs/analysis/cellar-door-competitive-landscape.md` — N14
7. `holos-investment-thesis-v2.md` — N10
8. `hot-chip-analysis.md` — N13

## Files Created

1. `docs/style-guide.md` — N1, N2, N3
2. `projects/cellar-door-exit/benchmarks/results.md` — N4
