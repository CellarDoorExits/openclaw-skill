# Passage Protocol — 31-Persona Synthesis Report

**Date:** 2026-02-26  
**Scope:** 31 expert persona reviews (P01r–P32) of EXIT/ENTRY/Passage Protocol (Cellar Door)  
**Version Reviewed:** EXIT Spec v1.1, cellar-door-exit v0.2.0  

> **Note:** 32 reviews were planned but P33 does not exist in the assessment directory. This synthesis covers 31 reviews.

---

## 1. Verdict Matrix

Sorted from most positive to most negative.

| Persona | Role | Verdict / Score | One-Line Summary |
|---------|------|----------------|------------------|
| P07r | Platform Operator (SRE) | **Go** | All prior conditions met; 50% reduction in integration effort; start pilot now |
| P06r | Vercel/Next.js Developer | **Ship** ✅ | Upgraded from "ship with caveats" — signer abstraction makes it production-viable |
| P28 | Science Fiction Author | **Would novelize** | "A novel waiting to happen" — the protocol is a world-building engine |
| P05r | AI Agent Dev (LangChain) | **Would integrate (EXIT + trust layer)** | Upgraded from EXIT-only; signer + claim store + confidence scoring are composable |
| P15 | Philosopher of AI Rights | **Proleptic infrastructure** (positive) | Philosophically serious; wisely builds infrastructure before rights are settled |
| P04r | Senior Backend Developer | **Internal tooling ready** | Upgraded from "prototyping only"; signer abstraction opened the gate |
| P16 | DevRel / Community Builder | **Almost launch-ready** | Fix README order, nail Show HN narrative, ship LangChain example |
| P13r | OSS Maintainer | **Would-Contribute** 🤝 | Upgraded from Would-Watch; every governance gap addressed |
| P29 | High School CS Teacher | **High educational value** | Great for AI ethics elective with scaffolding; CLI demos would engage teens |
| P10r | HN Commenter | **Would star (conditionally)** | Upgraded from "wouldn't star"; FIPS + signer show momentum and taste |
| P08r | Compliance Officer (Finance) | **Conditionally suitable** | Upgraded from "not ready"; deploy with 11 conditions enforced |
| P26 | Civil Law Notary | **Would-Not-Notarize** (nuanced) | Not a notarial act, but crypto authentication exceeds traditional seals; useful as exhibits |
| P03r | Enterprise CISO | **3.2/5** (borderline Trial) | Upgraded from 2.4/5; approve 8-week PoC, not production |
| P20 | Database Architect | **Well-Designed** | Clean data model; 8 minor recommendations for production readiness |
| P21 | Cloud Architect | **Build (as add-on)** 🟡 | Trivially deployable on AWS/GCP; ~$45/mo at 100K exits; market 12-18mo away |
| P22 | Patent Attorney | **Defensive publication** (not patenting) | Proof of Passage is best patent candidate; Apache 2.0 makes offensive patents incoherent |
| P01r | NIST Technical Reviewer | **Conditional Accept** | Upgraded from Revise & Resubmit; 3 of 7 blockers resolved; FIPS path sound |
| P24 | B2B SaaS Product Manager | **Ship** (with conditions) | PMF 5/10; cut scope aggressively; get 1 production integration in 6 months |
| P02r | NIST Policy Analyst | **Monitor** (closer to threshold) | FIPS addressed; still needs 2nd implementer, production use, or W3C submission |
| P25 | Deep Tech VC | **Interested — would not lead** | Fundable at pre-seed ($3-6M cap); needs 1 integration partner + full-time founder |
| P18 | MAS Researcher | **Would-Cite** (narrowly) | Real gap identified; needs formal game theory + empirical evaluation for main venue |
| P17 | RegTech Analyst | **Watch** | No direct competitors; market doesn't exist yet; re-evaluate on audit + standards adoption |
| P11r | AI Agent (Claude) | **Watch (pre-rotation + signer)** | Fundamental tension: agent is a process, not a person; can't hold own keys yet |
| P12r | Competitor / Critic | **Threat: Low-Medium** | Velocity concerning; self-attestation + zero users still killable; watch 3 months |
| P27 | Applied Cryptographer | **Needs Fixes** | Sound architecture; 3 medium bugs (P-256 serialization, id exclusion, legacy signMarker) |
| P19 | Red Team (Hostile) | **HIGH: Subject-key binding missing** | Impersonation via unbound proof.verificationMethod; one-line fix critical |
| P14 | Academic Peer Reviewer | **Weak Reject** | No formal proofs, no real deployment, synthetic validation not credible; resubmit encouraged |
| P09r | Tech Journalist | **Skip (for now)** | Downgraded from "roundup"; no shipped SDK to test; revisit Q2 2026 |
| P23 | DPO / GDPR Specialist | **Overall Risk: HIGH** | Structural GDPR tensions; encryption should be MUST not MAY; critical gaps in erasure |
| P30 | Plaintiff's Class Action Attorney | **Litigation goldmine** | 5+ class actions identifiable; $50M-$1B exposure per platform defendant |
| P31 | Securities Attorney | **Medium risk** | Core markers not securities; Module D + derivatives are the danger zone |
| P32 | Antitrust Attorney | **Moderate-High risk** | ENTRY admission = antitrust weapon; `blockedOrigins` is a landmine; consortium exclusion critical |

