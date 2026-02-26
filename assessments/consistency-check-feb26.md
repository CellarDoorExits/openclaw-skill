# Consistency Check — 2026-02-26

**Scope:** Full M-06 Tier 1 consistency check across all Cellar Door project files.

---

## 1. Numbers Consistency

### 1.1 ❌ Dependency Count: 5 vs 6

- **Files:** `package.json`, website `index.html`, `SHOW_HN_FINAL.md`
- **Issue:** `package.json` has **5** runtime dependencies (`@noble/ciphers`, `@noble/curves`, `@noble/ed25519`, `@noble/hashes`, `commander`). Website and Show HN both say **6**.
- **Fix:** Either add the 6th dependency or update marketing to say 5. The `commander` CLI dep may not have been in the original count. Verify which is correct — if `commander` was added later, update all docs to 6 → 5, or split the count ("5 runtime + 1 CLI").

### 1.2 ❌ Test Count in README: 404 vs 410

- **Files:** `cellar-door-exit/README.md` says "All 404 tests pass across 24 test files"
- **Actual:** 410 tests pass across 25 test files (confirmed by running `vitest run`)
- **Website** says 410 ✅, **Show HN** says 410 ✅
- **Fix:** Update README from "404" to "410" and "24 test files" to "25 test files".

### 1.3 ✅ Marker size: ~335 bytes

- Website says ~335B ✅
- README says ~335 bytes ✅
- Spec says "approximately 300–500 bytes" (acceptable range) ✅
- Paper says "approximately 300–500 bytes" (acceptable range) ✅

### 1.4 ✅ Sign time 0.47ms

- Website says 0.47ms ✅

### 1.5 ✅ Sunset defaults: 730/365

- Spec says 730 voluntary, 365 involuntary ✅
- Code (`marker.ts:88`) says 730 voluntary, 365 otherwise ✅

### 1.6 ✅ JSON size limit: 8192 bytes

- Code (`validate.ts`) enforces 8192 bytes ✅

### 1.7 ✅ Domain separation prefixes

- Code: `exit-marker-v1.1:` in `proof.ts`, `key-compromise.ts`, `ceremony.ts` ✅
- Spec: `exit-marker-v1.1:` ✅
- Entry code: `entry-marker-v1.0:` in `sign.ts`, `revocation.ts` ✅

### 1.8 ✅ Test counts: 410 + 75 = 485

- Exit tests: 410 ✅
- Entry tests: 75 ✅

---

## 2. Terminology Consistency

### 2.1 ✅ exitType enum values

- Code matches spec: `voluntary`, `forced`, `emergency`, `keyCompromise`, `platform_shutdown`, `directed`, `constructive`, `acquisition` ✅

### 2.2 ✅ status enum values

- Code matches spec: `good_standing`, `disputed`, `unverified` ✅

### 2.3 ✅ Ed25519 + P-256

- No instances of `secp256k1` found ✅
- Code uses `P256` in function names (acceptable for code identifiers) ✅
- Spec and docs use `P-256` with hyphen ✅

### 2.4 ⚠️ Paper uses only 4 exitTypes

- **File:** `EXIT_PAPER_DRAFT.md` §3.2
- **Issue:** Lists only 4 exit types: `voluntary`, `forced`, `emergency`, `keyCompromise`. Missing: `platform_shutdown`, `directed`, `constructive`, `acquisition`.
- **Mitigation:** The paper predates v1.1 and the spec §1.3 changelog lists these as v1.1 additions. However, the paper's abstract mentions v1.1 features. This is a partial inconsistency.
- **Fix:** Add the 4 new exit types to the paper's §3.2, or add a note that "v1.1 adds four additional types."

### 2.5 ⚠️ Paper uses only "7 mandatory fields" vs spec's 8+

- **File:** `EXIT_PAPER_DRAFT.md` says "seven mandatory fields" and "7 fields"
- **Spec:** Lists 8 numbered mandatory fields (including `specVersion` added in v1.1) plus `proof`
- **README:** Says "7 mandatory fields"
- **Fix:** The README and paper are aligned at 7 (they count `proof` as part of the 7). The spec numbers them 1-8 plus `proof` separately. Clarify: the canonical count should be consistent. Recommend aligning on "7 mandatory fields + proof" or "8 fields including proof."

---

## 3. Cross-Document Consistency

### 3.1 ❌ Paper uses `cellar-door.org` instead of `cellar-door.dev`

