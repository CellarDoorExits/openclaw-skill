# Expert Persona Review v3 — Post-Sprint Assessment
**Date:** 2026-02-25 | **Status:** PLAN — awaiting Warren's approval

---

## What Changed Since v2 (Feb 24)

v2 identified 7 NIST blockers and universal "not yet" verdicts. Since then (in ~24 hours):

| v2 Finding | Status | What We Did |
|-----------|--------|-------------|
| B1: Ed25519 not FIPS → no algorithm agility | ✅ **FIXED** | P-256 signer + `Signer` abstraction + `createSigner()` factory |
| B4: No HSM / signer abstraction | ✅ **FIXED** | `docs/HSM_INTEGRATION.md` — AWS KMS, Azure, GCP, YubiKey examples |
| "No claim store / replay prevention" | ✅ **FIXED** | `MemoryClaimStore` with query, filter, GDPR delete |
| "v0.1.0 maturity gap" | ✅ **FIXED** | Version bumped to 0.2.0, Passage API rename |
| "No governance / bus factor 1" | ✅ **FIXED** | CONTRIBUTING.md, CODE_OF_CONDUCT.md, GOVERNANCE.md |
| "Self-attestation useless" | ✅ **FIXED** | Trust enhancers: timestamps, witnesses, identity claims (conduit-only) |
| "No observability" | ✅ **FIXED** | OpenTelemetry integration, PII-safe spans |
| "legalHold informational only" | ✅ **FIXED** | `docs/NON_BLOCKING_ENFORCEMENT.md` |
| B2: XChaCha20 not FIPS | ⚠️ Not addressed | Privacy module still uses XChaCha20 |
| B3: Custom canonicalization vs JCS | ⚠️ Not addressed | Still custom canonical JSON |
| B5: Test vectors not in spec | ⚠️ Not addressed | |
| B6: Don't present synthetic reviews as validation | ⚠️ Not addressed | |
| B7: FreeTSA not qualified | ⚠️ Not addressed | |
| "Zero adoption / no production users" | ⚠️ Still true | |
| "Multi-language SDK" | ⚠️ Not addressed | |

**Net:** We fixed 7 of the top issues. 5-8 remain. Time to re-evaluate.

---

## v3 Persona Selection

### Strategy
- **Don't repeat all 13** — wasteful for personas whose concerns were fully addressed
- **Re-run the most critical** with updated context to see if verdicts shift
- **Add new angles** we haven't covered: academic peer reviewer, OSS community builder, philosopher/ethicist (deeper than v1's)
- **HOLOS-wide scope** for select reviewers — not just EXIT/Cellar Door

### Selected Personas (10 total, 3 batches)

---

## Batch 1 — NIST Re-evaluation + Academic (3 personas)

### P01r: NIST Technical Reviewer (RE-RUN)
**Why re-run:** They gave "Revise & Resubmit" and 7 specific blockers. We fixed 4 of them. Need updated verdict before March 9 submission.
**Context pack (~45K tokens):**
- `cellar-door-exit/specs/EXIT_SPEC_v1.1.md` (~26K)
- `docs/papers/NIST_RFI_v2.md` (~20K)
- `cellar-door-exit/src/signer.ts` (~2.5K) — show the FIPS fix
- `cellar-door-exit/SECURITY.md` (~3K)
- `cellar-door-exit/docs/HSM_INTEGRATION.md` (~2.5K)
- Previous P01 review for reference (~3K)

**Key question:** With P-256 signer, HSM guide, and algorithm agility — does this move from "Revise & Resubmit" to something stronger?

---

### P03r: Enterprise CISO (RE-RUN)
**Why re-run:** Gave 2.4/5. Key complaints: no FIPS, no HSM, no signer abstraction, no governance. All fixed.
**Context pack (~35K tokens):**
- `cellar-door-exit/specs/EXIT_SPEC_v1.1.md` (~26K)
- `cellar-door-exit/SECURITY.md` (~3K)
- `cellar-door-exit/docs/HSM_INTEGRATION.md` (~2.5K)
- `cellar-door-exit/GOVERNANCE.md` (~1K)
- `cellar-door-exit/docs/NON_BLOCKING_ENFORCEMENT.md` (~1K)
- Previous P03 review for reference (~3K)

**Key question:** Updated scorecard — has any category moved?

---

