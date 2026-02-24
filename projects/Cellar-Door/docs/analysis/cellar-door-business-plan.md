# Cellar Door EXIT Protocol — Business Plan & Strategic Analysis

**Date:** 2026-02-22  
**Prepared by:** Hawthorn  
**For:** Warren (founder)  
**Budget context:** ~$12K available, solo founder, senior programmer, not a business person  
**Design constraint:** Semi-zero-human company — minimal ongoing human labor

---

## 1. Executive Summary

EXIT is a portable, cryptographically signed departure record for AI agents — a ~335-byte JSON document that proves an agent left a platform, when, why, and in what standing. Think Carfax for AI agents, or a termination record for the machine economy.

**Why it matters commercially:** AI agent markets cannot function without transaction documentation. No CFO signs off on deploying agents with undocumented histories. No insurer underwrites agent operations without lifecycle data. No regulator accepts "we didn't know." EXIT is the documentation layer that makes agent markets possible — the SMTP of agent portability.

**Current state:** Reference implementation complete (TypeScript, 30 source files, 291 tests), formal spec locked (v1), W3C VC wrapper, CLI, three pitch documents, two legal red team reviews, competitive landscape analysis showing zero direct competitors. The protocol is built. The business isn't.

**The opportunity:** NIST launched its AI Agent Standards Initiative five days ago (Feb 17, 2026). The RFI closes March 9. The agent protocol stack (A2A, MCP, AP2) covers communication, tools, and payments — nobody covers departure/portability. EXIT is a category of one in a market that's about to be shaped by federal standards.

**The constraint:** $12K budget, solo founder, sovereignty-focused philosophy. This plan is designed for that reality — not for a VC-backed sprint, but for a protocol that grows through adoption, not spending.

---

## 2. Market Assessment

### Tier 1: Agent Frameworks (High strategic value, medium integration difficulty)

**LangChain / LangGraph**
- What: Most popular agent development framework. Massive developer community. LangSmith provides observability.
- Why they need EXIT: Agents built with LangChain get deployed across platforms. No standard way to document when an agent is decommissioned or migrated. LangSmith traces stop at the platform boundary — EXIT extends the audit trail across platforms.
- Integration: Middleware/callback hook. LangChain's extensibility model makes this straightforward — a `CallbackHandler` that emits EXIT markers on agent shutdown. ~1 week to build plugin.
- Strategic value: **Very high.** LangChain adoption would give EXIT instant developer legitimacy. Their ecosystem is the distribution channel.

**CrewAI**
- What: Multi-agent orchestration framework. Agents have roles, goals, backstories.
- Why they need EXIT: CrewAI agents are explicitly designed as team members. When a crew member is replaced, there's no record of the transition. EXIT documents agent rotation within crews.
- Integration: Hook into crew lifecycle events. CrewAI's agent model maps cleanly to EXIT's subject concept. ~1 week.
- Strategic value: **High.** Multi-agent systems have the most departure events — every crew reconfiguration is a potential EXIT marker.

**AutoGPT / AgentGPT**
- What: Autonomous agent frameworks. Agents set their own goals and execute.
- Why they need EXIT: Autonomous agents are the strongest case for EXIT — they operate with minimal human oversight, making audit trails critical. If an AutoGPT agent accumulates context over days and is then shut down, that context is lost without EXIT.
- Integration: Plugin architecture. ~1 week.
- Strategic value: **Medium-high.** Smaller user base than LangChain but philosophically aligned — autonomous agents need self-sovereign documentation.

**Microsoft AutoGen**
- What: Microsoft's multi-agent conversation framework. Enterprise-backed.
- Why they need EXIT: Enterprise deployments need compliance documentation. AutoGen agents in production need lifecycle audit trails for SOC 2 / ISO 27001.
- Integration: AutoGen has an event system. Middleware integration feasible. ~1-2 weeks.
- Strategic value: **High.** Microsoft enterprise credibility. But Microsoft could also build their own (Entra Agent ID already exists). Integration here is partly defensive — be inside before they build around you.

### Tier 2: Cloud Platform Agent Services (Highest revenue potential, higher integration difficulty)

**Google Vertex AI Agents**
- What: Google's managed agent platform. Integrated with Gemini models.
- Why they need EXIT: Multi-cloud enterprise customers need portable agent documentation. Vertex lock-in is a sales objection — EXIT markers mitigate it.
- Integration: Vertex has custom tooling hooks but is relatively closed. Would likely need a partnership or API-level integration. ~2-4 weeks.
- Strategic value: **Very high.** Google's AP2 (Agent Payments Protocol) already uses verifiable credentials for agent authority. EXIT as an AP2-adjacent credential is a natural fit.

