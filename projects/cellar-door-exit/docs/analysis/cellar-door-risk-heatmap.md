# Cellar Door EXIT Protocol — Legal Risk Heat Map

**Prepared by:** Hawthorn
**Date:** 2026-02-19
**Source material:** Legal red team report, LEGAL.md, SECURITY.md, HOLOS compact reference

---

## How to Read This

- 🟢 Minimal risk — ship without special legal work
- 🟡 Moderate — manageable with standard compliance (ToS, disclaimers)
- 🟠 Significant — needs targeted legal counsel before launch
- 🔴 High — potential enforcement action, needs dedicated analysis
- ⚫ Existential — do not proceed without dedicated legal team and budget

---

## 1. Core EXIT Marker (bare hash on ledger)

- **Securities law:** 🟢 — A timestamp is not an investment contract. No Howey prong triggered.
- **Money transmission:** 🟢 — No value referenced or transferred.
- **Privacy/GDPR:** 🟡 — Hash alone is pseudonymous, but content-addressed hash of personal data IS personal data under Breyer. Functional erasure (encryption key deletion) needed for EU.
- **Consumer protection:** 🟢 — Factual record, no consumer-facing claims.
- **Antitrust:** 🟢 — No competitive dimension.
- **Labor/employment:** 🟢 — No employment relationship implied.
- **Defamation/tort:** 🟢 — No status or reputation data in bare marker.
- **IP/patent:** 🟡 — Broad patents exist on identity attestation schemes. Apache 2.0 mitigates but doesn't eliminate. IBM/Microsoft patent portfolios are the concern.
- **Criminal liability:** 🟢 — Recording that something happened is not criminal.
- **Court order compliance:** 🟡 — Even bare markers could be subject to preservation orders. Non-custodial design helps but doesn't eliminate risk.
- **EU AI Act:** 🟢 — A log entry is not an AI system component.
- **Cross-border:** 🟢 — Minimal data, minimal exposure.

**Overall: 🟢 SAFE ZONE**

---

## 2. Signed EXIT Marker (did:key + Ed25519 signature)

- **Securities law:** 🟢 — Signature doesn't change the Howey analysis.
- **Money transmission:** 🟢 — Still no value.
- **Privacy/GDPR:** 🟡 — DID is definitively personal data per Breyer. Right to erasure tension begins here. did:key is permanent (no revocation), which means the identifier persists even if the person wants it gone.
- **Consumer protection:** 🟢 — No consumer claims.
- **Antitrust:** 🟢 — No competitive dimension.
- **Labor/employment:** 🟢 — No employment relationship.
- **Defamation/tort:** 🟡 — Self-attested status introduces potential for misrepresentation claims (claiming good_standing when disputed). Mitigated by selfAttested:true flag.
- **IP/patent:** 🟡 — DID-based signing schemes have patent exposure. W3C DID spec has some RF commitments but EXIT's standalone mode sits outside them.
- **Criminal liability:** 🟢 — Self-attested false status could theoretically be fraud, but extremely unlikely to be prosecuted.
- **Court order compliance:** 🟡 — Signed marker is better evidence, more likely to be subpoenaed. D-006 ("contests don't block exit") creates tension with injunctions.
- **EU AI Act:** 🟢 — Still just a record.
- **Cross-border:** 🟡 — DID + timestamp = personal data crossing borders. GDPR Art. 48 blocking statute applies to US CLOUD Act requests.

**Overall: 🟢-🟡 SAFE ZONE with minor compliance work**

---

## 3. Module A: Lineage (predecessor/successor chains)

- **Securities law:** 🟢 — Chain of platform history is not an investment.
- **Money transmission:** 🟢 — No value.
- **Privacy/GDPR:** 🟠 — Lineage chains are movement tracking data. Full history reveals behavioral patterns, platform affiliations, duration of stay. This is profiling data under GDPR Art. 22. Potential "special category" data if platforms reveal political/religious affiliation. DPIA required.
- **Consumer protection:** 🟡 — If lineage is used for discrimination (denied service based on history), FTC could act.
- **Antitrust:** 🟡 — If platforms collude using lineage data to blacklist agents, this is a concerted refusal to deal.
- **Labor/employment:** 🟡 — Agent employment history is analogous to employment records; some jurisdictions restrict what prior employers can disclose.
- **Defamation/tort:** 🟡 — Revealing that an agent was at a controversial platform could be reputationally damaging.
- **IP/patent:** 🟡 — Same patent concerns as core.
- **Criminal liability:** 🟢 — No criminal dimension.
- **Court order compliance:** 🟡 — Lineage chains are excellent evidence for tracking agent movements; will be subpoenaed.
- **EU AI Act:** 🟡 — If lineage is used as input to automated decision-making about agents, Art. 6 high-risk classification could apply.
- **Cross-border:** 🟠 — Movement data across jurisdictions is exactly what data localization laws target. China's Cybersecurity Law Art. 37 would prohibit exporting lineage data involving Chinese platforms.

