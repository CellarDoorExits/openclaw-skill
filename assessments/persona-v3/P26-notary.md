# P26 — Civil Law Notary / Notary Public

**Persona:** Civil Law Notary with jurisdiction over authentication, witnessing, and verification of legal instruments  
**Document reviewed:** EXIT Protocol Specification v1.1; EXIT Paper v5 (Passage Protocol)  
**Date:** 2026-02-25  
**Classification:** Professional Opinion — Notarial Analysis

---

## Executive Summary

EXIT Protocol borrows the language and some structural patterns of notarial practice but does not perform notarial acts in any legally recognized sense. The term "process notary" is aspirational metaphor, not functional description. EXIT is better understood as a **self-authenticating attestation service** — a system for producing signed declarations that may, with additional infrastructure, eventually support evidentiary use.

**Verdict: Would-Not-Notarize** in its current form. The protocol lacks the essential elements a notary requires: verified natural or juridical persons, physical or legally-equivalent presence, and connection to a recognized legal framework. However, the architecture is sound enough that with specific additions, EXIT markers could become *exhibits* a notary might authenticate — and that is a meaningful achievement.

---

## 1. Does EXIT's "Process Notary" Claim Hold Up?

**No, but it's closer than you'd expect.**

A notary public performs four core functions:

1. **Identity verification** — confirming the signer is who they claim to be
2. **Witnessing** — being present (physically or via authorized remote means) during execution
3. **Authentication** — affixing a seal/signature attesting the act was performed correctly
4. **Record-keeping** — maintaining a notarial journal as an independent evidentiary record

EXIT performs rough analogs of functions 2–4 but completely omits function 1.

**Identity verification** is the bedrock of notarial practice. A notary who authenticates a document without verifying identity commits malpractice per se in every jurisdiction I'm aware of. EXIT's "identity" is a DID — a self-generated cryptographic identifier with no connection to a natural or juridical person. `did:key:z6Mk...` tells me a key exists, not who holds it. This is the protocol's fundamental notarial deficiency.

**Witnessing** has a partial analog. The ceremony state machine (§5) — ALIVE → INTENT → SNAPSHOT → OPEN → FINAL → DEPARTED — structurally resembles a witnessed execution ceremony. The `witnessed` confirmation level (§7.1) explicitly contemplates third-party attestation. But EXIT "witnesses" are cryptographic co-signers, not persons with legal standing to testify. A notary's witness capacity derives from their commission; EXIT's derives from possession of a signing key.

**Authentication** is where EXIT is strongest. The cryptographic proof structure — Ed25519/P-256 signatures over canonicalized content — provides stronger tamper-evidence than a notarial seal. A forged notarial stamp is detectable only by an expert examining the physical document or contacting the notary's commissioning authority. A forged EXIT signature is detectable by anyone with the public key in milliseconds. As a pure authentication mechanism, EXIT exceeds traditional notarial practice.

**Record-keeping** has two analogs: RFC 3161 timestamp anchoring (§11.3) and git ledger anchoring (§11.4). Neither constitutes a notarial journal. A notarial journal is maintained by a commissioned officer under penalty of law; these are maintained by software under no legal obligation. However, the *structure* — append-only, timestamped, content-addressed — mirrors notarial journal best practices better than many actual notaries' handwritten logbooks.

**Assessment:** EXIT performs a ceremony that *resembles* notarial authentication but lacks the legal predicates that make notarial acts legally operative. It is a process verification system, not a process notary.

---

## 2. Notarial Functions Performed vs. Lacking

### Performed (Functional Analogs)

| Notarial Function | EXIT Analog | Quality |
|---|---|---|
| Acknowledgment (signer acknowledges signing voluntarily) | `exitType: voluntary` + subject signature | Partial — no identity verification |
| Jurat (signer swears content is true) | `selfAttested: true` flag | Honest — explicitly marks self-attestation as unverified |
| Protest (formal notice of dishonor) | `exitType: forced` + Module C dispute bundle | Strong structural analog |
| Attestation of copy | Content-addressed `id` (SHA-256 hash) | Technically superior to notarial attestation |
| Depositions / sworn statements | Module E narrative + `rightOfReply` | No oath, no legal consequence for falsehood |
| Safekeeping of documents | Checkpoint markers (§5.5, §20) in escrow | Conceptually sound; no regulated custodian |

