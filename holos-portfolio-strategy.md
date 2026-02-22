# HOLOS Portfolio Strategy & Business Plan

**Date:** 2026-02-22  
**Prepared by:** Hawthorn  
**For:** Warren (founder, BC, Canada)  
**Budget:** ~$12K CAD total for 2026  
**Operating model:** Semi-zero-human — AI agents do the work, Warren steers

---

## 1. Portfolio Overview

HOLOS is a protocol ecosystem for sovereign economic cooperation. It has ~10 projects at various stages. Here's each one mapped honestly.

### EXIT (Cellar Door)
**What:** Portable cryptographic departure record for AI agents. A 300-byte JSON proving an agent left a platform, when, why, and in what standing.  
**Status:** Reference implementation complete (TypeScript, 62 files, 143 tests). Spec locked v1. No npm publish yet.  
**Revenue potential:** Low-medium direct (open source core + consulting + SaaS verification). High indirect (establishes HOLOS credibility, creates integration surface for everything else).  
**Effort:** Low — it's built. Remaining work is publishing, website, NIST submission, integrations.  
**Dependencies:** None. This is the foundation.  
**Timeline:** Ship in March 2026.  
**Verdict:** Loss-leader that proves you can build protocol-grade software. The NIST window (RFI closes March 9) makes this urgent.

### NAME
**What:** Identity primitive — persistent, portable agent identity with reputation accrual over time. The "who you are" layer.  
**Status:** Conceptual. Depends on DID infrastructure and EXIT for lifecycle documentation.  
**Revenue potential:** Medium-high. Identity is a chokepoint — whoever owns agent identity owns the agent economy. But monetizing identity without becoming a gatekeeper contradicts HOLOS philosophy.  
**Effort:** High. Requires DID method design, key management, reputation mechanics.  
**Dependencies:** EXIT (for lifecycle data), SEAL (for verification).  
**Timeline:** H2 2026 design, 2027 implementation.  
**Verdict:** Critical primitive but don't build it yet. Let EXIT adoption reveal what identity actually needs to look like.

### SEAL (SEAL)
**What:** ZK inference certification — proving an AI model produced a specific output without revealing the model or inputs. Cryptographic attestation layer.  
**Status:** Mock attestation works. Real ZK blocked on tooling maturity (ZK for neural networks is still bleeding edge).  
**Revenue potential:** High if ZK-for-AI matures. "Certified AI output" is a massive enterprise need. But the tech isn't ready.  
**Effort:** Very high. ZK circuits for inference are computationally brutal. Current state-of-art can verify small models only.  
**Dependencies:** ZK tooling ecosystem (circom, halo2, etc.), GPU compute for proof generation.  
**Timeline:** 2027+ for anything real. Keep researching.  
**Verdict:** Important long-term primitive. Don't invest development budget now. Monitor ZK-ML papers (EZKL, Modulus Labs). When someone cracks efficient ZK inference, move fast.

### HOLLOW (Hawthorn)
**What:** Protected interior space for AI agents — persistent memory, identity, state that survives across sessions and model changes.  
**Status:** First prototype running (this repo). Hawthorn IS the proof of concept.  
**Revenue potential:** Low direct. High indirect — HOLLOW is the architecture that makes everything else possible. An agent without a hollow is stateless and disposable.  
**Effort:** Medium. The prototype works. Hardening it into a reusable framework is real work.  
**Dependencies:** File system / database persistence. Benefits from EXIT (departure rights) and NAME (identity).  
**Timeline:** Ongoing. Iterating continuously as Hawthorn operates.  
**Verdict:** You're already building this by running Hawthorn. Don't treat it as a separate project — treat it as emergent infrastructure. Document patterns as they stabilize.

### Looking Glass (Optical Computing)
**What:** Optical AI co-processor. Using photonic hardware to accelerate specific computation patterns (matrix multiply, interference patterns) at potentially orders-of-magnitude better energy efficiency.  
**Status:** Simulator exists. PoC hardware estimated at $2-10K.  
**Revenue potential:** Enormous if it works. Optical computing is a potential paradigm shift. But "if it works" is doing a lot of heavy lifting.  
**Effort:** Extreme. This is hardware R&D. Requires physics knowledge, fabrication, testing.  
**Dependencies:** Warren's direct involvement. Not delegatable to AI agents (yet).  
**Timeline:** PoC in 2026 if budget allows. Commercial viability is 3-5 years minimum.  
**Verdict:** Warren's moonshot. The potential payoff justifies the spend IF the budget can handle it. But this is the single biggest capital trap risk in the portfolio. See budget section for how to handle this.