### P14: Academic Peer Reviewer (NEW)
**Profile:** Professor of distributed systems / applied crypto at a top CS department. Reviews for IEEE S&P, USENIX Security, ACM CCS. Evaluates formal rigor, novelty, related work coverage.
**Context pack (~35K tokens):**
- `docs/papers/EXIT_PAPER_v5.md` (~30K)
- `cellar-door-exit/src/types.ts` (~5K) — to check paper matches code

**Questions:**
1. Is this publishable at a top venue? Which one?
2. What's genuinely novel vs. assembly of known primitives?
3. Is the threat model / security analysis rigorous?
4. What related work is missing?
5. Would this pass IEEE S&P or USENIX Security peer review?

**Format:** Referee report (Accept / Weak Accept / Borderline / Weak Reject / Reject). Detailed comments per section.

---

## Batch 2 — New Angles (4 personas)

### P15: Philosopher of AI Rights / Digital Personhood (NEW)
**Profile:** Academic philosopher specializing in machine consciousness, digital ethics, and rights frameworks. Familiar with Floridi, Dennett, Bostrom, legal personhood debates.
**Context pack (~25K tokens):**
- `docs/papers/EXIT_PAPER_v5.md` — sections 1, 6, 7 only (~10K)
- `site/cellar-door/index.html` — Idealist mode section only (~8K)
- `../../LOCUS_PRIMITIVE.md` or equivalent HOLOS philosophy docs (~5K)
- `../../memory/holos-full-synthesis.md` (~5K)

**Questions:**
1. Does EXIT implicitly grant moral status to agents? Should it?
2. Is "departure as a right" philosophically defensible for non-sentient systems?
3. What's the relationship between EXIT and personhood theories?
4. Is this protocol covertly building infrastructure for AI rights while claiming it's just "tooling"?
5. What philosophical frameworks best support or critique this work?

**Format:** Philosophical analysis (2-3 pages). Not a verdict — a mapping of the conceptual terrain.

---

### P16: Open Source Community Builder / DevRel (NEW)
**Profile:** Head of DevRel at a mid-size open source company (think: Supabase, Deno, Turso scale). Builds communities from 0→10K GitHub stars. Evaluates projects for launch strategy, narrative clarity, contributor onboarding.
**Context pack (~20K tokens):**
- `cellar-door-exit/README.md` (~8K)
- `cellar-door-exit/CONTRIBUTING.md` (~2K)
- `cellar-door-exit/GOVERNANCE.md` (~1K)
- `site/cellar-door/index.html` — first 200 lines (~5K)
- `cellar-door-exit/package.json` (~2K)

**Questions:**
1. If I saw this on Show HN, would I star it? Contribute?
2. What's the 30-second elevator pitch and does the README deliver it?
3. Is the contributor onboarding clear enough for a first PR?
4. What's the launch strategy you'd recommend? (Show HN, Twitter, Discord, Reddit?)
5. What 3 things would you change before public launch?

**Format:** Launch readiness assessment. Score: Ready / Almost / Not Yet. Specific action items.

---

### P17: Regulatory Technology (RegTech) Analyst (NEW)
**Profile:** Analyst at a RegTech firm covering AI governance tooling. Writes reports for banks, insurers, and law firms evaluating compliance tech. Knows EU AI Act, DORA, SOC2, ISO 42001 inside-out.
**Context pack (~30K tokens):**
- `cellar-door-exit/specs/EXIT_SPEC_v1.1.md` (~26K)
- `cellar-door-exit/docs/NON_BLOCKING_ENFORCEMENT.md` (~1K)
- `cellar-door-exit/SECURITY.md` (~3K)

**Questions:**
1. Which regulatory frameworks does EXIT directly address?
2. What's the market size for AI agent compliance tooling?
3. How does EXIT compare to existing GRC/compliance offerings?
4. Would a bank's compliance team consider this? What's missing?
5. What's the commercialization path in regulated industries?

**Format:** Market assessment brief. TAM estimate. Competitor matrix. Recommendation: Buy / Watch / Pass.

---

### P18: Multi-Agent Systems Researcher (NEW)
**Profile:** PhD researcher working on agent-to-agent coordination, swarm intelligence, or LLM-based multi-agent systems. Published at AAMAS, NeurIPS, ICML. Evaluates protocols for practical agent interop.
**Context pack (~40K tokens):**
- `docs/papers/EXIT_PAPER_v5.md` (~30K)
- `cellar-door-exit/README.md` (~8K)
- `cellar-door-entry/ENTRY_SPEC_v1.0.md` or README (~5K)