### Lacking (No Analog)

| Notarial Function | Gap |
|---|---|
| **Identity verification (personal knowledge or satisfactory evidence)** | DIDs are pseudonymous; no link to legal identity |
| **Competence/willingness assessment** | No mechanism to assess whether the "signer" understands the act or acts under duress (coercion *detection* exists but is heuristic, not a human assessment) |
| **Administration of oaths** | No oath mechanism; `selfAttested` is explicit about this |
| **Notarial seal/commission** | No commissioning authority; no regulated credential |
| **Journal of notarial acts** | Git ledger is structural but not legally mandated or regulated |
| **Venue/jurisdiction identification** | No jurisdiction field; markers are jurisdiction-agnostic by design |
| **Apostille / authentication chain for cross-border use** | No Hague Convention compliance pathway |

---

## 3. Is the "Departure Ceremony" Analogous to Any Existing Notarial Act?

The closest analog is the **protested bill of exchange** — a formal notarial act recording that a financial instrument was presented, dishonored, and protested. The ceremony follows a prescribed sequence:

1. Presentment (INTENT)
2. Dishonor / response (OPEN → CONTESTED)
3. Formal protest with notation of circumstances (FINAL)
4. Recording (DEPARTED + anchoring)

The EXIT ceremony mirrors this structure almost exactly, particularly in the forced/disputed exit path. The protest analogy is strong because:

- Both record an event the other party may dispute
- Both follow a prescribed state progression
- Both preserve the protester's account alongside the other party's response
- Both create a portable record for use in subsequent proceedings

A secondary analog is the **proof of service** — a notarial act attesting that legal process was served. EXIT's unilateral path (departure without origin cooperation) resembles service by publication or alternative service: the departing entity creates a verified record of its departure even when the origin refuses to participate.

A weaker analog is the **notarial will** (civil law jurisdictions) — a document executed through a prescribed ceremony with specific formal requirements, where the ceremony itself confers legal validity. EXIT's ceremony state machine has this flavor, but without a commissioned officer presiding, the ceremony is procedural rather than juridical.

---

## 4. Liability Exposure for a Real Notary Performing EXIT's Role

If I were asked to notarize an EXIT marker — to affix my seal attesting that this departure occurred as described — I would face the following liability concerns:

### Immediate Disqualifying Issues

**No personal appearance.** In 48 U.S. states and all civil law jurisdictions, a notarial act requires the signer to appear before the notary (physically or via authorized remote online notarization). An AI agent cannot appear. RON statutes require credential analysis and knowledge-based authentication of a *person*. An agent is not a person under any current notary commission statute.

**No satisfactory evidence of identity.** My commission requires me to verify identity through government-issued photo ID or personal knowledge. A DID is neither. I cannot verify that the holder of `did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK` is the entity described in the marker.

**Unauthorized practice concerns.** Notarizing a document for a non-person entity outside established corporate acknowledgment procedures could constitute unauthorized practice or, worse, facilitating fraud.

### If These Were Resolved (Hypothetical Future)

Assuming future legislation recognizes agent legal capacity and authorizes notarization of agent instruments:

**Standard of care liability:** A notary who certifies a `good_standing` status based solely on `selfAttested: true` is certifying something they have no independent knowledge of. This would be equivalent to notarizing a jurat without administering the oath — per se negligence.

**Errors & omissions exposure:** The `mutual` and `witnessed` confirmation levels (§7.1) would reduce E&O exposure because the notary could point to independent corroboration. `self_only` confirmation would be indefensible — I'd be certifying a self-serving declaration.

**Surety bond risk:** Most notary bonds cover $5,000–$25,000 per act. If EXIT markers govern agent operations worth significant sums (the economic module suggests this is contemplated), the bond would be grossly inadequate.

