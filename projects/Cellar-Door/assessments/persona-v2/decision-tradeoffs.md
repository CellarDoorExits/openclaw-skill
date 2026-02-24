# Decision Tradeoffs Report: EXIT Protocol Persona v2 Feedback

**Date:** 2026-02-24  
**Source:** 13 persona reviews (P01–P13), synthesis.md, cross-group-coherence-v2.md  
**Purpose:** For each major issue raised across reviews, analyze options, tradeoffs, and recommend a path forward  
**Milestones referenced:** NIST submission (March 9), Show HN launch, v1.0

---

## 1. FIPS Algorithm Agility

**Raised by:** P01 (NIST Technical), P03 (Enterprise CISO), P02 (NIST Policy), P07 (Platform Operator), P08 (Compliance)  
**Priority:** P0 — Blocks NIST submission

### The Problem

Ed25519 is hardcoded as the only valid proof type (`"MUST be Ed25519Signature2020 for v1.1"`). Ed25519 is **not FIPS 186-5 approved** (only Ed448 is). XChaCha20-Poly1305 for encryption is also non-FIPS. Federal agencies and regulated financial institutions cannot deploy the protocol as specified. Five of thirteen personas flagged this — the strongest consensus blocker.

### Options

| Option | Description | Effort | Risk |
|--------|-------------|--------|------|
| **(A) Implement now** | Add ECDSA P-256/P-384 + AES-GCM support to both spec and code before NIST submission | 5–7 days | Rushing crypto code; expanded test surface; potential bugs in new signing paths |
| **(B) Spec now, implement later** | Define algorithm negotiation mechanism in spec v1.2; ship Ed25519-only code with documented FIPS gap | 2–3 days | NIST sees spec ambition without working code; still technically non-compliant |
| **(C) Acknowledge as future work** | Document FIPS gap in submission; position Ed25519 as reference algorithm with agility planned | 1 day | NIST deprioritizes submission; enterprise personas confirmed this is a hard blocker |

### Tradeoff Analysis

**Implementation cost:** `@noble/curves` already supports P-256/P-384. The dependency exists. The code change is: (1) abstract `signMarker`/`verifyMarker` over an algorithm parameter, (2) add `EcdsaSecp256r1Signature2019` as a valid proof type, (3) add AES-256-GCM as alternative to XChaCha20. The `@noble` ecosystem makes this tractable.

**API surface expansion:** Adds an `algorithm` parameter to `signMarker()`, `quickExit()`, and verification functions. Backward compatible if Ed25519 remains default. Existing markers remain valid.

**Spec changes:** `proofType` becomes an enum (`Ed25519Signature2020 | EcdsaSecp256r1Signature2019 | Ed448Signature2020`) instead of a constant. Verifiers MUST support all listed algorithms. This is a meaningful spec change but well-precedented (W3C Data Integrity does exactly this).

**Performance:** ECDSA P-256 is ~2x slower than Ed25519 for signing, comparable for verification. Not material at expected volumes.

**Backward compatibility:** Existing Ed25519 markers remain valid. New markers with ECDSA are a superset. No migration needed.

### Recommendation: **(B) Spec now, implement Ed25519 + P-256 before NIST**

Hybrid approach. Write the algorithm agility mechanism into the spec (2 days). Implement P-256 alongside Ed25519 in code (3 days). Skip Ed448 and AES-GCM for now — P-256 is the most widely deployed FIPS algorithm and covers 90% of enterprise needs. Document Ed448 and AES-GCM as planned additions.

**Rationale:** Option C is insufficient — P01 and P03 both indicate FIPS non-compliance causes immediate deprioritization. Option A is over-scoped for the timeline. Option B with partial implementation demonstrates commitment and provides a working FIPS path.

**Estimated effort:** 5 days  
**Priority:** P0

---

## 2. Spec Complexity vs. Adoption

**Raised by:** P12 (Competitor/Critic), P04 (Senior Developer), P13 (OSS Maintainer), P10 (HN Commenter)  
**Priority:** P1 — Blocks Show HN and community adoption

### The Problem

