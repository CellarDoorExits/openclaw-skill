# Fix Log: C2–C4 Contradictions + reputation_score Removal

**Date:** 2026-02-22
**Author:** Automated fix (subagent)
**Files changed:** 4

---

## C2: Confidence Formula (Paper §4.3.3)

**Problem:** Paper described confidence scoring as a **multiplicative** model:
```
confidence = baseScore(status) × attestationMultiplier × tenureWeight × lineageWeight
```
Spec (§7.4) and code (`trust.ts:computeConfidence`) use an **additive** model:
```
confidence = status_weight [0–0.4] + tenure_weight [0–0.3] + lineage_weight [0–0.15] + commit_reveal_bonus [0–0.15]
```

**Fix:** Replaced paper §4.3.3 with the additive formula matching spec and code. Added footnote explaining the change and why additive is preferred (single zero factor doesn't collapse entire score).

**File:** `EXIT_PAPER_v3.md`

---

## C3: Tenure Weight Formula (Paper §4.3.2)

**Problem:** Paper used `log2(days + 1) / 10`. Spec (§7.3) and code use `log₂(days + 1) / log₂(731)`.

The difference is significant: `/10` saturates at ~1023 days (2.8 years); `/log₂(731)` saturates at 730 days (~2 years). The code matches the spec exactly (`Math.log2(731)`).

**Fix:** Replaced paper formula with spec formula. Added footnote documenting the change.

**File:** `EXIT_PAPER_v3.md`

---

## C4: Canonicalization (Paper §5.3)

**Problem:** Paper stated "JSON Canonicalization Scheme (JCS) per `eddsa-jcs-2022`". The code (`marker.ts:canonicalize`) uses a **custom** deterministic JSON serialization with recursive lexicographic key sorting — not RFC 8785 JCS. The spec (§13.1) describes this custom approach.

**Practical difference:** JCS includes Unicode normalization (NFC) and specific number serialization rules. The EXIT implementation is simpler (recursive sort + `JSON.stringify` for primitives). For the ASCII-only, integer/string-only data EXIT markers contain, the outputs are identical — but they are formally different specifications.

**Fix:** Replaced JCS reference with description of custom canonicalization per spec §13.1. Added footnote explaining the change and noting practical equivalence for EXIT's data subset.

**File:** `EXIT_PAPER_v3.md`

---

## C5: `reputation_score` Removal

**Problem:** `reputation_score` existed as an `AssetType` in Module D (`src/modules/assets.ts`). This was flagged as a Howey risk in three separate legal analyses:
1. `cellar-door-legal-redteam.md` — "should be removed or renamed"
2. `cellar-door-risk-heatmap.md` — "If reputation_score becomes tradeable, you've created an unregistered security"
3. `cellar-door-legal-lenses.md` — "Remove reputation_score as an asset type"

**Fix:**
- Removed `"reputation_score"` from `AssetType` union in `src/modules/assets.ts`
- Added deprecation comment explaining the removal and citing the legal analyses
- Updated test in `src/__tests__/modules.test.ts` to use `"credentials"` instead
- All 205 tests pass after the change

**Files:** `src/modules/assets.ts`, `src/__tests__/modules.test.ts`

---

## Verification

- **Tests:** 205/205 passing (13 test files, 0 failures)
- **Spec unchanged:** EXIT_SPEC_v1.1.md was already correct (source of truth)
- **Code unchanged:** `trust.ts` and `marker.ts` already matched spec
- **Paper updated:** 3 formula/reference corrections with footnotes