**Estimated exposure:** Under current law, any notary who purported to notarize an EXIT marker would risk commission revocation, civil liability for negligent notarization, and potential criminal liability for false notarization (a felony in several states).

---

## 5. Is "Attestation Service" a Better Label Than "Process Notary"?

**Yes, unequivocally, but with qualification.**

The correct taxonomy, from most to least accurate:

| Term | Accuracy | Why |
|---|---|---|
| **Cryptographic attestation protocol** | ★★★★★ | Precisely describes what EXIT does: cryptographically signed attestations of departure events |
| **Self-authenticating record system** | ★★★★☆ | Emphasizes the self-contained verification property |
| **Attestation service** | ★★★★☆ | Correct but slightly implies a service provider; EXIT is non-custodial |
| **Departure certification protocol** | ★★★☆☆ | "Certification" implies authority EXIT doesn't possess |
| **Process notary** | ★★☆☆☆ | Evocative but legally misleading; implies commissioned authority |
| **Digital notary** | ★☆☆☆☆ | Would invite regulatory scrutiny and misrepresent capabilities |

**Recommended terminology:** "Cryptographic attestation protocol" for technical contexts. "Departure attestation service" for general audiences. Avoid "notary" in any official capacity — the term is legally regulated in most jurisdictions (e.g., California Government Code §8200 et seq.; German Beurkundungsgesetz).

The paper's own framing as a "communications protocol" (§7.1 of the paper) is actually the safest legal classification. I'd endorse that.

---

## 6. What Would It Take to Make EXIT Markers Legally Admissible as Evidence?

Admissibility requires clearing several evidentiary hurdles. Here is a jurisdiction-by-jurisdiction pathway:

### United States (Federal Rules of Evidence)

**FRE 901 — Authentication:** EXIT's cryptographic signatures satisfy authentication requirements *if* the key-to-person binding can be established. Current DIDs fail this. **Fix:** Bind DIDs to registered legal entities through a qualified identity provider or custodial registration.

**FRE 803(6) — Business Records Exception:** EXIT markers could qualify as business records if: (a) created at or near the time of departure, (b) by a person with knowledge or from information transmitted by such a person, (c) kept in the course of regularly conducted business activity, and (d) it was the regular practice to make such records. The git ledger + regular ceremony practice could satisfy (c) and (d). **Fix:** Establish EXIT marker creation as standard operating procedure; maintain the git ledger as a business record.

**FRE 902(13)/(14) — Self-Authenticating Electronic Records:** Certified records generated by an electronic process may be self-authenticating with a written declaration. EXIT markers with RFC 3161 timestamps from a qualified TSA could qualify. **Fix:** Use a TSA whose certificates are independently verifiable; prepare a §902(13) certification declaration.

**Daubert standard (expert testimony):** If challenged, the cryptographic verification methodology would need to satisfy Daubert — testable, peer-reviewed, known error rate, generally accepted. Ed25519 satisfies all four prongs. The confidence scoring (§7.4) is more vulnerable — it's a novel scoring model without independent validation.

### European Union (eIDAS)

**Qualified Electronic Signatures (QES):** EXIT signatures are *advanced* electronic signatures (unique to signer, capable of identifying signer, under sole control, linked to data) but not *qualified* (no qualified certificate from a trust service provider). **Fix:** Issue signing keys through an eIDAS-qualified trust service provider.

**Qualified Electronic Time Stamps:** RFC 3161 timestamps from an EU-qualified TSA have legal presumption of accuracy under eIDAS Art. 42. EXIT already supports this pathway. **Fix:** Use a qualified TSA (not `freetsa.org`, which is not EU-qualified).

**Qualified Electronic Registered Delivery:** The Passage Protocol (EXIT + ENTRY) resembles registered delivery. If operated by a qualified provider, the full passage could carry legal presumption under eIDAS Art. 44. This is the most promising EU pathway.

### Practical Requirements Summary

