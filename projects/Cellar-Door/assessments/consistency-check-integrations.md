# Consistency Check: Integrations, Site & Entry-Door Code

**Date:** 2026-02-24  
**Scope:** integrations/ (langchain, vercel-ai-sdk, mcp-server, openclaw-skill), cellar-door-entry/src, site/ (demo, cellar-door, paper)

---

## Summary

Overall the codebase is well-structured and consistent across integrations and the entry-door library. The main issues are: (1) the demo page uses a fictional API that doesn't match the actual code, (2) the openclaw-skill is stale and doesn't use cellar-door-entry, (3) terminology inconsistencies between old ("Transfer") and new ("Passage") across different files, and (4) the paper site matches EXIT_PAPER_v4.md very well but uses a different GitHub URL than other files.

---

## 1. Integration Package Versions ✅ Mostly Good

| Integration | cellar-door-exit dep | cellar-door-entry dep | Installed versions |
|---|---|---|---|
| langchain | peer `>=0.1.0` | peer `>=0.1.0` | exit 0.1.0, entry 0.1.0 |
| vercel-ai-sdk | peer `>=0.1.0` | peer `>=0.1.0` | exit 0.1.0, entry 0.1.0 |
| mcp-server | dep `^0.1.0` | dep `^0.1.0` | exit 0.1.0, entry 0.1.0 |
| openclaw-skill | dep `^0.1.0` | **NOT LISTED** ⚠️ | exit 0.1.0, **no entry** |

**Issue:** openclaw-skill does not depend on `cellar-door-entry`. Its `entry.sh` script manually constructs entry records using only `cellar-door-exit` for verification — it doesn't use the actual entry library at all.

---

## 2. API Consistency ⚠️ Several Issues

### Integration tools vs actual API

**langchain** exports:
- `createExitTool`, `ExitCallbackHandler` — EXIT side
- `createEntryTool`, `createAdmissionPolicyTool`, `createTransferVerificationTool` — ENTRY side
- ✅ Matches current `cellar-door-entry` API (quickEntry, evaluateAdmission, verifyTransfer)

**vercel-ai-sdk** exports:
- `exitMarkerTool`, `createExitOnFinish`, `withExitMarker` — EXIT side
- `verifyAndAdmitAgentTool`, `evaluateAdmissionTool`, `verifyTransferTool` — ENTRY side
- `createEntryOnStart`, `createTransitOnFinish` — middleware
- ✅ Matches current API

**mcp-server** exposes tools: `quick_exit`, `create_exit_marker`, `verify_exit_marker`, `generate_identity`, `verify_and_admit`, `evaluate_admission`, `verify_transfer`, `list_admission_policies`
- ✅ Matches current API. Policy presets (OPEN_DOOR, STRICT, EMERGENCY_ONLY) match entry code.

### quickExit signature
- Actual `cellar-door-exit`: `quickExit(origin: string)` → `{ marker, identity }`
- Demo page shows: `quickExit({ agentDid, platformDid, reason, knowledgeBoundary })` — **WRONG** ❌
- Site pragmatist mode shows: `quickExit("did:web:platform.example")` — **Correct** ✅
- OpenClaw skill api-guide shows: `quickExit(origin: string)` — **Correct** ✅