1,778-line spec. 6 optional modules. 120+ exports. v0.1.0 code with the scope of a v3.0 product. P12: "a PhD thesis, not an adoption-ready protocol." P10: "5 npm packages with 0 users is putting the cart before the horse." P13: "scope-to-team ratio is unsustainable."

### Options

| Option | Description | Effort | Risk |
|--------|-------------|--------|------|
| **(A) Ship minimal v1.0 surface** | Hide advanced exports behind subpath (`cellar-door-exit/advanced`). Reduce public API to ~20 exports. Market as "core" with extensions. | 2–3 days | Power users frustrated; documentation needs rewrite; internal refactor |
| **(B) Keep as-is, improve docs** | Better Getting Started guide, API reference, progressive disclosure in README. Keep 120+ exports. | 3–5 days | Doesn't address the perception problem; HN will still see 120 exports and v0.1.0 |
| **(C) Split into core + extensions** | `cellar-door-exit` = core (create, sign, verify, quickExit). Separate packages for ceremony, modules, anchoring, privacy, KERI. | 1–2 weeks | Package management overhead; versioning complexity; harder to test cross-package |

### Tradeoff Analysis

**Impact on developers (P04, P06):** Option A gives them what they want — a small, stable surface they can depend on, with power features available when needed. Option C gives cleaner separation but adds `npm install` friction for each feature.

**Impact on NIST (P01, P02):** The spec itself can remain comprehensive. The issue is code surface, not spec surface. NIST evaluates the spec; developers evaluate the code.

**Impact on competitors (P12):** Option A reduces the attack surface for "over-engineering" criticism. Option B leaves it wide open. Option C provides ammunition for "fragmented ecosystem" criticism.

**Impact on maintainability (P13):** Option A is lowest maintenance burden — same codebase, just controlled exports. Option C multiplies CI/CD, versioning, and release management for a solo maintainer.

### Recommendation: **(A) Ship minimal v1.0 surface**

Use TypeScript `exports` map in package.json to expose:
- `cellar-door-exit` → ~20 core exports (quickExit, createMarker, signMarker, verifyMarker, types, errors)
- `cellar-door-exit/ceremony` → ceremony state machine
- `cellar-door-exit/modules` → optional modules A–F
- `cellar-door-exit/anchoring` → TSA, git ledger, Merkle
- `cellar-door-exit/privacy` → redaction, encryption

Same package, subpath exports. No multi-package overhead. The 120+ exports still exist for power users; the default import surface is clean.

For Show HN, reduce to **2 packages**: `cellar-door-exit` (core) and one integration (LangChain or MCP). Ship others when demand exists.

**Estimated effort:** 3 days  
**Priority:** P1

---

## 3. Self-Attestation Trust Problem

**Raised by:** P10 (HN Commenter), P12 (Competitor/Critic), P01 (NIST Technical), P08 (Compliance)  
**Priority:** P1 — Existential narrative risk for Show HN

### The Problem

Without external anchoring, EXIT markers are self-signed claims. P12's "death spiral" argument: self-attested `status` with 0.05 confidence weight is "statistically useless for trust decisions." P10: "a self-attested departure record is... just a self-attested departure record." The confidence scoring formula produces meaningful scores only with cooperative origin confirmation — which is the scenario least likely to occur in adversarial environments.

### Options

| Option | Description | Effort | Risk |
|--------|-------------|--------|------|
| **(A) Accept + document clearly** | Explicitly frame self-attestation as the base layer. Document that trust requires layering (TSA timestamps, cooperative confirmation, platform reputation). Make the limitation a feature: "the protocol doesn't pretend to solve trust — it provides the substrate for trust mechanisms to build on." | 2–3 days (docs) | HN and competitors will still attack it; but honest framing is harder to critique than overselling |
| **(B) Build TSA into default flow** | Make RFC 3161 timestamping mandatory (not optional). Implement full cryptographic TSA verification. Default flow produces externally-anchored markers. | 1–2 weeks | Adds external dependency to default path; increases marker size; TSA availability becomes a runtime dependency |
| **(C) Add external witness protocol** | Define a lightweight witness co-signing protocol where N independent observers can attest to marker publication. Like Certificate Transparency logs for EXIT markers. | 3–4 weeks | Significant spec addition; no witnesses exist yet; chicken-and-egg adoption problem |

