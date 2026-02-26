# P31 — Securities Regulation Attorney Assessment

**Persona:** Senior Partner, Securities Enforcement & Digital Assets Practice
**Subject:** EXIT Protocol v1.1 — Securities Risk Memorandum
**Date:** 2026-02-25
**Classification:** Attorney Work Product — Privileged & Confidential

---

## EXECUTIVE SUMMARY

The EXIT protocol presents a **LOW-TO-MEDIUM** overall securities enforcement risk in its current design. The core protocol — cryptographic departure markers — is unlikely to be classified as a security under *SEC v. W.J. Howey Co.* (1946). However, **Module D (Economic)**, downstream derivative products, and the confidence scoring system create risk surfaces that require careful management. The existing securities disclaimer in `types.ts` is directionally correct but legally insufficient as a standalone shield.

**Overall Enforcement Risk Rating: MEDIUM**

---

## I. HOWEY TEST ANALYSIS

The Howey test asks whether an instrument involves: (1) an investment of money, (2) in a common enterprise, (3) with an expectation of profits, (4) derived from the efforts of others.

### A. Core EXIT Markers

| Howey Prong | Analysis | Risk |
|---|---|---|
| **Investment of money** | EXIT markers are self-created cryptographic records. No money changes hands to acquire one. There is no purchase price, no token sale, no fundraiser. | **Not satisfied** |
| **Common enterprise** | No pooling of funds. Each marker is independently created by its subject. There is no shared treasury, no common pool, no horizontal or vertical commonality. | **Not satisfied** |
| **Expectation of profits** | Markers are departure records, not investment instruments. No mechanism exists for marker appreciation or yield. | **Not satisfied** |
| **Efforts of others** | The marker's value (if any) derives from the subject's own history. Cellar Door provides infrastructure only. | **Not satisfied** |

**Conclusion: Core EXIT markers are NOT securities under Howey.** They are closer to self-signed certificates or notarized records than investment contracts. The SEC would likely view these as utility/infrastructure artifacts, not investment contracts.

### B. Module D — Economic (Asset Manifests)

This is where risk concentrates. Module D allows markers to reference assets, obligations, and exit fees.

| Howey Prong | Analysis | Risk |
|---|---|---|
| **Investment of money** | The `assetManifest` field references external assets (tokens, shares, etc.). If those assets are securities, Module D becomes a vehicle for securities data transport. | **Elevated — depends on referenced assets** |
| **Common enterprise** | Module D itself doesn't create commonality. But if platforms aggregate Module D data to create indices, pools, or scoring products — commonality emerges at the platform layer. | **Pass-through risk** |
| **Expectation of profits** | `exitFee` and `pendingObligations` create financial dynamics. If exit fees are structured as revenue-sharing or if obligation references encode profit expectations, this prong could be triggered. | **Context-dependent** |
| **Efforts of others** | The spec's "conduit-only" framing helps here. Cellar Door doesn't manage assets. But if Cellar Door ever curates, scores, or recommends based on Module D data, the "efforts of others" prong activates. | **Currently low, structurally fragile** |

**Conclusion: Module D is a conduit for potentially regulated data.** The module itself is not a security, but it can carry securities references, and platforms consuming it may create securities.

### C. Confidence Scores & Trust Enhancers

The confidence scoring system (§7.4) and `TrustEnhancers` interface are the most interesting regulatory surface.

**Critical question:** If confidence scores become a de facto reputation currency that platforms use for access decisions, lending, or staking eligibility — does the score itself become a security or a component of one?

Under current SEC posture: **probably not on its own.** But if anyone creates a tradeable token backed by or derived from EXIT confidence scores, that token almost certainly satisfies Howey. The score becomes the "investment thesis" and the scoring algorithm becomes the "efforts of others."

---

## II. THE "CONDUIT-ONLY" DEFENSE

The spec and code repeatedly emphasize that Cellar Door is a "conduit only" — it validates structure, not truth. This is evident in `types.ts`:

> *"Cellar Door acts as a CONDUIT only: it validates well-formedness of these fields but has ZERO opinion on their truth, authenticity, or legal significance."*

### Strengths of This Approach

1. **No custody.** Cellar Door never holds assets, manages funds, or executes transfers. This is critical — the SEC's primary targets are custodians and exchanges.
2. **No investment contract.** There is no purchase, no pooling, no profit expectation created by the protocol itself.
3. **Structural validation only.** The protocol explicitly disclaims evaluation of truth or legal significance.
4. **Precedent.** SMTP is not liable for the content of emails. HTTP is not liable for web content. Protocol-layer neutrality has strong legal footing.

### Weaknesses of This Approach

