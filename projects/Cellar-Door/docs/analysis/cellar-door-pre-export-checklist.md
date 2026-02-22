# Cellar Door EXIT — Pre-Export Readiness Checklist

**Author:** Hawthorn  
**Date:** 2026-02-22  
**Purpose:** Final assessment before npm publish, paper submission, integrations, and NIST submission

---

## Status Summary

- **205 tests passing** across 11 test suites (including property-based tests)
- **0 TODO/FIXME/HACK comments** in source code
- **0 npm audit vulnerabilities**
- **0 direct competitors** in the space
- Spec v1 draft complete, 7 core fields locked
- All 6 modules (A–F) implemented
- CLI with 8+ commands working
- 3 demo scenarios running

---

## 1. Code Quality

### 1a. `tsup` and `tsx` are runtime dependencies
- **Issue:** `tsup` (bundler) and `tsx` (TS runner) are listed in `dependencies` instead of `devDependencies`. Users who `npm install cellar-door-exit` will download build tools they don't need.
- **Priority:** Must-fix
- **LOE:** 15 minutes
- **Blocks export:** Yes — bloats install, looks unprofessional

### 1b. No TODO/FIXME comments found ✅
- Clean codebase. Good.

### 1c. KERI is stubs only
- **Issue:** `src/keri.ts` contains stubs, not real KERI integration. The legal battery flags `did:key` as having no key rotation/revocation — "key compromise is the existential risk."
- **Priority:** Should-fix (document clearly), but does NOT block v1 export
- **LOE:** Documentation: 30 min. Real implementation: 2–4 weeks (Tier 3)
- **Blocks export:** No — but README/docs must clearly state `did:key` is for development, `did:keri` for production

### 1d. No benchmarks exist
- **Issue:** Paper readiness assessment flagged zero quantitative data. No marker size measurements, no signature perf, no ceremony timing.
- **Priority:** Must-fix (for paper), should-fix (for npm)
- **LOE:** 3 hours to write benchmark suite
- **Blocks export:** Blocks paper. Does not block npm publish.

### 1e. 205 tests is solid ✅
- Property-based tests with fast-check. Integration tests. Edge cases (1000-marker batch). Good coverage.

---

## 2. Spec Gaps

### 2a. No canonicalization requirement
- **Issue:** Legal battery §VI flags: "JSON-LD is notoriously difficult to canonicalize. Different JSON serializations of semantically identical data produce different hashes." Spec does not mandate JCS (RFC 8785) or URDNA2015.
- **Priority:** Must-fix
- **LOE:** 2–3 hours (spec language + implementation check)
- **Blocks export:** Yes — interoperability failure if two implementations serialize differently

### 2b. No replay protection specified
- **Issue:** Legal battery §VI: "A signed EXIT marker can be replayed. There's no nonce or challenge-response mechanism. Verifiers must maintain a seen-marker cache, which the spec doesn't mandate."
- **Priority:** Should-fix
- **LOE:** 1–2 hours (spec guidance for verifiers)
- **Blocks export:** No — but should be addressed in spec before v1.0.0 tag

### 2c. Subject capacity section missing
- **Issue:** Todo reassessment T2-9: "Add section addressing human/org/agent subjects and their different legal capacities."
- **Priority:** Should-fix
- **LOE:** 2–3 hours
- **Blocks export:** No — but improves spec completeness

### 2d. `@context` URL points to unregistered domain
- **Issue:** Spec §3.1 mandates `@context: "https://cellar-door.org/exit/v1"`. Domain is not registered. Every marker created will have a broken context URL.
- **Priority:** Must-fix
- **LOE:** 1 hour (register domain) + 2–3 hours (DNS/hosting). Requires Warren (payment).
- **Blocks export:** Yes — JSON-LD context URLs that 404 are a credibility problem

---

## 3. Security

### 3a. `did:key` has no revocation
- **Issue:** Compromised Ed25519 key = permanent identity theft. No recovery. Legal battery rates this as "existential risk."
- **Priority:** Should-fix (documentation), Tier 3 (implementation)
- **LOE:** 30 min docs. 2–4 weeks real KERI.
- **Blocks export:** No — acceptable for v0.x with clear warnings. Must be fixed before any production deployment recommendation.

### 3b. No constant-time comparison verification
- **Issue:** Legal battery §VI recommends `crypto.timingSafeEqual()` for signature verification. Unknown if reference implementation uses it.
- **Priority:** Should-fix
- **LOE:** 1 hour (audit crypto.ts, fix if needed)
- **Blocks export:** No — but a real security concern for production use