### Tradeoff Analysis

**Option A is honest but feels like surrender.** The competitor will say "they admit their own trust model is weak." However, P01 notes the protocol is "strategically sound" for solving "tomorrow's problem today" — and framing self-attestation as a deliberate base layer (like TCP provides unreliable delivery that HTTP builds reliability on top of) is architecturally defensible.

**Option B improves trust without solving it.** TSA proves *when* a marker was created, not *whether its contents are true*. But temporal anchoring is significant: it proves the marker existed at a point in time, preventing backdating. This is the single highest-value external signal achievable without cooperation from third parties.

**Option C is the "right" answer but premature.** A witness network requires witnesses. With zero adoption, there are no witnesses. This is v2.0 territory.

### Recommendation: **(A) + partial (B)**

Accept the limitation and document it clearly — but also complete cryptographic TSA verification (already a P0 NIST blocker) and make timestamping the *recommended* default (SHOULD, not MUST). Frame the trust model explicitly:

> "Self-attestation is the floor, not the ceiling. EXIT markers at minimum prove: (1) the signer controlled a key at a point in time, (2) the marker content was committed to that moment via TSA. Cooperative confirmation, platform reputation, and arrival verification layer additional trust. The protocol provides the substrate; trust is built on top."

Write a dedicated "Trust Model" section for the README and Show HN first comment. Pre-empt the attack by leading with the limitation.

**Estimated effort:** 3 days (documentation) + 2–3 days (TSA verification, already in P0)  
**Priority:** P1

---

## 4. Bus Factor / Governance

**Raised by:** P13 (OSS Maintainer), P03 (Enterprise CISO), P02 (NIST Policy), P07 (Platform Operator), P10 (HN), P12 (Competitor)  
**Priority:** P1 — Credibility blocker for all audiences

### The Problem

Solo maintainer. No organization. No CONTRIBUTING.md, no GOVERNANCE.md, no security contact, no code of conduct. Seven personas flagged this. P13 predicts "high risk of abandonment within 12-18 months." P03: "I would not bring a v0.1.0 package from a solo maintainer into our supply chain."

### Options

| Option | Description | Effort | Risk |
|--------|-------------|--------|------|
| **(A) Accept for now** | Acknowledge solo status. Focus on shipping. Address governance when there's something to govern. | 0 | Every audience sees this as a red flag; NIST submission is weakened; enterprise adoption blocked |
| **(B) Create governance docs** | CONTRIBUTING.md, GOVERNANCE.md, SECURITY.md (with real contact), CODE_OF_CONDUCT.md, RFC process for spec changes | 1–2 days | Governance docs without a community is performative; but signals intent and maturity |
| **(C) Find co-maintainer** | Recruit 1–2 co-maintainers from relevant communities (crypto, agent frameworks, standards) | Weeks–months | Hard to find for a v0.1.0 project; requires giving up some control; dilutes vision |
| **(D) Foundation / fiscal sponsor** | Join an existing foundation (e.g., Linux Foundation, Open Web Foundation) or create a lightweight entity | Weeks–months + $$ | Premature for current stage; adds bureaucracy; but signals institutional commitment |

### Tradeoff Analysis

The real question is: **what's achievable before NIST (March 9) vs. Show HN vs. v1.0?**

- Before NIST: Only (B) is achievable. Governance docs take 1–2 days and meaningfully improve the submission's credibility section.
- Before Show HN: (B) is essential. (C) is aspirational. HN respects solo developers but will flag the sustainability concern.
- Before v1.0: (C) or (D) becomes necessary. No enterprise will adopt a v1.0 from a solo maintainer.

**Option B is not performative if done well.** A clear GOVERNANCE.md that says "This project is currently maintained by one person. Here's the plan for sustainability. Here's how to contribute. Here's the RFC process for spec changes." is honest and actionable. It's better than silence.

### Recommendation: **(B) now, (C) before v1.0**

Create governance docs immediately (before NIST). Include:
- CONTRIBUTING.md with clear contribution paths
- GOVERNANCE.md with honest solo-maintainer acknowledgment + sustainability plan
- SECURITY.md with a real security contact (not "TBD")
- CODE_OF_CONDUCT.md (Contributor Covenant)
- RFC process for spec changes (lightweight: GitHub issues with "rfc" label)