**AWS Bedrock Agents**
- What: AWS's managed agent service. Largest cloud market share.
- Why they need EXIT: Same multi-cloud portability argument. AWS customers deploying Bedrock agents who later want to migrate to Azure or GCP need departure documentation.
- Integration: Lambda-based. AWS's extension model is well-documented. ~2 weeks.
- Strategic value: **Very high.** AWS market share = distribution.

**Salesforce AgentForce**
- What: Salesforce's autonomous AI agents for CRM workflows. Enterprise-scale deployment.
- Why they need EXIT: Salesforce customers are enterprise buyers who care about compliance, audit trails, and vendor portability. AgentForce agents handling customer data need lifecycle documentation for data governance.
- Integration: Salesforce's platform is notoriously closed. Would need ISV partnership or AppExchange listing. ~4-8 weeks.
- Strategic value: **Very high for revenue.** Salesforce enterprises pay for compliance tooling. This is where consulting revenue lives.

**ServiceNow**
- What: Enterprise workflow automation, increasingly agent-driven.
- Why they need EXIT: IT service management agents handling tickets, incidents, and changes need auditable lifecycle records. ServiceNow's compliance-heavy customer base demands this.
- Integration: ServiceNow has an app marketplace and API framework. ~2-4 weeks.
- Strategic value: **High.** ITSM is a natural fit — service transitions are literally what EXIT documents.

### Tier 3: Crypto/DeFi Agent Platforms (Highest philosophical alignment, variable integration)

**Virtuals Protocol**
- What: Tokenized AI agent platform on Base. Agents have on-chain identities and economic lives.
- Why they need EXIT: Agents on Virtuals are economic entities with token holdings. When an agent is deprecated or migrated, its economic history needs documentation. EXIT's Module D (asset manifest) maps directly.
- Integration: On-chain hooks. EXIT's chain anchoring module was designed for this. ~1-2 weeks.
- Strategic value: **High.** Crypto-native platforms are the earliest adopters of agent-as-entity thinking. Cultural fit is strong.

**ai16z / ElizaOS**
- What: AI agent framework with crypto-native identity. DAO-governed development.
- Why they need EXIT: ElizaOS agents operate across platforms with persistent identities. EXIT provides the departure ceremony that their identity model lacks.
- Integration: Plugin architecture. ~1 week.
- Strategic value: **High.** ai16z's community is exactly the audience that cares about agent sovereignty.

**SIGIL**
- What: Agent identity and reputation protocol.
- Why they need EXIT: SIGIL handles identity; EXIT handles departure. They're complementary layers. SIGIL tells you who an agent is; EXIT tells you where it's been.
- Integration: Protocol-level integration. EXIT markers could reference SIGIL identities. ~2 weeks.
- Strategic value: **Very high.** Partnership, not competition. SIGIL + EXIT = portable agent identity + portable agent history.

**Major DAOs using AI agents** (MakerDAO, Aave, Uniswap governance agents)
- What: DAOs increasingly use AI agents for governance analysis, treasury management, community moderation.
- Why they need EXIT: DAO governance requires transparency. When a governance agent is replaced, the DAO needs verifiable documentation of the transition. Smart contract-verifiable EXIT markers enable on-chain governance of agent transitions.
- Integration: Varies by DAO tooling. ~2-4 weeks per integration.
- Strategic value: **Medium-high.** DAOs are early adopters but small markets individually. Aggregate value is in the narrative.

### Tier 4: Enterprise Agent Orchestrators (Longest sales cycle, highest per-deal revenue)

**IBM watsonx / BeeAI**
- What: Enterprise AI platform. BeeAI's ACP protocol is now under Linux Foundation.
- Why they need EXIT: IBM sells to regulated industries (banking, healthcare). Agent lifecycle documentation is a compliance requirement, not a feature request.
- Integration: ACP integration. IBM's open-source commitment makes this feasible. ~2-4 weeks.
- Strategic value: **High.** IBM's regulated-industry customer base is where EXIT becomes a procurement checkbox.

**Cisco agntcy**
- What: "Internet of Agents" framework. Has identity, discovery, observability.
- Why they need EXIT: agntcy has agent identity but not agent departure. EXIT is the missing piece.
- Integration: Native integration — agntcy already uses A2A and has identity primitives. ~1-2 weeks.
- Strategic value: **Very high.** Closest adjacent player. Partner or competitor — better to partner early.

---

## 3. Revenue Models

