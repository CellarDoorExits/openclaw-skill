# Fix Log — Important Items (I5, I7, I8, I11, I15)

**Date:** 2026-02-22  
**Executor:** Subagent (cross-group assessment fixes)

---

## I5 — Mark project plan as historical ✅

**File:** `projects/cellar-door-exit/docs/analysis/cellar-door-project-plan.md`  
**Change:** Added prominent ⚠️ HISTORICAL header note explaining the document predates implementation. References 205 tests, 49 source modules, working CLI.

---

## I7 — Update TODO ✅

**File:** `TODO.md` (root)  
**Changes:**
- Updated EXIT status section: 153 tests → 205 tests, 20+ modules → 49 modules
- Marked implementation as complete (Sprint 1-5 done)
- Added new "CURRENT PRIORITIES" section with: NIST RFI (March 9), npm publish, consistency fixes, integrations
- Removed BLOCKER tags from completed items
- Note: `memory/TODO.md` is a duplicate of root TODO.md from an earlier snapshot — not updated (it's the user's original vision doc)

---

## I8 — Reconcile Module D risk ratings ✅

**File:** `projects/cellar-door-exit/analysis/howey-test-module-d.md`  
**Change:** Added reconciliation note at top explaining Low (v1, constrained) vs Critical (v2, unconstrained) ratings. Points to `assessments/howey-module-d-v2.md` as authoritative.

---

## I11 — Clarify budget discrepancy ✅

**File:** `holos-investment-thesis-v3.md`  
**Change:** Added clarifying note after the "$200K available capital" line explaining: $12K CAD = 2026 AI/software budget; $200K+ = total theoretical capital across all portfolio projects (land, hardware, consulting), mostly deferred/unfunded.

---

## I15 — Resolve Signamancy naming ✅

**Files modified (Signamancy → REPUTE for reputation references):**
- `holos-investment-thesis-v3.md` — Section renamed to "REPUTE — Agent Reputation", all reputation references updated, naming note added
- `holos-investment-thesis-v2.md` — Section 1.7 renamed, all reputation references updated, naming note added at top
- `holos-investment-thesis.md` — Section renamed, reputation references updated, naming note added
- `holos-portfolio-strategy.md` — Section renamed, references updated, naming note added at top
- `memory/holos-overview.md` — Added "(now REPUTE)" annotation and naming note
- `MEMORY.md` — Updated repo list to "Signamancy (REPUTE)"

**Preserved "Signamancy" where it refers to:**
- The GitHub repo name (dogcomplex/Signamancy)
- The ontological concept / LHS⇒RHS rule engine
- The group-e assessment analysis (documents the naming problem itself)
- Reading notes about the token-based rule engine
- TODO.md rename history line (already documents the transition)
- Cross-group assessment (documents the issue)
- LOGS.md (historical log entry)
- `state/hawthorn-state.md` (repo survey reference)
