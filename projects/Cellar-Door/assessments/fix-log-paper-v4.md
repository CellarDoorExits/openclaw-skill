# Fix Log: EXIT_PAPER_v4.md (Full Coherence Pass)

**Date:** 2026-02-22  
**Source of truth:** EXIT_SPEC_v1.1.md  
**Input:** EXIT_PAPER_v3.md + all prior fix logs (C1–C5, C2–C4, remaining)

---

## Changes Applied

### 1. Version Note Added
- Added `> This paper describes EXIT Protocol Specification v1.1.` after the preprint notice.

### 2. Abstract — Byte Sizes Corrected
- **Old:** `~586 bytes signed`
- **New:** `~335 bytes unsigned, ~596 bytes signed`
- Aligns with measured benchmarks and fix-log-C1-C5 canonical values.

### 3. Abstract — Test Count Corrected
- **Old:** `153 passing tests`
- **New:** `205 passing tests`
- Was missed in prior fix-log-C1-C5 pass (§8.2 was fixed but abstract was not).

### 4. §3.1 Design Goals — Count Corrected
- **Old:** `EXIT is designed around five principles:`
- **New:** `EXIT is designed around six principles:`
- The 6th goal (non-weaponizable) was added by a prior subagent (I4) but the count wasn't updated.

### 5. §6.3 GDPR Section — Byte Size Corrected
- **Old:** `~586 byte signed core markers`
- **New:** `~596 byte signed core markers`

### 6. §8.2 Marker Size — Both Values Corrected
- **Old:** `Core markers (unsigned) measure 442 bytes; signed markers measure 586 bytes.`
- **New:** `Core markers (unsigned) measure ~335 bytes; signed markers measure ~596 bytes.`

---

## Verified Correct (No Changes Needed)

| Check | Status |
|-------|--------|
| Spec section references (§7.3, §7.4, §13.1, §17) | ✅ All reference v1.1 sections correctly |
| Design goals list 6 items including non-weaponization | ✅ Present (added by prior subagent) |
| Module A–F descriptions match spec §4.1–4.6 | ✅ Consistent |
| Ceremony state machine (7 states, 3 paths) matches spec §5 | ✅ Consistent |
| 205 tests in §8.2 | ✅ Already correct |
| 9 test vectors in §8.2 Table 4 | ✅ Already correct (§17.1–17.9) |
| Terminology: "departure" general, "subject" formal | ✅ Consistent with style guide |
| 24 references present and correctly cited | ✅ Verified |
| No reputation_score references | ✅ None found |
| No v1.0-era section references (§12.x) | ✅ None found (fixed by prior subagent) |
| Confidence formula (additive, §4.3.3) | ✅ Already correct (fixed by C2–C4) |
| Tenure formula (log₂(731), §4.3.2) | ✅ Already correct (fixed by C2–C4) |
| Canonicalization (custom, not JCS, §5.3) | ✅ Already correct (fixed by C2–C4) |
| Commit-reveal description matches spec §7.2 | ✅ Consistent |
| Status confirmation levels match spec §7.1 | ✅ Consistent |

---

## Files

- **Created:** `docs/papers/EXIT_PAPER_v4.md`
- **Preserved:** `EXIT_PAPER_v3.md` (unchanged, historical)
