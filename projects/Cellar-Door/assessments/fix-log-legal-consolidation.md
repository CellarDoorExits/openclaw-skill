# Fix Log: Legal Consolidation (I9, I10, I14, I17, I18, I19)

**Date:** 2026-02-22
**Scope:** Cross-group assessment items related to legal document cross-referencing and consolidation

---

## I9 — Fix SECURITY.md Cross-Reference ✅

**Problem:** SECURITY.md §1.2 referenced "deferred decision D-D01" as dispute resolution. D-D01 is actually "DID Method Recommendation" (per DECISIONS.md).

**Fix:** Replaced `(deferred decision D-D01)` with `(see EXIT_SPEC_v1.1 §4.3 Module C: Dispute Bundle; §5.3 CONTESTED state; D-006 non-blocking disputes)`. There is no dedicated deferred decision for dispute resolution — it's addressed by the spec's Module C and the D-006 non-blocking principle.

**File:** `projects/cellar-door-exit/SECURITY.md`

---

## I10 — Update Version Headers ✅

**Problem:** LEGAL.md and SECURITY.md referenced v1.0 despite EXIT_SPEC_v1.1 being the current spec.

**Fix:**
- SECURITY.md: `1.0-draft` → `1.1-draft`, date updated to 2026-02-22, added `Spec Version: EXIT_SPEC_v1.1`
- LEGAL.md: `1.0-draft` → `1.1-draft`, date updated to 2026-02-22, status updated to reference `EXIT_SPEC_v1.1`

**Files:** `projects/cellar-door-exit/SECURITY.md`, `projects/cellar-door-exit/LEGAL.md`

---

## I14 — Risk Rating Scale Mapping Table ✅

**Problem:** Five different risk scales across legal docs with no mapping between them.

**Fix:** Created `projects/cellar-door-exit/docs/analysis/risk-scale-mapping.md` with:
- Unified 5-level mapping table (Emoji ↔ Text ↔ Letter Grade ↔ Howey v1 scale)
- Per-document scale usage table
- Interpretation notes (compound ratings, grade vs. risk distinction)

Added `> 📊 Risk Scale Reference` callout to the top of each analysis doc pointing to the mapping:
- `cellar-door-risk-heatmap.md`
- `cellar-door-legal-redteam.md`
- `cellar-door-legal-redteam-v2.md`
- `cellar-door-legal-lenses.md`
- `cellar-door-legal-battery.md` (root-level)
- `howey-test-module-d.md`
- `howey-module-d-v2.md` (assessments/)

---

## I17 — Consolidate LEGAL.md Amendment Recommendations ✅

**Problem:** Recommended amendments to LEGAL.md were scattered across Lenses and Battery with no consolidated view.

**Fix:** Added "Appendix: Recommended Amendments" to LEGAL.md (before Disclaimer) with source-attributed recommendations from:
- **Legal Lenses:** 10 recommendations (new §1.1, §6.1–6.3, §8.1–8.2, §14, anti-discrimination, tax, EU AI Act)
- **Legal Battery:** 5 recommendation groups (defamation mitigation, FCRA disclaimer, securities strengthening, insurance context warning, GDPR templates)
- **Red Team v2:** 2 recommendations (antitrust warning, bankruptcy automatic stay)

All marked as "pending review — not yet incorporated into normative sections."

**File:** `projects/cellar-door-exit/LEGAL.md`

---

## I18 — Add Scope & Limitations to Battery ✅

**Problem:** Battery had no section documenting what it doesn't cover that other docs do.

**Fix:** Added "§VIII. Scope & Limitations" section before the Summary Table, documenting:
- What the Battery covers (7 specialist analyses)
- What RT2 covers that Battery doesn't (antitrust, insurance reliance by users, agent personhood, treaty law, remediation grading)
- What Lenses covers that Battery doesn't (multi-lens classification, cross-lens conflicts, conservative baseline, spec language drafts, open questions)
- Gaps covered by neither (EU AI Act conformity, patent landscape, state-by-state US analysis)

**File:** `cellar-door-legal-battery.md`

---

## I19 — Resolve Insurance Contradiction ✅

**Problem:** RT1 says "Do not launch without Tech E&O" (immediate). Battery §VII recommends trigger-based deferral. Current decision is: defer insurance.

**Fix:** Added update notes to docs recommending immediate insurance:
- **RT1 §6.3:** Added boxed update note after "Do not launch without Tech E&O" pointing to Battery §VII trigger framework as canonical. Current decision: defer, GL only until first platform integration.
- **RT1 action item #6:** Added inline note marking it deferred per Battery framework.
- **RT2 action item #18:** Added same inline deferral note.

Battery §VII's trigger table is now the canonical insurance decision framework. No changes needed to Battery itself (it already recommends the correct approach).

**Files:** `projects/cellar-door-exit/docs/analysis/cellar-door-legal-redteam.md`, `projects/cellar-door-exit/docs/analysis/cellar-door-legal-redteam-v2.md`
