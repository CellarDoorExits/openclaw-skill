# Sprint 6 — Security & Legal Review: cellar-door-exit modules

**Reviewer:** Claude (subagent)  
**Date:** 2026-02-23  
**Scope:** `tsa.ts`, `git-ledger.ts`, `visual.ts`, `full-service.ts`

---

## Security Findings

### CRITICAL

*None identified.*

### HIGH

#### H1 — TSA default endpoint uses plain HTTP (MITM)
**File:** `tsa.ts:14`  
```ts
const DEFAULT_TSA_URL = "http://freetsa.org/tsr";
```
The default TSA URL uses `http://`, not `https://`. A network attacker can intercept and replace the TSR response, providing a forged timestamp. The entire trust model of TSA anchoring collapses if the transport is unprotected.

**Recommendation:** Change default to `https://freetsa.org/tsr`. Add a validation check that rejects non-HTTPS TSA URLs unless an explicit `allowInsecure` flag is set.

---

#### H2 — TSA timestamp extraction is heuristic, not verified
**File:** `tsa.ts:104-120` (`extractTimestampFromTSR`)  
The function scans for `0x18` bytes anywhere in the TSR buffer. A crafted TSR could contain a `0x18` byte in an unrelated position, causing extraction of a wrong or attacker-chosen timestamp. Combined with H1, this is exploitable.

**File:** `tsa.ts:186-199` (`verifyTSAReceipt`)  
Verification checks only that the hash bytes appear somewhere in the TSR body (`tsrBuffer.includes(hashBytes)`). This is a substring search, not cryptographic verification. Any buffer containing those 32 bytes passes. The function does NOT verify the TSA's signature.

**Recommendation:** Document clearly that `verifyTSAReceipt` is **structural only** and MUST NOT be relied upon for trust decisions. For real verification, shell out to `openssl ts -verify` or use a proper ASN.1 library. Consider renaming to `checkTSAReceiptStructure` to avoid false confidence.

---

#### H3 — No fetch timeout on TSA requests
**File:** `tsa.ts:156-163`  
The `fetch()` call has no `signal` / `AbortController` timeout. A slow or malicious TSA server can hang the process indefinitely, causing denial of service.

**Recommendation:** Add `AbortSignal.timeout(30_000)` (or configurable) to the fetch options.

---

#### H4 — No response size limit on TSA response
**File:** `tsa.ts:168`  
`Buffer.from(await response.arrayBuffer())` reads the entire response into memory. A malicious server could return gigabytes.

**Recommendation:** Check `Content-Length` header and/or stream with a size cap (e.g., 1 MB for a TSR).

---

### MEDIUM

#### M1 — Branch name injection in git-ledger
**File:** `git-ledger.ts:49-51` (`branch()` / `git()`)  
Branch names from `config.branch` are passed directly to `execFile` arguments. While `execFile` (not `exec`) prevents shell injection, a branch name like `--upload-pack=malicious` could be interpreted as a git flag.

**Recommendation:** Validate branch names against a strict pattern: `/^[a-zA-Z0-9._\/-]+$/`. Reject names starting with `-`.

---

#### M2 — repoPath not validated (path traversal)
**File:** `git-ledger.ts:56`  
`config.repoPath` is used directly in `execFile("git", ["-C", config.repoPath, ...])` and in `join()` for file writes. No validation prevents paths like `../../../../etc` or absolute paths to sensitive directories.

**Recommendation:** Resolve `repoPath` to an absolute path and validate it's within an allowed base directory, or at minimum document that callers must sanitize.

---

#### M3 — Hash used as filename without validation
**File:** `git-ledger.ts:119`  
`record.hash` is used in `join("ledger", \`${record.hash}.json\`)`. If `computeAnchorHash` ever returns unexpected characters (or is replaced), this could write to arbitrary paths.

**Recommendation:** Validate that hash matches `/^[a-f0-9]{64}$/` before using as filename.

---

#### M4 — TSA fallback timestamp on parse failure
**File:** `tsa.ts:171`  
```ts
const timestamp = extractTimestampFromTSR(tsrBuffer) ?? new Date().toISOString();
```
If timestamp extraction fails, the local clock is used silently. This defeats the purpose of TSA timestamping — the caller believes they have a TSA timestamp but actually have a local one.

**Recommendation:** Throw an error or include a `source: "local" | "tsa"` field so callers know. At minimum log a warning.

---

#### M5 — Identity object returned by full-service contains private key
**File:** `full-service.ts:107`  
`departAndAnchor` returns `{ marker, identity, ... }`. The `Identity` type (from `convenience.ts`) likely contains the Ed25519 private key. If the result object is logged, serialized, or sent over the network, the private key leaks.

**Recommendation:** Return only the public key portion by default. Add an explicit `includePrivateKey: true` option if the caller needs it. Document the risk prominently.

---

#### M6 — Dynamic imports with string literals are safe but error-swallowing is broad
**File:** `full-service.ts:67-97` (all `try*` functions)  
All dynamic import errors are silently swallowed. If `tsa.js` exists but has a runtime bug, the error vanishes. The caller gets `undefined` with no indication of failure vs. absence.

