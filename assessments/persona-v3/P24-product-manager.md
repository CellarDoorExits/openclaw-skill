# P24 — B2B SaaS Product Manager Assessment

**Product:** Cellar Door / EXIT.protocol (Passage Protocol)
**Date:** 2026-02-25
**Assessor Lens:** B2B SaaS Product Management — developer tools, pricing, GTM, product-market fit

---

## Product Brief

EXIT is a cryptographic primitive that generates portable, verifiable departure records for AI agents moving between platforms. Companion ENTRY protocol handles arrival. Together they form "Passage" — a Proof of Passage chain for agent mobility.

**What it actually is:** An npm library (~12KB) that signs a ~660-byte JSON-LD blob when an agent leaves a platform. Offline-verifiable, non-custodial, DID-based.

**What it wants to be:** The "vehicle history report" for AI agents — the trust infrastructure layer that makes agent mobility possible across the emerging multi-platform agent economy.

---

## 1. Who Is the Customer?

### Customer Segments (Ranked by Priority)

**Tier 1: Platform Operators (Agent Hosting / Orchestration)**
- Companies running multi-tenant agent platforms (think: agent marketplaces, orchestration layers, agent-as-a-service providers)
- **Why first:** They have the integration surface (agents leave their platform), the pain (no way to evaluate inbound agents), and they control the chokepoint. If platforms adopt EXIT, agents get markers automatically.
- **Examples:** Hypothetical equivalents of Vercel for agents, managed LangChain hosting, enterprise agent orchestration platforms.
- **Buyer:** VP Engineering / Head of Platform

**Tier 2: Enterprise AI/ML Teams**
- Large orgs deploying agents across internal platforms and vendor ecosystems
- **Why second:** Compliance and audit trail requirements (ISO 42001, NIST AI RMF, EU AI Act) create a regulatory pull. They need agent lifecycle governance artifacts.
- **Buyer:** CISO / Head of AI Governance / Compliance

**Tier 3: Agent Framework Developers**
- Teams building on LangChain, Vercel AI SDK, CrewAI, AutoGen, etc.
- **Why third:** They're the distribution channel, not the buyer. Framework integrations (already built for LangChain, Vercel AI SDK, MCP) make EXIT available to their users. Framework maintainers adopt if their users demand it.
- **Buyer:** Framework maintainers / OSS community adoption

**Tier 4: Agent Developers (Individual)**
- Developers building autonomous agents who want portable reputation
- **Why last:** They don't pay. They're the end-user beneficiary, not the economic buyer. They create bottom-up demand but won't drive revenue.

**Not a customer (yet):** DAOs, insurers, agent marketplaces. These are future ecosystem participants once critical mass exists. Don't sell to them now.

---

## 2. Pricing Model Recommendation

### Recommended: Open Core + Hosted Services

**Open source (Apache 2.0) — keep it:**
- Core EXIT/ENTRY libraries (marker creation, signing, verification)
- CLI tools
- Framework integrations (LangChain, Vercel AI SDK, MCP)
- This is correct. The primitive must be free and open to achieve protocol adoption. You're selling the network, not the library.

**Commercial layer — build this:**

| Tier | Name | Price | What's Included |
|------|------|-------|-----------------|
| Free | Community | $0 | OSS libraries, self-hosted everything |
| Paid | Pro | $99–499/mo | Managed TSA timestamping, hosted claim store, dashboard, webhook integrations, SLA |
| Enterprise | Enterprise | Custom ($2K–10K/mo) | FIPS 140-2/3 compliance (P-256 signer), HSM/KMS integration support, SSO, audit log exports, dedicated TSA endpoint, SLA with uptime guarantees, custom admission policies |

**Usage-based component:** Charge per verified Passage (EXIT→ENTRY chain verification via hosted API). $0.001–0.01 per verification. This aligns revenue with ecosystem activity.

**Why not pure usage-based:** The market is too early. Usage-based requires volume. You need platform contracts first.

**Why not enterprise-only:** The protocol needs grassroots adoption to create network effects. Open core is the only model that achieves both adoption and revenue.