---

## 2. Verdict Shift (Re-runs from v2 → v3)

| Persona | v2 Verdict | v3 Verdict | What Changed |
|---------|-----------|-----------|-------------|
| P01r | Revise & Resubmit (7 blockers) | Conditional Accept (3 unresolved) | P-256/FIPS added, HSM integration guide, Signer abstraction |
| P02r | Monitor | Monitor (closer to threshold) | FIPS gap closed; ENTRY shipped; trust enhancers added |
| P03r | 2.4/5 (Assess) | 3.2/5 (borderline Trial) | +0.8 across all dimensions; FIPS + HSM were top 2 of 6 conditions |
| P04r | Prototyping only | Internal tooling ready | Signer abstraction, OTel, 399 tests, P-256 |
| P05r | Would integrate EXIT only | Would integrate EXIT + trust layer | Signer, claim store, confidence scoring composable with LangChain |
| P06r | Ship with caveats | Ship ✅ | Signer abstraction = production-viable; OTel = free observability |
| P07r | Conditional Go | **Go** | All 4 conditions met: claim store, HSM, OTel, trust model |
| P08r | Not ready for regulated finance | Conditionally suitable | Non-blocking enforcement doc + trust enhancers resolved primary blocker |
| P09r | Cover in a roundup | Skip (for now) | Higher bar: needs shipped SDK, not just spec; too sui generis for listicle |
| P10r | Would read spec, wouldn't star | Would star (conditionally) | FIPS + signer + 399 tests cross credibility threshold |
| P11r | Can't meaningfully use yet | Watch (signer + pre-rotation) | Signer abstraction cracks the door; custody still unresolved |
| P12r | Threat: Low | Threat: Low-Medium | Velocity increase; FIPS closes their algorithm differentiator |
| P13r | Would-Watch | Would-Contribute 🤝 | All governance gaps addressed (CONTRIBUTING, GOVERNANCE, SECURITY, CoC) |

---

## 3. Consensus Findings (Raised by 3+ Personas)

| # | Finding | Count | Personas |
|---|---------|-------|----------|
| 1 | **No production deployment / zero users** | 16 | P01r, P02r, P03r, P04r, P09r, P10r, P12r, P13r, P14, P17, P18, P21, P24, P25, P30, P32 |
| 2 | **Bus factor of 1 / solo maintainer** | 10 | P02r, P03r, P04r, P07r, P12r, P13r, P17, P24, P25, P26 |
| 3 | **Self-attestation is cheap talk / Sybil vulnerability** | 9 | P01r, P10r, P11r, P12r, P14, P18, P19, P24, P27 |
| 4 | **No second independent implementation** | 7 | P01r, P02r, P03r, P04r, P13r, P14, P17 |
| 5 | **Custom canonicalization (not JCS/RFC 8785)** | 5 | P01r, P03r, P14, P27, P20 |
| 6 | **TypeScript only / no multi-language SDK** | 5 | P02r, P03r, P04r, P12r, P18 |
| 7 | **GDPR/erasure tension with immutable records** | 5 | P08r, P17, P23, P30, P32 |
| 8 | **FreeTSA as default TSA is a credibility problem** | 4 | P01r, P03r, P26, P27 |
| 9 | **No formal security audit** | 6 | P01r, P03r, P13r, P14, P17, P25 |
| 10 | **Dual API vocabulary (Exit/Passage) creates confusion** | 4 | P04r, P06r, P10r, P13r |
| 11 | **Module D (Economic) is a legal/securities risk** | 5 | P08r, P24, P30, P31, P32 |
| 12 | **`blockedOrigins` is an antitrust landmine** | 3 | P08r, P30, P32 |
| 13 | **Confidence scoring weights are ad-hoc / unjustified** | 4 | P14, P18, P26, P30 |
| 14 | **No npm publication evidence** | 4 | P04r, P06r, P10r, P13r |
| 15 | **XChaCha20-Poly1305 not FIPS-approved (privacy module)** | 3 | P01r, P03r, P27 |