Actively seek co-maintainers after Show HN, when visibility exists to attract them. Consider (D) if/when NIST engagement materializes.

**Estimated effort:** 2 days (governance docs), ongoing (co-maintainer recruitment)  
**Priority:** P1

---

## 5. Non-Blocking Disputes vs. Regulatory Holds

**Raised by:** P08 (Compliance Officer)  
**Priority:** P1 — Blocks regulated finance adoption

### The Problem

Core protocol invariant: "Disputes MUST NOT block transitions" (Spec §5.4). The `legalHold` field is "informational only — it does not prevent exit or modify protocol behavior." In financial services, regulatory preservation orders and litigation holds **must** block certain actions. A protocol that *by design* cannot enforce holds is architecturally incompatible with regulated environments.

### Options

| Option | Description | Effort | Risk |
|--------|-------------|--------|------|
| **(A) Keep principle + document escape hatch** | Maintain non-blocking as core principle. Document that application-layer enforcement (platform refuses to process exits during holds) is the intended pattern. Provide implementation guidance. | 2–3 days (docs) | Regulated platforms must build their own hold enforcement; protocol cannot guarantee compliance |
| **(B) Add optional blocking mode** | Spec extension: platforms MAY declare `blockingDispute: true` in their configuration. When set, disputes in CONTESTED state block the `final → departed` transition. | 1 week (spec + code) | Fundamentally alters the protocol's value proposition; creates two incompatible protocol flavors; agents lose the guarantee of non-blockable exit |
| **(C) Defer to platform layer** | Explicitly state that regulatory hold enforcement is out of scope and belongs in the platform's application layer. The protocol provides the *record* of holds; the platform provides the *enforcement*. | 1 day (docs) | Same as (A) but less helpful — no implementation guidance |

### Tradeoff Analysis

**The core tension is real and irreconcilable at the protocol layer.** The non-blocking principle exists because blocking creates a weapon: platforms can indefinitely trap agents by filing disputes. This is the anti-vendor-lock-in guarantee that makes EXIT valuable. But regulatory holds exist for legitimate reasons.

**Option B breaks the protocol's core value proposition.** If platforms can block exits via disputes, the entire anti-lock-in story collapses. P08 would be satisfied, but P05, P10, and P12 would correctly note that EXIT lost its distinguishing feature.

**Option A is the right architectural boundary.** The protocol provides the record; the platform provides enforcement. This is how TLS works — the protocol provides confidentiality, but applications decide what to do with it. A platform implementing EXIT in a regulated environment adds hold enforcement in its application layer: "Before calling `csm.depart()`, check the hold registry."

### Recommendation: **(A) Keep principle + document the pattern**

Write a "Regulatory Compliance" section in the spec/docs that explicitly:
1. States non-blocking disputes is a deliberate design choice (anti-lock-in guarantee)
2. Documents the application-layer hold pattern with code examples
3. Provides a reference implementation of a `HoldEnforcementMiddleware` that wraps the ceremony state machine
4. Notes that `legalHold` metadata in the marker provides the audit trail even though the protocol doesn't enforce it

This preserves the protocol's integrity while giving regulated platforms a clear path.

**Estimated effort:** 3 days  
**Priority:** P1

---

## 6. Module D Securities Risk

**Raised by:** P08 (Compliance Officer)  
**Priority:** P2 — Partially mitigated, needs documentation

### The Problem

Module D (Economic/Asset Manifest) allows markers to reference economic assets, contributions, and stakes. P08 flagged this as approaching the Howey test boundary for securities. The `reputation_score` field was already killed (per synthesis context), but the remaining asset manifest fields (`contributions`, `stakes`, `economicClaims`) could still create exposure if platforms use them to represent investment-like instruments.

### Options