### exitTypes available
- EXIT spec defines: `voluntary`, `forced`, `emergency`, `keyCompromise`
- Admission policy code references: `exitType` field on ExitMarker with string comparison
- OpenClaw skill only mentions: `voluntary`, `forced`, `emergency` — missing `keyCompromise` ⚠️
- Site bureaucrat/agent modes list: `VOLUNTARY | FORCED | CHECKPOINT` — **WRONG** ❌ (should be `voluntary | forced | emergency | keyCompromise`; "CHECKPOINT" is not an exitType, it's a ceremony concept)

---

## 3. Entry-Door Code vs ENTRY_SPEC_v1.0.md ✅ Good Match

The code faithfully implements the spec. Detailed comparison:

| Spec Section | Code Implementation | Match |
|---|---|---|
| §3.1 ArrivalMarker fields | `types.ts` ArrivalMarker interface | ✅ All fields present |
| §3.2 VerificationResult | `types.ts` VerificationResult | ✅ |
| §3.3 Proof (Ed25519Signature2020) | `sign.ts` signArrivalMarker | ✅ |
| §3.5 AdmissionTypes (automatic/reviewed/conditional) | `types.ts` AdmissionType | ✅ |
| §4 Admission Policies | `admission-policy.ts` | ✅ All policy fields, presets |
| §5 Passage (Transfer) Verification | `transfer.ts` verifyTransfer | ✅ |
| §5.3 Continuity checks (5 checks) | `continuity.ts` verifyContinuity | ✅ All 5 checks |
| §6 Probation | `probation.ts` | ✅ ProbationConfig, createProbationaryArrival, isProbationComplete |
| §7 Capability Scoping | `capability-scope.ts` | ✅ scopeFromExitMarker, mergeScopes |
| §8 Claim Tracking | `claim-tracking.ts` | ✅ ClaimStore interface, InMemoryClaimStore, GDPR deleteBySubject |
| §9 Revocation | `revocation.ts` | ✅ RevocationMarker, authority checks |
| §11 Canonicalization | `arrival.ts` canonicalize | ✅ Sorted keys, recursive |
| §12 Signing/Verification | `sign.ts` | ✅ |
| §13 Validation | `validation.ts` | ✅ All 12 validation checks |
| §14.1 quickEntry | `convenience.ts` | ✅ |
| §21 Exported functions | `index.ts` | ✅ All 20 functions exported |

**Minor observations:**
- `ArrivalMarker` in code has a `type` field set in `arrival.ts` (`"ArrivalMarker"`) but it's not in the TypeScript interface definition in `types.ts`. The spec test vectors don't show a `type` field either. The code adds it internally but it's not part of the interface. ⚠️ Minor inconsistency.
- Spec says `@context` is `"https://cellar-door.dev/entry/v1"` — code constant `ENTRY_CONTEXT_V1` = `"https://cellar-door.dev/entry/v1"` ✅

---

## 4. Demo Page ⚠️ Several Issues

### Terminology
- Uses "Transfer" in the transfer verification tool name — spec now prefers "**Passage**"
  - `verifyTransfer()` function name is fine (it's in the code), but the conceptual framing should say "Passage"
  - The demo page doesn't use the word "Transfer" or "Passage" prominently — it focuses on the IP provenance scenario. ✅ No direct conflict.

### Marker examples — NOT consistent with actual code
- **EXIT marker format in demo** uses a completely different schema than the actual `cellar-door-exit` code:
  - Demo shows: `agent`, `departing_from`, `knowledge_boundary`, `reason`, `version: "1.1.0"` — **FICTIONAL** ❌
  - Actual exit marker has: `subject`, `origin`, `exitType`, `status`, `selfAttested`, `@context: "https://cellar-door.org/exit/v1"`
  - No `specVersion` field in actual code
- **ENTRY marker format in demo** uses fictional schema:
  - Demo shows: `arriving_at`, `prior_exit`, `initial_state`, `version: "1.0.0"` — **FICTIONAL** ❌
  - Actual entry marker has: `departureRef`, `departureOrigin`, `destination`, `subject`, `admissionType`, `verificationResult`
- **Code examples in demo** show fictional API:
  - `quickExit({ agentDid, platformDid, reason, knowledgeBoundary })` — not the real signature
  - `createEntryMarker({ agentDid, platformDid, priorExit, initialState })` — not the real signature
  - Real: `quickExit(origin)` and `createArrivalMarker(exitMarker, destination, opts)`

**Verdict:** The demo page is a **narrative/conceptual demo**, not a technical reference. The marker examples are illustrative fiction, not actual protocol output. This should be explicitly noted on the page or the examples should be updated to match real markers.

---

## 5. Site Cross-Links ✅ Working

| From | Link | Target | Works? |
|---|---|---|---|
| cellar-door (main) | `../paper/` | paper/index.html | ✅ (bureaucrat callout) |
| cellar-door (main) | `../demo/` | demo/index.html | ✅ (bureaucrat callout) |
| paper | `../cellar-door/` | cellar-door/index.html | ✅ (nav: ← Cellar Door) |
| paper | `../demo/` | demo/index.html | ✅ (nav: Demo →) |
| demo | `/` (root) | cellar-door? | ⚠️ Assumes root = cellar-door |
| demo | `/paper/` | paper | ⚠️ Assumes `/paper/` is correct path |
| demo | `/exit/v1/` and `/entry/v1/` | specs | ⚠️ These pages don't exist in site/ |

**Issues:**
- Demo footer links to `/exit/v1/` and `/entry/v1/` — these pages don't exist in the site directory ❌
- Demo nav links use absolute paths (`/`, `/paper/`) which depend on hosting at domain root

---

## 6. Paper Site vs EXIT_PAPER_v4.md ✅ Very Close Match

The paper site HTML (`site/paper/index.html`) appears to be a faithful HTML rendering of `EXIT_PAPER_v4.md`. Key comparisons:

- Title: "EXIT: A Protocol for Verifiable Agent Departure Ceremonies" ✅
- Version: "EXIT Protocol Specification v1.1" ✅
- Author: "Warren Koch, EXIT Protocol Project" in HTML vs "[Names TBD]" in v4.md — ⚠️ **Difference** (HTML has the actual author name)
- Abstract: ✅ Match (205 tests, commit-reveal, confidence scoring, etc.)
- All 10 sections present ✅
- References section: ✅ All citations match
- Correspondence footer: `warren@cellardoor.network`, `github.com/cellar-door-project` — different from `CellarDoorExits` org used elsewhere ⚠️

---

## 7. npm Package Names ⚠️ Minor Inconsistency

| Context | Package names used |
|---|---|
| Integration package.json names | `@cellar-door/langchain`, `@cellar-door/vercel-ai-sdk`, `@cellar-door/mcp-server`, `@cellar-door/openclaw-skill` |
| Core dependencies | `cellar-door-exit`, `cellar-door-entry` |
| All READMEs | Reference `cellar-door-exit` and `cellar-door-entry` on npm ✅ |
| OpenClaw skill SKILL.md | Says "cellar-door-entry is not yet published" — **Still accurate?** The entry package IS in node_modules of other integrations ⚠️ |

**Issue:** The openclaw-skill SKILL.md says `cellar-door-entry` is "not yet published" and the api-guide.md shows a manual ENTRY schema that doesn't match the actual `cellar-door-entry` types. The entry package appears to be installable (it's in node_modules of langchain/vercel/mcp), so the skill is stale.

---

## 8. GitHub URLs ⚠️ Inconsistencies

| Location | GitHub URL |
|---|---|
| langchain package.json | `https://github.com/CellarDoorExits/langchain` |
| vercel-ai-sdk package.json | `https://github.com/CellarDoorExits/vercel-ai-sdk` |
| mcp-server package.json | `https://github.com/CellarDoorExits/mcp-server` |
| openclaw-skill package.json | `https://github.com/CellarDoorExits/openclaw-skill` |
| All READMEs | `https://github.com/CellarDoorExits/exit-door` (EXIT protocol link) |
| Paper site footer | `github.com/cellar-door-project` ❌ Different org! |
| EXIT_PAPER_v4.md footer | Not yet visible (same content) |

**Issue:** Paper references `cellar-door-project` org while all integration repos use `CellarDoorExits` org. These should be aligned.

---

## 9. Brand Elements ✅ Mostly Consistent

| Element | Expected | Found |
|---|---|---|
| 𓉸 symbol | Present in branding | **Not found** in any integration code, README, or site page ❌ |
| "Right of Passage" | Slogan | Not found in any checked file. Spec uses "Departure is a right. Admission is a privilege." The site uses "There's always a door." and "It opens both ways." ⚠️ |
| "There's always a door." | Slogan | ✅ Found in: demo page, cellar-door site (all modes), paper site footer area |
| "It opens both ways." | Slogan | ✅ Found in demo page |
| "Every home needs a door" | Slogan | ✅ Found in cellar-door site idealist mode |
| "exit(0)" | Agent mode slogan | ✅ Found in cellar-door site agent mode |
| Cellar Door brand name | Consistent | ✅ Used everywhere |

**Issue:** The 𓉸 symbol is not present in any of the checked files. "Right of Passage" is not used anywhere — perhaps this is a planned but not yet deployed brand element?

---

## 10. OpenClaw Skill ⚠️ Stale / Needs Update

The openclaw-skill exists and has:
- ✅ SKILL.md with clear usage instructions
- ✅ 4 shell scripts (exit.sh, entry.sh, verify.sh, transfer.sh)
- ✅ api-guide.md reference
- ✅ cellar-door-exit 0.1.0 installed

**But critically:**
- ❌ Does NOT depend on `cellar-door-entry` — only `cellar-door-exit`
- ❌ `entry.sh` manually constructs ENTRY records with a **completely different schema** than the actual `cellar-door-entry` library:
  - Skill produces: `{ "@context": "https://cellar-door.org/entry/v1", id, subject, origin, destination, exitMarkerId, timestamp, status: "admitted", exitVerified: true }`
  - Actual entry library produces: `ArrivalMarker { "@context": "https://cellar-door.dev/entry/v1", id, departureRef, departureOrigin, destination, subject, timestamp, admissionType, verificationResult, proof }`
  - Note: Even the `@context` URL differs! `.org` vs `.dev`
- ❌ `verify.sh` checks for ENTRY records using the old manual schema (looks for `exitMarkerId` field), not the actual ArrivalMarker schema
- ❌ `transfer.sh` checks for `exitMarkerId` field, not `departureRef`
- ❌ api-guide.md documents the old manual ENTRY schema, not the `cellar-door-entry` API

**This is the biggest consistency issue found.** The openclaw-skill needs to be updated to use `cellar-door-entry` and its actual API.

---

## Priority Fixes

### High Priority
1. **OpenClaw skill:** Add `cellar-door-entry` dependency; rewrite `entry.sh`, `verify.sh`, `transfer.sh` to use actual library; update api-guide.md
2. **Context URL:** Skill uses `cellar-door.org` while entry library uses `cellar-door.dev` — align on one

### Medium Priority
3. **Demo page:** Either add disclaimer that marker examples are illustrative/fictional, or update them to match actual EXIT/ENTRY marker schemas
4. **Demo page code examples:** Update `quickExit()` and `createEntryMarker()` signatures to match real API
5. **GitHub org:** Align `cellar-door-project` (paper) with `CellarDoorExits` (integrations)
6. **Site exitTypes:** Fix bureaucrat/agent modes — `CHECKPOINT` is not an exitType, should be `emergency` + `keyCompromise`
7. **Demo footer:** Remove broken links to `/exit/v1/` and `/entry/v1/` or create those pages

### Low Priority
8. **𓉸 symbol:** If this is an active brand element, add it to site/READMEs
9. **"Right of Passage" slogan:** If active, incorporate somewhere
10. **Spec says "Passage", code says "transfer":** The function names (`verifyTransfer`, `TransferRecord`) use old terminology. The spec explicitly says "Passage" replaces "Transfer" as the concept name. Consider whether to rename exports (breaking change) or just update docs.
11. **Paper author:** HTML has "Warren Koch" while md has "[Names TBD]" — update md or keep intentional?