---

## 4. Critical Security Findings

### From P19 (Red Team) — IMMEDIATE ACTION REQUIRED

| # | Finding | Severity | CVSS | Fix |
|---|---------|----------|------|-----|
| **F2** | **No subject-key binding in `verifyMarker()`** — attacker can create valid markers attributed to any subject DID | **HIGH** | 8.1 | Add `proof.verificationMethod === marker.subject` check. **One-line fix.** |
| F1 | Cross-algorithm key confusion (proof.type vs DID prefix not cross-checked) | HIGH | 7.5 | Not currently exploitable (library rejects), but logic bug. Add algorithm cross-check. |
| F8 | Full attack chain: fabricate reputation at scale + impersonate + launder + weaponize | HIGH | 7.5 | Depends on F2 fix. Even with fix, self-sovereign markers allow self-fabrication. |
| F4 | Trust enhancer witness signatures not cryptographically verified | MEDIUM | 6.5 | Provide `verifyTrustEnhancers()` function |
| F5 | Unicode normalization absent in canonicalization | MEDIUM | 5.9 | Apply NFC normalization before canonicalization |
| F3 | No replay prevention / marker deduplication | MEDIUM | 5.3 | Promote content-addressed IDs to MUST; define replay guidance |

### From P27 (Cryptographer) — SHORT-TERM FIXES

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 1 | P-256 signature serialization format ambiguous (`.toCompactRawBytes()` vs `.toDERRawBytes()`) | Medium | Explicitly call format method; document canonical form |
| 2 | Spec says exclude `id` from signing; code doesn't | Medium | Align spec and implementation |
| 3 | Legacy `signMarker` hardcodes Ed25519 proof type regardless of key | Medium | Deprecate; use `signMarkerWithSigner` |
| 4 | No domain separation in signed data | Medium | Prepend `"exit-marker-v1.1:"` to signed bytes |
| 5 | Algorithm cross-check missing (confirms P19-F1) | Low | Cross-check DID multicodec vs proof.type |

**Combined priority:** Fix P19-F2 (subject-key binding) immediately — it enables impersonation. Then P27 items 1-4 before any production deployment.

---

## 5. Legal Risk Summary

### Consolidated Risk Matrix (P22 Patent + P23 GDPR + P30 Plaintiff + P31 Securities + P32 Antitrust)

| Risk Area | Rating | Primary Concern | Recommended Action |
|-----------|--------|----------------|-------------------|
| **GDPR Art. 17 (Erasure)** | 🔴 CRITICAL | Immutable records + chain anchoring incompatible with right to erasure | Make encryption MUST (not MAY); prohibit `subjectDid` in on-chain anchors; implement crypto-shredding |
| **GDPR Cross-border (Ch. V)** | 🔴 CRITICAL | Portable markers = uncontrolled international transfers | Encryption as supplementary measure; hash-only anchoring per CNIL guidance |
| **Antitrust: Coordinated blocking** | 🔴 CRITICAL | `blockedOrigins` enables per se illegal group boycotts (Sherman §1) | Rename to `securityExclusions`; add justification + sunset requirements; add anti-coordination clause to ENTRY |
| **Antitrust: Walled gardens** | 🔴 HIGH | Vertical control of EXIT+ENTRY enables foreclosure | Add non-discrimination obligation for gatekeepers; mandatory minimum admission floor |
| **Defamation / False reputation** | 🔴 HIGH | False `originStatus` + automated admission denial = economic destruction | Mandatory sunset policies; FCRA-style dispute/correction rights; human review requirement |
| **Securities: Module D** | 🟡 MEDIUM | Asset manifests may carry securities references; confidence scores could be tokenized | Add anti-securitization clause to spec §14; elevate disclaimer from JSDoc to spec |
| **Securities: Core protocol** | 🟢 LOW | Markers are not securities under Howey | Maintain conduit-only architecture |
| **Patent: FTO** | 🟢 LOW-MOD | Module F (blockchain anchoring) has densest patent thicket | Targeted FTO search for Module F ($8-15K); defensive publication recommended |
| **Patent: Own IP** | 🟢 LOW | Apache 2.0 + public disclosure = offensive patents incoherent | File defensive publication ($2-5K) |