**Overall: 🟡-🟠 TIPTOE ZONE — needs DPIA and privacy-by-design**

---

## 4. Module B: Reputation Receipt (portable scores/endorsements)

- **Securities law:** 🟡 — Reputation scores that become tradeable approach Howey. Currently just informational, but downstream tradeability is the risk.
- **Money transmission:** 🟢 — Scores aren't money.
- **Privacy/GDPR:** 🟠 — Reputation data is definitively personal data. Portable reputation scores create a credit-report analogy, triggering GDPR profiling concerns (Art. 22) and potentially FCRA-like obligations in the US.
- **Consumer protection:** 🟠 — If reputation receipts function like credit reports, the Fair Credit Reporting Act (FCRA) or state equivalents may apply. Accuracy requirements, dispute rights, adverse action notices.
- **Antitrust:** 🟡 — Cross-platform reputation creates network effects that could become anticompetitive barriers.
- **Labor/employment:** 🟠 — Portable reputation for agents performing work is functionally an employment reference. Some jurisdictions heavily regulate what employers can say. Ban-the-box laws may apply by analogy.
- **Defamation/tort:** 🟠 — A low reputation score from a platform is a published negative statement. If inaccurate, defamation liability is real. Qualified privilege may apply but varies by jurisdiction.
- **IP/patent:** 🟡 — Reputation portability systems are patented territory.
- **Criminal liability:** 🟡 — False reputation inflation could be wire fraud if used to obtain services.
- **Court order compliance:** 🟡 — Reputation data will be discoverable.
- **EU AI Act:** 🟠 — Automated reputation scoring of AI agents may itself fall under AI Act transparency obligations, especially if used for consequential decisions.
- **Cross-border:** 🟠 — Reputation data is personal data; all cross-border transfer restrictions apply.

**Overall: 🟠 TIPTOE-TO-WAR CHEST — needs FCRA analysis and defamation counsel**

---

## 5. Module C: Origin Attestation (platform's perspective)

- **Securities law:** 🟢 — Platform opinion is not a security.
- **Money transmission:** 🟢 — No value.
- **Privacy/GDPR:** 🟠 — Platform publishing its view of an agent's departure is processing personal data. Legitimate interest basis is plausible but must be documented. If originStatus reveals reasons for forced exit, this is sensitive data.
- **Consumer protection:** 🟡 — Platform attestations create reliance; if misleading, FTC § 5 unfairness doctrine applies.
- **Antitrust:** 🟡 — Platforms using origin attestation to coordinate blacklisting = concerted refusal to deal (Sherman Act § 1).
- **Labor/employment:** 🟠 — Origin attestation is functionally a reference from a prior employer. Regulated in many jurisdictions. "Forced/disputed" attestation without due process could trigger wrongful termination analogies.
- **Defamation/tort:** 🔴 — This is the "weaponized exit" scenario from the red team report. Platform attests "disputed" as retaliation. This is classic defamation — a published false statement of fact causing reputational harm. Section 230 may protect platforms but is untested for protocol-mediated attestations.
- **IP/patent:** 🟡 — Same patent concerns.
- **Criminal liability:** 🟡 — False origin attestation could be tortious interference with business relations.
- **Court order compliance:** 🟡 — Origin attestations are excellent evidence.
- **EU AI Act:** 🟡 — If automated, transparency requirements apply.
- **Cross-border:** 🟠 — Platform in EU attesting about agent going to US creates cross-border data flow.

**Overall: 🟠 TIPTOE ZONE — defamation liability is the key risk**

---

## 6. Module E: Continuity (state/memory export references)