1. **The conduit defense has limits.** See *Reves v. Ernst & Young* (1990) — if you know the conduit is being used for securities transactions and you facilitate it, you can be an aider-and-abetter. The spec's Module D disclaimer actually works against you here: by acknowledging Howey risk, you've demonstrated knowledge.
2. **"Conduit" is a factual determination, not a label.** The SEC doesn't care what you call yourself. If Cellar Door starts offering hosted verification services, confidence score APIs, or Module D analytics dashboards, the conduit defense erodes.
3. **The FCRA/GDPR awareness in `IdentityClaimAttachment` comments shows sophisticated legal awareness** — which a regulator may interpret as evidence that the team understood the regulatory landscape and chose to proceed.

**Assessment: The conduit defense is viable TODAY but structurally fragile.** It works only so long as Cellar Door remains purely a spec + reference implementation without hosted services, aggregation, or curation.

---

## III. DERIVATIVE PRODUCT RISK

**Scenario:** A third-party platform creates "EXIT Score" tokens — ERC-20 tokens whose value is pegged to an agent's EXIT confidence score, tradeable on secondary markets.

### Howey Analysis of EXIT Score Derivatives

| Prong | Satisfied? |
|---|---|
| Investment of money | ✅ Users buy/trade the token |
| Common enterprise | ✅ Token holders share in the platform's success |
| Expectation of profits | ✅ Token appreciates as agent reputation improves |
| Efforts of others | ✅ Value derives from the scoring algorithm and the agent's activities |

**This is a textbook security.** Full stop.

### Cellar Door's Liability for Derivatives

**Direct liability: LOW.** Cellar Door doesn't create, issue, or promote these tokens.

**Indirect liability: MEDIUM.** If Cellar Door:
- Provides APIs that make derivative creation easy
- Fails to include anti-derivative warnings in the spec
- Partners with or endorses platforms that create derivatives
- Publishes Module D data in formats optimized for financial aggregation

…the SEC could pursue a **material assistance** theory under *Lorenzo v. SEC* (2019).

### The §8.6 Anti-Weaponization Clause as Partial Shield

The anti-weaponization clause (§8.6) prohibits using EXIT markers as blacklists. This is good but insufficient. It addresses discrimination, not securitization. A separate **anti-securitization clause** is needed.

---

## IV. ADEQUACY OF THE SECURITIES DISCLAIMER IN `types.ts`

The Module D JSDoc comment contains:

> *"The contents of Module D asset manifests may constitute securities disclosures... Cellar Door EXIT does NOT provide legal, financial, or securities advice. This module is a data transport mechanism only."*

### What It Gets Right
- Acknowledges Howey risk explicitly
- Disclaims advisory role
- Characterizes Module D as transport-only
- References a detailed analysis document

### What It Gets Wrong or Misses

1. **It's in a source code comment.** No court has ever held that a JSDoc comment constitutes adequate securities disclosure. This needs to be in the spec (§14), in the README, in the API documentation, and in any SDK.
2. **No actual limitation on use.** The disclaimer says "consult counsel" but doesn't restrict Module D's use. Compare: SWIFT messages carry actual legal restrictions on relay and use.
3. **No downstream liability allocation.** It doesn't say "platforms that create derivative products from Module D data assume all regulatory liability."
4. **No user-facing warning.** The disclaimer is developer-facing only. End users (agents, DAOs) who create markers with Module D never see it.
5. **The reference to `assessments/howey-module-d-v2.md` is good** but creates a discovery risk — if that document contains unfavorable analysis, it's now referenced in discoverable source code.

**Assessment: Necessary but insufficient.** Grade: C+. Needs significant strengthening.

---

## V. SEC ENFORCEMENT POSTURE (2024-2026)

### Current Climate

The SEC under the current administration has signaled a more nuanced approach to crypto than the Gensler era, but enforcement has **not** stopped:

1. **Staff Accounting Bulletin 121 rescission** eased crypto custody rules, but didn't change the securities classification framework.
2. **The Howey test remains the law.** No legislation has superseded it.
3. **The SEC has continued enforcement against projects that blur utility/security lines** — particularly tokens with governance features, staking yields, or secondary market trading.
4. **The "sufficient decentralization" doctrine** remains informal guidance, not binding law.

### How the SEC Would View EXIT

**Most likely: No action on the core protocol.** EXIT markers are closer to PGP signatures than to tokens. There's no token sale, no ICO, no trading market.

**Where they'd look harder:**
- Module D if it becomes a conduit for unregistered securities transfers
- Confidence scores if they become tradeable or used as collateral
- Any hosted EXIT verification service that charges fees (potential investment advisor registration)
- Any "EXIT token" that someone inevitably creates

