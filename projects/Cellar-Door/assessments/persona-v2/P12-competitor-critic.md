# P12: Competitor / Critic — Competitive Intelligence Brief

**Persona:** CTO at a competing AI governance startup
**Date:** 2026-02-24
**Documents Reviewed:** EXIT_SPEC_v1.1, EXIT_PAPER_v5 (abstract + conclusion), ecosystem-map.md, cellar-door-exit/README.md

---

## Executive Summary

EXIT/Passage Protocol is an ambitious spec with genuine intellectual rigor — and it's riddled with exploitable weaknesses. The core insight (portable departure records) is sound but the execution has critical gaps that a well-funded competitor can exploit. Here's how we kill it, and what we steal.

---

## Weaknesses Ranked (Most to Least Exploitable)

### 1. 🔴 CRITICAL: The Self-Attestation Death Spiral

The entire trust model rests on self-attested claims with optional cooperative signals. Their own paper admits this repeatedly ("cheap talk," "lemons problem," Akerlof 1970 — they cite the diagnosis but don't cure it). The confidence scoring formula is a fig leaf:

- `self_only` confirmation gets 0.05 weight. That's the *default case* for any hostile or indifferent origin — which is the *primary use case* they're designing for.
- The score maxes at 1.0, but realistically most markers in the wild will score 0.05–0.20. That's statistically useless for trust decisions.
- Their "tenure weighting" is self-attestable too (50% weight for self-attested tenure with no origin corroboration). An attacker can claim 2 years of tenure at a Sybil origin and get full credit.

**Kill argument:** "EXIT markers are self-signed JSON blobs with no more trustworthiness than a self-written LinkedIn recommendation. The trust mechanisms are academic exercises that don't survive contact with adversarial agents."

### 2. 🔴 CRITICAL: Zero Production Deployment

v0.1.0. No production users. No real-world validation. 291 tests against synthetic data. The paper *acknowledges* this: "The Passage Protocol has been tested only with synthetic data." They've built a spec in a vacuum.

**Kill argument:** "Show me one platform that accepts EXIT markers. Show me one agent that carries one. This is an academic exercise masquerading as infrastructure."

### 3. 🟠 HIGH: The Sybil Origin Problem Is Unsolvable in Their Architecture

They acknowledge it (§6.2) and basically shrug: "The Sybil origin problem is inherent to any system where identity creation is permissionless." But their whole value proposition depends on departure records being *meaningful*. If I can spin up `did:web:totally-legit-platform.example`, co-sign my own departure as `mutual` confirmation, and get a 0.40 status weight — the scoring system is gamed.

They punt to "destination allowlists" and "future web-of-trust mechanisms" but have no concrete solution. This is the architectural Achilles heel.

### 4. 🟠 HIGH: Spec Complexity vs. Adoption Reality

The spec is **1,778 lines**. 20 sections. 6 optional modules. KERI key management. RFC 3161 TSA integration. Git ledger anchoring. Merkle batch operations. Commit-reveal schemes. Coercion detection. Weaponization detection. Reputation laundering detection. Visual hash doors.

This is a PhD thesis, not an adoption-ready protocol. Compare: JWT is ~30 pages. OAuth 2.0 is ~76 pages. EXIT v1.1 is trying to be everything to everyone and will be nothing to anyone.

**Interop failure prediction:** Module interaction is underspecified. What happens when Module A lineage conflicts with Module C dispute data? When Module D economic claims reference assets the origin disputes? The spec says modules "MUST NOT alter the semantics of the core fields" but doesn't specify resolution when modules contradict each other.

### 5. 🟡 MEDIUM: Single-Algorithm Dependency

Ed25519 only. The spec *mentions* post-quantum migration (2030-2035) but mandates `Ed25519Signature2020` for v1.1. No algorithm agility. When NIST's ML-DSA becomes standard, every EXIT marker in circulation becomes a migration headache. A competitor launching today with algorithm agility has a structural advantage.

### 6. 🟡 MEDIUM: TSA Verification Is Theater

The reference implementation does **structural verification only** — not cryptographic. Their own spec says in bold: "A forged or tampered TSR that embeds the correct hash bytes will pass structural verification." They've documented the weakness but shipped it anyway. Any timestamp-dependent trust decision built on this implementation is security theater.

### 7. 🟡 MEDIUM: The ENTRY Protocol Is Incomplete

ENTRY v1.0 is described in the paper but the ecosystem map says it's "in development." The whole Proof of Passage concept requires both halves. Selling EXIT without ENTRY is selling one shoe.

### 8. 🟡 MEDIUM: Solo Maintainer Risk

`package.json` shows version 0.1.0. LICENSE copyright: "Warren Koch, EXIT Protocol Project." One person. No org. No funding mentioned. No GOVERNANCE.md. No CONTRIBUTING.md. The ecosystem map mentions an unresolved entity question ("Delaware LLC vs. BC sole prop vs. HoldCo+SPV"). This project could disappear if one person gets a day job.

---

## Spec Ambiguities That Will Cause Interop Failures

1. **Canonicalization is custom, not JCS.** The ecosystem map flags this: "Spec uses custom canonical JSON; paper references JCS/eddsa-jcs-2022." Two implementations will serialize differently and break signature verification.

2. **Module interaction semantics undefined.** "Modules MUST NOT alter the semantics of the core fields" — but what about each other? Module A successor + Module C dispute + Module D economic claims can create incoherent states with no resolution rule.

3. **`did:key` resolution is assumed but unspecified.** The spec says "Resolve the `proof.verificationMethod` to a public key" but doesn't specify DID resolution requirements. Different DID method resolvers will produce different verification results.

4. **Content-addressed ID is SHOULD, not MUST.** "The `id` field SHOULD be content-addressed." So non-content-addressed IDs are valid. Deduplication and integrity checking break when some markers have content-addressed IDs and some don't.

5. **Sunset date computation ambiguity.** "The `sunsetDate` MUST be computed from the marker `timestamp` plus the policy duration." But `sunsetDate` is a field on the marker, and `SunsetPolicy` is a separate structure. Who computes it? When? What if they disagree?

---

## Go-to-Market Vulnerability

**They have no go-to-market.** The paper is a preprint. The code is v0.1.0. The entity doesn't exist yet. The README says "npm install cellar-door-exit" but the package isn't on npm (the repo URL points to GitHub, no npmjs.com link). The brand guide is polished but branding doesn't ship code.

**Specific vulnerabilities:**
- **No SDK for other languages.** TypeScript only. Python agents (LangChain's primary language), Rust agents, Go agents — all excluded.
- **No cloud-native story.** No hosted verification service. No API gateway. Enterprise buyers need SaaS, not `npm install`.
- **Framework integrations are thin.** LangChain + Vercel AI SDK + MCP are listed but these are wrappers, not deep integrations. No CrewAI, no AutoGen, no agency frameworks.
- **NIST timing risk.** They submitted an RFI response to NIST's AI Agent Standards Initiative. If NIST moves in a different direction (likely — NIST tends toward enterprise-friendly solutions, not crypto-native protocols), EXIT becomes a standardization orphan.

---

## Top 3 "Why EXIT Will Fail" Arguments

### 1. "Nobody needs this yet."
The agent ecosystem is still forming. Agents don't migrate between platforms because there aren't enough platforms to migrate between. EXIT is solving a 2028 problem in 2026, and by 2028 a better-funded team will have built the actual solution informed by real market needs.

### 2. "Self-attestation makes the whole thing useless for the use cases that matter."
The high-value use case is distinguishing good agents from bad ones. EXIT's trust model produces confidence scores of 0.05–0.20 for the vast majority of real-world scenarios (hostile/indifferent origins). That's noise, not signal. Platforms will build their own proprietary reputation systems that actually work, making EXIT irrelevant.

### 3. "Spec complexity will kill adoption."
No developer is going to implement 1,778 lines of spec for a v0.1.0 protocol with zero production users. OAuth took years to reach critical mass with corporate backing. EXIT has one person and an Egyptian hieroglyph.

---

## What I Would Steal

### Immediately:
- **The unblockable exit invariant (D-006).** Brilliant design decision. Disputes never block departure. We should adopt this principle wholesale.
- **The `selfAttested: boolean` pattern.** Simple, machine-readable honesty about claim provenance. Applicable to any credential system.
- **The commit-reveal scheme for exit intent.** Clever anti-retaliation mechanism. We can generalize this beyond departure to any adversarial attestation scenario.
- **The ceremony state machine pattern.** Seven states, three paths, clear invariants. Good protocol design regardless of the specific use case.

### With modification:
- **The confidence scoring formula.** The weights are wrong (self_only at 0.05 is too generous given Sybil attacks) but the composite scoring approach is sound. We'd add network-effect signals they can't (platform endorsement graphs, behavioral analytics).
- **Visual hash doors.** Gimmicky but memorable. Good for developer experience and brand differentiation. We'd steal the concept, not the hieroglyph.

---

## Grudging Acknowledgment: What's Actually Good

1. **The intellectual foundation is excellent.** Hirschman, Akerlof, Spence, mechanism design — this is the most theoretically grounded protocol spec I've seen in the agent space. The paper would get accepted at a workshop.

2. **The adversarial design posture is correct.** Designing for hostile origins, emergency departure, unilateral paths — they've thought about the hard cases. Most governance protocols assume cooperation; EXIT assumes betrayal. That's the right instinct.

3. **The ethics guardrails are ahead of the market.** Anti-weaponization clause, coercion detection, right of reply, sunset policies — no competitor has thought about this layer. When regulation catches up, they'll have a head start.

4. **The modular architecture is well-designed.** Core schema at 335 bytes, everything else optional. The separation of concerns between modules is clean. Module F's GDPR warning about on-chain anchoring shows mature thinking.

5. **Apache 2.0 with explicit patent grant reasoning (D-007) is smart.** They actually thought about patent landscape risks in identity/credential systems. Most OSS projects don't.

6. **The ecosystem map is unusually self-aware.** Explicit liability boundaries, HOLOS primitive mappings, clear "we do this / we don't do that" lines. Most projects at this stage can't articulate their own boundaries this clearly.

---

## Bottom Line

EXIT is a well-designed protocol that solves a real future problem, built by one person with no production validation and no go-to-market strategy. The self-attestation problem makes it commercially useless for the trust use cases that drive adoption. The spec complexity will prevent the grassroots adoption that could compensate for lack of enterprise sales.

**Our play:** Watch for 6 months. If the agent ecosystem matures and departure becomes a real problem, we ship a simpler protocol (core schema only, no modules) with a hosted verification service and enterprise SDK. We steal the unblockable exit invariant, the self-attestation flag, and the commit-reveal scheme. We solve the Sybil problem with a federated platform registry (which they explicitly refused in D-012 — that's a competitive opening, not a principle).

**Threat level: Low (current), Medium (if they get funding and production users).**