### 3c. Signing interface is not abstracted for algorithm agility
- **Issue:** Legal battery recommends abstracting signing for post-quantum migration (Ed25519 → ML-DSA/Dilithium). Current implementation may be Ed25519-specific.
- **Priority:** Nice-to-have for v1, must-fix for v2
- **LOE:** 4–8 hours
- **Blocks export:** No

### 3d. No formal crypto audit
- **Issue:** Both todo reassessment (T2-5) and legal battery (§VI) recommend external audit. $15–30K.
- **Priority:** Should-fix before enterprise adoption
- **LOE:** 2–4 weeks + $15–30K
- **Blocks export:** No — acceptable for v0.x / early adopter phase

---

## 4. API Surface

### 4a. API appears clean and stable ✅
- Clear exports from `src/index.ts`
- Custom error classes (6 types)
- Convenience functions (`generateIdentity()`, `quickExit()`)
- Framework interop layer (middleware, hooks, events, transport)
- DevEx review scored 8.5/10 post-Sprint 4

### 4b. Package name `cellar-door-exit` vs `@cellar-door/exit`
- **Issue:** Todo reassessment flags this as an open question (Q6). Scoped packages (`@cellar-door/exit`) are more professional but require npm org. Once published, name is locked.
- **Priority:** Must-decide
- **LOE:** 30 min decision + 15 min npm org setup if scoped
- **Blocks export:** Yes — must decide before first `npm publish`

### 4c. Version is 0.1.0 ✅
- Appropriate for initial publish. Signals pre-1.0 instability.

---

## 5. Documentation

### 5a. README lacks "Why Should I Care" section
- **Issue:** Todo reassessment T2-8: "README assumes you know you need exit markers."
- **Priority:** Must-fix
- **LOE:** 1 hour
- **Blocks export:** Yes — first thing developers see

### 5b. Getting Started guide exists ✅
- `docs/GETTING_STARTED.md` created in Sprint 4.

### 5c. API docs — no generated API reference
- **Issue:** No TypeDoc or similar generated API documentation.
- **Priority:** Should-fix
- **LOE:** 2–3 hours (TypeDoc setup + generation)
- **Blocks export:** No — source types serve as docs for early adopters

### 5d. No CHANGELOG.md
- **Issue:** Standard for npm packages. Missing.
- **Priority:** Should-fix
- **LOE:** 30 minutes
- **Blocks export:** No — but expected by developers

---

## 6. Legal

### 6a. LEGAL.md §8 "by design" language
- **Issue:** Line 122: `"Does not provide mechanisms for courts to block exit (by design)"`. Second legal red team flagged this as antagonistic toward courts. Could be read as deliberately obstructing legal process.
- **Priority:** Must-fix
- **LOE:** 15 minutes — rephrase to: "Does not include mechanisms for external parties to prevent marker creation"
- **Blocks export:** Yes — legal liability concern

### 6b. SECURITY.md contact is TBD
- **Issue:** `"[security contact TBD]"` — unacceptable for a security-focused cryptographic project.
- **Priority:** Must-fix
- **LOE:** 15 minutes (once email decided). Requires Warren.
- **Blocks export:** Yes — embarrassing if found by any reviewer

### 6c. No DECISIONS.md in repo
- **Issue:** Todo reassessment references 13 ratified decisions (D-001 through D-013). No DECISIONS.md file exists in the repo. Design rationale is not externally visible.
- **Priority:** Should-fix
- **LOE:** 2–3 hours (compile from memory files)
- **Blocks export:** No — but valuable for contributor onboarding

---

## 7. Naming/Branding

### 7a. Package name decision needed (see 4b)
- `cellar-door-exit` vs `@cellar-door/exit`
- **Blocks export:** Yes

### 7b. CLI command name `exit`
- **Issue:** `exit` is a shell builtin. Running `exit` in a terminal will close the terminal, not run the CLI. Users must use `npx exit` or install globally and hope PATH resolution works.
- **Priority:** Must-fix
- **LOE:** 30 minutes — rename to `exit-marker` or `cellar-door` in package.json bin field
- **Blocks export:** Yes — CLI is broken by name collision with shell builtin

### 7c. Domain not registered (see 2d)
- **Blocks export:** Yes

### 7d. Trademark not filed
- **Issue:** Todo reassessment T2-4: "Cellar Door" trademark. ~$2,500. Name protection.
- **Priority:** Should-fix (before significant visibility)
- **LOE:** 2–4 hours + attorney + $2,500
- **Blocks export:** No — but risk increases with visibility

---

## 8. Dependencies

### 8a. `tsup` and `tsx` in production deps (see 1a)
- **Blocks export:** Yes