**Probability of enforcement against Cellar Door specifically: LOW (15-20%)** — assuming they stay at the protocol layer and don't create hosted services or tokens.

**Probability of enforcement against EXIT ecosystem participants who create derivatives: HIGH (70%+).**

---

## VI. RECOMMENDED SAFEGUARDS

### Priority 1 — Immediate (Do Now)

| # | Action | Rationale |
|---|---|---|
| 1 | **Add anti-securitization clause to spec §14** | Mirror §8.6 anti-weaponization. Explicitly: "EXIT markers, confidence scores, and Module D data MUST NOT be tokenized, securitized, or used as the basis for tradeable financial instruments." |
| 2 | **Elevate the securities disclaimer from JSDoc to spec §14** | Source code comments are not legal documents. The spec is the normative text. |
| 3 | **Add downstream liability allocation** | "Any party that creates derivative financial instruments from EXIT protocol data assumes all regulatory compliance obligations." |
| 4 | **Remove the reference to internal Howey analysis from public source code** | The `See: assessments/howey-module-d-v2.md` reference is a discovery gift to plaintiffs. Remove from types.ts; keep the analysis internal. |

### Priority 2 — Near-Term (30 days)

| # | Action | Rationale |
|---|---|---|
| 5 | **Formal legal opinion letter from securities counsel** | Not a self-assessment. An actual Regulation D / no-action letter analysis from external counsel. |
| 6 | **Module D usage guidelines** | Published document specifying what Module D is and isn't for. Include: not for securities transactions, not for transfer of value, not for investment contracts. |
| 7 | **Confidence score anti-tokenization language** | In §7.4 and the `ConfidenceScore` type: "Confidence scores are ephemeral computation results, not portable assets. Tokenizing or trading confidence scores is prohibited." |
| 8 | **Terms of Use for any SDK/API** | Wrap the protocol in ToS that include securities-related restrictions. |

### Priority 3 — Structural (90 days)

| # | Action | Rationale |
|---|---|---|
| 9 | **Consider making Module D opt-in with explicit legal acknowledgment** | Require consumers to acknowledge the securities risk before Module D fields are available. |
| 10 | **Engage with SEC staff informally** | A no-action letter request or informal staff guidance would provide significant protection. |
| 11 | **Monitor state money-transmitter laws** | If Module D references crypto assets, some states may classify EXIT as a money transmission protocol. |
| 12 | **DAO/governance structure** | If EXIT becomes community-governed, ensure the governance token (if any) is structured to avoid Howey. |

---

## VII. RISK MATRIX

| Risk Surface | Howey Risk | Enforcement Probability | Severity | Overall |
|---|---|---|---|---|
| Core EXIT markers | Very Low | Very Low | Low | **LOW** |
| Module D (asset manifests) | Medium | Low-Medium | High | **MEDIUM** |
| Confidence scores (as-is) | Low | Very Low | Medium | **LOW** |
| Confidence score derivatives | High | High | Critical | **HIGH** |
| "EXIT token" by third party | Critical | Very High | Critical | **CRITICAL** |
| Hosted EXIT verification service | Medium | Medium | High | **MEDIUM** |
| Trust Enhancers (identity claims) | Low | Low | Medium | **LOW** |

---

## VIII. CONCLUSION

The EXIT protocol team has done something rare in the crypto/protocol space: they've actually thought about securities law *before* shipping. The conduit-only architecture, the explicit disclaimers, and the structural separation between the protocol and the data it carries are all correct instincts.

But instincts aren't legal protections. The disclaimer in `types.ts` is a developer note, not a legal shield. The anti-weaponization clause covers discrimination but not securitization. And Module D, by its very nature, will eventually carry references to instruments that are securities — the question isn't *whether* but *when*.

The critical vulnerability isn't in the protocol itself — it's in the ecosystem that will grow around it. Someone *will* create an EXIT score token. Someone *will* build a reputation market on Module D data. Someone *will* create a staking protocol that uses confidence scores as collateral. The SEC won't come for Cellar Door first — they'll come for those platforms. But if Cellar Door hasn't clearly disclaimed and structurally separated itself, it could be swept into the enforcement action as a facilitator.

**Bottom line:** The protocol is well-designed from a securities perspective. Now it needs the legal infrastructure to match the technical infrastructure. The six recommendations in Priority 1 should be implemented before any public launch.

---

*This memorandum constitutes a risk assessment, not legal advice. The EXIT protocol team should retain securities counsel licensed in their operating jurisdiction for formal legal guidance.*

**— P31, Securities Regulation Attorney**
*Partner, Digital Assets & SEC Enforcement Practice*