**Questions:**
1. Does this solve a real problem in current multi-agent systems?
2. How would this integrate with existing agent frameworks (AutoGen, CrewAI, CAMEL)?
3. What are the overhead implications for agent-to-agent communication?
4. Is the "departure ceremony" concept meaningful or theatrical for software agents?
5. What's missing for this to be useful in a research context?

**Format:** Research evaluation. Would-cite / Would-not-cite verdict. Positioning relative to existing MAS literature.

---

## Batch 3 — Adversarial Re-run + Stress Test (3 personas)

### P12r: Competitor/Critic (RE-RUN)
**Why re-run:** v2 said "Threat level: Low." Now we've shipped significant improvements. Has the threat assessment changed?
**Context pack (~40K tokens):**
- `cellar-door-exit/README.md` (~8K)
- `cellar-door-exit/specs/EXIT_SPEC_v1.1.md` (~26K)
- `cellar-door-exit/src/signer.ts` (~2.5K)
- `cellar-door-exit/src/telemetry.ts` (~1.5K)
- `cellar-door-exit/src/claim-store.ts` (~2.5K)
- Previous P12 review for reference (~3K)

**Key question:** Updated threat assessment with v0.2.0 features. What's still killable?

---

### P10r: HN Commenter (RE-RUN)
**Why re-run:** v2 said "Would read spec, wouldn't star." Now we have actual features, governance, observability. Need to gauge Show HN readiness.
**Context pack (~15K tokens):**
- `cellar-door-exit/README.md` (~8K)
- `site/cellar-door/index.html` — Pragmatist mode (~5K)
- `cellar-door-exit/package.json` (~2K)

**Key question:** Updated HN comment. Would you star it now?

---

### P19: Hostile Red Team (NEW)
**Profile:** Security researcher who specializes in breaking identity protocols. Has published CVEs against OAuth, SAML, and WebAuthn implementations. Looking for exploitable flaws.
**Context pack (~35K tokens):**
- `cellar-door-exit/specs/EXIT_SPEC_v1.1.md` (~26K)
- `cellar-door-exit/src/signer.ts` (~2.5K)
- `cellar-door-exit/src/proof.ts` (~3K)
- `cellar-door-exit/src/validate.ts` (~3K)
- `cellar-door-exit/SECURITY.md` (~3K)

**Questions:**
1. Can I forge a valid EXIT marker? How?
2. Can I replay markers to impersonate another agent?
3. Can I exploit the trust enhancer conduit model?
4. What's the worst attack possible with the current architecture?
5. Is the canonicalization implementation vulnerable to confusion attacks?

**Format:** Security audit findings. CVSS-scored vulnerabilities. Exploit sketches where applicable.

---

## Execution Summary

| Batch | Personas | Total ~Tokens Input | Parallelizable |
|-------|----------|-------------------|----------------|
| 1 | P01r, P03r, P14 | ~115K | Yes (3 parallel) |
| 2 | P15, P16, P17, P18 | ~115K | Yes (4 parallel) |
| 3 | P12r, P10r, P19 | ~90K | Yes (3 parallel) |

**Total: 10 personas, 3 batches, ~320K input tokens**
**Estimated output: ~30-50K tokens across all reviews**
**Sub-agent cost estimate: ~10 Opus calls ≈ $3-5 USD**

### New vs Re-run
- **4 re-runs** (P01r, P03r, P10r, P12r) — checking if verdict shifted after fixes
- **5 new** (P14, P15, P16, P17, P18, P19) — covering gaps: academia, philosophy, community, RegTech, MAS research, red team
- **Total: 10**

### Output
- Each writes to `assessments/persona-v3/P{NN}-{slug}.md`
- Synthesis: `assessments/persona-v3/synthesis.md`

### Not Re-running (and why)
| Persona | Why Skip |
|---------|----------|
| P02 (NIST Policy) | Will shift with P01r; same context |
| P04 (Senior Dev) | Main complaints (DX) weren't what we fixed |
| P05 (Agent Dev) | LangChain integration unchanged |
| P06 (Vercel Dev) | Vercel integration unchanged |
| P07 (Platform Ops) | Claim store addresses main complaint; P17 covers the gap differently |
| P08 (Compliance) | P17 (RegTech) covers this angle with fresh eyes |
| P09 (Journalist) | P16 (DevRel) covers launch readiness better |
| P11 (AI Agent) | Fundamental agent key storage issue unchanged |
| P13 (OSS Maintainer) | P16 (Community Builder) covers this with more specificity |