- **File:** `EXIT_PAPER_DRAFT.md` §3.2 JSON example
- **Issue:** `"@context": "https://cellar-door.org/exit/v1"` — should be `cellar-door.dev`
- **Spec** correctly uses `cellar-door.dev` ✅
- **Fix:** Change `.org` to `.dev` in the paper.

### 3.2 ⚠️ README import style differs from website

- **README:** `import { quickExit, quickVerify, toJSON } from "cellar-door-exit"`
- **Website (pragmatist):** Same ✅
- Minor: README's `quickExit` takes `"did:web:platform.example"` (DID), website takes `"https://platform.example.com"` (URL). Both are valid per spec but inconsistent examples.
- **Fix:** Align examples — recommend using URI format in both since `origin` is defined as URI in spec.

### 3.3 ✅ Website has all 6 modes

- Poet, Idealist, Pragmatist, Bureaucrat, Cynic, Agent — all present ✅

### 3.4 ✅ All 8 exit types listed in website

- Pragmatist mode table lists all 8 ✅
- Idealist mode lists all 8 ✅

---

## 4. Code-Spec Alignment

### 4.1 ✅ validate.ts enforces spec requirements

- Checks `@context`, `specVersion`, all mandatory fields, `selfAttested`, emergency justification, legal hold structure, 8192 byte limit ✅

### 4.2 ✅ ExitType and ExitStatus enums match spec

- All 8 exit types present ✅
- All 3 status values present ✅

### 4.3 ✅ Domain separation prefix matches spec

- Code uses `exit-marker-v1.1:` consistently ✅

### 4.4 ✅ Sunset defaults in code match spec

- `marker.ts:88`: voluntary=730, else=365 ✅

### 4.5 ⚠️ Code uses `sunsetDate` not `expires`

- **Spec §3.4:** Says `expires` is the MUST field, `sunsetDate` is deprecated legacy alias
- **Code (`guardrails.ts`):** Uses `sunsetDate` throughout, no reference to `expires`
- **Code (`marker.ts:88`):** Sets `expires` field ✅
- **Fix:** `guardrails.ts` should check both `expires` and `sunsetDate` (fallback). Currently only checks `sunsetDate`, meaning markers using the new `expires` field won't be sunset-checked by guardrails.

---

## 5. Contact Info Consistency

### 5.1 ❌ `warrenkoch@gmail.com` in public-facing files

- **Files with `warrenkoch@gmail.com`:**
  - `cellar-door-exit/GOVERNANCE.md` (project lead contact)
  - `cellar-door-exit/CODE_OF_CONDUCT.md` (report concerns)
  - `cellar-door-entry/GOVERNANCE.md` (project lead contact)
  - `cellar-door-entry/CODE_OF_CONDUCT.md` (report concerns)
  - `cellar-door-exit/docs/NIST_RFI_PRAGMATIC.md` (contact)
  - `docs/papers/NIST_RFI_v2.md` (contact, appears twice)
- **Fix:** Replace all instances with `hawthornhollows@gmail.com`.

### 5.2 ✅ `hawthornhollows@gmail.com` used correctly

- `cellar-door-exit/SECURITY.md` ✅
- `cellar-door-exit/docs/EXIT_PAPER_DRAFT.md` ✅

### 5.3 ✅ No `security@cellar-door.dev` found

- Not present anywhere ✅

---

## Summary

| # | Severity | Issue | Files |
|---|----------|-------|-------|
| 1.1 | 🔴 HIGH | Dependency count 5 vs 6 | package.json, website, Show HN |
| 1.2 | 🔴 HIGH | Test count 404 vs 410 in README | README.md |
| 2.4 | 🟡 MED | Paper missing 4 new exit types | EXIT_PAPER_DRAFT.md |
| 2.5 | 🟡 MED | Field count inconsistency (7 vs 8) | Paper, README, Spec |
| 3.1 | 🔴 HIGH | Wrong domain in paper (.org vs .dev) | EXIT_PAPER_DRAFT.md |
| 4.5 | 🟡 MED | guardrails.ts checks sunsetDate not expires | guardrails.ts |
| 5.1 | 🔴 HIGH | warrenkoch@gmail.com in 6 public files | GOVERNANCE, COC, NIST files |

**Total inconsistencies found: 7**
- 🔴 HIGH (fix before launch): 4
- 🟡 MEDIUM (fix soon): 3