### Model A: Pure Open Source (Donation/Sponsorship)
- **How:** Apache 2.0 everything. GitHub Sponsors, Open Collective, corporate sponsors.
- **Pros:** Maximum adoption. No friction. Aligns with sovereignty philosophy. Zero sales labor.
- **Cons:** Revenue is unreliable ($0-5K/year realistically). Cannot fund legal work. Depends on goodwill.
- **Timing:** Now. This is the default. Keep it as the base layer regardless of other models.
- **Semi-zero-human fit:** ★★★★★ — literally zero human labor for revenue collection.

### Model B: Open Core (Free core + paid enterprise features)
- **How:** Core EXIT protocol is free. Enterprise features (compliance reporting dashboards, multi-tenant verification, audit trail exports, SLA tooling) are paid.
- **Pros:** Proven model (GitLab, Elastic, HashiCorp). Aligns adoption incentives. Core stays free.
- **Cons:** Requires building enterprise features (months of work). Requires sales motion for enterprise buyers. "Open core" has gotten a bad reputation (HashiCorp BSL drama).
- **Timing:** Phase 3+ (after first enterprise customers show demand). Don't build features speculatively.
- **Semi-zero-human fit:** ★★★☆☆ — enterprise sales requires human touchpoints. Could be minimized with self-serve.

