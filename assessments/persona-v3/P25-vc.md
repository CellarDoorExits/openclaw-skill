# P25 — Deep Tech VC Investment Memo

**Project:** Cellar Door / Passage Protocol
**Evaluator Persona:** Deep Tech Venture Capitalist (Infrastructure, Protocols, Developer Tools)
**Date:** 2026-02-25

---

## Verdict: INTERESTED — Would Not Lead at This Stage

---

## 1. Is This Fundable? At What Stage and Valuation?

**Yes, fundable — at pre-seed.** Valuation range: $3–6M cap on a SAFE.

What I see: a well-specified protocol with a working reference implementation (5 npm packages, 399 tests, framework integrations), an academic paper that would hold up at a systems conference, and a clearly identified gap in the agent infrastructure stack. This is the profile of a technically strong pre-seed — real code, real spec, no users.

What's missing for seed ($8–15M): any evidence of adoption. Zero production deployments. No platform has issued or consumed an EXIT marker in anger. The paper explicitly acknowledges this. The protocol requires network effects to be valuable — both sides of the market (origins and destinations) need to participate. That's a classic chicken-and-egg cold start problem, and I see no go-to-market strategy articulated anywhere.

At $3–6M I'm buying the thesis, the spec quality, and optionality on market timing. At seed valuation I need at least one integration partner with live traffic.

## 2. Market Timing — Too Early, Too Late, or Just Right?

**12–18 months early. Which might be exactly right.**

The agentic AI market is real and accelerating. A2A (Google), MCP (Anthropic), AP2 (Google), OASF (Cisco), NIST's AI Agent Standards Initiative (Feb 2026) — the ecosystem layers are stacking. But agent *mobility* isn't yet a felt pain. Agents aren't leaving platforms en masse. Platform lock-in for agents hasn't become a talking point outside research circles.

However: this is how infrastructure protocols get built. TCP/IP wasn't built in response to user demand — it was built by people who saw the structural need before the pain was acute. The NIST initiative signals that the standardization window is opening. Being early with a clean spec and reference implementation is how you become the default when the need crystallizes.

The risk: the need may crystallize differently. Agent identity might get absorbed into a broader framework (W3C VC extensions, AAIF working group, or a de facto standard from a major cloud provider). The 12-month window between "interesting paper" and "everyone needs this" is when the project either gets traction or gets scooped.

Comparable timing: Hashicorp's Vault launched when "secrets management" wasn't a category. Cloudflare Workers launched when edge compute was academic. Both were ~18 months early, which turned out to be exactly right.

## 3. Competitive Moat

**Moderate moat today. Fragile without adoption.**

**What constitutes the moat:**
- **Specification depth.** This isn't a blog post — it's a 660-line paper with formal threat models, mechanism design analysis, game-theoretic grounding, and 15-persona validation. Replicating the *thinking* takes months, not days.
- **Implementation completeness.** 399 tests, 5 packages, integrations with LangChain/Vercel AI SDK/MCP. This is 6+ months of focused engineering.
- **Standards positioning.** NIST RFI response submitted. W3C DID alignment. FIPA lifecycle extension. The project is planted in the standards landscape, not floating outside it.
- **Naming and framing.** "Passage Protocol," "Proof of Passage," the EXIT/ENTRY symmetry, the Hirschman theoretical grounding — this is unusually well-branded for a protocol project.