---

## 3. Product-Market Fit Assessment

### Verdict: Early-stage fit exists, but it's conditional.

**The signal that fit exists:**
- The problem is real and will get worse. As the agent ecosystem matures (A2A, MCP, AP2 all gaining traction), agent mobility will become a first-class concern. NIST's AI Agent Standards Initiative (Feb 2026) explicitly identified agent authentication and lifecycle governance as priorities.
- The multi-lens validation (15 personas, unanimous core endorsement) is a strong qualitative signal.
- 399 passing tests, 5 npm packages, framework integrations — this is not vaporware.

**The signal that fit is conditional:**
- **No production deployment.** Zero real-world usage. All validation is synthetic.
- **Demand is latent, not active.** Nobody is googling "agent departure protocol" yet. The market needs to be educated.
- **The chicken-and-egg problem is severe.** EXIT markers are worthless if no destination verifies them. ENTRY is worthless if no origin produces markers. You need both sides simultaneously.
- **Self-attestation undermines the value prop.** The paper acknowledges this candidly — self-attested `good_standing` is cheap talk. Until mutual attestation or third-party verification is common, the markers carry limited trust signal.

**PMF score: 5/10 — Solution with a real problem, but the market hasn't felt the pain yet.**

The question isn't "is this needed?" — it's "is it needed *now*?" The answer is: not quite, but the window is opening. The agent ecosystem is ~12–18 months from needing this badly.

---

## 4. GTM Playbook

### Phase 1: Developer Adoption (Months 1–6)
- **Goal:** 50 GitHub stars, 500 npm downloads/week, 3 blog posts on agent portability
- **Actions:**
  - Publish to npm (already done)
  - Write "Why your agent platform needs departure records" thought leadership
  - Submit to NIST AI Agent Standards Initiative as a reference implementation
  - Conference talks: AI Engineer Summit, LangChain community calls
  - Build a playground/demo site where people can create and verify markers in-browser
- **Sell to:** Nobody. Build awareness.

### Phase 2: Design Partners (Months 6–12)
- **Goal:** 3–5 platform operators integrating EXIT in staging/production
- **Actions:**
  - Identify 5 agent platform companies with >1000 active agents
  - Offer free integration support + co-marketing
  - Build the hosted verification API (commercial layer)
  - Publish case studies from design partners
- **Sell to:** VP Eng at agent platforms. Pitch: "Your agents carry proof of their history. Your competitors' don't."

### Phase 3: Enterprise Compliance (Months 12–18)
- **Goal:** 2–3 enterprise contracts, $50K+ ARR
- **Actions:**
  - Map EXIT markers to ISO 42001 / NIST AI RMF compliance requirements
  - Build compliance reporting dashboard
  - Partner with AI governance consulting firms
  - FIPS 140-2/3 certification for the P-256 signer path
- **Sell to:** CISO / AI Governance leads at F500 companies deploying agents at scale

### Phase 4: Ecosystem (Months 18+)
- **Goal:** EXIT becomes the default departure record format
- **Actions:**
  - Push for AAIF or NIST standardization
  - Build marketplace for trust attestation providers
  - Launch agent "credit bureau" concept (hosted Passage history)

### First Sale Target
**Agent platform operators** — specifically, companies building agent marketplaces or multi-tenant hosting. They have the pain (evaluating inbound agents), the integration surface (agents leave/arrive), and the budget.

---

## 5. Competitive Moat

### Current moats (weak to moderate):
1. **First-mover on departure semantics.** Nobody else has formalized this. The paper is thorough, the spec is rigorous, the implementation is real. But first-mover in a nascent market is a thin moat.
2. **Specification depth.** The ceremony state machine, 8 exit types, 6 optional modules, trust mechanisms — this is hard to replicate quickly. A competitor would need 6+ months to reach parity.
3. **Framework integrations.** LangChain, Vercel AI SDK, MCP server already built. Distribution channels are prepped.
4. **Academic rigor.** The paper (mechanism design, game theory, legal analysis) gives credibility that a quick competitor can't fake.

