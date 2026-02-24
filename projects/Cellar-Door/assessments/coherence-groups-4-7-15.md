# Coherence Check: Groups 4–7 (Assessments) & Group 15 (Integrations)

**Date:** 2026-02-24  
**Scope:** All 55 assessment files, 4 integration packages (langchain, vercel-ai-sdk, mcp-server, openclaw-skill), fix logs, multi-lens synthesis  
**Checker:** Subagent coherence pass

---

## Summary (~500 words)

The Cellar Door project's assessments and integrations are largely coherent after the extensive fix passes documented in 7 fix logs. The core integration code is well-written, correctly uses published package APIs (`quickExit`, `quickEntry`, `verifyTransfer`, `evaluateAdmission`, `fromJSON`, `toJSON`), and all three SDK integrations faithfully implement both EXIT and ENTRY functionality with proper security fixes (S-01 through S-03) applied. Brand elements (𓉸) are present in the skill. Test counts and marker sizes have been corrected across documents.

However, several issues remain:

**Terminology:** "Transfer" persists extensively in integration code and docs. The brand guide mandates "Passage" but the underlying packages export `verifyTransfer()` and `TransferRecord`, making a clean break impossible at the integration layer without upstream API changes. The langchain package has a file literally named `transfer-tool.ts`. All three READMEs reference "Transfer Verification" in headings. This is acknowledged in `consistency-check-docs.md` but the integration layer wasn't updated.

**OpenClaw Skill:** The `package.json` lists only `cellar-door-exit` as a dependency, yet all four scripts use `cellar-door-entry` via runtime `npm install`. The `openclaw-skill.md` assessment says `entry.sh` "manually constructs entry records using only cellar-door-exit" — this is **now incorrect**: the scripts were rewritten to properly use `quickEntry()`, `verifyArrivalMarker()`, `verifyTransfer()` from `cellar-door-entry`. The assessment is stale.

**Domain References:** `cellar-door.dev` appears in the skill's SKILL.md and api-guide.md (3 occurrences). The cross-consistency-post-fixes.md checked for `cellar-door.org` but didn't flag `.dev`. It's unclear whether `cellar-door.dev` is the canonical domain — no other doc uses it.

**Assessment Contradictions:** The `consistency-check-integrations.md` (§2) says the openclaw-skill "does not depend on `cellar-door-entry`" and that `entry.sh` "manually constructs entry records." The actual scripts now use `require('cellar-door-entry')` with `quickEntry()`. The `cross-consistency-post-fixes.md` (item 6) says "✅ PASS" for the skill, which is correct for the scripts themselves but doesn't flag the missing `package.json` dependency.

**Multi-Lens vs Implementation:** The synthesis identified ENTRY protocol as the #1 consensus need (11/15 personas). It has since been built and integrated across all packages — a major win. However, several synthesis recommendations remain unaddressed in code: non-refoulement principle, destruction protocols, field-level redaction, directed exit type, and discovery documents (`.well-known`). These are correctly flagged as future work in the synthesis but no tracking document maps them to implementation status.

**Fix Log Accuracy:** All 7 fix logs are accurate for the changes they describe. Test counts (205 exit, 77 entry) match. Security fixes (S-01 through S-03, HIGH-01/02) are verified intact in the current code. The paper v4 fix log correctly notes all byte size corrections.

---

## Findings

### CRITICAL — None

### HIGH

| ID | Finding | Location | Details |
|----|---------|----------|---------|
| H-1 | OpenClaw skill `package.json` missing `cellar-door-entry` dependency | `openclaw-skill/package.json` | Scripts use `quickEntry`, `verifyTransfer`, `verifyArrivalMarker` from `cellar-door-entry` at runtime. Package.json only lists `cellar-door-exit`. If npm installs from package.json (not script auto-install), entry/transfer/verify operations fail. |
| H-2 | Assessment `openclaw-skill.md` & `consistency-check-integrations.md` are stale — claim skill doesn't use cellar-door-entry | `assessments/openclaw-skill.md`, `assessments/consistency-check-integrations.md` | Both assessments describe an earlier version of the skill. The skill was rewritten to use the actual `cellar-door-entry` package. Assessments should note this correction. |