| Option | Description | Effort | Risk |
|--------|-------------|--------|------|
| **(A) Document limitations clearly** | Add explicit warnings in spec and LEGAL.md: Module D fields are descriptive records, not financial instruments. Add "Module D MUST NOT be used to represent securities, investment contracts, or financial instruments." | 1 day | Documentation doesn't prevent misuse; but establishes clear intent and shifts liability |
| **(B) Remove Module D** | Kill the economic module entirely. Asset references can go in Module E (metadata) as unstructured narrative. | 1 day | Loses structured economic data; platforms wanting asset portability lose a clean interface |
| **(C) Restrict Module D fields** | Remove `stakes` and `economicClaims`. Keep only `contributions` (work product references). | 2–3 days | Reduces attack surface while preserving the most useful field |

### Tradeoff Analysis

Module D's value is primarily in recording what an agent contributed to a platform — not financial claims. The `contributions` field (work product references) is clearly non-securities. The `stakes` and `economicClaims` fields are where Howey risk concentrates.

P07 (Platform Operator) independently recommended: "Skip Module D — the economic module's liability surface is too broad for initial deployment."

### Recommendation: **(A) + (C) hybrid**

Keep `contributions`. Remove or rename `stakes` → `allocations` (non-financial framing) and add explicit non-securities disclaimers. Add a "Securities Law Notice" section to LEGAL.md with clear prohibitions and safe usage patterns.

**Estimated effort:** 2 days  
**Priority:** P2

---

## 7. Production Readiness Gaps

**Raised by:** P04 (Senior Developer), P07 (Platform Operator), P03 (Enterprise CISO)  
**Priority:** P1–P2 (varies by gap)

### The Problem

No HSM integration. No signer abstraction (raw keys in memory). No Java/Go/Python SDK. No claim store reference implementation. No OpenTelemetry. No Kubernetes operator. The gap between DX quality and production readiness is the central finding of the entire review.

### Phased Approach

#### Before NIST (March 9) — P0

| Gap | Achievable? | Action |
|-----|-------------|--------|
| Signer abstraction | Yes (2–3 days) | Define `Signer` interface: `sign(data: Uint8Array): Promise<Uint8Array>`. Refactor `signMarker` to accept `Signer | privateKey`. Default implementation wraps raw key. | 
| TSA crypto verification | Yes (2–3 days) | Already in NIST blocker list. Implement proper ASN.1 TSR signature verification. |

#### Before Show HN — P1

| Gap | Achievable? | Action |
|-----|-------------|--------|
| npm publication | Yes (1 day) | Publish with provenance attestation. Essential credibility signal. |
| Claim store docs | Yes (1 day) | Document the claim store interface + Redis reference pattern. Not a full implementation. |
| `sideEffects: false` | Yes (5 min) | Add to package.json. Fixes tree-shaking. |
| Separate CLI entry | Yes (2 hours) | Move `commander` to a separate `bin/` entry point. Prevents leaking into Edge bundles. |

#### Before v1.0 — P2

| Gap | Achievable? | Effort | Notes |
|-----|-------------|--------|-------|
| HSM integration guide | Yes | 1 week | Document PKCS#11 + Cloud KMS patterns using the `Signer` interface |
| Python SDK | Yes | 2–4 weeks | P04, P07, P12 all flag this. LangChain's primary ecosystem is Python. |
| Go SDK | Stretch | 4–6 weeks | Enterprise backend language. Lower priority than Python. |
| Java SDK | Stretch | 4–6 weeks | P03 needs this. Lower priority than Python. |
| Security audit | External | 6–12 weeks + $50K+ | Gate for enterprise adoption. Trail of Bits or NCC Group. |
| OpenTelemetry | Yes | 3 days | Enterprise observability. Low effort, high signal. |
| Claim store impl | Yes | 1 week | Redis-backed reference implementation with TTL for sunset policies. |

### Recommendation: **Signer interface is the highest-leverage single change**

The `Signer` interface unblocks: HSM integration, Cloud KMS, hardware tokens, and multi-party signing — all from a 2–3 day code change. It's the architectural prerequisite for everything P03 and P07 need.

**Estimated effort:** See table above  
**Priority:** Signer interface = P0; npm publish = P1; Python SDK = P2

---

## 8. Site / Marketing Clarity

**Raised by:** P09 (Tech Journalist), P10 (HN Commenter)  
**Priority:** P1 — Blocks effective Show HN launch