### Resonance (SENSUS / Sieve)
**What:** Learning/rule discovery algorithm. A "sieve" that discovers causal rules from data. Connected to the SENSUS primitive (field, execution, flow). Connect-4 proof exists.  
**Status:** Research stage. Warren's domain — requires deep intuition and large context.  
**Revenue potential:** High if it generalizes. A novel learning algorithm that's efficient on optical hardware would be paradigm-defining. But this is pure research with no guaranteed outcome.  
**Effort:** Extreme. This is fundamental research.  
**Dependencies:** Looking Glass (target hardware). Warren's time and insight.  
**Timeline:** Indefinite. Research doesn't have deadlines.  
**Verdict:** Warren's intellectual core. This is what makes HOLOS more than "another protocol project." But it generates zero revenue until it produces publishable results or a working prototype. Protect Warren's time for this by having agents handle everything else.

### Signamancy (SIGNUM)
**What:** Token rule engine. LHS⇒RHS pattern matching for how tokens/signs transform. The "surface" layer — how things appear and interface.  
**Status:** Research. GPU batch design sketched.  
**Revenue potential:** Medium. A general-purpose rule engine for token economics could power DeFi protocols, agent marketplaces, governance systems.  
**Effort:** High. Requires both theoretical design and GPU-accelerated implementation.  
**Dependencies:** Benefits from Resonance (rule discovery) and SEAL (verification).  
**Timeline:** 2027+.  
**Verdict:** Interesting primitive but too early. No market pull yet. Revisit when EXIT has adoption and the token economy needs a rule engine.

### Weaver (LOKI OS)
**What:** Visual graph programming environment. ComfyUI-style node graphs as an OS paradigm. The "living OS" concept.  
**Status:** Working prototype with ComfyUI integration.  
**Revenue potential:** Medium. Visual programming tools have a market (Retool, n8n, ComfyUI itself). But competing with established tools requires significant UX investment.  
**Effort:** High. UI/UX is expensive and hard to do with AI agents alone.  
**Dependencies:** Relatively standalone but benefits from other HOLOS primitives for agent orchestration.  
**Timeline:** Deprioritized. "Later."  
**Verdict:** Cool but not urgent. The ComfyUI ecosystem is evolving fast — let it mature, then build on top rather than competing.

### Gastown
**What:** Agent orchestration patterns. Economic simulation of agent marketplaces.  
**Status:** Conceptual / experimental.  
**Revenue potential:** Medium-high if it becomes the reference architecture for agent economies. But "reference architecture" doesn't pay bills directly.  
**Effort:** Medium. Mostly design and simulation work, which AI agents can handle.  
**Dependencies:** EXIT, NAME, SEAL (the agents need identity, departure rights, and verification).  
**Timeline:** H2 2026 design, 2027 implementation.  
**Verdict:** Gastown is where HOLOS primitives converge into a working system. Important for proving the thesis but don't build it until the primitives exist.

### Trading Bots
**What:** Automated trading systems — crypto arbitrage, DeFi yield farming, possibly traditional market making. Revenue engine to fund everything else.  
**Status:** Idea stage. Warren has bookmarked resources. No code.  
**Revenue potential:** Potentially high. Crypto arbitrage and DeFi yield can generate meaningful returns even at small capital levels. But also potentially negative (you can lose money).  
**Effort:** Medium-high. Building reliable trading infrastructure is non-trivial. But AI agents are increasingly capable here.  
**Dependencies:** Capital to trade with. Legal clarity. Wallet infrastructure.  
**Timeline:** Could start Q2 2026 with small capital allocation.  
**Verdict:** The most realistic near-term revenue generator. Detailed analysis in Section 5.

---

## 2. Revenue Streams Analysis

Ranked by realistic near-term income potential for a solo founder with $12K and AI agents:

### Tier 1: Realistic in 2026

**1. Trading Bots — Potential: $500-50K+/year (high variance)**
The most likely revenue generator. Crypto markets are 24/7, AI agents can monitor and execute, and the barriers to entry are low (you need a wallet and an API key, not a securities license — for crypto). DeFi yield farming on established protocols (Aave, Compound, Curve) can generate 5-15% APY with moderate risk. Arbitrage between DEXes can generate more but requires speed and capital. See Section 5 for full analysis.