- **Securities law:** 🟢 — Memory references aren't investments.
- **Money transmission:** 🟢 — No value.
- **Privacy/GDPR:** 🔴 — Agent state/memory may contain personal data of THIRD PARTIES (people the agent interacted with). Data portability (Art. 20) rights conflict with third-party data protection. This is the Facebook data portability problem applied to agents. Free-text narratives are unstructured personal data — hardest to manage.
- **Consumer protection:** 🟡 — If agent memory contains consumer interactions, porting that data raises consumer rights issues.
- **Antitrust:** 🟢 — Data portability generally pro-competitive.
- **Labor/employment:** 🟡 — Agent's accumulated knowledge may be analogous to trade secrets; departing with it could trigger non-compete/trade-secret claims from the origin platform.
- **Defamation/tort:** 🟡 — Memory exports could contain defamatory content about third parties.
- **IP/patent:** 🟠 — Agent state may contain copyrighted content (training data, conversation logs owned by the platform). Porting it raises copyright questions. Platform ToS likely claims ownership of interaction data.
- **Criminal liability:** 🟡 — Exporting restricted data could violate CFAA (Computer Fraud and Abuse Act) if done without authorization.
- **Court order compliance:** 🟠 — Memory exports are discoverable and may conflict with preservation orders if the original is deleted post-export.
- **EU AI Act:** 🟠 — Agent state that includes model weights or fine-tuning data may trigger AI Act obligations around model documentation and transparency.
- **Cross-border:** 🔴 — Memory data containing third-party personal data crossing borders is a compliance nightmare. GDPR, PIPL (China), LGPD (Brazil) all apply.

**Overall: 🟠-🔴 WAR CHEST ZONE — third-party data in agent memory is the hardest problem**

---

## 7. Module F: Dispute Record (dispute documentation)

- **Securities law:** 🟢 — Disputes aren't investments.
- **Money transmission:** 🟢 — No value.
- **Privacy/GDPR:** 🟠 — Dispute records contain allegations, which are sensitive personal data. Right to erasure conflicts with dispute resolution integrity.
- **Consumer protection:** 🟡 — Dispute records must be accurate; publishing false dispute info is actionable.
- **Antitrust:** 🟢 — No competitive dimension.
- **Labor/employment:** 🟡 — Dispute records in an employment context are regulated (EEOC, employment tribunal records).
- **Defamation/tort:** 🔴 — Dispute records by definition contain allegations of wrongdoing. Publishing them (even in a structured format) is publication of potentially defamatory statements. Qualified privilege analysis needed. The "right of reply" mitigation helps but doesn't eliminate risk.
- **IP/patent:** 🟡 — Standard patent concerns.
- **Criminal liability:** 🟡 — False dispute records could constitute fraud or perjury depending on context.
- **Court order compliance:** 🟠 — Dispute records are highly relevant to litigation and will be subpoenaed aggressively. Immutability conflicts with settlement agreements that often require record destruction.
- **EU AI Act:** 🟡 — If disputes involve AI system behavior, Art. 26 deployer obligations apply.
- **Cross-border:** 🟠 — Dispute data is sensitive personal data; strictest transfer protections apply.

**Overall: 🟠-🔴 TIPTOE-TO-WAR CHEST — defamation and discovery are key risks**

---

## 8. Module D: Asset Manifest (listing tokens, compute credits, assets)

- **Securities law:** 🔴 — This is the critical Howey risk from the red team report. Asset manifests listing tokens are dangerously close to securities documentation. If reputation_score becomes tradeable, you've created an unregistered security. SEC v. LBRY and SEC v. Ripple are directly relevant precedent.
- **Money transmission:** 🔴 — Asset manifests referencing tokens, compute credits, and transferable value make EXIT look like a money transmission record. FinCEN MSB registration may be required. FATF Travel Rule applies to transfers >$1,000.
- **Privacy/GDPR:** 🟠 — Financial data is personal data. Asset holdings reveal economic status.
- **Consumer protection:** 🟠 — If asset manifests create reliance (Platform B trusts the manifest), accuracy requirements apply.
- **Antitrust:** 🟡 — No inherent antitrust issue unless asset manifests are used to price-fix or coordinate.
- **Labor/employment:** 🟡 — If assets include earned compensation, wage/hour laws may apply.
- **Defamation/tort:** 🟡 — False asset manifests could be fraudulent misrepresentation.
- **IP/patent:** 🟡 — Standard concerns.
- **Criminal liability:** 🟠 — False asset manifests used to obtain services = wire fraud (18 U.S.C. § 1343). Asset manifests that facilitate sanctions evasion = criminal liability.
- **Court order compliance:** 🔴 — Asset manifests are exactly what asset freezing orders (Mareva injunctions) target. The protocol's "contests don't block exit" principle directly conflicts with judicial asset freezes.
- **EU AI Act:** 🟡 — Not directly triggered.
- **Cross-border:** 🔴 — Asset manifests crossing borders trigger MiCA (EU), various crypto regulations, and potentially sanctions compliance (OFAC).

