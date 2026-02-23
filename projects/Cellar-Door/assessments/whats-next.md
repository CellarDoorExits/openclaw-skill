# What's Next — Cellar Door EXIT Project Assessment

**Date:** 2026-02-23  
**Assessor:** Hawthorn (subagent, fresh eyes)  
**Scope:** Full project state — code, docs, spec, paper, submissions, publish readiness

---

## TL;DR

The EXIT project is in remarkably good shape for a $0-budget, agent-built prototype. The code is solid (205 tests, zero TODOs, comprehensive spec coverage). The *documentation corpus* is where the debt lives — stale claims, formula mismatches between paper and spec, and an unresolved legal entity question blocking three workstreams. The code is closer to publishable than the docs suggest.

---

## 1. Consistency Fixes Status

### Truly Done ✅
- C1: Marker size corrected (~335/~596 across all docs)
- C2: Confidence scoring formula reconciled (paper → additive model matching spec)
- C3: Tenure weight formula reconciled (paper → log₂(731) matching spec)
- C4: Canonicalization reconciled (paper → custom canonical JSON matching spec)
- C5: Test count updated to 205 everywhere
- I5: Project plan marked historical
- I7: TODO updated
- I8: Module D risk ratings given conditional framing
- I11: Budget discrepancy clarified
- I15: Signamancy → REPUTE rename

### Needs Verification 🔍
- **reputation_score removal propagation** — removed from code per fix-log-C2-C4, but no doc-sweep confirmed all references gone. Low risk, ~30 min to verify.
- **"~300 bytes" claim** — C1 was marked done but the NIST RFI pragmatic version (line ~1 of §2.1) still says "~335 bytes (unsigned) to ~596 bytes (signed)" which is correct. Verify no stale "~300" references remain in pitches.

### Still Open 🔧
18 items from the remaining-work-audit. The big ones:
- **I1: Paper update to v1.1** (8–16h) — the single largest task. Paper still missing v1.1 features: ethics guardrails detail, KERI, encryption, redaction, anchoring, extended fields. Formula fixes were done but structural update was not.
- **I2: Paper test vector references** (1h) — still references 4 vectors, should be 9
- **I3: Spec §17.6 test vector** (1h) — `dispute` wrapper doesn't match Module C fields
- **C8: NIST RFI field count 7 vs 9** (0.5h)
- **I9, I10: SECURITY.md/LEGAL.md cross-refs and version headers** (1h total)

---

## 2. Code TODOs

**Zero.** `grep -r "TODO\|FIXME\|HACK\|XXX"` across all `.ts` files returns nothing. The codebase is clean.

---

## 3. Spec vs Implementation Gaps

### Fully Implemented ✅
| Spec Feature | Code Location |
|---|---|
| Core 7-field schema + compliance fields | `marker.ts`, `types.ts`, `validate.ts` |
| Modules A–F | `src/modules/` (lineage, dispute, assets, trust, reputation, origin-attestation, continuity) |
| Ceremony state machine (3 paths) | `ceremony.ts` |
| Ed25519 signing/verification | `crypto.ts`, `proof.ts` |
| Content-addressed IDs | `marker.ts` |
| Commit-reveal | `modules/trust.ts` |
| Confidence scoring (additive model) | `modules/trust.ts` |
| Tenure attestation | `modules/trust.ts` |
| Status confirmation levels | `modules/trust.ts` |
| Coercion detection | `ethics.ts` |
| Weaponization detection | `ethics.ts` |
| Laundering detection | `ethics.ts` |
| Right of reply | `ethics.ts` (via types) |
| Sunset policies | `ethics.ts` |
| Anti-weaponization clause | `guardrails.ts` |
| KERI key event logs (inception, rotation) | `keri.ts` |
| Pre-rotation commitments | `pre-rotation.ts` |
| Key compromise recovery | `key-compromise.ts` |
| XChaCha20-Poly1305 encryption | `privacy.ts` |
| Field-level redaction | `privacy.ts` |
| Minimal disclosure | `privacy.ts` |
| Chain anchoring (anchor records) | `anchor.ts` |
| Merkle batch operations | `batch.ts` |
| Transport serialization (binary) | `interop.ts` |
| Express-style middleware | `interop.ts` |
| Lifecycle hooks | `interop.ts` |
| VC wrapper | `vc.ts` |
| CLI (keygen, create, sign, verify, inspect) | `cli.ts` |
| DID resolver | `resolver.ts` |
| In-memory registry | `registry.ts` |
| Storage abstraction | `storage.ts` |
| Marker chaining | `chain.ts` |