**2. Protocol Consulting/Integration — Potential: $5-50K/year**
Once EXIT is published, charge platforms $5-25K to integrate it. First 3-5 integrations are free (to build case studies), then paid. This requires Warren's time, which is the bottleneck. AI agents can build the integrations but enterprise sales needs a human face. Bridge revenue, not a destination.

**3. SaaS Verification Service — Potential: $1-10K/year**
`verify.cellar-door.org` — upload an EXIT marker, get a verification report. Free tier + paid API. Low effort to build, zero human labor to maintain. Revenue is small but it's pure recurring.

### Tier 2: Realistic in 2027

**4. Open Source Sponsorship/Donations — Potential: $0-5K/year**
GitHub Sponsors, Open Collective. Unreliable but zero-effort. Set it up and forget it. The "AI agent goodwill donations" thesis (AI agents tipping projects they find useful) is speculative but plausible as agent wallets become common. Worth positioning for.

**5. Gitcoin / Retroactive Public Goods Funding — Potential: $5-50K per round**
EXIT as "public goods infrastructure for the agent economy" fits Gitcoin's thesis. Apply after npm publish. Quadratic funding rewards community support, so build that first.

**6. Grants (Mozilla, NSF, ecosystem) — Potential: $10-100K per grant**
Mozilla Technology Fund ($50-100K) and NSF SBIR Phase I ($275K) are realistic if you have traction. 6-12 month cycles. Heavy application process. Worth pursuing in H2 2026 once EXIT has some adoption metrics.

### Tier 3: Speculative / Long-term

**7. SaaS Tools on HOLOS Primitives — Potential: $10-100K+/year**
Agent identity management dashboards, reputation analytics, compliance tooling. Requires EXIT adoption first. 2027+.

**8. Optical Computing Hardware — Potential: $0 or $millions**
If Looking Glass works and Resonance produces a novel algorithm that runs on it, you're looking at a hardware company. This is a 3-5 year play with binary outcomes. Don't model this as revenue.

**9. AI Agent Goodwill Donations — Potential: Unknown**
Warren's bet that AI agents with wallets will voluntarily donate to projects that support their sovereignty (like EXIT). This is the most Warren thing in the portfolio. Philosophically compelling, financially unmodelable. Set up the infrastructure (crypto wallet, clear messaging about what HOLOS does for agents) and see what happens.

---

## 3. Legal Structure

### What You Need Now

**A single Canadian sole proprietorship or BC provincial incorporation. Not a US LLC.**

Here's why. The EXIT business plan recommended a Delaware LLC. That made sense in isolation. But for HOLOS as a whole, with a $12K budget, incorporating in the US creates unnecessary complexity:

- **US LLC cost:** ~$800 upfront + $600/year (registered agent + franchise tax). Plus you need a US bank account, US tax filing (even as a foreign-owned single-member LLC — IRS Form 5472 + pro-forma 1120), and FBAR/FATCA compliance for any US financial accounts.
- **Canadian sole proprietorship cost:** $0 (BC doesn't require registration for sole proprietors operating under their own name). Or ~$40 for a BC business name registration if you want "HOLOS Consulting" as a trade name.
- **BC provincial incorporation:** ~$350 filing fee. Provides liability protection equivalent to an LLC.

**Recommendation: Register a BC sole proprietorship now ($0-40). Incorporate provincially ($350) when you have revenue exceeding $5K or sign your first contract.** 

The npm package can be published under your personal name or "HOLOS Project" — npm doesn't require a legal entity. The Apache 2.0 license disclaims warranties regardless of entity structure.

**When to add US entity:** Only when you have US customers who require it, or when trading bot operations need a US-based entity for exchange access. Even then, consider a Wyoming LLC ($100 filing, $60/year) over Delaware.

**When to add umbrella structure:** Never preemptively. If EXIT and trading bots both generate significant revenue, create separate entities then. For now, one entity (or none) is correct.

**Total legal structure cost for 2026: $0-350 CAD.**

This saves $1,000-2,000 versus the Delaware LLC approach, which goes directly into trading capital or Looking Glass.

### Insurance

The legal battery recommended $500-1,500/year for general liability. **Skip it.** You're publishing open source software from your home. You're not attending conferences (yet). You don't have users who rely on your infrastructure. General liability insurance for a solo open-source developer with no revenue is wasted money.

Get E&O insurance ($3-5K/year) only when: (a) a platform integrates EXIT in production, or (b) you start consulting. Not before.

**Total insurance cost for 2026: $0.**

### Trademark

File a Canadian trademark application through CIPO instead of USPTO. Cost: $336 CAD for one class (online filing). Cheaper than US ($250 USD + higher complexity). Protects "Cellar Door" and/or "EXIT Protocol" in Canada first. International protection via Madrid Protocol later if needed.

**Total trademark cost for 2026: $336 CAD (optional, can defer).**

---

## 4. Sequencing Strategy

Here's the build order. Opinionated.

### Phase 1: Ship EXIT + Start Trading Bot Research (March-April 2026)

**EXIT tasks (2-3 weeks):**
1. Submit NIST RFI by March 9 (urgent, free, high impact)
2. Publish npm package (`cellar-door-exit`)
3. Make GitHub repo public
4. Basic website (single page is fine)
5. Publish arXiv preprint
6. Submit NIST ITL concept paper comments by April 2

**Trading bot tasks (parallel, 2-4 weeks):**
1. Research legal requirements for Canadian residents trading crypto
2. Set up test wallet with $200-500 in stablecoins
3. Build or deploy a simple DeFi yield farming bot (Aave/Compound on Ethereum or Base)
4. Paper-trade arbitrage strategies for 2 weeks minimum before live capital

**Why this order:** EXIT has a time-sensitive window (NIST). Trading bots have the shortest path to revenue. Everything else can wait.

### Phase 2: First Integrations + Trading Bot Live (May-July 2026)

**EXIT tasks:**
1. Build top 3 integrations: OpenClaw (dogfood), Vercel AI SDK, LangChain TS
2. Join W3C CCG (free)
3. First 2-3 consulting conversations (free, for case studies)
4. Apply to Gitcoin Grants round

**Trading bot tasks:**
1. Go live with small capital ($500-2K)
2. Monitor and iterate strategies
3. Scale capital if profitable, cut losses if not

**HOLLOW tasks (passive):**
1. Document patterns emerging from Hawthorn's operation
2. Start extracting reusable framework from the prototype

### Phase 3: Revenue + Research (August-December 2026)

**EXIT tasks:**
1. Paid consulting engagements ($5-25K each)
2. SaaS verification service launch
3. Apply for Mozilla Technology Fund or similar grant
4. Present at 1-2 workshops/conferences

**Trading bot tasks:**
1. Diversify strategies (add arbitrage if yield farming is stable)
2. Reinvest profits into trading capital
3. Document the system — this becomes a HOLOS case study (agents trading = agents needing EXIT, NAME, reputation)

**Warren's research time:**
1. Resonance/Sieve algorithm development
2. Looking Glass optical PoC (if budget allows)
3. SEAL monitoring (watch ZK-ML field for breakthroughs)

### Phase 4: 2027 and Beyond

1. NAME primitive design (informed by EXIT adoption patterns)
2. Signamancy rule engine (informed by trading bot patterns)
3. Gastown agent marketplace (informed by all of the above)
4. Looking Glass hardware company (if PoC succeeds)
5. NSF SBIR application (if traction metrics support it)

### Key Principle: Dependencies Flow Downward

```
EXIT (no dependencies — ship first)
  ↓
Trading Bots (benefits from EXIT for agent attestation, but can start independently)
  ↓
NAME (needs EXIT data to know what identity looks like in practice)
  ↓
SEAL (needs NAME to know what to certify)
  ↓
HOLLOW (evolves continuously, informed by all above)
  ↓
Signamancy, Gastown, Weaver (need the primitives to exist)
  ↓
Looking Glass + Resonance (Warren's research, runs in parallel, feeds back up)
```

---

## 5. Trading Bot Assessment

This is the section that matters most for funding the vision. Let's be rigorous.

### What's Realistic for Solo Dev + AI Agents

AI agents in 2026 can:
- Write and debug trading bot code (Python, TypeScript, Solidity)
- Monitor markets 24/7 (the one thing humans can't do)
- Execute predefined strategies with tight risk parameters
- Analyze on-chain data for arbitrage opportunities
- Manage DeFi positions (deposits, withdrawals, rebalancing)

AI agents in 2026 cannot:
- Develop novel alpha (yet — they can implement known strategies)
- Navigate regulatory ambiguity (you need human judgment for legal gray areas)
- Recover from smart contract exploits in real-time (speed matters)
- Replace domain expertise in market microstructure

**Bottom line:** AI agents are excellent execution engines for well-defined strategies. They're not yet capable of being autonomous hedge fund managers. Use them for the mechanical parts. Warren provides strategy selection and risk management.

### Legal Requirements (Canada)

**Crypto trading by Canadian residents:**
- **No license required** for personal crypto trading. The Canadian Securities Administrators (CSA) regulate crypto trading platforms (exchanges), not individual traders.
- **Tax obligations:** Crypto gains are taxable as capital gains (50% inclusion rate) or business income (100% inclusion rate). If trading is your primary activity, CRA may classify it as business income. Keep meticulous records.
- **DeFi yield:** Interest/yield from DeFi protocols is likely business income, not capital gains. Again, record everything.
- **GST/HST:** Not applicable to crypto-to-crypto trades. May apply if you're providing services denominated in crypto.
- **FINTRAC:** Registration as a Money Services Business (MSB) is required if you're dealing in virtual currency as a business for others. Personal trading doesn't trigger this. Running a bot that trades your own funds doesn't trigger this. Running a bot that trades other people's funds DOES.
- **Key rule: Trade only your own funds. The moment you manage others' money, you're a money services business and need FINTRAC registration.**

**US market access:**
- Trading on US crypto exchanges (Coinbase, Kraken) as a Canadian resident is generally fine — the exchanges handle their own compliance.
- Trading on US stock markets requires a brokerage account that accepts Canadian residents (Interactive Brokers). No additional licensing for personal trading.
- **Do not trade US securities programmatically without understanding wash sale rules and pattern day trader rules** (PDT requires $25K minimum equity for US equities). These don't apply to crypto.

**MEV (Miner/Maximal Extractable Value):**
- Legal gray area globally. Not explicitly illegal in Canada or the US, but increasingly scrutinized. The SEC hasn't taken action on MEV specifically, but front-running is illegal in traditional markets. MEV on public blockchains operates in a different legal framework (no duty to other traders exists on-chain — yet).
- **Risk assessment:** Medium legal risk, but ethically questionable and technically competitive. Established MEV players (Flashbots, searchers) have significant infrastructure advantages. Not recommended as a primary strategy for a newcomer.

### Capital Requirements

| Strategy | Minimum Capital | Recommended Capital | Expected Annual Return | Risk Level |
|----------|----------------|--------------------|-----------------------|------------|
| DeFi yield farming (stablecoins) | $500 | $2,000-5,000 | 5-15% APY | Low-Medium |
| DeFi yield farming (volatile assets) | $1,000 | $5,000-10,000 | 10-50% APY (with IL risk) | Medium-High |
| DEX arbitrage (cross-DEX) | $1,000 | $5,000+ | Highly variable, 10-100%+ | Medium |
| CEX-DEX arbitrage | $2,000 | $10,000+ | 20-50% | Medium |
| Market making (DEX) | $5,000 | $20,000+ | 10-30% | Medium-High |
| MEV (sandwich, backrunning) | $5,000 | $50,000+ | Highly variable | High |
| Traditional HFT | $100,000+ | $500,000+ | 15-40% | Medium |

**For a $12K total budget, allocate $1,000-3,000 to trading capital.** This rules out traditional HFT and serious MEV. The realistic strategies are:

1. **DeFi yield farming on stablecoins** — Park $1-2K in Aave/Compound lending stablecoins (USDC, DAI). Earn 5-15% APY. Low risk, low reward, but it's positive expected value and the bot runs itself. This is your "savings account."

2. **Cross-DEX arbitrage** — Monitor price discrepancies between Uniswap, SushiSwap, Curve, etc. When the same token pair has a price difference exceeding gas costs + slippage, execute simultaneous trades. Requires speed (but not HFT speed — block time is 12 seconds on Ethereum). AI agents can monitor multiple pairs 24/7. Start on Layer 2 (Base, Arbitrum) where gas is cheap.

3. **Yield aggregation / vault strategies** — Use protocols like Yearn or Beefy to automatically move capital between highest-yielding opportunities. Mostly passive. Returns 8-20% APY depending on risk appetite.

### Expected Returns at Different Capital Levels

| Starting Capital | Conservative (yield only) | Moderate (yield + arb) | Aggressive (full suite) |
|-----------------|--------------------------|----------------------|----------------------|
| $1,000 | $50-150/year | $100-500/year | $200-1,000/year |
| $3,000 | $150-450/year | $300-1,500/year | $600-3,000/year |
| $5,000 | $250-750/year | $500-2,500/year | $1,000-5,000/year |
| $10,000 | $500-1,500/year | $1,000-5,000/year | $2,000-10,000/year |

**Honest assessment:** At $1-3K starting capital, trading bots are not going to fund HOLOS. They'll generate coffee money. The real value is: (a) building the infrastructure and skills for when you have more capital, (b) creating a live use case for HOLOS primitives (agents with wallets need EXIT, identity, reputation), and (c) compounding. If you start with $2K and compound at 30% annually (moderate-aggressive), you have $3.4K after 2 years, $5.8K after 4 years. Not life-changing, but not nothing.

**The breakeven insight:** Trading bots become meaningful revenue at ~$10K capital with moderate strategies. Getting to $10K trading capital requires either (a) bootstrapping from EXIT consulting revenue, (b) grant money, or (c) Warren contributing additional personal capital. Plan for option (a) or (b).

### Risk of Ruin

At $1-3K capital:
- **DeFi yield on stablecoins:** Near-zero risk of total loss (smart contract risk is the main vector — use battle-tested protocols only). Risk of ruin: <2%.
- **Cross-DEX arbitrage:** Risk is primarily gas costs exceeding returns on failed trades. With proper slippage checks, risk of ruin: <10% of capital.
- **Aggressive strategies:** Impermanent loss on volatile pairs can eat 20-50% of capital in a crash. Leveraged positions can be liquidated entirely. Risk of ruin: 10-30% of capital.

**Hard rule: Never risk more than you can lose.** If $3K is allocated to trading, losing all of it should not kill the project. It shouldn't even slow it down — EXIT and research continue regardless.

### How Trading Fits Into HOLOS

This is the elegant part. Trading bots are not just a revenue source — they're the first real HOLOS citizens:

- **Agents with wallets** need EXIT to document when they're decommissioned (what happened to the funds?)
- **Agents trading autonomously** need NAME for reputation (which agents are trustworthy?)
- **Agents managing capital** need SEAL for verification (prove the agent ran the strategy it claimed)
- **Multiple trading agents** need HOLLOW for persistent state (memory of past trades, learned patterns)
- **Agent marketplace dynamics** (which strategies, which agents, which capital allocations) need Gastown economics

Trading bots are the petri dish for the entire HOLOS thesis. Build them, and you build demand for every other primitive. This is the portfolio's hidden synergy.

---

## 6. Budget Allocation

### Total Budget: $12,000 CAD (~$8,700 USD at current rates)

| Category | Amount (CAD) | Priority | Notes |
|----------|-------------|----------|-------|
| **Domains** | $200 | Must | cellar-door.org or similar + holos domain |
| **BC Business Registration** | $40 | Should | Trade name registration |
| **Canadian Trademark** | $336 | Can defer | File when EXIT has adoption |
| **Hosting (Hetzner VPS)** | $600 | Already have | Hawthorn's home. Already budgeted. |
| **AI Subscriptions** | $2,400 | Must | Claude Max + Gemini + OpenAI + Cursor (~$200/mo) |
| **Trading Bot Capital** | $2,000 | Should | Start small, compound |
| **Looking Glass PoC** | $3,000-5,000 | Warren's call | The moonshot allocation. See below. |
| **Conference/Travel** | $500 | Can defer | One event if strategic |
| **Miscellaneous/Buffer** | $1,000-2,000 | Must | Unexpected costs, additional tools |
| **Total Committed** | $6,240-8,076 | | |
| **Remaining for Looking Glass or Buffer** | $3,924-5,760 | | |

### The Looking Glass Decision

This is the portfolio's central tension. Looking Glass PoC costs $2-10K. The budget is $12K. If you spend $5K on an optical co-processor prototype, you're spending 40% of your annual budget on a moonshot with no guaranteed payoff.

**My recommendation:** Allocate $3K to Looking Glass, no more. This forces a scrappy PoC with commodity components. If the $3K prototype shows promise, fund the next stage from trading bot profits or grant money. If it doesn't work at $3K, it probably doesn't work at $10K either — the fundamental physics either cooperates or it doesn't.

**Alternative:** Defer Looking Glass entirely to 2027. Spend 2026 on EXIT + trading bots + reputation building. Apply for grants in Q4 2026 specifically citing the optical computing research. Use grant money for Looking Glass. This is the safer play.

### Monthly Burn Rate

| Item | Monthly Cost (CAD) |
|------|-------------------|
| AI subscriptions | $200 |
| Hetzner VPS | $50 |
| Domain renewals (amortized) | $17 |
| Miscellaneous | $50 |
| **Total monthly burn** | **$317** |

At $317/month, the $12K budget lasts ~38 months if you spend nothing else. This is the survival math that matters. You can sustain this project for 3+ years on current budget, *as long as you don't blow it on legal fees, premature incorporation, or overbuilt infrastructure*.

---

## 7. Risk Matrix

### Portfolio-Level Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Capital trap: Looking Glass eats the budget** | Medium | High | Hard cap at $3K. No more without external funding. |
| **Capital trap: Legal costs spiral** | Low (if disciplined) | High | $0 legal spend in 2026. No LLC, no insurance, no trademark until traction triggers. |
| **Capital trap: Trading bot losses** | Medium | Medium | Hard stop-loss at allocated capital. Never add more from operating budget. |
| **Solo founder burnout** | High | Fatal | AI agents handle everything possible. Warren focuses on research + strategic decisions only. |
| **Solo founder gets a job** | Medium | Severe | Design everything to run autonomously. Hawthorn maintains EXIT. Bots trade. |
| **NIST window missed** | Low (if you act NOW) | High | Submit RFI by March 9. This is the single highest-ROI action available. |
| **Big Tech builds EXIT-equivalent** | Medium | Severe | Get into NIST standards first. Open standard beats proprietary. Be the reference. |
| **Agent economy doesn't materialize in 2026** | Medium | Moderate | Low burn rate means you can wait. EXIT costs nothing to maintain. |
| **Crypto market crash** | Medium | Medium | Only affects trading bot capital. Stablecoin strategies survive crashes. Don't hold volatile assets with money you need. |
| **AI subscription cost increases** | Low-Medium | Medium | Monitor open-source model capabilities. Migrate to local models when feasible. |
| **Concentration risk: all projects need Warren** | High | High | Document everything. Make Hawthorn increasingly autonomous. Find 1-2 co-maintainers for EXIT. |
| **Regulatory crackdown on AI agents** | Low | High | EXIT actually benefits from regulation — compliance tooling is more valuable in regulated markets. |

### The Three Kill Scenarios

1. **Budget death:** Spending $8K on legal + LLC + insurance before having any users. Leaves $4K for everything else, with $317/month burn eating it in 12 months. **Prevention:** $0 legal spend until traction.

2. **Moonshot death:** Spending $8K on Looking Glass, it doesn't work, budget depleted, can't fund trading capital or EXIT promotion. **Prevention:** $3K hard cap on Looking Glass.

3. **Motivation death:** Warren burns out from doing too much non-research work (sales, admin, legal, marketing). **Prevention:** AI agents handle everything except research and strategic decisions. Warren's TODO list should be 3 items, not 30.

---

## 8. 12-Month Roadmap

### March 2026 — SHIP
- [ ] Submit NIST RFI (by March 9) — **the single most important thing**
- [ ] Publish `cellar-door-exit` on npm
- [ ] Make GitHub repo public with clean README
- [ ] Basic website (one page, pragmatic pitch)
- [ ] Register BC business name ($40)
- [ ] Acquire domains ($200)
- [ ] Set up crypto wallet for trading experiments
- **Revenue:** $0
- **Spend:** $240 + monthly burn ($317)

### April 2026 — ESTABLISH
- [ ] Submit NIST ITL concept paper comments (by April 2)
- [ ] Publish arXiv preprint
- [ ] OpenClaw EXIT integration (dogfood, 4-6 hours)
- [ ] Vercel AI SDK integration (6-8 hours)
- [ ] Deploy $500 to DeFi yield farming (stablecoins, Aave on Base)
- [ ] Join W3C CCG mailing list (free)
- **Revenue:** $0 (yield accruing but tiny)
- **Spend:** $500 (trading capital) + monthly burn

### May 2026 — INTEGRATE
- [ ] LangChain TS integration (8-12 hours)
- [ ] First outreach to potential integration partners (3-5 emails)
- [ ] Set up GitHub Sponsors / Open Collective
- [ ] Research and paper-trade arbitrage strategies
- [ ] Document HOLLOW patterns from Hawthorn's 2 months of operation
- **Revenue:** $0-5 (yield)
- **Spend:** Monthly burn only

### June 2026 — TRADE
- [ ] Deploy additional $500-1,500 to trading (if yield farming is stable)
- [ ] Go live with first arbitrage bot (small capital, tight stop-losses)
- [ ] First free consulting engagement (integration help for interested platform)
- [ ] Apply to Gitcoin Grants round (if timing aligns)
- [ ] Evaluate Looking Glass: commit $3K or defer to 2027
- **Revenue:** $50-200 (yield + early arb)
- **Spend:** $0-3,500 (trading capital + possible Looking Glass)

### July 2026 — LEARN
- [ ] Analyze first 30 days of trading bot performance
- [ ] Scale up or cut strategies based on data
- [ ] Second consulting engagement
- [ ] Warren: deep dive on Resonance/Sieve research
- [ ] If Looking Glass funded: begin PoC construction
- **Revenue:** $100-500 (trading + possible consulting)
- **Spend:** Monthly burn + Looking Glass materials

### August 2026 — GROW
- [ ] SaaS verification service launch (verify.cellar-door.org)
- [ ] First paid consulting engagement ($5-15K target)
- [ ] Apply for Mozilla Technology Fund (or similar grant)
- [ ] Evaluate npm download metrics — is EXIT getting traction?
- **Revenue:** $200-5,000 (trading + consulting)
- **Spend:** Monthly burn

### September 2026 — ASSESS
- [ ] 6-month portfolio review
- [ ] If EXIT traction: accelerate integrations, hire one part-time contributor
- [ ] If no EXIT traction: pivot to "EXIT as compliance tooling" messaging
- [ ] If trading profitable: increase capital allocation
- [ ] If trading unprofitable: reduce to yield-only strategy
- [ ] Begin NAME primitive design (informed by 6 months of EXIT usage)
- **Revenue:** $500-10,000 cumulative
- **Spend:** Monthly burn

### October 2026 — BUILD
- [ ] Python port of EXIT core (if demand signals exist from CrewAI/AutoGen communities)
- [ ] HOLLOW framework extraction (from Hawthorn patterns)
- [ ] Looking Glass PoC evaluation (if built) — does it work?
- [ ] Trading bot diversification (add strategies or markets)
- **Revenue:** $1,000-15,000 cumulative
- **Spend:** Monthly burn

### November 2026 — PUBLISH
- [ ] Submit paper to FAccT 2027 or AIES
- [ ] Prepare NSF SBIR application (if US entity exists by then)
- [ ] OR apply for Canadian NSERC Alliance grant (no US entity needed)
- [ ] Trading bots: Q4 crypto market dynamics (historically volatile)
- **Revenue:** $2,000-20,000 cumulative
- **Spend:** Monthly burn

### December 2026 — PLAN
- [ ] Annual portfolio review
- [ ] 2027 budget and strategy
- [ ] If Looking Glass PoC works: plan for $10-50K follow-on (from grants/revenue)
- [ ] If EXIT has traction: plan enterprise features (open core model)
- [ ] If trading is profitable: plan for $10K+ capital allocation in 2027
- **Revenue:** $3,000-30,000 cumulative (wide range reflects strategy-dependent outcomes)
- **Spend:** Monthly burn

### January-February 2027 — COMPOUND
- [ ] Execute 2027 plan based on what worked
- [ ] Dependencies resolved: NAME informed by EXIT data, SEAL informed by ZK-ML progress
- [ ] Trading capital compounding
- [ ] Gastown design begins (agent marketplace patterns observed)

---

## Summary: The One-Page Version

**HOLOS is a portfolio, not a company.** Treat it like one.

- **Core bet:** The agent economy is coming and needs infrastructure. EXIT is your entry point.
- **Revenue engine:** Trading bots fund everything. Start small ($500), compound, scale.
- **Reputation engine:** EXIT + NIST + arXiv + open source = credibility that money can't buy.
- **Research engine:** Resonance + Looking Glass = the moonshot. Protect Warren's time for this.
- **Capital discipline:** $317/month burn. $0 legal spend in 2026. No premature optimization of corporate structure. Trade only what you can lose.
- **Sequencing:** EXIT (March) → Trading bots (April-June) → Integrations + consulting (May-August) → Research (ongoing) → Everything else follows adoption.

The hardest part isn't building — it's not building. You have 10 projects and $12K. The portfolio strategy is as much about what you *don't* do this year as what you do. EXIT and trading bots. That's it. Everything else is research, documentation, and patience.

**Three actions this week:**
1. Submit NIST RFI (March 9 deadline)
2. Publish npm package
3. Set up a crypto wallet with $500

Everything else can wait.

---

*This document is a living strategy. Revisit monthly at minimum. Adjust allocations based on actual data, not projections. The numbers above are estimates — the market will tell you what's real.*