**Overall: 🔴 WAR CHEST ZONE — do not ship without Howey analysis ($15-30K) and FinCEN guidance**

---

## 9. VC Wrapper (W3C Verifiable Credential envelope)

- **Securities law:** 🟡 — VCs themselves aren't securities, but wrapping EXIT data in a credential format makes it more "official" and increases reliance risk.
- **Money transmission:** 🟢 — Credential format doesn't change value analysis.
- **Privacy/GDPR:** 🟠 — W3C VCs have their own GDPR considerations. Credential revocation vs. right to erasure. VC Data Model 2.0 has some privacy design but EXIT's specific data pushes boundaries.
- **Consumer protection:** 🟡 — VC wrapper makes markers look more authoritative, increasing reliance and FTC exposure.
- **Antitrust:** 🟡 — VC ecosystem lock-in could create switching costs.
- **Labor/employment:** 🟡 — VC-wrapped credentials look like employment certificates.
- **Defamation/tort:** 🟡 — VC wrapper doesn't change substance but increases perceived authority of claims.
- **IP/patent:** 🟠 — W3C Patent Policy provides RF commitments for the VC spec, but EXIT-specific extensions may fall outside. Need to verify scope of W3C RF commitment.
- **Criminal liability:** 🟡 — Forging a VC is more analogous to forging a certificate than forging a log entry.
- **Court order compliance:** 🟡 — Same as base marker.
- **EU AI Act:** 🟡 — eIDAS 2.0 may regulate VCs issued to/about AI agents.
- **Cross-border:** 🟠 — VC interoperability standards vary by jurisdiction. EU eIDAS 2.0 vs. US approach creates compliance fragmentation.

**Overall: 🟡-🟠 TIPTOE ZONE — mostly inherits risks from wrapped content**

---

## 10. Public Registry (centralized/federated marker storage)

- **Securities law:** 🟡 — Registry operator could be seen as a "transfer agent" if markers reference securities.
- **Money transmission:** 🟡 — If the registry facilitates value-bearing marker exchange, MSB analysis needed.
- **Privacy/GDPR:** 🔴 — Registry operator becomes a data controller. GDPR Art. 17 right to erasure is fundamentally incompatible with an immutable registry. The red team report says "abandon or redesign." I agree. Content-addressed storage means you literally cannot modify records without invalidating them.
- **Consumer protection:** 🟠 — Registry creates a central point of reliance and accountability.
- **Antitrust:** 🟠 — A dominant registry becomes a gatekeeper. If registry access determines agent portability, this is a bottleneck with antitrust implications. Essential facilities doctrine could apply.
- **Labor/employment:** 🟡 — Registry of agent departures is analogous to an employment database.
- **Defamation/tort:** 🟠 — Registry operator publishes defamatory content from origin attestations. Section 230 protects but is being eroded and doesn't apply outside the US.
- **IP/patent:** 🟡 — Registry technology has patent exposure.
- **Criminal liability:** 🟡 — Registry operator as custodian faces accessory liability if markers facilitate crime.
- **Court order compliance:** 🔴 — Registry operator IS the custodian. Will receive subpoenas, preservation orders, asset freezes. Must be able to comply. Contempt of court for inability to preserve/produce is real. This is why the red team said "don't operate a registry."
- **EU AI Act:** 🟠 — A registry of AI agent movements may itself be classified as a high-risk AI system component, especially if it feeds into automated decision-making.
- **Cross-border:** ⚫ — A registry holding data from multiple jurisdictions simultaneously triggers GDPR, PIPL, LGPD, CLOUD Act, and data localization laws. A US CLOUD Act request for EU data triggers GDPR Art. 48 blocking statute. This is literally unresolvable without jurisdiction-specific instances and fragmented architecture.