**What's fragile:**
- Apache 2.0 means anyone can fork it. A larger player (Anthropic, Google, Microsoft) could adopt the spec, fork the implementation, and ship it as part of their stack. The spec becomes the standard; the company becomes a footnote.
- No network effects yet. The moat from adoption (everyone's EXIT markers reference your spec) doesn't exist because adoption is zero.
- The protocol is *infrastructure* — it's meant to be embedded, not sold. Monetization path is unclear.

**Can a bigger player copy this?** Yes, technically. But big players are more likely to adopt/endorse it than rebuild from scratch — IF the project achieves even modest traction before they notice. The Apache license is actually strategic here: it makes adoption frictionless for enterprises, which can accelerate standardization. The playbook is "become the standard, then monetize the enterprise layer" (cf. Hashicorp, Docker, Terraform).

## 4. Team Risk

**High risk. Not disqualifying, but needs mitigation.**

Solo founder + AI agent co-developer is... unprecedented. The output quality is remarkable — the paper reads like it was written by a senior distributed systems researcher, the implementation is production-grade, and the spec coverage is thorough. If this were a 3-person team from MIT I'd be writing a bigger check.

**Red flags:**
- Bus factor of 1. If the founder burns out, gets sick, or pivots — the project dies.
- No go-to-market person. The materials are all technical. Who's doing BD with platform operators? Who's presenting at AAIF working groups?
- The AI co-developer can't attend meetings, negotiate partnerships, or build relationships at standards bodies.

**Unique advantages:**
- Velocity. This is 12+ person-months of output from one human. The leverage is real.
- The founder clearly understands mechanism design, cryptography, game theory, distributed systems, AND developer experience. That's an unusual combination.
- The AI-assisted development model is itself a thesis on the future of software creation. Meta-alignment with the project's subject matter.

**What I'd need:** Commitment to hire a co-founder or senior hire focused on ecosystem/BD within 6 months of funding. The technical work is done well enough — the gap is entirely on the adoption side.

## 5. Comparable Exits in Adjacent Spaces

| Company | Space | Exit | Relevance |
|---------|-------|------|-----------|
| **Hashicorp** | Infrastructure (secrets, provisioning) | IPO 2021 ($14.2B), acquired by IBM 2024 ($6.4B) | Protocol → open source → enterprise. Direct playbook analog. |
| **Auth0** | Identity/auth | Acquired by Okta, 2021 ($6.5B) | Identity infrastructure for developers. EXIT is identity infrastructure for agents. |
| **Cloudflare** | Edge infrastructure | IPO 2019, ~$25B market cap | Infrastructure protocol company that became the default by being early and open. |
| **Protocol Labs** | Decentralized protocols (IPFS, Filecoin) | $257M raised, Filecoin $70M ICO | Protocol-first, implementation-second. Similar approach to spec-driven development. |
| **Spruce Systems** | DID/SSI tooling | Series A ($34M, a16z, 2022) | Closest technical analog — DID infrastructure for enterprises. |
| **Magic Labs** | Auth/identity (Web3) | Series A ($27M, 2020) | Developer-friendly identity primitives. |
| **Temporal** | Workflow orchestration | Series B ($103M, 2023) | Open-source infrastructure protocol that became enterprise standard. |

The exit pattern for protocol/infra companies is consistent: open source → adoption → enterprise features → acquisition or IPO. Typical timeline: 5–8 years. Typical acquirers for this space: Microsoft (identity portfolio), Okta/Auth0, Salesforce (agent platform), or one of the cloud hyperscalers building agent ecosystems.

## 6. What Would Make Me Write a Check?

**Three things, in order of importance:**

### Must-haves for pre-seed ($500K–$1M on $4M cap SAFE):
1. **One signed LOI or integration commitment** from a platform that would issue or consume EXIT markers. Doesn't need to be Google — an agent hosting startup, a DAO platform, even an open-source agent framework maintainer saying "we'll ship this."
2. **Founder commits to full-time.** This can't be a side project.
3. **Hire plan for a BD/ecosystem co-founder** within 6 months.

### Would-make-me-lead at seed ($2–3M on $10M cap):
1. **3+ platforms actively issuing/consuming markers** in production (even beta).
2. **AAIF or W3C working group engagement** — either a formal submission or active participation in an agent identity workstream.
3. **One enterprise pilot** (doesn't need revenue — just a Fortune 500 or major tech company testing the protocol internally).
4. **Second senior hire** on board (BD, developer relations, or protocol engineering).

---

## Terms I'd Want

- **Pre-seed SAFE**, $4M cap, MFN, with pro-rata rights.
- **Information rights** — monthly updates on adoption metrics (integrations, markers issued, developer signups).
- **Board observer seat** (not board seat — too early for governance overhead).
- **Anti-dilution:** Standard. Not worried at this stage.
- **IP assignment:** Confirm all IP (spec + implementation) is assigned to the company, not held personally. Apache 2.0 is fine — that's the strategy — but the company needs to own the canonical implementation and brand.

---

## Milestones to Hit (12-Month Plan)

| Month | Milestone | Why It Matters |
|-------|-----------|----------------|
| 0–3 | First integration partner live (even staging) | Proves someone else cares |
| 0–3 | Submit to AAIF or W3C working group | Standards legitimacy |
| 3–6 | Hire BD/ecosystem co-founder | Addresses team risk |
| 3–6 | 100 EXIT markers issued in production | Minimal network bootstrap |
| 6–9 | Enterprise pilot (internal agent mobility) | Enterprise signal for seed |
| 6–9 | Second framework integration (beyond LangChain/Vercel/MCP) | Broadens ecosystem |
| 9–12 | 3+ platforms with bidirectional Passage (EXIT + ENTRY) | Network effect ignition |
| 9–12 | Seed round closed | Fund the next phase |

---

## Risk Matrix

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Bigger player builds competing standard | High | Medium | Race to adoption; standards body engagement |
| Agent mobility never becomes a pain point | High | Low | Broader thesis on agent identity; pivot to IP provenance |
| Solo founder burnout | High | Medium | Co-founder hire mandate |
| Self-attestation problem limits utility | Medium | High | Roadmap to staked attestation and ZK disclosure |
| GDPR/legal blockers | Medium | Medium | Data protection counsel; functional erasure testing |
| Cold start / chicken-and-egg | High | High | Target one vertical deeply; agent-native platforms first |

---

## Bottom Line

This is the best-specified, most thoroughly thought-through protocol project I've seen at this stage. The intellectual depth is unusual — grounding in Hirschman, Akerlof, Spence, and Ostrom isn't decoration; it's structural to the design. The implementation is production-grade for a pre-seed. The market timing is early but defensible.

The project's weakness is entirely on the adoption axis. No users, no partners, no GTM, solo team. That's normal for a pre-seed protocol project — but it means the *next* 6 months matter more than the *last* 6 months. The spec is done. The code works. Now the question is: can the founder build an ecosystem?

I'd write a check at pre-seed to find out. I would not lead until I see evidence that someone besides the founder wants this to exist.

**Decision: INTERESTED. Would participate in a pre-seed round, not lead. Would revisit for seed lead with adoption milestones.**

---

*Assessed by: Deep Tech VC Persona (P25)*
*Fund profile: Infrastructure, protocols, developer tools*
*Comparable portfolio: Hashicorp, Cloudflare, Protocol Labs*
