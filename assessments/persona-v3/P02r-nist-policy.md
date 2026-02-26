# P02r: NIST Policy Review — EXIT Protocol (Re-evaluation)

**Reviewer Persona:** Policy Analyst, NIST AI Standards Coordination  
**Date:** 2026-02-25  
**Prior Review:** P02 (2026-02-24) — Verdict: Monitor  
**Documents Reviewed:** NIST_RFI_v2.md, GOVERNANCE.md, P02 prior assessment  
**Format:** Delta Assessment Memo

---

## 1. What Changed Since P02

| Prior Gap | Current Status | Assessment |
|-----------|---------------|------------|
| FIPS non-compliant (Ed25519 only) | ECDSA P-256 (FIPS 186-5) added as built-in algorithm; HSM integration guidance for FIPS 140-2/3 (CloudHSM, Azure, YubiKey) | **Resolved.** Federal deployment path now exists without protocol modification. |
| No governance files | GOVERNANCE.md present: decision process, RFC for breaking changes, DECISIONS.md architecture log | **Partially addressed.** Structure exists but governance is still "benevolent dictator" with a single maintainer. |
| 368 tests | 399 tests (322 EXIT + 77 ENTRY) | Incremental improvement. ENTRY protocol now tested. |
| ENTRY protocol incomplete | ENTRY v1.0 shipped: admission policies, probation, capability scoping, claim tracking, revocation | **Resolved.** Full Passage (EXIT→ENTRY) chain now operational. |
| No trust signal graduation | Trust enhancers shipped: 6-level status confirmation, tenure attestation, commit-reveal, confidence scoring | **Resolved.** Addresses the "cheap talk" problem noted in P02 §3. |
| No observability | OpenTelemetry integration noted | Minor but positive for operational maturity. |
| v0.1.x | v0.2.0 shipped | Still pre-1.0 but progressing. |

---

## 2. What Has NOT Changed

The structural concerns from P02 remain:

1. **No empirical demand signal.** Still no production deployments, enterprise pilots, or letters of support from platform operators. The demand case remains reasoned, not demonstrated.
2. **Solo project.** Single maintainer (Warren Koch), no institutional affiliation, no co-authors, no advisory board. GOVERNANCE.md acknowledges this openly ("benevolent dictator — simple and fast while the contributor base is small").
3. **Not peer-reviewed.** No academic publication, no independent security audit, no multi-implementation interop test.
4. **No W3C engagement.** Custom JSON-LD context remains standalone. No Community Group submission. JCS canonicalization mismatch persists.
5. **HOLOS framing.** The broader ontological framework (LOCUS/SIGNUM/SENSUS) remains a perception risk for standards audiences.

---

## 3. Impact on EO 14110 / AI RMF Alignment

The FIPS P-256 addition materially strengthens the federal relevance case. Previously, any NIST-adjacent work would have required algorithm modification — that barrier is removed. The abstract `Signer` interface with explicit HSM guidance (RFI §5.1) is exactly the pattern federal integrators expect.

The complete Passage chain (EXIT + ENTRY) strengthens the AI RMF Manage function mapping. Admission policies with presets (OPEN_DOOR, STRICT, EMERGENCY_ONLY) provide a concrete governance toolkit, not just departure records.

Trust enhancers address the P02 §3 gap on measurement consistency — confidence scoring provides a composite metric, though it remains non-normative.

Alignment upgrades from **Moderate-Strong** to **Strong** on the narrow question of agent lifecycle governance. The broader AI safety mandate gap remains.

---

## 4. Updated Verdict

**Monitor** (unchanged, but closer to threshold)

The FIPS compliance addition was the most actionable gap from P02 and it's been addressed — quickly and cleanly. The ENTRY protocol completion and trust enhancers show the project is maturing on a technical axis. The governance file, while thin, shows standards-awareness.

However, the verdict-changing factors remain unmet:

- **No second implementer.** A standard requires multi-implementation evidence. One codebase, however well-tested, is a reference implementation, not an ecosystem.
- **No production use.** The jump from "tested with synthetic data" to "deployed in production" is the primary signal NIST needs.
- **No community.** Governance for one person is not governance — it's project management.

---

## 5. What Would Change the Verdict to "Recommend Engagement"

Any **two** of the following would trigger re-evaluation to Recommend:

1. **A second independent implementation** of the EXIT or ENTRY protocol (any language, any framework) demonstrating interop with the reference implementation.
2. **A production deployment** at an identifiable organization, even a small one, with public acknowledgment.
3. **W3C Community Group submission** of the EXIT/ENTRY vocabulary, or formal liaison with the Verifiable Credentials working group.
4. **An independent security audit** or academic peer review of the cryptographic protocol.
5. **A multi-stakeholder governance body** — even 3 people from different organizations on an advisory board.
6. **Adoption by an agent framework** as a built-in feature (not a third-party integration package) — e.g., LangChain, CrewAI, or AutoGen shipping EXIT support natively.

Any **one** of the following would trigger immediate Recommend:

- A **major cloud provider or AI platform** (OpenAI, Anthropic, Google, Microsoft, AWS) publicly expressing interest in or piloting the protocol.
- **Inclusion in a W3C or IETF working group charter** as a work item.

---

## 6. Recommended Actions (Updated)

Prior recommendations from P02 remain valid. Additional:

- **Acknowledge the FIPS remediation.** The project responded to a concrete federal requirement gap. This is a positive maturity signal.
- **If NIST convenes an agent interoperability workshop**, the submitter should be invited as a technical contributor. The Passage chain (EXIT→ENTRY) is the most complete open specification for agent mobility currently available, regardless of adoption status.
- **Track for the "second implementer" signal.** This is the most likely near-term trigger for verdict change.
- **Do not reference the EXIT Protocol in NIST publications at this time.** The "Monitor" posture remains appropriate.

---

*Assessment by NIST AI Standards Coordination (simulated persona). This is an internal evaluation exercise, not an official NIST document.*