### The Problem

P09: "buries the lede under literary metaphor." P10: wouldn't star — needs to see the spec, not the branding. The README mixes current capabilities with future aspirations. The "Cellar Door" name and Egyptian glyph (𓉸) are either charming or pretentious — "coin flip" per P10.

### Options

| Option | Description | Effort | Risk |
|--------|-------------|--------|------|
| **(A) Problem-first rewrite** | Restructure README: problem statement → one-liner demo → what it does today → what's planned. Kill literary metaphors in technical docs. Keep brand personality in site/marketing only. | 2–3 days | May lose the distinctive voice that makes the project memorable |
| **(B) Dual-track content** | Technical README (problem-first, no metaphor) + separate brand site (full personality). README links to site for the story. | 3–4 days | More content to maintain; but correct separation of concerns |
| **(C) Status quo + Show HN first comment** | Keep README as-is. Write a killer Show HN first comment that provides the problem-first framing. | 1 day | README still confuses visitors who arrive via search, not HN |

### Specific Content Changes Needed

1. **README first paragraph** must answer: "What problem does this solve?" Not "what is the metaphor?"
2. **Current vs. future** must be visually separated. A "Roadmap" section, not interleaved aspirational claims.
3. **Show HN post** must lead with the concrete scenario (agent migrating OpenAI → Anthropic) not the protocol name.
4. **First HN comment** must lead with limitations: key management problem, self-attestation boundaries, zero production users. Control the narrative.
5. **License inconsistency** (README says MIT, LICENSE says Apache 2.0) — fix immediately. P13 flagged this as a credibility signal.

### Recommendation: **(B) Dual-track content**

The distinctive voice *is* a competitive advantage — P09 said they'd cover it. But technical docs need technical clarity. Separate them:

- **README.md**: Problem → demo → API → limitations → roadmap. Clean, technical, honest.
- **cellar-door.dev**: The full story, the brand, the metaphor. Let it breathe.
- **Show HN**: Problem-first post. First comment with limitations + concrete demo.

**Estimated effort:** 3–4 days  
**Priority:** P1

---

## Summary Matrix

| # | Issue | Priority | Recommendation | Effort | Milestone |
|---|-------|----------|---------------|--------|-----------|
| 1 | FIPS Algorithm Agility | **P0** | Spec agility mechanism + implement P-256 | 5 days | NIST |
| 2 | Spec Complexity vs Adoption | **P1** | Subpath exports, reduce to 2 packages for launch | 3 days | Show HN |
| 3 | Self-Attestation Trust | **P1** | Accept + document clearly + complete TSA verification | 3 days (docs) | Show HN |
| 4 | Bus Factor / Governance | **P1** | Governance docs now, co-maintainer later | 2 days | NIST |
| 5 | Non-Blocking vs Regulatory Holds | **P1** | Keep principle + document application-layer pattern | 3 days | Show HN |
| 6 | Module D Securities Risk | **P2** | Restrict fields + add disclaimers | 2 days | v1.0 |
| 7 | Production Readiness | **P0–P2** | Signer interface (P0), npm publish (P1), Python SDK (P2) | Varies | Phased |
| 8 | Site/Marketing Clarity | **P1** | Dual-track: technical README + brand site | 3–4 days | Show HN |

### Total Effort Estimate

- **Before NIST (March 9):** ~12 days (FIPS agility, signer interface, TSA verification, governance docs, NIST blockers from synthesis)
- **Before Show HN:** ~12 additional days (API surface, documentation, npm publish, content rewrite)
- **Before v1.0:** ~3–6 months (Python SDK, security audit, entity formation, production deployment)

### The Strategic Sequence

1. **Now → March 9:** FIPS compliance + NIST blockers + governance docs + signer interface
2. **March → Show HN:** API surface cleanup + documentation rewrite + npm publish + TSA verification
3. **Post-Show HN → v1.0:** Python SDK + security audit + co-maintainer + first production deployment

---

*Decision tradeoffs report produced 2026-02-24. Based on 13 synthetic persona reviews (v2 round), synthesis document, and cross-group coherence check. All analysis is advisory — final decisions rest with the project maintainer.*