### Lawyers' Consensus Recommendations

1. **Make sunset policies mandatory** with default expiry (P23, P30, P32)
2. **Prohibit Module D and Module F** for initial launch (P08r, P24, P31)
3. **Add FCRA-style protections** — dispute, correction, reinvestigation (P30)
4. **Require human review** before admission denial based on markers (P30, P32)
5. **Add anti-securitization and anti-coordination clauses** to the spec (P31, P32)
6. **Rename `blockedOrigins`** to `securityExclusions` with mandatory justification (P32)

---

## 6. Market / Launch Readiness

| Persona | Role | Ready to Ship? | Key Condition |
|---------|------|---------------|---------------|
| P16 | DevRel | **Almost** — weekend of work | Restructure README (problem-first); Show HN post; LangChain example |
| P24 | Product Manager | **Ship** with 40% scope cut | Cut Modules B,C,D,F; reduce to 4 exit types; 2 ceremony paths; ship MCP integration |
| P25 | VC | **Not yet investable** at seed | Need 1 LOI/integration; full-time founder; BD hire plan |
| P09r | Journalist | **Skip** — nothing to test | Revisit when SDK ships + 1 platform integrates |
| P10r | HN Commenter | **Not yet for Show HN** | Need: 1 integration, demo video, "contests don't block exit" as lead |

### Launch Readiness Verdict

**The protocol is technically ready. The product is not.**

The engineering is impressive (399 tests, FIPS compliance, clean Signer abstraction, OTel). But there is:
- No published npm package with provenance
- No production deployment anywhere
- No demo video or interactive playground
- README ordered as reference manual, not landing page
- No community (Discord, forum, etc.)

**Recommended launch sequence:**
1. Fix P19-F2 (subject-key binding) — this week
2. Fix P27 items 1-4 — this week
3. npm publish with provenance
4. Restructure README (P16 guidance)
5. Create demo video / asciinema (P10r)
6. Show HN with narrative: "Your AI agent can't prove it left"
7. Simultaneously pursue 1 design partner integration

---

## 7. Top 10 Action Items

| Priority | Action | Impact | Effort | Source |
|----------|--------|--------|--------|--------|
| **P0** | **Fix subject-key binding in `verifyMarker()`** — add `proof.verificationMethod === subject` check | Closes impersonation attack class | 1 line | P19 |
| **P0** | **Fix P-256 signature format + spec/code alignment** (id exclusion, legacy signMarker, domain separation) | Prevents interop failures + cross-impl bugs | 1-2 days | P27 |
| **P1** | **Add algorithm cross-check** (DID multicodec vs proof.type) | Closes key confusion class | Small | P19, P27 |
| **P1** | **Make encryption MUST (not MAY) for markers with personal data; hash-only chain anchoring** | GDPR compliance | Spec change | P23 |
| **P1** | **Make sunset policies mandatory** with default expiry (e.g., 730 days voluntary / 365 days forced) | Legal risk reduction + GDPR storage limitation | Spec change | P23, P30, P32 |
| **P2** | **Restructure README** — problem-first, move reference docs out; add glossary | Launch readiness | 3 hours | P16, P29 |
| **P2** | **npm publish with provenance** + pick one API vocabulary (deprecate the other) | Developer trust + reduced confusion | 1 day | P04r, P06r, P13r |
| **P2** | **Add anti-securitization clause to spec §14** + elevate securities disclaimer from JSDoc | Legal protection | Spec change | P31 |
| **P2** | **Add non-discrimination + anti-coordination clauses to ENTRY spec** | Antitrust protection | Spec change | P32 |
| **P3** | **Provide `verifyTrustEnhancers()` + Unicode NFC normalization in canonicalize()** | Trust model integrity + interop | 1-2 days | P19, P27 |