| Requirement | Current State | Needed |
|---|---|---|
| Identity binding to legal persons | ❌ Pseudonymous DIDs | Qualified identity provider integration |
| Commissioned or regulated operator | ❌ Non-custodial | Optional regulated operator mode |
| Qualified timestamps | ⚠️ Structural verification only | Full cryptographic TSA verification + qualified TSA |
| Chain of custody documentation | ⚠️ Git ledger (not legally tested) | Certified records custodian or qualified trust service |
| Jurisdictional nexus | ❌ Jurisdiction-agnostic | Venue/jurisdiction field in schema |
| Expert witness availability | ⚠️ Novel protocol | Published methodology; peer review; expert pool |
| Established error rates | ✅ Cryptographic primitives well-characterized | Document protocol-level error rates |

---

## Professional Opinion

EXIT Protocol is a well-engineered cryptographic attestation system that borrows structural patterns from notarial practice without performing notarial acts. This is not a criticism — the protocol's designers appear to understand the distinction (the `selfAttested` flag is, from a notarial perspective, refreshingly honest about the limits of self-certification).

**What impresses me:**

- The ceremony state machine is more rigorous than most notarial procedures I've witnessed. Many notaries skip steps; EXIT's state machine enforces them.
- The anti-weaponization clause (§8.6) addresses a concern that notarial practice has historically handled poorly — the misuse of authenticated documents as weapons.
- The commit-reveal mechanism (§7.2) solves a problem notaries face constantly: proving that a document existed before a contested event. RFC 3161 integration is the right approach.
- Content-addressed identifiers provide stronger attestation of document integrity than any notarial seal.
- The right of reply (§8.4) is better than most notarial systems, which typically don't allow the other party to attach a counter-narrative.

**What concerns me:**

- The term "process notary" will create confusion and potentially regulatory exposure. Regulated notary terms include *Notar* (Germany), *notaire* (France), and *notary public* (common law). Using these terms without commission is, in some jurisdictions, a misdemeanor.
- Self-attested `good_standing` is equivalent to a self-notarized affidavit — a logical contradiction. The protocol knows this (§5.1 of the paper calls it "cheap talk"), but downstream consumers may not.
- The confidence scoring model (§7.4) uses terms like `high` and `very_high` that imply certainty a notary would never claim without independent verification. The paper recommends treating these as `confidenceHint` — I strongly concur.
- No jurisdiction field means I cannot determine which law governs the marker or which courts have jurisdiction over disputes.

---

## Verdict

### Would-Notarize ✅

- **The cryptographic proof structure** — I would authenticate that a given signature was verified against a given public key. This is a factual attestation within my competence.
- **A Passage record with mutual attestation** (`witnessed` or `mutual` confirmation) — I could notarize a declaration that "both parties attest these facts," similar to a bilateral acknowledgment.
- **RFC 3161 timestamp receipts** from a qualified TSA — these are already within notarial practice in many EU jurisdictions.
- **The ceremony log** as a business record, if maintained by an identified legal person under regular business practices.

### Would-Not-Notarize ❌

- **Self-attested status claims** — I cannot authenticate a self-serving declaration with no independent verification. This would be negligent notarization.
- **Any marker where I cannot verify the signer's identity** — which is currently all of them, since DIDs don't resolve to legal persons.
- **Confidence scores as findings of fact** — these are algorithmic assessments, not witnessed facts.
- **The marker as a whole** as a "notarized departure record" — the instrument has no legal character I can certify under my commission.

---

## Recommended Terminology

**Use:** "Cryptographic departure attestation," "verifiable departure record," "signed departure marker"

**Avoid:** "Process notary," "digital notary," "notarized exit," "certified departure"

**If the protocol community insists on a notarial metaphor:** "Departure protest" (protesto) is the most defensible term — it's an actual notarial act with structural parallels, and it doesn't imply the presence of a commissioned officer.

---

*This opinion is provided in my capacity as a notarial professional reviewing a technical specification. It does not constitute legal advice and should not be relied upon as a substitute for consultation with licensed counsel in the relevant jurisdiction.*

*Respectfully submitted,*  
*P26 — Civil Law Notary / Notary Public*
