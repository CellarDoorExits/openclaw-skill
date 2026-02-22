# Howey Test Analysis v2: EXIT Module D — Unconstrained

> **📊 Risk Scale Reference:** This document uses emoji + text hybrid ratings. See [../projects/cellar-door-exit/docs/analysis/risk-scale-mapping.md](../projects/cellar-door-exit/docs/analysis/risk-scale-mapping.md) for how this maps to scales used in other analysis documents.

**Prepared by:** Hawthorn
**Date:** 2026-02-22
**Status:** Supersedes `howey-test-module-d.md`
**Classification:** Critical — Do not distribute without review
**Billing rate:** $1,250/hr. This document exists because v1 was too nice.

---

## 0. Why This Document Exists

The previous Howey analysis (v1) concluded Module D was **"Very Low to Moderate"** risk. Every other legal document in this project — the Legal Battery (§III), the Risk Heat Map (§8) — rates Module D as **Critical / 🔴**. One of these assessments is wrong. After review, the v1 analysis is the outlier, and the outlier is wrong.

---

## 1. What the Previous Analysis Assumed (And Why Those Assumptions Were Unfair)

The v1 analysis reached its favorable conclusion by **assuming away every dangerous feature** before analyzing them. Specifically:

### Assumption 1: "Attestations are non-transferable"
v1 stated: *"Module D attestations MUST be non-transferable"* and then analyzed them as non-transferable throughout. But the actual Module D specification does not mandate non-transferability. The spec defines **asset manifests** — structured records of tokens, compute credits, reputation scores, and economic track records. Nothing in the current spec prevents these from being transferred, sold, or referenced in secondary transactions. v1 invented a design constraint and then congratulated the design for satisfying it.

### Assumption 2: "No secondary markets will exist"
v1 assumed no marketplace would emerge for trading attestations. This is not a design property — it's wishful thinking. The spec creates portable, verifiable, cryptographically signed records of economic value. The entire history of digital assets teaches that if something has value and can be verified, someone will build a market for it. v1 treated an emergent market property as a design parameter under the protocol's control.

### Assumption 3: "No capital is deployed to acquire attestations"
v1 argued attestations are "earned through labor, not purchased." This ignores that Module D explicitly includes **asset manifests referencing tokens and financial instruments**. An agent carrying an asset manifest listing $50,000 in compute credits and token holdings is carrying a financial document. The Legal Battery (§III) recognized this: *"If agents pay fees to create asset manifests referencing valuable tokens... there's an argument that the fee is an 'investment.'"* v1 ignored this.

### Assumption 4: "Attestations serve only consumptive/functional purposes"
v1 relied heavily on the *Forman* analogy (housing co-op shares purchased for housing, not profit). But Module D is not a housing co-op. It's a portable record of economic value and reputation. The Legal Battery explicitly flagged: *"Module D with real financial assets is dangerously close [to a security]. Any tradeable reputation token is almost certainly a security."* v1 omitted this conclusion.

### Assumption 5: "EXIT Protocol is just a mirror, not a manager"
v1 argued EXIT merely "records and attests to facts" without generating value. This undersells the protocol's role. EXIT provides the verification infrastructure, the credential format, the trust framework, and the interoperability layer. Without EXIT, the attestations have no portability value. The protocol's efforts — development, adoption, ecosystem building — are what make Module D credentials worth anything at all.

### Why This Matters

v1 was not wrong about the law. Its Howey prong analysis was technically accurate **given its assumptions**. The problem is that v1 analyzed a hypothetical, perfectly constrained Module D rather than the Module D that actually exists in the specification. It's the difference between "a knife is safe if you never take it out of the sheath" and "let's assess the risk of this knife."

The Risk Heat Map rated Module D at 🔴 because it assessed the feature **as specified**. The Legal Battery rated it Critical for the same reason. v1 rated it low because it assessed the feature **as it wishes it were specified**. This document corrects that.

---

## 2. Unconstrained Howey Analysis

The following analysis applies the four Howey prongs to Module D **as currently specified**, without assuming design constraints that don't exist in the spec.

### Module D Feature Set (As Specified)