### Spec Features NOT in Code (Gaps)
| Spec Feature | Section | Status |
|---|---|---|
| `did:keri` DID method resolution | §12.7 | Stub only — `resolver.ts` handles `did:key` but KERI DID resolution is not wired up. KEL operations exist but don't produce resolvable DIDs. |
| Event emission (intent/negotiating/signing/departed) | §12.6 | Not implemented. `interop.ts` has middleware and hooks but no event emitter. |
| GDPR DPIA tooling | §10.4 | Normative text only — no code assists with DPIA. This is arguably out of scope for a library. |
| JSON-LD context file hosting | §12.1 | No actual context file at `https://cellar-door.org/exit/v1`. Domain not set up. |
| `application/exit+jsonld` media type | §16 | Not registered (spec says MAY). |

**Verdict:** The implementation covers ~95% of the spec. The gaps are minor (event emission, did:keri resolution) or intentionally out-of-scope (GDPR tooling, IANA registration). This is an honest v0.1.0.

---

## 4. NIST Submission Readiness

The NIST AI Agent Standards Initiative RFI deadline is **March 9, 2026**.

### Ready ✅
- Core argument is strong and well-framed (documentation gap, liability records)
- References current standards (A2A, MCP, AP2, OASF, Entra)
- Technical description is accurate post-C1–C5 fixes
- Contact info filled (Warren Koch, warrenkoch@gmail.com)
- Date field says "March 2026" — needs exact date

### Blocking Issues 🔴
- **C8: Field count inconsistency** (7 vs 9) — the core schema table says 7 fields but the submission may reference 9 somewhere. ~30 min fix.
- **Legal entity** — submission says "Warren Koch, EXIT Protocol Project." This is fine for an individual submission. No LLC required for an RFI response.

### Should-Fix Before Submission 🟡
- Review for any remaining "~300 bytes" references (likely clean post-C1)
- Add a sentence about the reference implementation being open-source with a link
- Proofread one more time for internal consistency

**Verdict: 90% ready. 1–2 hours of polish and it can go out.** The NIST RFI is a comment/input, not a proposal — perfection isn't required. Ship it.

---

## 5. npm Publish Readiness

### Ready ✅
- Package name: `cellar-door-exit` (already in package.json)
- Version: `0.1.0` (appropriate for first publish)
- Build: `tsup` configured, ESM output with `.d.ts`
- CLI: `exit` binary defined
- Dependencies: all `@noble/*` (audited, minimal), `commander`, `tsup`, `tsx`
- License in package.json: `Apache-2.0`
- README: solid, with examples and API docs
- 205 passing tests

### Blocking Issues 🔴
- **`tsup` is in `dependencies` not `devDependencies`** — it's a build tool, shouldn't ship to users. Same for `tsx`. Move both to `devDependencies`.
- **No `prepublishOnly` script** — should run `npm run build && npm run test` before publish.
- **No `.npmignore` or `files` field** — will publish everything including tests, demos, benchmarks. Add `"files": ["dist", "README.md", "LICENSE"]` to package.json.
- **No LICENSE file** — package.json says Apache-2.0 but no LICENSE file exists in the repo root.
- **`@noble/ed25519` is redundant** — `@noble/curves` includes Ed25519. Check if it can be removed.
- **CLI shebang** — `dist/cli.js` needs `#!/usr/bin/env node` at top. Check if tsup adds it.

### Should-Fix 🟡
- Add `"repository"`, `"homepage"`, `"bugs"` fields to package.json
- Add `"keywords"` for discoverability: `["exit", "agent", "departure", "verifiable", "did", "identity", "portability"]`
- Add `"engines": { "node": ">=18" }` (uses crypto, ESM)
- Run `npm pack --dry-run` to verify what gets included

**Verdict: ~2 hours of package.json cleanup and it's publishable.** The code itself is ready; it's packaging hygiene.

---

## 6. Integration Opportunities

### Vercel AI SDK
- **Hook:** `beforeExit`/`afterExit` lifecycle hooks already exist in `interop.ts`
- **Effort:** ~4–8h to write an adapter that auto-creates EXIT markers when an AI SDK agent session ends
- **Value:** High — puts EXIT in front of the largest agent developer community

### LangChain / LangGraph
- **Hook:** LangGraph has checkpoint/state persistence. EXIT markers could be emitted at graph termination
- **Effort:** ~8–16h for a `langchain-exit` package
- **Value:** Medium-high — LangChain ecosystem is massive

### OpenClaw Skill
- **Hook:** OpenClaw agents could emit EXIT markers when leaving contexts
- **Effort:** ~4h — thin wrapper calling the library
- **Value:** Medium — proves the concept in a real agent framework

### CrewAI / AutoGen
- **Hook:** Task completion / agent termination events
- **Effort:** ~4–8h each
- **Value:** Medium

### Recommended first integration: **Vercel AI SDK adapter** — highest developer reach, cleanest hook points.

---

## 7. Website / Marketing

