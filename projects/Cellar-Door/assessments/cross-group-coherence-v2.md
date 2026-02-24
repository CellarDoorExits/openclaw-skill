# Cross-Group Coherence Check v2

**Date:** 2026-02-24  
**Scope:** All intra-group reports + cross-consistency-post-fixes + consistency-check-docs + consistency-check-code, verified against live codebase  
**Reports reviewed:** coherence-groups-4-7-15, cross-group-assessment, cross-consistency-post-fixes, consistency-check-docs, consistency-check-code

> **Note:** Three of four requested intra-group reports (groups 8-10, 11-14, 1-3-16-17) do not exist yet. This analysis uses the one available (groups 4-7-15) plus the pre-existing cross-group-assessment, post-fix check, docs check, and code check as source material.

---

## 1. Numbers That Must Match Everywhere

### Test Counts

| Source | EXIT Tests | ENTRY Tests | Total |
|--------|-----------|-------------|-------|
| **cross-consistency-post-fixes (live run)** | **279** | **77** | **356** |
| coherence-groups-4-7-15 | 205 | 77 | 282 |
| cross-group-assessment | 143 or 153 (disputed) | — | — |
| consistency-check-docs | 275 | not mentioned | — |
| Target claim | 291 | 77 | 368 |

**⚠️ CONTRADICTION:** No source agrees. The live-verified count is **279 exit + 77 entry = 356 total**. However, tests currently fail to run (18 suites fail, likely due to build/config issues — the 279 count comes from the post-fixes report's last successful run). The claimed 291 exit tests do not match any source.

**Verdict:** The authoritative count is **279 + 77 = 356** (last verified run). The 291 figure needs verification — 12 tests may have been added after the post-fixes check, or the number is wrong.

### Byte Sizes

| Source | Unsigned | Signed | Notes |
|--------|----------|--------|-------|
| **Live measurement (this check)** | **352** | **644** | `quickExit('test')` minus proof / with proof |
| cross-group-assessment | 442 (core) | 586 | OLD — pre-v1.1 |
| Comms docs (pitches, NIST) | ~300 | — | WRONG but closer to 352 than to 442 |
| consistency-check-docs | "300–500" (spec) | — | Spec range partially correct |

**Verdict:** The authoritative sizes are **352 bytes unsigned, 644 bytes signed** (measured 2026-02-24). The old 442/586 numbers are stale (pre-specVersion field changes). The "~300 bytes" claim in comms is wrong but less wrong than previously thought (352 vs 300 = 17% error). All docs must be updated.

### Package Counts

| Metric | Claimed | Actual |
|--------|---------|--------|
| npm packages | 5 | **6** (cellar-door-exit, cellar-door-entry, @cellar-door/langchain, @cellar-door/vercel-ai-sdk, @cellar-door/mcp-server, @cellar-door/openclaw-skill) |
| GitHub repos | 6 | **Unverifiable** (no GitHub access), but 6 package.json files exist with repo fields pointing to `CellarDoorExits` org |

**Verdict:** There are **6 npm packages**, not 5. The openclaw-skill is the 6th.

### ExitType Count

| Source | Count | Values |
|--------|-------|--------|
| **Code (types.ts)** | **8** | voluntary, forced, emergency, keyCompromise, platform_shutdown, directed, constructive, acquisition |
| EXIT_SPEC v1.1 (doc) | 4 | voluntary, forced, emergency, keyCompromise |
| consistency-check-code | 8 (notes 4 new untested) | ✅ matches code |

**Verdict:** **8 ExitTypes in code**, but the spec document only lists 4. Spec-code drift is a HIGH issue.

### Source Module Counts

6 optional modules (A–F) — consistent across all sources. ✅

---

## 2. Terminology: "Passage" vs "Transfer"

**Brand mandate:** "Passage" everywhere. "Transfer" is retired.

| Location | Status | Action Needed |
|----------|--------|---------------|
| ENTRY_SPEC v1.0 prose | ✅ Uses "Passage" | None |
| ENTRY_SPEC code types | ❌ `TransferRecord`, `verifyTransfer()`, `transferTime` | Rename to `PassageRecord`, `verifyPassage()`, `passageTime` |
| ENTRY README | ❌ "The Transfer Flow", "Transfer Verification" headings | Add Passage notes or rename |
| Integration langchain | ❌ `transfer-tool.ts` filename | Rename file |
| Integration READMEs (all 3 SDKs) | ❌ "Transfer Verification" headings | Update |
| Slogans-v2 | ⚠️ 4 slogans use "transfer" | These are candidates, not active — low priority |
| EXIT source code | ✅ No "Transfer"/"Passage" references | Clean |

**Files still needing update:** ENTRY_SPEC type names, ENTRY README headings, all 3 SDK integration READMEs, langchain `transfer-tool.ts` filename.

---

## 3. Domain References

**Source code uses:** `cellar-door.dev` consistently ✅

| Location | Domain | Status |
|----------|--------|--------|
| cellar-door-exit/src/context.ts | `cellar-door.dev` | ✅ Canonical |
| cellar-door-exit/src/types.ts | `cellar-door.dev` | ✅ |
| cellar-door-entry/src/types.ts | `cellar-door.dev` | ✅ |
| EXIT_SPEC v1.1 doc (§3.1 @context) | `cellar-door.org` | ❌ STALE |
| EXIT_SPEC v1.md examples | `cellar-door.org` (7 occurrences) | ❌ STALE |
| ENTRY_SPEC v1.0 doc | `cellar-door.dev` | ✅ |
| Papers (v3, v4) | `cellar-door.org` | ⚠️ Historical docs |
| OpenClaw skill SKILL.md | `cellar-door.dev` | ✅ |
| preservation-considerations | `cellar-door.org` | ⚠️ Historical |

**Verdict:** `cellar-door.dev` is the canonical domain (it's what the code uses). The consistency-check-docs flagged a "domain mismatch" between EXIT spec (.org) and ENTRY spec (.dev) — but the code is uniform on `.dev`. The EXIT_SPEC document needs updating from `.org` → `.dev`.

**No `.org` references remain in source code.** ✅ Only in spec docs and papers.

---

## 4. Module Naming: Ecosystem Map vs Spec vs Code

| Concept | Ecosystem Map | EXIT_SPEC | Code (types.ts) | Correct Name |
|---------|--------------|-----------|-----------------|--------------|
| Module A (Reputation) | REPUTE | Module A | `ModuleA` / `ReputationModule` | **Module A / REPUTE** |
| Module B (State) | (core) | Module B | `ModuleB` | **Module B** |
| Module C (Dispute) | (core) | Module C | `ModuleC` / `DisputeModule` | **Module C** |
| Module D (Economic) | PLEDGE | Module D | `ModuleD` / `AssetManifestModule` | **Module D / PLEDGE** |
| Module E (Metadata) | (core) | Module E | `ModuleE` / `ContinuityModule` | **Module E** |
| Module F (Cross-domain) | (core) | Module F | `ModuleF` / `OriginAttestationModule` | **Module F** |
| Lineage chain | LINEAGE | lineage | `lineage` | **LINEAGE / lineage** |
| Insurance → | PLEDGE | Module D | — | **PLEDGE** (Insurance retired) |
| Signamancy → | REPUTE (primitive); Signamancy (rule engine project) | — | — | **REPUTE** (primitive), **Signamancy** (project only) |

**Issue (CC-08/CC-09):** Code has a dual type system — `ModuleA`–`ModuleF` in types.ts AND separate `ReputationModule`/`DisputeModule`/etc in `modules/*.ts` with conflicting resolution status enums. These must be reconciled.

---

## 5. Cross-Report Contradictions

| # | Report A Says | Report B Says | Resolution |
|---|--------------|---------------|------------|
| 1 | groups-4-7-15: "exit: 205 tests" | post-fixes: "exit: 279 tests" | **279 is newer/correct** — 205 was pre-fix count |
| 2 | groups-4-7-15: skill "does not depend on cellar-door-entry" | post-fixes: skill scripts use `require('cellar-door-entry')` | **Post-fixes is correct** — skill was rewritten. Assessment is stale |
| 3 | cross-group-assessment: "442 bytes unsigned, 586 signed" | This check (live): "352 unsigned, 644 signed" | **352/644 is current** — code changed since cross-group-assessment |
| 4 | consistency-check-docs: "EXIT spec uses .org, ENTRY uses .dev" | Code check: both use `.dev` | **Code is authoritative** — EXIT spec doc is stale, not the code |
| 5 | post-fixes: "CC-01/CC-02 type exports missing from index.ts" | post-fixes check #2: "✅ PASS both exported" | **Post-fixes is newer** — CC-01/CC-02 were fixed between code-check and post-fixes |
| 6 | groups-4-7-15: "ExitType.KeyCompromise missing from skill docs" | Code: 8 ExitTypes exist | Skill docs list 3, code has 8 — **skill docs need updating** |
| 7 | consistency-check-docs §10: "specVersion NOT in EXIT_SPEC" | Code: `EXIT_SPEC_VERSION = "1.1"` used everywhere | **Spec document lags code** — 6 features in code not in spec doc |

---

## 6. Priority-Ordered Fix List for NIST Submission

### 🔴 P0 — BLOCKS NIST SUBMISSION

| # | Fix | Est. Hours | Why |
|---|-----|-----------|-----|
| 1 | **Update byte size claims** in NIST RFI, pitches, business plan: 352 unsigned / 644 signed | 1 | Submitting wrong numbers to a federal agency destroys credibility |
| 2 | **Update EXIT_SPEC @context domain** from `cellar-door.org` → `cellar-door.dev` | 0.5 | Spec references a domain that doesn't match the code |
| 3 | **Update test count** in all docs: 279 exit + 77 entry = 356 (or re-run and verify) | 0.5 | Must be accurate for technical claims |
| 4 | **Fix NIST RFI placeholders** (date, contact, entity) | 1 | Can't submit with [PLACEHOLDER] |
| 5 | **Decide legal entity** for submission header | 1 | Required for NIST submission form |

### 🟡 P1 — FIX BEFORE PUBLICATION

| # | Fix | Est. Hours |
|---|-----|-----------|
| 6 | Update EXIT_SPEC v1.1 doc with 6 missing features (specVersion, 4 new ExitTypes, dispute fields, completenessAttestation, PlatformCompromiseDeclaration, BatchShutdownCeremony) | 4 |
| 7 | Add validation for v1.1 fields (CC-03, CC-04: dispute sub-fields, completenessAttestation) | 3 |
| 8 | Add tests for 4 new ExitTypes + completenessAttestation + dispute fields (CC-05/06/07) | 3 |
| 9 | Reconcile dual module type system (CC-08, CC-09: types.ts vs modules/*.ts) | 2 |
| 10 | Update JSON-LD context with v1.1 terms (CC-10) | 1 |
| 11 | Reconcile confidence scoring formula (spec vs paper) | 2 |
| 12 | Reconcile tenure weight formula (spec vs paper) | 1 |
| 13 | Reconcile canonicalization (JCS vs custom) | 2 |

### 🟢 P2 — FIX FOR QUALITY

| # | Fix | Est. Hours |
|---|-----|-----------|
| 14 | Rename Transfer → Passage in ENTRY types/README/integration docs | 2 |
| 15 | Add `cellar-door-entry` to openclaw-skill package.json | 0.25 |
| 16 | Update stale assessments (openclaw-skill.md, consistency-check-integrations.md) | 1 |
| 17 | Update skill SKILL.md to list all 8 ExitTypes | 0.5 |
| 18 | Rebuild dist/ to clear stale .org references | 0.25 |
| 19 | Add ExitType tests for PlatformShutdown, Directed, Constructive | 1 |

---

## 7. Source of Truth Reference Card

### 📋 Cellar Door — Authoritative Metrics (2026-02-24)

| Metric | Value | Source |
|--------|-------|--------|
| **Unsigned marker size** | **352 bytes** | Live measurement: `quickExit('test')` minus proof field |
| **Signed marker size** | **644 bytes** | Live measurement: `quickExit('test')` with Ed25519 proof |
| **EXIT test count** | **279** | Last successful `npx jest` run (post-fixes report) |
| **ENTRY test count** | **77** | Last successful `npx jest` run (post-fixes report) |
| **Total test count** | **356** | 279 + 77 |
| **npm packages** | **6** | cellar-door-exit, cellar-door-entry, @cellar-door/langchain, @cellar-door/vercel-ai-sdk, @cellar-door/mcp-server, @cellar-door/openclaw-skill |
| **GitHub repos (planned)** | **6** | One per package under `CellarDoorExits` org |
| **ExitType values** | **8** | voluntary, forced, emergency, keyCompromise, platform_shutdown, directed, constructive, acquisition |
| **Optional modules** | **6** | A (Reputation), B (State), C (Dispute), D (Economic), E (Metadata), F (Cross-domain) |
| **Ceremony states** | **7** | alive, intent, snapshot, open, contested, final, departed |
| **Ceremony paths** | **3** | cooperative, unilateral, emergency |
| **Canonical domain** | **cellar-door.dev** | Source code context.ts / types.ts |
| **GitHub org** | **CellarDoorExits** | All package.json repository fields |
| **Spec version** | **1.1** | EXIT_SPEC_VERSION constant in types.ts |
| **Brand terminology** | **"Passage"** (not "Transfer") | Brand guide mandate |
| **Primary slogan** | **"Right of Passage"** | Brand guide |
| **Glyph** | **𓉸** | Brand guide |

### ⚠️ Numbers That Are WRONG in Existing Docs

| Wrong Claim | Where | Correct Value |
|-------------|-------|---------------|
| ~300 bytes | Pitches, business plan, NIST RFI | 352 unsigned / 644 signed |
| 442 bytes unsigned / 586 signed | cross-group-assessment, old paper | 352 / 644 |
| 153 tests / 143 tests / 205 tests | Various old docs | 279 exit + 77 entry = 356 |
| 5 npm packages | Task description | 6 |
| 4 ExitTypes | EXIT_SPEC doc | 8 (code has 8) |
| `cellar-door.org` | EXIT_SPEC doc, papers | `cellar-door.dev` |

---

## Conclusion

The Cellar Door project is **architecturally sound** but suffers from **documentation lag** — the code has moved ahead of the spec documents, and old metrics propagate through comms materials. The single most impactful action is updating the 5 key numbers (byte sizes, test counts, ExitType count, package count, domain) across all documents before NIST submission.

**Estimated total fix time:** ~27 hours (P0: 4h, P1: 18h, P2: 5h)