### MEDIUM

| ID | Finding | Location | Details |
|----|---------|----------|---------|
| M-1 | "Transfer" terminology throughout integration docs and code | All 4 integration packages | `transfer-tool.ts` filename, `verifyTransfer` tool names, "Transfer Verification" README headings. Brand guide mandates "Passage" but upstream API uses "Transfer". Should add Passage notes (as ENTRY_SPEC does) or defer to upstream rename. |
| M-2 | `cellar-door.dev` domain in skill — unverified | `openclaw-skill/SKILL.md`, `openclaw-skill/references/api-guide.md` | 3 references to `https://cellar-door.dev`. No other project file uses this domain. If domain doesn't exist or isn't controlled, these are broken links. Cross-consistency check missed this (only searched for `.org`). |
| M-3 | `ExitType.KeyCompromise` missing from skill docs | `openclaw-skill/SKILL.md` | SKILL.md only lists `voluntary|forced|emergency` for exit.sh. Actual API supports `keyCompromise` as a 4th type. |
| M-4 | No tracking doc maps multi-lens synthesis recommendations to implementation | N/A | 15 personas raised ~20 actionable recommendations. ENTRY was built (biggest one). Others (redaction, directed exits, discovery docs, non-refoulement) have no tracking. |

### LOW

| ID | Finding | Location | Details |
|----|---------|----------|---------|
| L-1 | Skill repo URL may not exist | `openclaw-skill/package.json` | Points to `CellarDoorExits/openclaw-skill.git` — this repo likely doesn't exist on GitHub (only `exit-door` is confirmed). |
| L-2 | integration-langchain.md says "imports from relative path — will need updating" | `assessments/integration-langchain.md` | This was already fixed per `fix-log-references.md`. Assessment is stale on this point. |
| L-3 | integration-vercel.md "Before Publishing" checklist items may be done | `assessments/integration-vercel.md` | Lists 4 TODO items that appear resolved (imports fixed, build works). Assessment doesn't reflect current state. |
| L-4 | Test counts in integration assessments may be stale | Various | `integration-langchain.md` says 8 tests, `integrations-entry-update.md` says 15. `integration-vercel.md` says 12, entry-update says 18. Later counts supersede but earlier assessments aren't annotated. |
| L-5 | `cross-group-assessment.md` X-2 test count (143 vs 153) — fix logs corrected to 205 but this assessment not updated | `assessments/cross-group-assessment.md` | Assessment still discusses 143/153 discrepancy. Fix was applied; assessment is historical analysis and intentionally left unchanged, but could confuse readers. |

---

## Verification Checklist

| Check | Result |
|-------|--------|
| Integration APIs match published `cellar-door-exit` / `cellar-door-entry` | ✅ All 4 packages use correct function signatures |
| Security fixes S-01/S-02/S-03 intact | ✅ Verified in source: try/catch on JSON.parse, default OPEN_DOOR policy, serverPolicy override |
| HIGH-01/HIGH-02 (private key leak) intact | ✅ No private keys in any tool response |
| Brand glyph 𓉸 in skill | ✅ Present in SKILL.md and all 4 scripts |
| Package versions consistent | ✅ All reference cellar-door-exit/entry 0.1.0 / ^0.1.0 |
| Fix logs accurate | ✅ All 7 logs verified against current source |
| Paper v4 corrections applied | ✅ Byte sizes, test counts, formulas all correct |
| README disclaimers (L-01) present | ✅ All 3 SDK READMEs have liability disclaimer |
| `cellar-door.org` removed from source | ✅ Only in historical specs/assessments (acceptable) |
| GitHub org `CellarDoorExits` consistent | ✅ All package.json files use correct org |