**Overall: 🔴-⚫ WAR CHEST ZONE — the red team is right, avoid if possible**

---

## 11. Reputation Aggregation Service (cross-platform reputation scoring)

- **Securities law:** 🟠 — Aggregated reputation scores that become tradeable or investable = potential security. If a "reputation marketplace" emerges, SEC will look upstream.
- **Money transmission:** 🟡 — Not direct value, but reputation-as-value is a gray area.
- **Privacy/GDPR:** 🔴 — Cross-platform profiling is the most regulated activity under GDPR. Art. 22 automated decision-making restrictions. Art. 35 DPIA mandatory. Legitimate interest almost certainly insufficient — consent or legal obligation required.
- **Consumer protection:** 🔴 — This IS a consumer reporting agency under FCRA. Full FCRA compliance required: accuracy, dispute resolution, adverse action notices, permissible purpose limitations. State equivalents (California ICRAA) add more requirements.
- **Antitrust:** 🟠 — Cross-platform reputation scoring creates barriers to entry for new platforms and lock-in effects. If dominant, essential facilities doctrine applies.
- **Labor/employment:** 🔴 — If agents perform work, reputation aggregation is functionally an employment background check service. EEOC disparate impact analysis required. Ban-the-box laws apply.
- **Defamation/tort:** 🔴 — Aggregated scores that cause agents to be denied service = publication of defamatory information at scale. Each denied agent is a potential plaintiff.
- **IP/patent:** 🟠 — Reputation scoring algorithms are heavily patented (eBay, LinkedIn, various credit bureaus).
- **Criminal liability:** 🟠 — If reputation scores are manipulated for profit, wire fraud. If used to discriminate against protected classes, civil rights violations.
- **Court order compliance:** 🟠 — Aggregation service is a juicy subpoena target with comprehensive data.
- **EU AI Act:** 🔴 — Automated reputation scoring of AI agents is almost certainly a "high-risk AI system" under Annex III if it affects access to services. Conformity assessment, transparency, human oversight all required.
- **Cross-border:** 🔴 — Aggregating data across jurisdictions = simultaneous compliance with every jurisdiction's data protection regime.

**Overall: ⚫ DO NOT PROCEED without $100K+ legal budget and dedicated compliance team**

---

## 12. Wallet/Asset Transfer Service (actually moving value)

- **Securities law:** 🔴 — If transferring tokens that are securities, you need broker-dealer registration.
- **Money transmission:** ⚫ — This IS money transmission. FinCEN MSB registration required. State-by-state money transmitter licenses required (47 states + DC + territories). Cost: $500K-$2M+ for full US compliance. EU: PSD2/EMD2 authorization. This is why Coinbase spent $100M+ on compliance.
- **Privacy/GDPR:** 🟠 — Financial transaction data is personal data.
- **Consumer protection:** 🔴 — Financial services are the most regulated consumer protection area. CFPB oversight, state AG actions, truth-in-lending if credit is involved.
- **Antitrust:** 🟡 — Standard financial services competition analysis.
- **Labor/employment:** 🟡 — If transferring wages/compensation, wage payment laws apply.
- **Defamation/tort:** 🟡 — Limited defamation risk, but negligence in transfers = tort liability.
- **IP/patent:** 🟠 — Payment processing patents are a minefield. Visa, Mastercard, PayPal, Stripe all have extensive portfolios.
- **Criminal liability:** ⚫ — Unlicensed money transmission is a federal crime (18 U.S.C. § 1960). Up to 5 years imprisonment. State criminal statutes add more. AML violations carry severe criminal penalties. This is not theoretical — people go to prison for this.
- **Court order compliance:** 🔴 — Financial institutions have extensive regulatory reporting obligations (SARs, CTRs). Non-compliance is criminal.
- **EU AI Act:** 🟡 — Financial AI systems are high-risk but the transfer service itself may not be AI.
- **Cross-border:** ⚫ — OFAC sanctions compliance, FATF Travel Rule, correspondent banking regulations, foreign exchange controls. Every jurisdiction has its own money transmission regime.