### Current State
- No website exists
- No domain registered (`cellar-door.org` referenced in spec context URI)
- README is the only public-facing doc

### What's Needed
- **Domain:** Register `cellar-door.org` or `exitprotocol.org`. The spec hardcodes `https://cellar-door.org/exit/v1` as the JSON-LD context URI. This needs to resolve eventually.
- **Landing page:** Single-page site explaining EXIT in 30 seconds. Can be a GitHub Pages deploy.
- **JSON-LD context file:** Must be hosted at the context URI for JSON-LD processors to work.
- **Logo/brand:** The slogan workshop exists (`cellar-door-slogan-workshop.md`) but no visual identity.

### Effort
- Domain + GitHub Pages + context file: ~4h
- Proper landing page with design: ~8–16h
- Logo: ~2–4h (generate with AI, refine)

---

## 8. Paper / Academic

### Current State
- EXIT_PAPER_v4.md is the latest — coherence-passed against spec v1.1 for formulas
- Still structurally a v1.0-era paper with v1.1 bolted on
- Missing: ethics guardrails detail, KERI, encryption/redaction, anchoring, extended fields, 9 test vectors (has 4)

### arXiv Readiness
- **Not ready yet.** The paper needs the I1 update (8–16h) to honestly represent v1.1.
- Once updated: format for arXiv (LaTeX conversion ~4h), submit to cs.CR or cs.AI
- No peer review needed for arXiv — it's a preprint server

### Venue Strategy
- **arXiv first** (free, immediate visibility)
- **Workshop submissions:** AAAI Workshop on AI Safety, NeurIPS SoLaR (Socially Responsible Language Modelling), ACM CCS Workshop on Decentralized Identity
- **Journal (long-term):** ACM Computing Surveys (if EXIT gets traction), IEEE S&P (if security angle deepens)

### Effort
- I1 paper update: 8–16h
- LaTeX conversion: 4h
- arXiv submission: 2h
- **Total to arXiv: ~14–22h**

---

## 9. Security

### Addressed in Code ✅
- Ed25519 signatures (no RSA/ECDSA complexity)
- KERI pre-rotation for forward security
- Key compromise recovery flow
- XChaCha20-Poly1305 authenticated encryption
- Coercion / weaponization / laundering detection heuristics
- Content-addressed IDs prevent tampering

### Unaddressed Items 🔧
- **SECURITY.md cross-reference D-D01** (I9) — points to wrong section. 30 min fix.
- **SECURITY.md/LEGAL.md version headers** (I10) — still say "companion to EXIT_SPEC_v1". 30 min fix.
- **No formal security audit** — expected at v0.1.0, but should be noted in README
- **`did:key` has no revocation** — documented in spec §12.7 as low trust. Code defaults to `did:key`. Should document upgrade path to `did:keri` more prominently.
- **No rate limiting in middleware** — `interop.ts` Express middleware has no abuse protection. Should note this is for reference, not production.
- **Timing side channels** — Ed25519 verification via `@noble/curves` is constant-time, but no explicit audit of the canonicalization path.

### Verdict
Security posture is appropriate for a v0.1.0 protocol library. No critical issues. The unaddressed items are documentation fixes and "note for production" caveats.

---

## 10. Community / Outreach

### What Would Help Adoption
1. **npm publish** — people can't use what they can't install. This is #1.
2. **GitHub repo public** — open-source visibility, stars, issues, PRs
3. **Blog post / announcement** — "We built a departure protocol for AI agents" on HN, Reddit r/artificial, Twitter/X
4. **Integration example** — a working Vercel AI SDK demo is worth 10 blog posts
5. **NIST submission** — credibility signal, shows the project engages with standards bodies
6. **Discord/community channel** — low effort, enables feedback
7. **Conference lightning talk** — AI engineer meetups, Web3 identity events

### What NOT to Do Yet
- Don't build a governance structure before there are users
- Don't create a token or DAO (Howey risk, per the extensive legal analysis)
- Don't over-market before the paper is on arXiv

---

## 11. HOLOS Integration

EXIT is the **first concrete primitive** in the HOLOS vision. It connects to:

- **LOCUS** (identity) — EXIT markers reference DIDs, which are LOCUS identifiers. An agent's EXIT history becomes part of its LOCUS identity.
- **REPUTE** (reputation, formerly Signamancy) — EXIT markers carry reputation signals (status, tenure, confidence). REPUTE could aggregate EXIT markers into reputation scores.
- **SENSUS** (learning) — EXIT patterns across a population could feed SENSUS learning algorithms (which platforms are toxic? which agents churn?).
- **SEEL** (verification) — ZK proofs could verify EXIT marker properties without revealing content (e.g., "this agent has >1 year tenure" without revealing where).
- **HOLLOW** (agent OS) — EXIT would be a core system call in HOLLOW: `hollow.exit(context)`.