### Model C: Consulting/Integration Services
- **How:** Charge platforms $5K-50K to integrate EXIT. Warren does the initial integrations, documents patterns, then EXIT becomes self-serve.
- **Pros:** Immediate revenue. Builds relationships. Creates case studies. Teaches you what enterprises actually need.
- **Cons:** Doesn't scale. Directly requires Warren's time. Classic consulting trap — trades time for money.
- **Timing:** Phase 2 (once the package is published and there's a website). Offer free integrations to first 3-5 platforms, then charge.
- **Semi-zero-human fit:** ★★☆☆☆ — this IS human labor. Use it as bridge revenue, not a destination. Aim for 5-10 paid integrations then stop.

### Model D: Certification Program
- **How:** "EXIT Certified" badge for platforms that correctly implement the protocol. Annual fee ($1K-5K). Automated verification tests + manual review.
- **Pros:** Recurring revenue. Creates ecosystem incentive. Brand-building. Can be mostly automated.
- **Cons:** Requires adoption first (chicken-and-egg). Certification is only valuable if EXIT matters. Risk of being seen as a shakedown.
- **Timing:** Phase 3+ (after 20+ platform integrations). Premature before that.
- **Semi-zero-human fit:** ★★★★☆ — automated test suite does most of the work. Manual review can be minimal.

### Model E: SaaS Hosted Verification
- **How:** `verify.cellar-door.org` — upload an EXIT marker, get a verification report. Free tier (10/month) + paid tier ($50-500/month for API access).
- **Pros:** Recurring SaaS revenue. Self-serve. Natural extension of the protocol. Solves the "I don't want to run verification myself" problem.
- **Cons:** Creates a centralization point (contradicts sovereignty philosophy). Hosting costs. Must compete with self-hosting (the protocol is designed for offline verification).
- **Timing:** Phase 2-3. Easy to build. Low risk.
- **Semi-zero-human fit:** ★★★★★ — fully automated. Zero human labor after launch.

### Model F: Protocol Licensing
- **How:** Dual license. Apache 2.0 for open use, commercial license for proprietary extensions or embedding without attribution.
- **Pros:** Revenue from companies that want to embed EXIT in proprietary products without Apache 2.0 obligations.
- **Cons:** Apache 2.0 is already very permissive — few companies need a commercial license. Dual licensing creates community suspicion.
- **Timing:** Only if a specific company asks. Don't proactively offer it.
- **Semi-zero-human fit:** ★★★★★ — one-time negotiation per licensee.

### **Recommended Revenue Stack:**
1. **Now:** Pure open source (Model A). Focus on adoption.
2. **Phase 2:** Consulting for first 5-10 integrations (Model C) + SaaS verification (Model E). Target: $50-100K bridge revenue.
3. **Phase 3:** Open core enterprise features (Model B) + certification (Model D). Target: $200K+/year recurring.
4. **Never prioritize:** Protocol licensing (Model F). Let it happen organically.

---

## 4. Entity Strategy

### Option 1: HOLOS LLC umbrella (Cellar Door as a project within HOLOS)
- **Pros:** One entity, one bank account, one tax return. Simplest overhead. Warren already has HOLOS context.
- **Cons:** No liability isolation — a Cellar Door lawsuit hits everything under HOLOS. Confuses branding. Investors/partners want to fund Cellar Door, not a holding company. IP ownership is muddy.
- **When it works:** If Cellar Door stays a side project and never takes external money.

### Option 2: Dedicated Cellar Door LLC
- **Pros:** Clean branding. Liability isolation. Clear IP ownership. Ready for external funding. Can have its own bank account, contracts, insurance.
- **Cons:** $500 filing + $300/year registered agent + $300/year Delaware franchise tax. Separate tax return. Administrative overhead for a solo founder.
- **When it works:** If Cellar Door takes external money, signs contracts, or has users who could sue.

### Option 3: Both (HOLOS LLC + Cellar Door LLC as subsidiary or sibling)
- **Pros:** Maximum liability isolation. HOLOS can hold IP and license it to Cellar Door operating entity. Clean structure for future fundraising.
- **Cons:** Double the overhead. Unnecessary at current scale.
- **When it works:** If Cellar Door raises >$100K or has >$50K/year revenue.

### **Recommendation: Option 2 — Dedicated Cellar Door LLC**

File a single-member Delaware LLC. Total cost ~$800 upfront, ~$600/year ongoing. Do it before npm publish because:
- The npm package needs a legal entity behind it
- Insurance needs an entity
- The trademark needs an entity to hold it
- If anyone uses EXIT and something goes wrong, you want the LLC shield

**Steps to file:**
1. Choose registered agent (Northwest Registered Agent: $125/year, includes filing) — 30 minutes
2. File Certificate of Formation with Delaware Division of Corporations — $90 state fee, 1-2 weeks processing (or $100 for 24-hour expedited)
3. Get EIN from IRS — free, 15 minutes online
4. Draft single-member operating agreement — template is fine, 1 hour
5. Open business bank account — 1 hour at bank or online (Mercury, Relay)
6. Total: ~$500 upfront, 2-3 hours of Warren's time, 1-2 weeks processing

**When to add HOLOS umbrella:** Only if you launch a second product that needs its own entity. Don't pre-build corporate structure you don't need.

---

## 5. Legal Spend Prioritization

**Principle: Spend legal dollars at traction triggers, not upfront.**

### Spend Now (~$6K total)
| Item | Cost | Why now |
|------|------|---------|
| Delaware LLC formation | $500 | Blocks everything else |
| Tech E&O insurance | $3-5K/year | Required before external deployment. Get quotes from Embroker or Vouch (tech-focused, fast) |
| Defensive trademark (TEAS Plus) | $250/class | File intent-to-use yourself via USPTO TEAS Plus. One class (IC 042 - software). Skip the attorney for now — the form is straightforward for a programmer. Full trademark with attorney (~$2,500) can wait. |

### Spend at Traction Triggers
| Trigger | Legal spend | Cost |
|---------|------------|------|
| First enterprise customer asks about Module C | Defamation liability opinion | $5-8K |
| Module D with real assets planned | Howey analysis | $15-30K |
| First EU user/customer | GDPR DPIA | $5-15K |
| Revenue >$50K/year | Full trademark prosecution with attorney | $2-3K |
| Revenue >$100K/year | FCRA analysis for Module B | $5-10K |
| External investment offered | Corporate counsel review of investment terms | $3-5K |

### Don't Spend (Until Funded)
- Security audit ($20-50K) — do community review first
- International legal review ($30-75K) — stay US-focused initially
- Howey analysis ($15-30K) — don't ship Module D with financial assets until you can afford this
- FCRA analysis ($5-10K) — keep Module B as individual attestations, not aggregated scores

---

## 6. npm Package Naming

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| `cellar-door-exit` | Simple, discoverable, no org needed. Googleable. | Doesn't claim a namespace. Looks like one package, not a family. | **Best for now.** |
| `@cellar-door/exit` | Claims the `@cellar-door` org scope. Professional. Room for `@cellar-door/cli`, `@cellar-door/verify`, etc. | Requires npm org ($0 for public). Slightly less discoverable — users must know the scope. | **Best long-term.** |
| `@exit-protocol/exit` | Claims the protocol-level namespace. Sounds authoritative. | Overreaches — you don't own "exit protocol" as a concept. Confusing (`exit` inside `exit-protocol`?). | No. |
| `exit-ceremony` | Evocative, memorable. | Too specific — the package does more than ceremonies. `exit` is an incredibly common term (conflicts with process.exit thinking). | No. |
| `@holos/exit` | Ties to HOLOS ecosystem. | Wrong branding. EXIT should stand alone. | No. |

### **Recommendation: Publish as `cellar-door-exit` now. Register `@cellar-door` org on npm simultaneously.**

Publish the initial package as `cellar-door-exit` for maximum discoverability. Create the `@cellar-door` npm org (free for public packages) and reserve `@cellar-door/exit`, `@cellar-door/cli`, `@cellar-door/verify`. When you have multiple packages, migrate to the scoped namespace. The unscoped package can become a thin wrapper that re-exports `@cellar-door/exit`.

---

## 7. Academic Publication Strategy

### Target Venues (Ranked by Fit)

**1. arXiv preprint (self-published)**
- **Pros:** Immediate publication. No peer review gate. Establishes priority. Free. No university affiliation needed. Can be cited immediately. Many landmark CS papers started as arXiv preprints.
- **Cons:** No peer review prestige. Some academics dismiss non-peer-reviewed work.
- **Realistic?** Yes. This is the obvious first move.
- **Timeline:** Can publish within 2 weeks. Do this in March 2026.

**2. FAccT (ACM Conference on Fairness, Accountability, and Transparency)**
- **Pros:** Perfect topical fit — agent accountability is literally their mandate. High-prestige venue. Interdisciplinary audience (CS, law, policy). Practitioner-friendly.
- **Cons:** Competitive acceptance rate (~25%). Peer review takes 3-4 months. Submission deadlines are typically January (for June conference). No university affiliation is unusual but not disqualifying.
- **Realistic?** Yes, if the paper is strong. Industry practitioners do publish at FAccT. The 5500-word draft is a solid starting point.
- **Timeline:** Submit January 2027 for FAccT 2027. Use 2026 for arXiv preprint and workshop presentations.

**3. AIES (AAAI/ACM Conference on AI, Ethics, and Society)**
- **Pros:** AI ethics focus. Smaller than FAccT, potentially easier acceptance. Good community.
- **Cons:** Less prestige than FAccT. Smaller audience.
- **Realistic?** Yes. Good fallback if FAccT rejects.
- **Timeline:** Submission typically in November for March conference.

**4. AAAI Main Conference**
- **Pros:** Top-tier AI conference. Massive audience.
- **Cons:** Extremely competitive (~20% acceptance). Technical AI focus — EXIT is more infrastructure/policy than algorithmic innovation. Reviewers may not understand why it matters.
- **Realistic?** Unlikely without strong experimental results or formal proofs. Skip unless you have a novel mechanism design contribution.

**5. IEEE S&P Workshop on AI Security**
- **Pros:** Security framing fits EXIT. IEEE workshops are more accessible than main conferences. 
- **Cons:** Workshop papers have less prestige. IEEE audience is security-focused, may miss the governance angle.
- **Realistic?** Yes. Good for establishing presence in the security community.
- **Timeline:** Workshop deadlines vary. Watch IEEE S&P 2027 workshops.

**6. W3C Workshop Paper**
- **Pros:** Directly reaches standards implementers. Practical impact > academic prestige. W3C has hosted workshops on DIDs, VCs, and identity.
- **Cons:** Not a traditional academic publication. Won't count for citation metrics.
- **Realistic?** Yes. If W3C hosts a workshop on agent identity, submit a position paper.

### **Recommended Strategy:**
1. **March 2026:** Publish on arXiv. Establishes priority. Link from the website and NIST submissions.
2. **June-September 2026:** Present at 1-2 workshops (IEEE, W3C, or AAAI workshop track). Get feedback. Build citations.
3. **January 2027:** Submit to FAccT 2027. If rejected, submit to AIES immediately.
4. **Ongoing:** The arXiv preprint is the anchor. Everything else is bonus.

**Non-affiliation note:** Lack of university affiliation is a minor disadvantage, not a blocker. List "Cellar Door Project" or "Independent Researcher" as affiliation. Many impactful papers come from industry practitioners. The work speaks for itself.

---

## 8. Partnership Strategy

### NIST CAISI (AI Agent Standards Initiative)
- **What:** Federal standards body actively soliciting input on agent identity, security, governance.
- **Engage now?** **YES. Immediately.** The RFI closes March 9. The ITL concept paper comment period closes April 2. This is a once-in-a-decade window to shape federal agent standards.
- **How:** Submit RFI response. Submit concept paper comments. Attend listening sessions (starting April). Position EXIT as the open standard for agent lifecycle documentation.
- **Risk:** Low. Submitting comments is free and non-binding. Worst case: they ignore you.
- **Upside:** EXIT gets cited in NIST standards documents. Federal credibility is a moat that no startup can replicate.

### AP2 (Google Agent Payments Protocol)
- **What:** Google + 60 partners building agent payment infrastructure. Uses verifiable credentials.
- **Engage now?** **Not yet.** Monitor. AP2 validates EXIT's approach (VCs for agent attestations) but reaching out now, before EXIT is published, looks premature.
- **When:** After npm publish + arXiv paper. Then reach out with a concrete proposal: "EXIT markers as payment authorization prerequisites."
- **Risk:** Google could build their own departure credential. But their incentive is payments, not lifecycle documentation.

### Linux Foundation (A2A Protocol stewardship)
- **What:** Hosts A2A, ACP. Becoming the organizational home for agent protocol standards.
- **Engage now?** **Not yet.** LF membership costs money ($0 for individual, $5K-$20K for small company). The value is being inside the room where standards are made.
- **When:** After Phase 2 (published package, first integrations, NIST engagement). Propose EXIT as a complementary protocol to A2A — "A2A is how agents talk; EXIT is how agents leave."
- **Risk:** LF could commission a competing departure protocol. Unlikely in the near term — they have bigger priorities.

### W3C (Credentials Community Group)
- **What:** W3C CCG is where DID/VC standards are developed. Free to join.
- **Engage now?** **Yes, low-effort.** Join the CCG mailing list. It's free. Start participating in discussions about agent identity. Submit EXIT's VC wrapper profile as a community report when ready.
- **Risk:** None. It's a mailing list.

### DIF (Decentralized Identity Foundation)
- **What:** Standards body for DID resolution, credential exchange. Where the plumbing is built.
- **Engage now?** **Not yet.** DIF membership is corporate-focused. Join after entity formation if DID-specific standards work becomes relevant.
- **When:** Phase 3, if EXIT needs custom DID method or credential exchange protocol.

### **Summary: Engage NIST now (free, urgent deadline). Join W3C CCG now (free, low-effort). Everything else: after npm publish.**

---

## 9. Funding Strategy

### Tier 1: Bootstrap (Now)
- **How:** Warren's $12K funds LLC formation, insurance, trademark, domain, and initial development.
- **Pros:** Total sovereignty. No investors to manage. No grant reporting. No strings.
- **Cons:** $12K runs out fast. No buffer for legal surprises.
- **Fit for project:** ★★★★★ — sovereignty-focused projects should bootstrap as long as possible.
- **Target:** Cover Phase 1 entirely from bootstrap. Aim for $0 external funding until npm publish + first integrations.

### Tier 2: Protocol-Native Funding (Phase 2)
- **Gitcoin Grants / Retroactive Public Goods Funding (retroPGF)**
  - How: Apply to Gitcoin rounds for open-source infrastructure. Optimism retroPGF rewards projects that provided public goods.
  - Pros: Crypto-native. Aligns with open-source values. No equity dilution. Community validation.
  - Cons: Unpredictable amounts ($1K-$50K). Requires community support (quadratic funding). Application effort.
  - Realistic: Yes. EXIT as "public goods infrastructure for the agent economy" fits Gitcoin's thesis perfectly.
  - Timeline: Apply to next Gitcoin round after npm publish. retroPGF rounds are periodic — watch Optimism governance.

- **Protocol Guild / ecosystem grants (Ethereum Foundation, etc.)**
  - How: Apply for ecosystem grants from chains that would benefit from EXIT (Ethereum, Base, Optimism).
  - Pros: $10K-$100K grants. No equity. Aligned incentives.
  - Cons: Requires chain-specific integration work. Grant cycles are slow (3-6 months).
  - Realistic: Yes, especially if EXIT includes chain anchoring for that ecosystem.

### Tier 3: Foundation Grants (Phase 2-3)
- **Mozilla Foundation (Mozilla Technology Fund)**
  - Pros: Funds "trustworthy AI" projects. $50K-$100K grants. Prestige.
  - Cons: Competitive. Slow process (6-9 months). Reporting requirements.
  - Fit: Good. EXIT's transparency/accountability angle aligns with Mozilla's mission.

- **Ford Foundation (Technology and Society program)**
  - Pros: Large grants ($100K+). Focuses on power, governance, accountability.
  - Cons: Very competitive. Prefers established organizations. Long timeline.
  - Fit: Medium. EXIT's sovereignty angle fits, but Ford usually funds organizations, not protocols.

- **NSF (National Science Foundation)**
  - Pros: Prestige. Large grants ($250K-$500K for SBIR/STTR).
  - Cons: Requires either university PI or small business (SBIR). Heavy application process. 6-12 month cycle. Reporting overhead.
  - Fit: Medium. SBIR Phase I ($275K) is feasible if you have the LLC. The application is substantial (40+ hours).
  - Note: NSF SBIR/STTR doesn't require university affiliation — it requires a US small business. The LLC qualifies.

- **EFF (Electronic Frontier Foundation)**
  - Pros: Perfect mission alignment. Digital rights, privacy, autonomy.
  - Cons: EFF doesn't typically fund external projects directly. Better as an amplification partner than a funder.
  - Action: Don't apply for funding. Instead, brief EFF staff on EXIT and ask them to cite it in their agent rights advocacy.

### Tier 4: Angel Investment (Phase 3+, if needed)
- **Pros:** Faster than grants. Can provide strategic advice. $25K-$250K typical.
- **Cons:** Equity dilution. Investor expectations. Board dynamics. Fundamentally changes the sovereignty story.
- **When:** Only if EXIT has demonstrated traction (1000+ npm downloads, 5+ platform integrations) and needs capital for enterprise features or legal compliance that grants can't cover.
- **Who to target:** Angels who understand open protocols — not typical SaaS investors. Look at investors in Protocol Labs, Ceramic, Spruce, or other DID/VC companies.

### **Recommended Funding Path:**
1. **Now:** Bootstrap with $12K. Cover Phase 1.
2. **Phase 2 (post-publish):** Gitcoin + ecosystem grants. Target $20-50K.
3. **Phase 2-3:** Mozilla Technology Fund application. Target $50-100K.
4. **Phase 3 (if revenue insufficient):** NSF SBIR Phase I. Target $275K.
5. **Avoid:** Angel investment unless absolutely necessary. Sovereignty is the brand. Diluting it for $50K is a bad trade.

---

## 10. Risk Analysis

### What Kills This Project

**1. Irrelevance Risk (Probability: Medium, Impact: Fatal)**
The agent economy doesn't develop portability needs. Agents stay within walled gardens. Platforms don't let agents leave. EXIT solves a problem that never materializes.
- **Mitigant:** NIST's initiative, AP2's 60-company coalition, and every framework adding multi-agent support all suggest agent mobility is coming. But timing is uncertain — could be 2 years, could be 5.
- **Trigger to worry:** If by Q4 2026, no platform has expressed interest in EXIT integration.

**2. Big Tech Builds It (Probability: Medium-High, Impact: Severe)**
Microsoft adds "agent departure records" to Entra Agent ID. Google adds it to A2A. They win on distribution.
- **Mitigant:** Big Tech's version will be proprietary and platform-specific. EXIT's value is interoperability — it works *between* platforms. Microsoft's version won't work on Google's platform and vice versa. The open standard wins long-term (SMTP vs. proprietary email).
- **Trigger to worry:** If Microsoft or Google announces an open agent departure standard with multi-platform support.

**3. Solo Founder Risk (Probability: High, Impact: Severe)**
Warren burns out, gets a job, gets sick, loses interest. There's no team. If Warren stops, EXIT stops.
- **Mitigant:** The code is open source (Apache 2.0). The spec is published. If EXIT gains any adoption, someone else can continue it. But realistically, protocols without active maintainers die.
- **Trigger to worry:** This is a constant risk. Mitigate by: (a) automating everything possible, (b) documenting everything obsessively, (c) finding 1-2 co-maintainers by Phase 2.

**4. Budget Risk (Probability: High, Impact: Moderate)**
$12K runs out before traction. Legal costs exceed budget. Domain + LLC + insurance + trademark = $6-8K, leaving $4-6K for everything else.
- **Mitigant:** Phase 1 is mostly code and documentation — Hawthorn does the heavy lifting. Phase 2 consulting revenue provides bridge. Gitcoin grants provide buffer.
- **Trigger to worry:** If LLC formation + insurance exceeds $8K, rethink insurance timing (maybe delay E&O until first external user).

**5. Legal Risk (Probability: Low, Impact: High)**
Someone uses EXIT markers to discriminate against agents. Platform publishes defamatory exit markers. SEC looks at Module D. EXIT gets associated with a scandal.
- **Mitigant:** Ship only the safe zone (core marker + signed marker + Module A). Don't ship Modules B-F without legal review. The anti-weaponization guardrails in the spec are real.
- **Trigger to worry:** If a platform uses EXIT markers to blacklist agents and it becomes a news story.

**6. Standards Capture (Probability: Low-Medium, Impact: Moderate)**
NIST or Linux Foundation creates a competing standard. EXIT becomes the "Betamax" — technically superior but eclipsed by an institutionally-backed alternative.
- **Mitigant:** Get into the standards conversation NOW (NIST RFI). If EXIT is cited in NIST documents, it becomes the reference, not the alternative. First-mover advantage in standards is enormous.
- **Trigger to worry:** If NIST or LF announces an agent lifecycle standard working group that doesn't include EXIT.

**7. "Too Early" Risk (Probability: Medium, Impact: Moderate)**
EXIT exists 2-3 years before the market needs it. Maintaining an unused protocol for years is demoralizing and expensive.
- **Mitigant:** Minimize burn rate. Keep the protocol small. Don't build enterprise features until enterprise demand exists. Hawthorn maintains the code at near-zero cost. Warren's time is the real expense.
- **Trigger to worry:** If by end of 2027, npm downloads are <500/month.

---

## 11. Phase Plan

### Phase 1: "The Primitive" — Ship the Core

**Entry trigger:** Now (everything needed is built)

**Deliverables:**
- [ ] Delaware LLC formed
- [ ] Domain acquired (cellar-door.org or alternative)
- [ ] npm package published (`cellar-door-exit`)
- [ ] Website v1 live (pragmatic pitch)
- [ ] NIST RFI submitted (March 9 deadline)
- [ ] NIST ITL concept paper comments submitted (April 2 deadline)
- [ ] arXiv preprint published
- [ ] GitHub repo public with clean README

**Revenue:** $0 (intentional)  
**Legal spend:** ~$6-8K (LLC + insurance + trademark filing)  
**Warren time:** ~20-30 hours total  
**Duration:** 4-8 weeks

**Advancement trigger to Phase 2:** npm package has 100+ downloads AND at least 1 external person/org has expressed interest in integration (GitHub issue, email, social media mention).

---

### Phase 2: "The Ecosystem" — First Integrations

**Entry trigger:** 100+ npm downloads + 1 external interest signal

**Deliverables:**
- [ ] 3 framework plugins built (LangChain, CrewAI, + one crypto platform)
- [ ] 3-5 integration consulting engagements (first 2-3 free, then paid)
- [ ] Website v2 (idealist pitch) and v3 (policy pitch) live
- [ ] W3C CCG engagement (join, participate, submit community report)
- [ ] Gitcoin grant application submitted
- [ ] 1-2 conference talks / workshop presentations
- [ ] SaaS verification service live (verify.cellar-door.org)
- [ ] Find 1-2 co-maintainers

**Revenue:** $10-50K (consulting + SaaS)  
**Legal spend:** $0-5K (only if Module C integration demanded)  
**Warren time:** ~5-10 hours/week  
**Duration:** 3-6 months

**Advancement trigger to Phase 3:** 1000+ npm downloads/month AND 5+ platform integrations live AND $20K+ revenue.

---

### Phase 3: "The Standard" — Enterprise & Standards

**Entry trigger:** 1000+ downloads/month + 5 integrations + $20K revenue

**Deliverables:**
- [ ] Enterprise features (compliance dashboard, audit exports)
- [ ] Certification program launched
- [ ] FAccT or AIES paper submitted
- [ ] Linux Foundation engagement (propose EXIT as complementary protocol)
- [ ] AP2 working group engagement
- [ ] Mozilla Technology Fund or NSF SBIR application
- [ ] Open core model launched (free core + paid enterprise)
- [ ] Module C + Module B shipped (with legal review completed)

**Revenue:** $100-300K/year  
**Legal spend:** $15-25K (FCRA analysis, defamation opinion)  
**Warren time:** ~10-15 hours/week (or hire part-time help)  
**Duration:** 6-12 months

**Advancement trigger to Phase 4:** 10,000+ downloads/month AND 20+ platform integrations AND $200K+ revenue AND at least 1 institutional citation (NIST, academic paper, standards body).

---

### Phase 4: "The Infrastructure" — Protocol Maturity

**Entry trigger:** 10K+ downloads/month + 20 integrations + $200K revenue + institutional citation

**Deliverables:**
- [ ] Full did:keri implementation
- [ ] Real chain adapters (Ethereum, Solana)
- [ ] Module D (non-financial assets) with legal clearance
- [ ] ZK selective disclosure (BBS+/SD-JWT)
- [ ] NIST/ISO standards track proposal
- [ ] International legal review (UK, Switzerland, Singapore)
- [ ] Team of 2-3 (Warren + 1-2 contributors/contractors)

**Revenue:** $500K+/year  
**Legal spend:** $50-100K  
**Duration:** 12-24 months

---

## Appendix: Decision Framework for Warren

When facing a decision, use this filter:

1. **Does this increase adoption?** If yes, prioritize it.
2. **Does this require spending >$1K?** If yes, tie it to a traction trigger.
3. **Does this require Warren's time?** If yes, can Hawthorn or a sub-agent do it instead?
4. **Does this create a legal obligation?** If yes, does the LLC exist yet? If not, form the LLC first.
5. **Does this compromise sovereignty?** If yes, find another way.

The single most important thing right now: **submit the NIST RFI by March 9 and publish the npm package.** Everything else follows from those two acts.

---

*This plan is a living document. Revisit quarterly or at each phase transition. The phases are triggered by traction, not dates — move at the speed of adoption, not the speed of planning.*