### 8b. `@noble/*` crypto libraries ✅
- Excellent choices. `@noble/ed25519`, `@noble/hashes`, `@noble/curves`, `@noble/ciphers` are audited, pure-JS, high-quality crypto libraries by Paul Miller. Industry standard. No known vulnerabilities.

### 8c. `commander` ✅
- Stable, widely-used CLI framework. No concerns.

### 8d. `npm audit` clean ✅
- 0 vulnerabilities found.

### 8e. No lockfile version pinning concerns
- `package-lock.json` present. Good.

---

## 9. Benchmarks

The paper readiness assessment flagged **zero quantitative data**. The following benchmarks should be run before paper submission:

| Benchmark | What to Measure | Why It Matters |
|---|---|---|
| Marker size | Core marker bytes (JSON), with each module combination | "~300 bytes" claim needs verification |
| Signature creation | Ed25519 sign operations/sec | Performance baseline |
| Signature verification | Ed25519 verify operations/sec | Verifier throughput |
| Ceremony timing | Time for each path (cooperative, unilateral, emergency) | "Emergency exit in <100ms" claim |
| Batch operations | Merkle tree construction + proof verification for N=10,100,1000,10000 | Scalability story |
| Content addressing | SHA-256 hash operations/sec for markers | Overhead measurement |
| `quickExit()` end-to-end | Full convenience function timing | Developer experience metric |
| Privacy operations | Encrypt/decrypt round-trip timing | Module overhead |
| Validation | `validate()` timing for valid + invalid markers | Input processing cost |

- **Priority:** Must-fix for paper. Should-fix for npm.
- **LOE:** 3–4 hours for full benchmark suite
- **Blocks export:** Blocks paper submission. Does not block npm publish.

---

## GO/NO-GO Assessment

### Current Status: **CONDITIONAL GO**

The protocol, implementation, and analysis are substantively excellent. The blockers are all **small, mechanical fixes** — not design problems.

### Must-Fix Before npm Publish (Blocks Export)

| # | Item | LOE | Owner |
|---|---|---|---|
| 1 | Move `tsup`/`tsx` to devDependencies | 15 min | Hawthorn |
| 2 | Rename CLI from `exit` to `exit-marker` or `cellar-door` | 30 min | Hawthorn |
| 3 | LEGAL.md §8 "by design" rephrase | 15 min | Hawthorn |
| 4 | SECURITY.md contact email | 15 min | Warren (decision) |
| 5 | README "Why Should I Care" section | 1 hr | Hawthorn |
| 6 | Decide package name (scoped vs unscoped) | 30 min | Warren (decision) |
| 7 | Register `cellar-door.org` domain | 1 hr | Warren (payment) |
| 8 | Spec: add canonicalization requirement (JCS/URDNA2015) | 2–3 hr | Hawthorn |

**Total Hawthorn LOE for must-fixes: ~5 hours**  
**Warren decisions needed: 3 (security email, package name, domain)**

### Should-Fix Before v1.0.0 Tag

| # | Item | LOE |
|---|---|---|
| 1 | Replay protection guidance in spec | 1–2 hr |
| 2 | Subject capacity section in spec | 2–3 hr |
| 3 | Constant-time comparison audit | 1 hr |
| 4 | DECISIONS.md in repo | 2–3 hr |
| 5 | CHANGELOG.md | 30 min |
| 6 | TypeDoc API reference generation | 2–3 hr |
| 7 | `did:key` production warning in docs | 30 min |
| 8 | Benchmark suite | 3–4 hr |

### Must-Fix Before Paper Submission

| # | Item | LOE |
|---|---|---|
| 1 | Benchmark suite (quantitative data) | 3–4 hr |
| 2 | Figures (state machine diagram, architecture) | 3 hr |
| 3 | Formalize one game-theoretic model | 4 hr |
| 4 | Update §4 with implemented mechanisms | 3 hr |
| 5 | Comparison table vs adjacent systems | 2 hr |
| 6 | Related Work section | 3 hr |

---

## Recommendation

**GO for npm publish** once the 8 must-fix items are completed (~5 hours of Hawthorn work + 3 Warren decisions). The codebase is clean, tests pass, dependencies are solid, and the API surface is well-designed.

**GO for NIST RFI** — drafts exist, deadline March 9. Needs Warren decision on framing.

**CONDITIONAL GO for paper** — needs benchmarks and figures first (~15 hours additional work).

The biggest single risk is the **unregistered domain** — every `@context` URL in every marker points to `cellar-door.org` which doesn't exist yet. This is the one item that could embarrass the project if overlooked. Everything else is fixable post-publish.

---

*Checklist complete. Ready to execute on the punch list.*