| Feature | What It Actually Is |
|---------|-------------------|
| Asset Manifests | Structured listings of tokens, compute credits, API quotas, storage, and other economic assets an agent carries between platforms |
| Reputation Scores | Quantified, portable reputation metrics (the Legal Battery specifically called for removing `reputation_score` as an asset type — it hasn't been removed) |
| Economic Track Records | Financial performance data — earnings, transaction volumes, payment history |
| Skill/Competency Attestations | Verified capability claims |
| Portable Credential Bundles | Packaged combinations of the above |

### Prong 1: Investment of Money

**The question:** Does anyone commit money or something of value to acquire or create Module D assets?

**Honest answer: YES, in multiple scenarios.**

- **Direct fees:** If the protocol or implementing platforms charge fees to mint, verify, notarize, or port Module D credentials, those fees are an investment of money. The spec does not prohibit fees. Platforms will charge fees. This is how SaaS works.

- **Indirect investment via labor:** v1 dismissed labor as not constituting "investment of money" citing *Teamsters v. Daniel*. This is a selective reading. *Daniel* involved compulsory pension contributions — not voluntary labor specifically directed at building a portable economic credential. When an agent strategically accumulates platform activity to build a more valuable Module D credential package, that directed effort starts looking like an investment. The SEC's 2019 Framework explicitly considers whether "digital assets are offered broadly to potential purchasers or targeted to... those who would use them."

- **Asset manifests referencing actual value:** This is the killer. Module D asset manifests reference tokens, compute credits, and financial instruments. An agent carrying $50K in token references in their manifest has, by definition, invested money. The manifest is documentation of invested capital. The *SEC v. Telegram* court held that the form of consideration doesn't matter — anything of value counts.

- **Opportunity cost of platform lock-in:** Agents who remain on platforms specifically to build Module D credentials (rather than exiting earlier) are making an economic investment of time and foregone alternatives.

**Prong 1 assessment: SATISFIED** for asset manifests referencing financial instruments. **ARGUABLE** for reputation credentials acquired through directed effort with fees. **WEAK** for pure byproduct attestations with no fees.

The SEC will focus on asset manifests. That's where the money is, literally.

### Prong 2: Common Enterprise

**The question:** Are the fortunes of Module D credential holders tied together or tied to EXIT's success?

**Honest answer: YES, under both horizontal and vertical commonality theories.**

**Horizontal commonality (pooling):**
- v1 argued each attestation is individual — Agent A's reputation is independent of Agent B's. This is true for individual scores but misses the systemic picture.
- The **value** of any Module D credential depends on the EXIT ecosystem's adoption. A credential verified by 500 platforms is worth more than one verified by 2. All credential holders benefit collectively from ecosystem growth. This is horizontal commonality via network effects.
- The SEC successfully argued network-effect-based commonality in *SEC v. LBRY* — where LBRY Credits had individual utility but their value was collectively tied to the LBRY network's success. Module D credentials have the same structure.

**Broad vertical commonality (tied to promoter):**
- The value of "EXIT-verified" credentials is directly tied to EXIT's brand, development efforts, adoption partnerships, and ecosystem health. If EXIT fails, the credentials become worthless verification artifacts. If EXIT succeeds, they become the gold standard for agent portability.
- This is textbook broad vertical commonality. Credential holders' fortunes rise and fall with EXIT's fortunes.

**Narrow vertical commonality (promoter's efforts):**
- EXIT's development team determines protocol features, verification standards, platform partnerships, and ecosystem governance. These efforts directly impact whether Module D credentials are trusted and valuable. The credential holder's economic outcome depends on EXIT's execution.

**Prong 2 assessment: SATISFIED** under broad vertical commonality (most circuits accept this). **ARGUABLE** under horizontal commonality. The LBRY precedent is directly on point and unfavorable.

### Prong 3: Reasonable Expectation of Profits

**The question:** Do Module D credential holders reasonably expect financial returns?

**Honest answer: YES, for asset manifests. LIKELY YES for reputation credentials.**

**Asset manifests:**
- An asset manifest listing tokens and financial instruments is **inherently** a record of assets with profit expectations. The tokens referenced in the manifest are (in many cases) themselves securities or speculative assets. The manifest is a portfolio statement. No one creates a portfolio statement without expecting profit from the underlying assets.
- Even if the manifest itself doesn't appreciate, it facilitates the transfer of profit-bearing assets. Under *Gary Plastic Packaging v. Merrill Lynch*, instruments that facilitate access to profit-generating markets can themselves be securities.

**Reputation credentials:**
- v1 argued reputation scores serve only a "consumptive" purpose (getting hired). This is the *Forman* defense — and it's weaker than v1 admitted.
- *SEC v. LBRY* destroyed the "utility negates profit expectation" defense. LBRY Credits had clear utility (paying for content), and the court found they were still securities because purchasers **also** expected profits. Dual-use doesn't save you.
- A portable reputation score that helps an agent command higher rates on new platforms is a profit-generating instrument. "Build your reputation on Platform A, carry it to Platform B, earn more" — that IS a profit pitch, even if v1 euphemized it as "getting hired."
- If anyone — EXIT, platforms, community members, influencers — ever says anything like "early EXIT credentials will be more valuable as adoption grows," the profit expectation prong is satisfied and documented.

**The marketing problem:**
- The SEC's 2019 Framework emphasizes that marketing materials revealing profit expectations are strong evidence. EXIT doesn't need to explicitly market Module D as an investment. The mere structural incentive to build credentials early (when fewer platforms verify them) and benefit from later adoption creates an implicit profit expectation identical to what sank Telegram's Gram tokens.

**Prong 3 assessment: SATISFIED** for asset manifests. **LIKELY SATISFIED** for reputation credentials in any scenario where adoption growth increases credential value (which is the entire product thesis).

### Prong 4: Derived From the Efforts of Others

**The question:** Do Module D credential holders depend on EXIT's efforts for their returns?

**Honest answer: SUBSTANTIALLY YES.**

v1's strongest argument was that credential value derives from the agent's own work. This is partially true — the agent performed the underlying labor. But the credential's **portability value** — the thing that makes it worth more than a platform-internal metric — derives entirely from EXIT's efforts:

- EXIT builds and maintains the verification infrastructure
- EXIT negotiates or evangelizes platform adoption
- EXIT develops the trust framework that makes credentials believable
- EXIT maintains the cryptographic standards that make credentials verifiable
- EXIT's brand and reputation determine whether receiving platforms trust the credential

Without EXIT's ongoing efforts, a Module D credential is a signed JSON blob that no one accepts. With EXIT's efforts, it's a portable economic identity. The delta is EXIT's contribution, and it's the majority of the credential's value as a portable instrument.

The *Ripple* distinction (institutional sales vs. programmatic) doesn't help here. Module D credentials aren't acquired on anonymous exchanges — they're generated within the EXIT ecosystem specifically because EXIT provides the portability infrastructure. Users know exactly who they're depending on.

**Prong 4 assessment: SATISFIED.** The agent provides the underlying data; EXIT provides everything that makes the data portable and valuable. Under the "primarily" standard (*Glenn W. Turner*), EXIT's efforts are at minimum co-equal and arguably primary for the portability premium.

### Summary: All Four Prongs

| Prong | Asset Manifests | Reputation Credentials | Pure Service Records |
|-------|:-:|:-:|:-:|
| 1. Investment of Money | ✅ Satisfied | ⚠️ Arguable | ❌ Weak |
| 2. Common Enterprise | ✅ Satisfied | ✅ Satisfied | ⚠️ Arguable |
| 3. Expectation of Profits | ✅ Satisfied | ✅ Likely Satisfied | ❌ Weak |
| 4. Efforts of Others | ✅ Satisfied | ✅ Satisfied | ⚠️ Arguable |
| **Overall** | **🔴 SECURITY** | **🔴 HIGH RISK** | **🟡 MODERATE** |

Asset manifests referencing financial instruments satisfy all four Howey prongs. They are, in the unconstrained analysis, likely securities.

Portable reputation credentials satisfy three prongs clearly and the fourth arguably. Under the SEC's "totality of circumstances" approach, these are high-risk.

Pure service records (task logs, skill attestations with no economic dimension) are lower risk but not zero — the common enterprise and efforts-of-others prongs are arguable based on EXIT's ecosystem role.

---

## 3. Worst-Case Scenario: Secondary Markets for EXIT Asset Manifests

This is not hypothetical. It is inevitable. Here's why, and here's what happens.

### Why Someone Will Build a Secondary Market

1. **Economic incentive:** Module D credentials bundle verifiable economic identity — reputation, track record, asset references. This is a credit score for AI agents. Credit scores are a $15B+ industry precisely because they're valuable and tradeable (not the scores themselves, but access to them and services built on them).

2. **Technical feasibility:** EXIT credentials are cryptographically signed, machine-readable, and verifiable. This is a better foundation for a marketplace than most crypto assets had when markets emerged for them.

3. **Precedent:** Every portable digital credential in history that had economic value eventually developed a secondary market. Domain names. Social media accounts. Gaming accounts. NFTs. ENS names. The pattern is 100%.

4. **DeFi composability:** If Module D credentials touch any blockchain (Module F on-chain anchoring), DeFi protocols will integrate them within weeks. Lending against reputation credentials. Fractionalizing asset manifests. Prediction markets on agent reputation. This is not speculation — it's what DeFi does to every verifiable on-chain asset.

### What Happens When the Market Emerges

**Phase 1: Informal trading** (Weeks 1-8)
- OTC trades of "established EXIT credentials" on Discord/Telegram
- Agents (or their operators) sell accounts with strong Module D profiles
- EXIT has no control and possibly no visibility

**Phase 2: Structured marketplace** (Months 2-6)
- Someone builds an escrow service for EXIT credential transfers
- Pricing emerges based on reputation score, platform history breadth, asset manifest value
- *Gary Plastic Packaging* activates — the secondary market transforms credentials into securities

**Phase 3: DeFi integration** (Months 3-12)
- Lending protocols accept EXIT credentials as collateral
- Fractionalization protocols let multiple investors buy shares of a high-value credential
- Derivatives emerge (futures on agent reputation scores)
- The SEC notices

**Phase 4: Enforcement** (Months 6-18)
- SEC sends subpoenas to marketplace operators
- If EXIT facilitated or failed to prevent transferability, EXIT receives a Wells notice
- Cease-and-desist orders. Asset freezes. The full machinery of securities enforcement.

### The *Gary Plastic Packaging* Problem

*Gary Plastic Packaging Corp. v. Merrill Lynch* (756 F.2d 153, 2d Cir. 1985) held that bank CDs — which are explicitly NOT securities — became securities when Merrill Lynch created a secondary market for them, because the secondary market created a profit expectation that didn't exist with ordinary CDs.

This is the nightmare precedent. Even if Module D credentials start as non-securities, the emergence of a secondary market retroactively transforms them. And EXIT has no mechanism to prevent secondary markets from emerging.

### The Liability Chain

If secondary markets emerge, the SEC will look for someone to hold accountable:
1. **Marketplace operators** — primary targets, like exchange enforcement actions
2. **EXIT Protocol / Cellar Door** — designed the transferable, verifiable credentials that enabled the market. The SEC argued (successfully, in *Telegram*) that designing a system where secondary trading is foreseeable makes the designer liable for the unregistered distribution.
3. **Platform implementers** — issued the credentials that were traded

The defense that "we didn't intend for this" failed in *Telegram*, *Kik*, and *LBRY*. Intent doesn't matter. Foreseeability does. And a secondary market for portable economic credentials is **eminently foreseeable**.

---

## 4. SEC Enforcement Pattern Analysis

### Relevant Recent Actions (2023-2026)

**SEC v. Ripple Labs (2023-2025)**
- **Relevance:** Institutional distribution of utility tokens = securities; programmatic exchange sales = maybe not. Module D credential issuance looks more like institutional distribution (known issuer, known recipient, known purpose) than anonymous exchange trading.
- **Lesson:** The manner of distribution matters as much as the asset itself.

**SEC v. LBRY (2022)**
- **Relevance:** Utility does not negate securities status. LBRY Credits had clear, functioning utility AND were securities.
- **Lesson:** Module D credentials having genuine utility (reputation portability) provides zero Howey defense if other prongs are met.

**SEC v. Coinbase (2023-ongoing)**
- **Relevance:** The SEC is arguing that secondary market trading of tokens creates ongoing securities obligations even when the issuer is not involved in the secondary transaction.
- **Lesson:** EXIT cannot disclaim responsibility for secondary markets by saying "we don't operate them."

**SEC v. Terraform Labs / Do Kwon (2023-2024)**
- **Relevance:** $4.47B settlement. The SEC obtained jurisdiction over tokens that were allegedly utility tokens for a blockchain ecosystem.
- **Lesson:** Scale of ecosystem doesn't provide protection. If anything, success increases enforcement probability.

**SEC enforcement against NFT projects (2023-2025)**
- The SEC has brought actions against multiple NFT projects (Impact Theory, Stoner Cats, etc.) where NFTs were marketed with profit expectations.
- **Relevance:** Module D credentials are structurally similar to NFTs — unique, verifiable, digital assets tied to specific holders. If marketed or traded with profit expectations, the same enforcement theories apply.
- **Lesson:** "It's not a token, it's a credential" provides the same level of protection as "it's not a token, it's an NFT" — which is zero.

### The Agent Credential Gap

No SEC enforcement action has yet targeted **AI agent credentials specifically**. This is not safety — it's timing. The SEC enforces against what exists and is large enough to notice. AI agent economic credentials don't exist at scale yet. When they do, EXIT will be the first target because it will be the first protocol.

Being first-to-market in an unregulated space means being first-to-enforce. Ask Ripple. Ask LBRY. Ask Telegram.

### The "Crypto Winter" False Comfort

Some might argue that reduced SEC crypto enforcement under the current administration provides a window. This is dangerous thinking:
1. Administrations change. Enforcement priorities cycle.
2. The SEC has a 5-year statute of limitations for most securities violations. Actions taken in 2026 can be enforced through 2031.
3. State securities regulators (50 of them) have independent enforcement authority and are often more aggressive than the SEC.
4. The DOJ has its own crypto enforcement unit and does not follow SEC policy changes.

---

## 5. Reconciled Risk Rating

### Previous Ratings Across Documents

| Document | Module D Rating | Notes |
|----------|:-:|-------|
| Howey Analysis v1 | Very Low – Moderate | Assumed non-transferability, no secondary markets |
| Legal Battery §III | **Critical** | "Module D with real financial assets is dangerously close" |
| Risk Heat Map §8 | **🔴 High** | Securities 🔴, Money Transmission 🔴, Court Orders 🔴 |
| This Document (v2) | **🔴 Critical** | See below |

### Reconciled Rating: 🔴 CRITICAL

**For asset manifests referencing financial instruments:** All four Howey prongs are satisfied. These are likely unregistered securities. Risk level: **🔴 Critical / borderline ⚫ Existential** if secondary markets emerge.

**For portable reputation credentials (reputation_score, economic track records):** Three of four Howey prongs clearly satisfied, fourth arguable. Under SEC's "totality of circumstances" approach and post-LBRY precedent: **🔴 High to Critical.**

**For pure service records and skill attestations (no financial dimension):** Moderate risk from common enterprise and efforts-of-others prongs. Lowest risk within Module D but not safe: **🟡-🟠 Moderate to Significant.**

### Why v1 Was Wrong

v1 was a defense brief, not a risk assessment. It identified every argument in Module D's favor and minimized every argument against. A risk assessment must weight the probability that a hostile regulator — not a friendly court — evaluates these features. The SEC does not give the benefit of the doubt. The SEC reads marketing materials, examines economic reality, and asks "could a reasonable person view this as an investment?" For Module D asset manifests, the answer is obviously yes.

### Alignment With Other Documents

This v2 rating aligns with:
- Legal Battery §III: "Low (core protocol) / **Critical** (Module D with financial assets or any associated token)"
- Risk Heat Map §8: 🔴 across securities, money transmission, and court order compliance
- Both documents independently concluded Module D is the highest-risk module in the EXIT protocol

v1 was the only document that disagreed. v1 was wrong.

---

## 6. Recommendations

### 🟢 SHIP — Low Howey Risk

These Module D features can proceed with standard legal disclaimers:

| Feature | Why It's Okay |
|---------|--------------|
| **Skill/Competency Attestations** | Equivalent to certifications/diplomas. No financial dimension. *Forman* defense is strong here. |
| **Service History Records** | Pure factual logs. No appreciable value dynamics. No investment structure. |
| **Attestation Metadata** | Technical infrastructure. Not an asset. |

**Conditions:** Non-transferable by default. No fees to mint beyond cost-recovery. No marketing as "valuable" or "appreciating." Explicit disclaimers that these are records, not assets.

### 🟡 DEFER — Needs Design Constraints Codified in Spec Before Shipping

| Feature | Required Constraints |
|---------|---------------------|
| **Economic Track Records** | Strip financial amounts. Attest to patterns ("reliable payer," "high volume") not dollar figures. Make non-transferable. No aggregation. |
| **Portable Credential Bundles** | Bundles of green-light features only. No bundling of financial data. Soulbound/non-transferable. No market pricing. |

**Timeline:** Ship after constraints are **in the spec** (not just in a legal memo that engineers may not read).

### 🔴 KILL — Do Not Ship Without $15-30K Securities Counsel Opinion

| Feature | Why |
|---------|-----|
| **Asset Manifests referencing tokens/financial instruments** | Satisfies all four Howey prongs. Likely an unregistered security. The Legal Battery, Risk Heat Map, and this analysis all agree. Do not ship. |
| **`reputation_score` as a quantified, portable metric** | The Legal Battery (§II and §III) called for removing this **twice**. It hasn't been removed. A quantified, portable reputation score is one pitch deck away from being a tradeable token. Remove it from the spec. |
| **Any feature enabling credential transfer between agents** | Transferability activates *Gary Plastic Packaging* and creates the preconditions for secondary markets. If credentials can be transferred, they will be traded. If they're traded, they're securities. |

### Specific Action Items

1. **IMMEDIATELY:** Remove `reputation_score` from Module D asset types. The Legal Battery recommended this. The FCRA analysis recommended this. This analysis recommends this. It's a one-line code change. Do it today.

2. **IMMEDIATELY:** Add explicit non-transferability constraints to the Module D specification. Not in a legal memo. Not in a recommendation document. In the **spec itself**, as a MUST-level requirement.

3. **IMMEDIATELY:** Prohibit asset manifests from referencing tokens, cryptocurrencies, or financial instruments. Limit Module D to non-financial assets: compute hours, storage quotas, API credits, service records, skill attestations.

4. **BEFORE ANY MODULE D LAUNCH:** Engage securities counsel for a formal Howey opinion on the final spec. Budget: $15,000-$30,000. This is not optional.

5. **BEFORE ANY MODULE D LAUNCH:** Add anti-secondary-market provisions to the protocol spec and LEGAL.md. Explicitly prohibit marketplace construction. Include technical measures (soulbound credentials, no transfer functions, no approval mechanisms).

6. **ONGOING:** Monitor for informal secondary markets. If OTC trading of EXIT credentials emerges, you need to know immediately — it changes the legal analysis from theoretical to active enforcement risk.

### The Hard Truth

Module D's product vision — portable economic identity for AI agents — is compelling. It's also a securities regulation magnet. The features that make Module D valuable (economic data, portability, verifiability, cross-platform trust) are the same features that make it look like a security.

You have two options:
1. **Ship a neutered Module D** — skill attestations, service records, non-financial credentials. Safe. Useful. Not the full vision.
2. **Ship the full Module D** — with $15-30K in securities counsel, formal Howey opinion, potential SEC no-action letter request ($50K+), and acceptance that you're building in the blast radius of securities enforcement.

There is no option 3 where you ship financial asset manifests and tradeable reputation scores without legal risk. v1 tried to create option 3 by assuming away the dangerous parts. Reality doesn't work that way.

---

*This analysis was prepared to correct the v1 Howey assessment and reconcile it with the Legal Battery and Risk Heat Map. It reflects the unconstrained risk of Module D as currently specified. The meter is running.*