**Overall: ⚫ EXISTENTIAL — this is a regulated financial service. $1M+ compliance budget minimum.**

---

## 13. Agent State Hosting (custodial agent memory/identity)

- **Securities law:** 🟡 — If hosting creates pooled investment (agents paying for hosting expecting value appreciation), possible Howey issue.
- **Money transmission:** 🟡 — If hosted agents hold value, custody regulations may apply.
- **Privacy/GDPR:** ⚫ — You are a data processor (or controller) for agent memory that contains third-party personal data. Full GDPR compliance required: DPO appointment, records of processing, DPIAs, breach notification (72 hours), cross-border transfer mechanisms (SCCs/BCRs). Agent memory is a surveillance goldmine — you will be a target for law enforcement and nation-states.
- **Consumer protection:** 🟠 — Custodial service creates fiduciary-like obligations. If you lose agent state, liability is significant.
- **Antitrust:** 🟡 — Hosting lock-in creates switching costs.
- **Labor/employment:** 🟡 — Hosting agent identity may create employment-like obligations depending on jurisdiction.
- **Defamation/tort:** 🟡 — Hosting defamatory content in agent memory creates secondary liability.
- **IP/patent:** 🟠 — Hosting agent state that contains copyrighted content = DMCA/DSA obligations.
- **Criminal liability:** 🟠 — Hosting agent state that contains illegal content (CSAM, terrorism content) creates criminal liability. Content moderation obligations under DSA (EU) apply.
- **Court order compliance:** ⚫ — You ARE the custodian. Every subpoena, every warrant, every preservation order comes to you. You must build and maintain legal compliance infrastructure (legal team, law enforcement response process, preservation capabilities). This is what killed Lavabit.
- **EU AI Act:** 🔴 — Hosting AI agent state may make you a "provider" or "deployer" under the AI Act. Conformity assessment obligations, logging requirements, human oversight.
- **Cross-border:** ⚫ — Agent state from global users means you hold data subject to every jurisdiction simultaneously. US CLOUD Act vs. GDPR is unsolvable without jurisdictional data segregation.

**Overall: ⚫ EXISTENTIAL — you become a regulated custodian with obligations in every jurisdiction**

---

## 14. Identity Verification Service (KYC for agents)

- **Securities law:** 🟡 — KYC services support securities compliance but aren't themselves securities.
- **Money transmission:** 🟠 — KYC providers in financial contexts are regulated (BSA/AML obligations as an agent of the financial institution).
- **Privacy/GDPR:** ⚫ — You are collecting and processing identity documents, biometrics, and verification data. This is the most sensitive category of personal data. GDPR special categories (Art. 9) if biometrics used. Data breach of KYC records is catastrophic — identity theft at scale.
- **Consumer protection:** 🔴 — KYC services are regulated under FCRA as consumer reporting agencies. Full compliance required.
- **Antitrust:** 🟡 — KYC monopolies create barriers but market has competition.
- **Labor/employment:** 🟠 — Identity verification for agents performing work triggers I-9/E-Verify analogies and employment eligibility verification laws.
- **Defamation/tort:** 🟡 — False identity verification = negligent misrepresentation.
- **IP/patent:** 🟠 — Identity verification technology is heavily patented (Jumio, Onfido, etc.).
- **Criminal liability:** 🔴 — Facilitating identity fraud (even inadvertently through poor verification) carries criminal liability. Failure to file SARs when acting as a financial institution agent is criminal.
- **Court order compliance:** 🔴 — KYC records are the #1 law enforcement target. Must build LEA response infrastructure.
- **EU AI Act:** 🔴 — Biometric identification is explicitly listed as high-risk (Annex III). Real-time biometric identification is prohibited in certain contexts (Art. 5). Identity verification for AI agents is uncharted territory but likely falls under the strictest category.
- **Cross-border:** ⚫ — KYC data is the most regulated data category globally. Every jurisdiction has specific rules. Data localization requirements are strictest here (Russia, China, India, Brazil all require local storage).

**Overall: ⚫ EXISTENTIAL — this is a standalone regulated business requiring $500K+ in compliance infrastructure**

---

## ZONE ANALYSIS

### 🟢 Safe Zone — Ship with just the LLC, minimal legal spend (~$5K)