### Current Integration Status
- EXIT is standalone. No code bridges to other HOLOS primitives exist.
- The HOLOS vision docs describe these connections philosophically but no implementation work has begun.
- This is correct prioritization — EXIT needs to stand alone before it can integrate.

---

## 12. Prioritized TODO List

### 🔴 Tier 1: Ship It (Week 1) — High Impact, Low-Medium Effort

| # | Task | Effort | Impact | Notes |
|---|------|--------|--------|-------|
| 1 | **Fix package.json for npm publish** (move tsup/tsx to devDeps, add files field, add LICENSE, add prepublishOnly) | 2h | 🔴 Critical | Unblocks npm publish |
| 2 | **npm publish v0.1.0** | 1h | 🔴 Critical | People can't use what they can't install |
| 3 | **Polish and submit NIST RFI** (C8 fix, final proofread, exact date) | 2h | 🔴 Critical | March 9 deadline |
| 4 | **Make GitHub repo public** | 0.5h | 🔴 Critical | Unblocks everything else |
| 5 | **Fix SECURITY.md/LEGAL.md** (I9, I10) | 1h | 🟡 Medium | Quick wins, professional polish |

**Week 1 total: ~6.5h**

### 🟡 Tier 2: Paper & Credibility (Weeks 2–3) — High Impact, High Effort

| # | Task | Effort | Impact | Notes |
|---|------|--------|--------|-------|
| 6 | **Update paper to v1.1** (I1, incorporating I2, I4) | 12h | 🔴 Critical | Blocks arXiv, blocks credibility |
| 7 | **Fix spec §17.6 test vector** (I3) | 1h | 🟡 Medium | Spec correctness |
| 8 | **Convert paper to LaTeX + submit arXiv** | 6h | 🔴 Critical | Academic credibility |
| 9 | **Register domain + deploy landing page + context file** | 4h | 🟡 Medium | JSON-LD context URI must resolve |
| 10 | **Write announcement blog post** | 3h | 🟡 Medium | Launch visibility |

**Weeks 2–3 total: ~26h**

### 🟢 Tier 3: Growth (Weeks 4–6) — Medium Impact, Medium Effort

| # | Task | Effort | Impact | Notes |
|---|------|--------|--------|-------|
| 11 | **Vercel AI SDK integration** | 8h | 🟡 Medium | First real-world adapter |
| 12 | **Standardize risk rating scales** (I14) | 2h | 🟢 Low | Doc consistency |
| 13 | **Consolidate LEGAL.md amendments** (I17) | 2h | 🟢 Low | Doc consistency |
| 14 | **Event emission** (spec §12.6) | 3h | 🟢 Low | Spec completeness |
| 15 | **OpenClaw EXIT skill** | 4h | 🟡 Medium | Dogfooding |

**Weeks 4–6 total: ~19h**

### ⚪ Tier 4: Polish (Ongoing) — Low Impact

| # | Task | Effort | Notes |
|---|------|--------|-------|
| 16 | Legal doc cross-references (I17, I18, I19) | 4h | Nice-to-have |
| 17 | Terminology standardization (N1, N2, N3) | 2.5h | Nice-to-have |
| 18 | Side project reconciliation (I12, I13) | 1.5h | Not EXIT-critical |
| 19 | SEAL naming standardization (7.4) | 0.5h | HOLOS housekeeping |
| 20 | Nice-to-haves N4–N16 | ~13h | As time permits |

### ⏳ Blocked on Warren

| Task | Blocker | Effort (once unblocked) |
|---|---|---|
| C6: Legal entity decision | Warren needs to decide: sole prop, LLC, or defer | 3h |
| C7: NIST RFI entity placeholders | C6 | 1h (but individual submission works fine) |
| I6: npm package name confirmation | Warren preference | 0h (`cellar-door-exit` is already set and good) |

---

## Summary

**The code is ready. The docs aren't.**

The EXIT reference implementation honestly covers ~95% of the v1.1 spec with 205 passing tests, zero TODOs, and clean architecture across 30+ source files. This is publication-quality code for a v0.1.0.

The bottleneck is the documentation ecosystem: the paper is stuck between v1.0 and v1.1, several legal docs have stale cross-references, and the NIST submission needs a final polish pass. None of these are hard — they're just hours of careful editing.

**The single highest-ROI action is: fix package.json → npm publish → make repo public.** Everything else (paper, NIST, integrations, community) becomes easier once the code is installable and visible.

Second priority: NIST RFI by March 9. It's 90% ready.

Third priority: Paper update + arXiv. This is the credibility unlock.

The project has done an extraordinary amount of legal, security, and mechanism design analysis for a solo/agent-built effort. The 83-document corpus is genuinely thorough. The main risk now is analysis paralysis — shipping imperfect-but-honest work beats polishing forever.