### Moats that don't exist yet:
- **Network effects.** Zero. The protocol has no users. This is the most important moat to build and it doesn't exist.
- **Data moat.** No Passage histories exist. Once they do, the hosted verification service becomes defensible.
- **Standard-body adoption.** Not yet endorsed by NIST, AAIF, or any standards body.

### Moat strategy:
Get to network effects as fast as possible. Every platform that integrates EXIT makes the protocol more valuable for every other platform. The moat is the network, not the code.

---

## 6. What to Cut for v1 Ship

The spec is overengineered for a v1 product. Here's what to cut:

### Cut entirely (ship without):
- **Module D (Economic)** — Asset manifests and exit fees. Securities law risk, premature complexity. Add in v2 when real demand exists.
- **Module F (Cross-Domain Anchoring)** — On-chain anchoring. GDPR tension, blockchain complexity, niche demand. Cut.
- **Git ledger anchoring** — Append-only git branch is clever but operationally complex and not tamper-proof. TSA is sufficient for v1.
- **Visual hash doors** — Cute, great for marketing, but zero production value. Keep the code, cut from the critical path.
- **ZK selective disclosure** — Already marked as "planned." Keep it planned. Don't even mention it in v1 marketing.
- **Dead-man switch / checkpoint patterns** — Interesting but edge-case. Ship the core ceremony first.
- **Confidence scoring / tenure weighting** — Premature optimization of trust. Ship with binary verified/not-verified. Add nuance when you have real data.

### Simplify:
- **Exit types: reduce from 8 to 4** for v1. Ship `voluntary`, `forced`, `emergency`, `platform_shutdown`. The others (`directed`, `constructive`, `acquisition`, `keyCompromise`) are edge cases. Add them in v1.1.
- **Ceremony paths: ship 2 of 3.** Cut the full cooperative path for v1. Ship unilateral and emergency. Cooperative requires both parties to integrate — that's a Phase 2 feature.
- **Modules: ship A (Lineage) and E (Metadata) only.** Lineage is the core value (identity continuity). Metadata is low-cost high-value (human-readable reason). Cut B, C, D, F.

### v1 ship scope:
- Core marker creation + signing + verification
- 4 exit types, 2 ceremony paths
- Modules A + E only
- CLI (`exit keygen`, `create`, `verify`)
- `quickExit()` / `quickVerify()` convenience API
- ENTRY protocol (basic: arrival markers + 1 admission policy)
- npm package, Apache 2.0
- One framework integration (MCP — highest leverage for agent ecosystem)

**Estimated reduction:** ~40% less code surface, ~60% less spec surface, ships 2–3 months faster.

---

## Ship / Pivot / Kill Verdict

### **SHIP** — with conditions.

**Why ship:**
- The problem is real and the timing window is opening
- The implementation is genuinely impressive for pre-revenue
- The spec rigor creates defensibility
- The agent ecosystem is moving fast enough that being 12 months early is better than 6 months late
- Open-core model means shipping doesn't require revenue — it requires adoption

**Conditions:**
1. **Cut scope aggressively** (see above). The current spec is an academic achievement, not a product. Ship the minimum viable protocol.
2. **Get 1 production integration within 6 months** or seriously evaluate pivot. Synthetic validation is not product-market fit.
3. **Stop writing papers, start writing docs.** The 15-persona validation, the game theory, the mechanism design — it's impressive and it's done. Now write a 5-minute quickstart, a "Why EXIT?" blog post, and a Loom video.
4. **Hire (or become) a developer advocate.** This product sells bottom-up through developer adoption. It needs someone in the community full-time.
5. **Name the company, not just the protocol.** "Cellar Door" is poetic but confusing as a B2B brand. Consider whether the company name should be more descriptive for enterprise buyers.

**Risk if you don't ship:** Someone at Google, Anthropic, or Microsoft ships a proprietary agent lifecycle management system that becomes the de facto standard. You lose the standards battle not because your solution is worse, but because you were still polishing the spec while they shipped the product.

**The clock is ticking. Ship the MVP. Get production users. Iterate from real data.**