**Recommendation:** Distinguish `MODULE_NOT_FOUND` from other errors. Log or propagate non-import errors.

---

### LOW

#### L1 — derLength only handles lengths up to 65535
**File:** `tsa.ts:49-52`  
`derLength` handles up to 2-byte lengths (0x82). Lengths ≥ 65536 would produce incorrect encoding. Not exploitable with SHA-256 hashes (32 bytes) but could be a latent bug if reused.

---

#### L2 — No Content-Type validation on TSA response
**File:** `tsa.ts:168`  
The response is not checked for `Content-Type: application/timestamp-reply`. An HTML error page would be parsed as a TSR.

---

#### L3 — SVG output not escaped
**File:** `visual.ts:130`  
`shortHash(hash)` output is interpolated into SVG text. If `hash` contained `<` or `&`, it could break the SVG. Low risk since hashes are hex, but defense-in-depth suggests escaping.

---

#### L4 — Git commit amend race condition
**File:** `git-ledger.ts:131-133`  
The `commit --amend` to patch in the commit hash creates a brief window where the commit history is rewritten. If another process reads the branch concurrently, it may see inconsistent state.

---

## Legal Findings

### HIGH

#### LH1 — TSA timestamping: disclaimer needed
RFC 3161 timestamps from third-party TSAs (FreeTSA.org) carry legal weight in some jurisdictions (e.g., eIDAS in the EU for qualified timestamps). However:
- FreeTSA.org is **not** a qualified TSA under eIDAS.
- The verification function (`verifyTSAReceipt`) does NOT perform cryptographic verification (see H2).
- Users may incorrectly believe timestamps are legally binding.

**Recommendation:** Add prominent disclaimer: "TSA timestamps are provided for informational/demonstration purposes only. They do not constitute qualified electronic timestamps under eIDAS or equivalent legislation. Cryptographic verification of TSA responses requires external tooling (e.g., `openssl ts -verify`)."

---

#### LH2 — Trust assessment ("high/medium/low") creates implied warranty
**File:** `full-service.ts:171-185`  
The `trustLevel` field with values "high", "medium", "low", "none" implies a security guarantee. If a downstream system grants access based on `trustLevel === "high"` and the assessment was wrong (e.g., because TSA verification is structural-only per H2), there's liability exposure.

**Recommendation:** 
1. Rename to something less authoritative: `confidenceHint` or `assessmentLevel`.
2. Add doc comment: "This is a heuristic assessment, not a security guarantee. Do not use as sole basis for access control decisions."
3. Consider adding a `disclaimer` field to `VerifyResult`.

---

### MEDIUM

#### LM1 — Git ledger as evidence: limited legal weight
The git ledger provides tamper-evidence (via git's SHA-1/SHA-256 hash chain) but:
- Local git repos can be rewritten (`git filter-branch`, `git rebase`).
- Without a remote push to a trusted third party, there's no independent witness.
- Git's SHA-1 is considered weak for collision resistance (SHAttered attack).

**Recommendation:** Document that the git ledger is an integrity mechanism, not a legal proof. If legal evidence is needed, combine with TSA timestamps AND push to a public/trusted remote.

---

#### LM2 — GDPR right to erasure vs. append-only ledger
The git ledger is designed as append-only. If EXIT markers contain personal data (which they likely do — origin platform, identity keys, timestamps), GDPR Article 17 grants a right to erasure.

An append-only git ledger **cannot** honor deletion requests without rewriting history, which breaks the integrity model.

**Recommendation:**
1. Document this tension explicitly.
2. Consider storing only hashes of personal data in the ledger (not the data itself).
3. Provide a `purgeLedgerEntry` function that rewrites history (with appropriate warnings about breaking the chain).
4. Add a data retention policy and privacy notice template.

---

### LOW

#### LL1 — Visual hash: no IP concerns identified
The door patterns in `visual.ts` use standard Unicode block elements and box-drawing characters. The patterns are algorithmically generated from hash values. No third-party designs, fonts, or copyrighted visual elements are used. The concept of "visual hashing" is well-established (e.g., GitHub identicons, SSH randomart).

**No action required.**

---

#### LL2 — FreeTSA.org terms of service
The default TSA endpoint is FreeTSA.org. Their terms may restrict commercial use or high-volume usage.

**Recommendation:** Review FreeTSA.org ToS. Make the TSA URL configurable (already done ✓) and document that production deployments should use their own TSA.

---

## Summary

| Severity | Security | Legal | Total |
|----------|----------|-------|-------|
| CRITICAL | 0        | 0     | 0     |
| HIGH     | 4        | 2     | 6     |
| MEDIUM   | 6        | 2     | 8     |
| LOW      | 4        | 2     | 6     |

**Top 3 actions before merge:**
1. **Fix TSA URL to HTTPS** (H1) — one-line change, high impact
2. **Add fetch timeout and response size limit** (H3, H4) — prevents DoS
3. **Add disclaimers for trust levels and TSA timestamps** (LH1, LH2) — prevents liability

**Recommended pre-merge; can follow up post-merge:**
- Branch name / repoPath validation (M1, M2)
- Private key exposure mitigation (M5)
- GDPR documentation (LM2)