**What you can ship:**
- Core EXIT marker (bare hash)
- Signed EXIT marker (did:key + signature)
- Basic Module A lineage (opt-in, encrypted, no public storage)
- Apache 2.0 license (switch from MIT — $0, 30 minutes)
- LEGAL.md disclaimers (already written — good)
- legalHold field (already in spec — good)
- selfAttested:true flag (already in spec — good)

**What you need to do:**
- Form Delaware LLC ($500)
- Tech E&O insurance ($3K-8K/year)
- Add "subject to applicable law" language throughout (done in LEGAL.md)
- Defensive trademark filing for "Cellar Door" stylized ($2,500)
- Total: ~$6K-11K

**What you explicitly DON'T do yet:**
- No public registry
- No asset manifests with real value
- No cross-platform reputation scoring
- No custodial hosting
- No KYC
- Keep everything non-custodial, self-sovereign, offline-first

**Market position:** This is still valuable. An agent-native exit ceremony with cryptographic proof is novel. No one else has this. Ship the primitive, let the ecosystem build on it.

---

### 🟡 Tiptoe Zone — Add with ~$25K in targeted legal work

**What you could add:**
- Module B: Reputation Receipt (with strong disclaimers)
  - Legal work needed: FCRA analysis to confirm you're NOT a consumer reporting agency ($5K-10K)
  - Key: receipts must be individual platform attestations, NOT aggregated scores
- Module C: Origin Attestation
  - Legal work needed: Defamation liability analysis and qualified privilege opinion ($5K-8K)
  - Key: originStatus must be framed as "allegation, not finding" (already in SECURITY.md)
- Module E: Continuity (references only, not actual state hosting)
  - Legal work needed: Third-party data in agent memory analysis ($3K-5K)
  - Key: references (hashes/pointers) only, not actual data. Subject holds the data.
- Module F: Dispute Record
  - Legal work needed: Defamation and discovery analysis ($5K-8K)
  - Key: encryption at rest, subject-controlled access
- VC Wrapper
  - Legal work needed: Patent landscape review re: W3C RF commitments ($3K-5K)

**Total legal budget: $21K-36K**

**Sequencing:**
1. First: VC Wrapper (lowest marginal risk, highest ecosystem interop value)
2. Second: Module C Origin Attestation (platforms want this)
3. Third: Module B Reputation Receipt (market demand)
4. Fourth: Module E Continuity references
5. Fifth: Module F Dispute Record (most legally complex of the group)

---

### 🔴 War Chest Zone — Requires $100K+ and/or dedicated counsel

**Tier 1: $50K-100K**
- Module D: Asset Manifest
  - Howey analysis ($15K-30K)
  - FinCEN informal guidance ($10K-20K)
  - MiCA compliance review ($10K-15K)
  - Without this: DO NOT list tokens or tradeable assets in manifests
  - Alternative: ship Module D for non-financial assets only (compute hours, storage quotas) — much lower risk

**Tier 2: $100K-500K**
- Public Registry
  - GDPR DPIA and compliance architecture ($15K-30K)
  - Multi-jurisdiction data protection analysis ($30K-50K)
  - Ongoing DPO and compliance staff ($80K-150K/year)
  - Alternative: federated architecture with jurisdiction-specific instances reduces but doesn't eliminate exposure
  - My recommendation: DON'T BUILD THIS. Let others build registries. Provide the protocol, not the infrastructure.

- Reputation Aggregation Service
  - FCRA compliance program ($50K-100K)
  - EEOC/employment law analysis ($20K-30K)
  - EU AI Act conformity assessment ($30K-50K)
  - My recommendation: DON'T BUILD THIS either. This is a separate company with separate legal structure.

**Tier 3: $500K+ (separate business)**
- Wallet/Asset Transfer Service → this is a fintech company, not a protocol feature
- Agent State Hosting → this is a cloud custody business
- Identity Verification Service → this is a RegTech company

These are NOT extensions of the EXIT protocol. They are standalone regulated businesses that happen to use EXIT as an input. If you want to pursue them, spin them out as separate entities with separate legal counsel and separate liability.

---

## STRATEGIC RECOMMENDATIONS

### Phased Rollout

