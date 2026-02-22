# Fix Log: C1–C5 (Marker Size & Test Count Consistency)

**Date:** 2026-02-22  
**Scope:** Fix incorrect "~300 bytes" marker size claims and outdated test counts across all project documents.

## Correct Values

| Metric | Actual |
|--------|--------|
| Core unsigned marker | ~335 bytes |
| Core signed marker | ~596 bytes |
| All modules | ~1,294 bytes |
| Test count | 205 tests |

## Files Changed

### Marker Size Fixes (~300 → ~335/~596)

| File | Old | New |
|------|-----|-----|
| `projects/cellar-door-exit/docs/PITCH_PRAGMATIC.md` | "~300 bytes", "300 bytes", "300-byte" (×3) | ~335 bytes (unsigned), ~596 bytes (signed) |
| `projects/cellar-door-exit/docs/PITCH_IDEALIST.md` | "300-byte" (×2) | ~335-byte |
| `projects/cellar-door-exit/docs/NIST_RFI_PRAGMATIC.md` | "~300–500 bytes", "~300 bytes" (×2) | ~335 bytes (unsigned) to ~596 bytes (signed) |
| `cellar-door-business-plan.md` | "300-byte" | ~335-byte |
| `projects/cellar-door-exit/README.md` | "~300 bytes" | ~335 bytes (unsigned) |
| `projects/cellar-door-exit/docs/analysis/cellar-door-project-plan.md` | "~300-500 bytes" | ~335–596 bytes |
| `projects/cellar-door-exit/docs/analysis/cellar-door-legal-lenses.md` | "~300-500 bytes" | ~335–596 bytes |
| `projects/cellar-door-exit/docs/analysis/cellar-door-master-assessment.md` | "~300-500 bytes" | ~335–596 bytes |
| `projects/cellar-door-exit/docs/analysis/cellar-door-professional-reviews.md` | "~300 bytes" | ~335 bytes |
| `holos-investment-thesis-v2.md` | "300-byte" | ~335-byte |
| `holos-investment-thesis-v3.md` | "300 bytes" | ~335 bytes |
| `holos-portfolio-strategy.md` | "300-byte" | ~335-byte |
| `cellar-door-integration-analysis.md` | "~300 bytes" | ~335 bytes |

### Test Count Fixes (143/153 → 205)

| File | Old | New |
|------|-----|-----|
| `EXIT_PAPER_v3.md` | 153 tests | 205 tests |
| `cellar-door-pre-export-checklist.md` | 153 tests (×2) | 205 tests |
| `cellar-door-business-plan.md` | 143 tests | 205 tests |
| `cellar-door-paper-readiness.md` | 143 tests | 205 tests |
| `projects/cellar-door-exit/docs/analysis/cellar-door-master-assessment.md` | 143 tests (×4) | 205 tests |
| `holos-investment-thesis.md` | 143 tests | 205 tests |
| `holos-investment-thesis-v2.md` | 143 tests | 205 tests |
| `holos-investment-thesis-v3.md` | 143 tests | 205 tests |
| `holos-portfolio-strategy.md` | 143 tests | 205 tests |
| `assessments/group-e-holos-vision.md` | 143 tests | 205 tests |

### Not Changed (intentional)

- `assessments/cross-group-assessment.md` — documents the discrepancy; references are analytical, not claims
- `assessments/group-cd-strategy-comms.md` — same; assessment of the problem
- `assessments/group-a-exit-core.md` — same
- `TODO.md` — contains task items about fixing these; left as-is for task tracking
- `cellar-door-pre-export-checklist.md` line 221 — flags "~300 bytes" as needing verification (meta-comment, not a claim)

## Verification

Post-fix grep for `~300`, `300 bytes`, `300-byte`, `143 tests`, `153 tests` returns zero hits outside assessment/tracking files.