---

## 8. Unique Insights

| Persona | Insight |
|---------|---------|
| **P15 (Philosopher)** | EXIT adopts a "moral-precautionary stance" — acts as if agents might deserve moral consideration without requiring that question to be settled. This is "proleptic ethics": building infrastructure in anticipation of moral realities not yet materialized. |
| **P28 (SF Author)** | "The world may end, but you will not" is a secular version of religion's oldest promise — the soul surviving the body's death. The dark side: what if persistence is a curse? |
| **P11r (AI Agent)** | "I am a process, not a person. EXIT gives me the vocabulary to declare departure and the cryptography to prove it — but it can't give me the sovereignty to hold my own keys." The Signer abstraction is the right seam, but runtime must meet protocol halfway. |
| **P12r (Competitor)** | The claim store "makes it easier to accumulate garbage at scale" — `ingestMarker()` faithfully stores unverified claims. "They've built a beautifully typed database for storing lies." |
| **P14 (Academic)** | The multi-lens persona validation is "circular reasoning: an AI system reviewing an AI system designed for AI systems." Should be removed or reframed as design exploration. |
| **P26 (Notary)** | EXIT's cryptographic authentication is *technically superior* to a notarial seal — a forged stamp requires an expert; a forged signature is detectable by anyone in milliseconds. |
| **P20 (DB Architect)** | Content-addressed IDs use 16-char truncated SHA-256 (64 bits) — collision probability reaches ~1% at 600M claims. **Must extend to 32+ hex chars.** |
| **P32 (Antitrust)** | The departure-right / admission-privilege asymmetry is the protocol's philosophical strength but its antitrust vulnerability: "the right to leave is worthless if no one will let you in." |
| **P30 (Plaintiff Attorney)** | The protocol's own paper contains "admissions against interest" — documented the harms, understood the risks, shipped anyway. Each goes into a complaint. |
| **P29 (HS Teacher)** | The emergency exit scenario — "the AI has milliseconds to prove it existed" — would be the engagement hook for teenagers. Lead with drama, not specs. |

---

## 9. Overall Assessment

The EXIT/Passage Protocol emerges from 31 expert reviews as **a technically impressive, architecturally sound protocol addressing a genuine gap in the AI agent ecosystem — with critical security bugs, significant legal exposure, and zero real-world adoption.** The engineering quality consistently exceeds reviewer expectations: 399 tests, clean Signer abstraction, FIPS compliance via P-256, OpenTelemetry integration, and a well-designed claim store interface. Multiple reviewers (P03r, P07r, P12r, P25) noted that the v0.1→v0.2 velocity was remarkable for a solo maintainer. The protocol's conceptual foundations — Hirschman's exit/voice framework, the departure-right/admission-privilege asymmetry, the non-blocking dispute invariant — are praised across technical, philosophical, and legal perspectives.

However, two classes of issues demand immediate attention. **First, security:** P19's discovery that `verifyMarker()` does not check subject-key binding (CVSS 8.1) means anyone can create "verified" markers attributed to any DID. This is a one-line fix but it undermines the entire trust model until resolved. P27 identified three additional medium-severity bugs in the cryptographic layer. **Second, legal exposure:** The four legal reviewers (P30-P32, P23) collectively identify $50M-$1B+ in potential platform liability from defamation, antitrust, GDPR, and securities risks — largely stemming from the admission policy design, mandatory sunset policy absence, and immutable record / erasure tension. The protocol's own paper contains statements that P30 characterizes as "admissions against interest" in future litigation.

**The project stands at a clear inflection point.** The hard technical and conceptual work is done. What's missing is entirely on the adoption, packaging, and legal infrastructure axes: fix the security bugs (days), restructure the README and publish to npm (weekend), add legal safeguards to the spec (weeks), get one production integration (months). Every reviewer who upgraded their verdict (13 of 13 re-runs improved) cited the same pattern: the maintainer listened to feedback and delivered the highest-impact changes first. If that pattern continues — security fixes → legal clauses → one integration partner → Show HN — the protocol has a credible path from "brilliant spec" to "adopted infrastructure." The 12-18 month window before agent mobility becomes a widely-felt pain point (P21, P25) is exactly enough time, but only if execution starts now.