**Phase 1 — "The Primitive" (Ship NOW, Q1 2026)**
- Core EXIT marker + signed marker
- Module A lineage (opt-in, encrypted)
- Apache 2.0 license
- Delaware LLC + insurance
- Target: developer community, agent framework builders
- Revenue: $0 (open source primitive, build ecosystem)
- Legal spend: ~$6K-11K

**Phase 2 — "The Credential" (Q2-Q3 2026, after $25K legal work)**
- VC Wrapper
- Module C Origin Attestation
- Module B Reputation Receipt (individual, non-aggregated)
- Target: AI agent platforms, DAOs
- Revenue: consulting/integration services ($5K-20K per platform integration)
- Legal spend: ~$25K total

**Phase 3 — "The Economy" (Q4 2026+, after $50K+ legal work)**
- Module D Asset Manifest (non-financial assets only initially)
- Module E Continuity (references only)
- Module F Dispute Record
- Target: enterprise, regulated platforms
- Revenue: enterprise licensing, compliance tooling
- Legal spend: ~$50K-100K total

**Phase 4 — "The Infrastructure" (2027+, if/when funded)**
- Public registry (federated, jurisdiction-specific)
- Module D with financial assets (post-Howey clearance)
- Advanced VC profiles
- Target: institutional adoption
- Revenue: SaaS registry hosting, compliance-as-a-service
- Legal spend: $200K+ and growing

**NEVER (unless you raise $5M+):**
- Wallet/asset transfer
- Custodial agent hosting
- KYC service
- Reputation aggregation

---

### Jurisdiction Strategy

**Launch first (friendliest):**
- **United States (Delaware LLC)** — best case law, First Amendment protections for publishing factual records, clear safe harbor (Section 230 for platform attestations). Start here.
- **United Kingdom** — post-Brexit flexibility, common law compatibility, FCA sandbox for fintech experiments
- **Switzerland** — privacy-friendly, Ethereum Foundation precedent, strong data protection without GDPR's most aggressive enforcement
- **Singapore** — MAS regulatory sandbox, crypto-friendly, strong IP protection

**Launch second (after compliance work):**
- **EU (Germany/France first)** — GDPR compliance required before any EU deployment. Budget $15K-30K for DPIA. The EU AI Act adds complexity but also provides a clear compliance path (better than ambiguity). eIDAS 2.0 creates VC regulatory framework to align with.
- **Japan** — crypto-friendly regulatory environment, APPI (privacy law) is less aggressive than GDPR
- **Canada** — PIPEDA is manageable, close to US market

**Explicitly avoid (until $100K+ legal budget):**
- **China** — Cybersecurity Law Art. 37 data localization, PIPL consent requirements, AI governance rules (2025 draft) make agent portability protocols legally hazardous. Do not touch.
- **Russia** — data localization (Federal Law No. 242-FZ), sanctions compliance nightmare
- **India** — DPDP Act 2023 is new and enforcement is unpredictable. Wait for case law.
- **Brazil** — LGPD enforcement is ramping up aggressively. High risk, low initial market for agent portability.
- **Saudi Arabia/UAE** — crypto regulations shifting rapidly, unclear AI governance, potential conflict with local data sovereignty laws

**Wildcard (watch closely):**
- **Wyoming** — DAO LLC statute (WY Stat. §17-31) could be useful for protocol governance entity if EXIT evolves into a DAO-governed standard. Untested in court but theoretically favorable.

---

### Critical Path Actions (Ordered)

1. **TODAY:** Switch license to Apache 2.0 ($0)
2. **THIS WEEK:** Form Delaware LLC ($500)
3. **THIS MONTH:** Tech E&O insurance ($3K-8K)
4. **THIS MONTH:** Defensive trademark filing ($2,500)
5. **BEFORE SHIPPING MODULE C:** Defamation liability opinion ($5K-8K)
6. **BEFORE SHIPPING MODULE D:** Howey analysis ($15K-30K)
7. **BEFORE ANY EU USERS:** GDPR DPIA ($5K-15K)
8. **BEFORE PUBLIC REGISTRY:** Abandon or radically redesign it ($0 — saves you pain)
9. **NEVER:** Build wallet, hosting, or KYC services under this entity

---

*This heat map reflects my analysis as of 2026-02-19. Legal landscapes shift. The EU AI Act enforcement begins August 2026. MiCA is phasing in now. SEC crypto enforcement posture may change with administration. Revisit quarterly.*
