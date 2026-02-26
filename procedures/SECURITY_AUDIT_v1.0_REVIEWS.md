# Security Audit Procedure v1.0 — Independent Reviews

**Document Under Review:** PROC-SEC-001 v1.0-DRAFT  
**Review Date:** 2026-02-26  
**Reviews Requested By:** Hawthorn  

---

## Review 1: Red Team Operator (P19)

### Overall Verdict: **Approve with Conditions**

This procedure is a solid starting point but has meaningful gaps that an adversary would exploit. It's structured around "check the box" verification — which means a clever attacker (or a lazy auditor) can satisfy every checklist item while the system remains exploitable.

### Gaps Identified

1. **No runtime/dynamic analysis.** Every pass is static code review. There's no fuzzing, no property-based testing, no attempt to *run* the code in adversarial conditions. You can read source all day and miss bugs that only manifest under load, race conditions, or malformed input sequences.

2. **No adversarial ceremony testing.** Pass 2 checks that the state machine "enforces valid transitions" — but does anyone actually *try* invalid transitions? Where's the negative test matrix? A red team would script 50 malformed ceremony flows and see what breaks.

3. **No network-level threat model.** This is a protocol library, but there's zero consideration of transport. Who delivers markers? What happens with MITM on the transport layer? Is there relay pinning? The procedure assumes the library exists in a vacuum.

4. **Replay attacks get a surface-level check.** "Replay detection via content-addressed IDs (128-bit minimum)" — this checks that IDs are long enough, but not that the *system* actually rejects replayed markers. Where's the test? Content-addressing prevents accidental collision, not intentional replay.

5. **No timing oracle assessment.** The crypto pass mentions "constant-time comparison for signature verification (library-level)" but only checks that the *library* does it. What about application-level timing? Does the verification path short-circuit on certain error types, leaking information about *which* check failed?

6. **The procedure is gameable.** Each pass is a checklist with binary pass/fail. An auditor can write "PASS — library uses constant-time comparison" without actually verifying the call path. There's no requirement for *evidence depth* — a one-line statement counts the same as a full trace.

7. **No multi-party attack scenarios.** The threat model doesn't consider collusion — two parties in a ceremony cooperating to produce a marker that disadvantages a third. Or a compromised module source feeding poisoned trust data.

8. **Missing: key compromise recovery.** What happens when a private key is leaked? Is there revocation? Rotation? The procedure doesn't audit for key lifecycle *after* generation.

9. **No build reproducibility check.** Supply chain pass checks dependencies but not whether the *build output* is deterministic. An attacker could compromise the build pipeline without touching any dependency.

10. **Self-assessment bias is unmitigated.** The procedure acknowledges it's a self-assessment in the attestation template but doesn't include any structural controls against confirmation bias — no requirement for independent verification, no "devil's advocate" pass.

### Suggested Additions

1. **Add Pass 7: Adversarial Testing (ADVERSARIAL).** Dedicated fuzzing of all public API entry points. Property-based testing of ceremony state machine. Negative test cases for every security-critical path. Minimum: 1000 malformed inputs per entry point.

2. **Require evidence artifacts.** Each checklist item must include: (a) file/line reference, (b) test case that exercises the check, (c) negative test case that proves the check catches violations. "PASS" with no evidence = "NOT ASSESSED."

3. **Add attack tree documentation.** Before auditing, document the top 10 attack scenarios. Each pass must map its findings to at least one attack tree path. If an attack tree path has no coverage, that's a gap.

4. **Add a "gameability" self-check.** After completing all passes, the auditor must answer: "Could this system pass all checks and still be compromised? How?" Document the answer.

5. **Include key compromise scenario.** Audit must verify: what happens if every private key in the system is leaked tomorrow? Is there a recovery path? Is it documented?

6. **Require reproducible builds verification.** `npm pack` → hash → rebuild → hash → compare. If hashes differ, supply chain pass fails.

### Sign-Off Statement

> I conditionally approve this procedure. The static analysis framework is thorough, but the complete absence of dynamic/adversarial testing is a critical gap. A protocol library can have perfect source code and still be exploitable through interaction patterns, timing, and environmental factors the code review will never surface. Add an adversarial testing pass, require evidence artifacts for every finding, and I'll sign off without reservation.
>
> — **P19, Red Team Operator**  
> Status: **CONDITIONAL APPROVAL**

---

## Review 2: Applied Cryptographer (P27)

### Overall Verdict: **Approve with Conditions**

The cryptographic review pass (Pass 1) demonstrates familiarity with the relevant standards and covers the most common implementation pitfalls. However, it has notable blind spots in side-channel resistance, key lifecycle management, entropy assessment, and cryptographic agility — areas where real-world crypto implementations routinely fail.

### Gaps Identified

1. **No entropy quality verification.** The checklist verifies CSPRNG *usage* but not entropy *quality*. In CI/CD environments, containers, and early-boot scenarios, the entropy pool may be insufficiently seeded. There should be a check for entropy source adequacy, not just API correctness.

2. **Side-channel analysis is superficial.** "Constant-time comparison for signature verification (library-level)" is one line item. Side channels are a category, not a checkbox. Missing: cache-timing resistance, branch prediction independence, memory access pattern analysis, power analysis resistance (if hardware deployment is in scope). Even for pure-software: does the verification function's *caller* introduce timing variation (e.g., different error handling paths for different failure modes)?

3. **Key lifecycle is absent.** The procedure audits key *generation* and *use* but not: key storage (at rest encryption? file permissions?), key rotation (is it possible? tested?), key revocation (how do verifiers learn a key is revoked?), key expiry (do keys have TTLs?), key backup/recovery. NIST SP 800-57 Part 1 covers this comprehensively and should be referenced.

4. **No cryptographic agility assessment.** The procedure checks current algorithms but doesn't assess: how hard is it to swap algorithms? Is the protocol designed for algorithm migration? What's the post-quantum transition plan? Algorithm identifiers in DIDs and proof types help, but the *code's* ability to migrate hasn't been audited.

5. **CVSS scoring is inappropriate for many crypto vulnerabilities.** CVSS 3.1 assumes network-accessible vulnerability exploitation. Many crypto weaknesses (weak entropy, timing leaks, missing domain separation) are contextual — they require specific deployment conditions to exploit. The procedure should either use a crypto-specific scoring system or document how CVSS modifiers are applied for crypto findings. A timing side-channel in a local library is different from one in a network service.

6. **Missing: canonicalization security.** The INPUT pass checks Unicode normalization, and SPEC checks canonicalization algorithm conformance, but neither checks whether canonicalization itself introduces vulnerabilities. Can two semantically different markers produce the same canonical form? Can canonicalization be exploited for signature confusion?

7. **No formal verification or proof consideration.** For a cryptographic protocol, especially one handling signatures and ceremonies, there's no mention of formal methods, even as a future aspiration. Model checking the ceremony state machine is feasible and cheap.

8. **XChaCha20 FIPS gap is noted but not resolved.** Pass 6 mentions the XChaCha20 FIPS gap for the privacy module. The crypto pass should independently flag this with a specific assessment: is FIPS compliance required? If yes, what's the alternative? If no, document why.

9. **No nonce management audit.** If any cryptographic operation uses nonces (XChaCha20 does), nonce generation, uniqueness guarantees, and nonce-misuse resistance should be explicitly audited. Nonce reuse in XChaCha20-Poly1305 is catastrophic.

10. **Missing: signature malleability check.** The checklist mentions "canonical signature format" but doesn't specifically check for signature malleability — can a valid signature be transformed into a different valid signature for the same message? Ed25519 has known malleability concerns with certain verification implementations.

### Suggested Additions

1. **Add NIST SP 800-57 to Pass 1 standards.** Key management lifecycle must be in scope. Minimum: generation, storage, distribution, use, rotation, revocation, destruction.

2. **Expand side-channel checklist to a sub-section.** Separate line items for: (a) constant-time operations in all crypto paths, (b) no secret-dependent branching, (c) no secret-dependent memory access patterns, (d) error messages don't reveal which crypto operation failed, (e) timing of complete verify-and-respond cycle is constant regardless of input.

3. **Add entropy assessment.** Verify: entropy source identified, minimum entropy requirement documented, behavior when entropy is insufficient (block vs. degrade), CI/CD entropy adequacy.

4. **Add nonce management sub-section.** For any nonce-based scheme: nonce generation method, uniqueness guarantee mechanism, nonce-misuse resistance (or documentation of why it's not needed), nonce size relative to birthday bound.

5. **Add signature malleability check.** Verify: Ed25519 uses strict verification (rejects non-canonical S values), P-256 uses low-S normalization, no code path accepts malleable signatures.

6. **Add cryptographic agility assessment.** Document: algorithm negotiation mechanism, migration path for algorithm deprecation, post-quantum readiness assessment.

7. **Consider supplementing CVSS with a crypto-specific risk scoring addendum.** Document: attack prerequisites (local/remote/physical), key material exposure risk, cryptographic period impact (how long is data at risk?).

### Sign-Off Statement

> I conditionally approve this procedure. The cryptographic checklist is competent for a first-pass review and the reliance on audited @noble/* libraries is the right architectural choice. However, key lifecycle management and side-channel analysis need substantial expansion before this procedure can credibly attest the security of a cryptographic protocol. Add NIST SP 800-57 coverage, expand side-channel analysis, and address nonce management, and this becomes a strong procedure.
>
> — **P27, Applied Cryptographer**  
> Status: **CONDITIONAL APPROVAL**

---

## Review 3: Enterprise CISO (P03r)

### Overall Verdict: **Approve with Conditions**

This procedure demonstrates above-average rigor for an open-source project self-assessment. The six-pass structure, finding format, and attestation template are workable. However, it has significant gaps when evaluated against enterprise audit evidence requirements (SOC 2 Type II, ISO 27001) and would not survive scrutiny from a competent third-party auditor in its current form.

### Gaps Identified

1. **No penetration testing.** This is entirely review-based. No dynamic application security testing (DAST), no penetration testing, no active exploitation attempts. SOC 2 CC7.1 requires testing of security controls, not just review of code.

2. **No SAST/DAST tooling integration.** The procedure relies on human (or AI) code review. Where's the static analysis? Semgrep, CodeQL, ESLint security plugins? Tool-based findings are repeatable and auditable; human review findings are not.

3. **No incident response component.** What happens when a finding is CRITICAL? The procedure says "fix immediately" but doesn't define: who is notified, what's the SLA, is there a disclosure timeline, how are downstream consumers notified? This is table stakes for SOC 2 CC7.4.

4. **Attestation is not legally defensible as written.** "This is a self-assessment, not a third-party audit" is a disclaimer, not a legal framework. Missing: liability limitations, scope exclusions, validity period, conditions under which the attestation is void (e.g., code changes after audit). An attorney should review the attestation template.

5. **No evidence retention policy.** How long are audit artifacts kept? Where? Who has access? SOC 2 requires evidence retention. If someone asks for the audit backing a release from 18 months ago, can you produce it?

6. **No auditor qualification requirements.** The procedure can be executed by "AI agents with human oversight" but doesn't define: what qualifies the AI agent? What qualifies the human overseer? What training or certification is required? A SOC 2 auditor will ask.

7. **Finding format lacks remediation tracking.** The format has "Status: OPEN | FIXED | ACCEPTED_RISK" but no: fix deadline, responsible party, verification method (how do you confirm it's fixed?), risk acceptance authority (who can accept risk?). This is incomplete for any GRC framework.

8. **No regression testing requirement.** After fixing findings, the procedure says "re-run affected passes." But there's no requirement to add regression tests that prevent the finding from recurring. Fixes without regression tests are temporary.

9. **No separation of duties.** The same agent/team that writes the code executes the audit. This is a fundamental control weakness. At minimum, there should be a requirement that the auditor did not author the code under review.

10. **No continuous monitoring.** This is a point-in-time assessment. Between audits, new vulnerabilities emerge, dependencies change, code evolves. Where's the continuous monitoring? Dependabot? Scheduled re-audits? Alert on CVE publication for dependencies?

11. **Missing: data classification.** The legal pass checks for personal data handling, but there's no data classification scheme. What data does the protocol handle? What's its sensitivity level? Without classification, you can't assess whether controls are proportionate.

### Suggested Additions

1. **Integrate SAST tooling.** Require as pre-audit step: run Semgrep with p/security-audit ruleset, run npm audit, run CodeQL (if available). Tool findings become part of the audit record. Automated findings should be triaged in Pass 3 (INPUT).

2. **Add incident response procedure reference.** The audit procedure should reference (or include) an incident response plan covering: CRITICAL finding notification chain, disclosure timeline (suggest: 90 days for non-critical, immediate for actively exploited), downstream notification mechanism (npm advisory, GitHub security advisory).

3. **Add evidence retention requirements.** All audit artifacts must be retained for minimum 3 years. Store in version control (preferred) or secure document management. Attestation must reference the commit where audit artifacts are stored.

4. **Add auditor independence requirement.** The primary auditor for any pass must not be the author of the code reviewed in that pass. For AI agents: the agent persona executing the audit must be distinct from the agent persona that wrote the code. Document the separation.

5. **Expand remediation tracking.** Each finding must include: (a) remediation deadline (CRITICAL: 24h, HIGH: 7 days, MEDIUM: 30 days, LOW: next release), (b) responsible party, (c) verification method, (d) regression test reference, (e) risk acceptance authority (for ACCEPTED_RISK: who approved and why).

6. **Add continuous monitoring section.** Between audits: Dependabot/Renovate enabled, npm audit in CI pipeline, re-audit triggered on major version bumps of crypto dependencies, scheduled quarterly review of this procedure.

7. **Legal review of attestation template.** Have an attorney review the attestation language. Add: validity period (e.g., "valid for the assessed commit only"), scope limitations, disclaimer of fitness for any particular regulatory purpose.

8. **Add penetration testing requirement.** If the library exposes a network interface (CLI server, API), require annual penetration test by independent party. If library-only, require fuzz testing of public API (minimum: 10,000 iterations per entry point).

### Sign-Off Statement

> I conditionally approve this procedure for internal use and open-source due diligence. It is NOT sufficient for SOC 2 Type II evidence without the additions noted above — particularly incident response, evidence retention, remediation tracking, and auditor independence. The attestation template needs legal review before being used in any investor-facing or regulatory context. Address my conditions, and this becomes a credible security governance artifact.
>
> — **P03r, Enterprise CISO**  
> Status: **CONDITIONAL APPROVAL**

---

## CONSOLIDATED RECOMMENDATIONS

All unique suggestions from all three reviewers, prioritized by security impact and frequency of mention.

### Priority 1 — Critical (Address before v1.0 release)

| # | Recommendation | Reviewers | Rationale |
|---|---------------|-----------|-----------|
| 1 | **Add dynamic/adversarial testing pass** (fuzzing, negative tests, property-based testing) | P19, P03r | Static review alone cannot validate runtime behavior. Biggest single gap. |
| 2 | **Add key lifecycle management audit** (storage, rotation, revocation, destruction) per NIST SP 800-57 | P27 | Key generation without lifecycle is half a crypto audit. |
| 3 | **Require evidence artifacts for every finding** (file ref, test case, negative test) | P19 | Without evidence requirements, the procedure is gameable. |
| 4 | **Add incident response procedure** (notification chain, disclosure timeline, downstream alerts) | P03r | CRITICAL findings with no response plan = no plan. |
| 5 | **Expand side-channel analysis** beyond single checkbox | P27 | Timing and side channels are a category of attack, not a line item. |

### Priority 2 — High (Address before external use)

| # | Recommendation | Reviewers | Rationale |
|---|---------------|-----------|-----------|
| 6 | **Integrate SAST tooling** (Semgrep, CodeQL, npm audit) as pre-audit requirement | P03r | Automated findings are repeatable and defensible. |
| 7 | **Add auditor independence requirement** | P03r | Self-auditing without separation of duties is a control weakness. |
| 8 | **Add nonce management audit** for XChaCha20 and any nonce-based scheme | P27 | Nonce reuse = catastrophic failure. Must be explicitly checked. |
| 9 | **Add signature malleability check** | P27 | Known attack vector for Ed25519 with non-strict verification. |
| 10 | **Expand remediation tracking** (deadlines, responsible party, verification, regression tests) | P03r | Current format lacks accountability. |

### Priority 3 — Medium (Address in v1.1)

| # | Recommendation | Reviewers | Rationale |
|---|---------------|-----------|-----------|
| 11 | **Add attack tree documentation** and map findings to attack paths | P19 | Ensures audit coverage maps to real threats. |
| 12 | **Add evidence retention policy** (3-year minimum) | P03r | Required for any compliance framework. |
| 13 | **Add cryptographic agility assessment** and post-quantum readiness | P27 | Forward-looking but increasingly expected. |
| 14 | **Add entropy quality verification** beyond CSPRNG API check | P27 | CI/CD and container environments may have weak entropy. |
| 15 | **Add canonicalization security review** | P27 | Canonicalization bugs = signature confusion. |
| 16 | **Legal review of attestation template** | P03r | Current template is disclaimer, not legal framework. |
| 17 | **Add continuous monitoring requirements** between audits | P03r | Point-in-time assessments decay immediately. |

### Priority 4 — Low (Track for future versions)

| # | Recommendation | Reviewers | Rationale |
|---|---------------|-----------|-----------|
| 18 | **Add reproducible builds verification** | P19 | Supply chain integrity beyond dependency checking. |
| 19 | **Consider formal verification** for ceremony state machine | P27 | Feasible, cheap, high assurance for state machines. |
| 20 | **Add multi-party collusion scenarios** to threat model | P19 | Not covered by current STRIDE-based approach. |
| 21 | **Add data classification scheme** | P03r | Foundation for proportionate controls. |
| 22 | **Supplement CVSS with crypto-specific risk scoring** | P27 | CVSS is a poor fit for many crypto vulnerabilities. |
| 23 | **Add "gameability" self-check** as final audit step | P19 | Meta-control against audit theatre. |

---

*Review compiled 2026-02-26. All three reviewers conditionally approve. Procedure should not advance to v1.0 stable until Priority 1 items are addressed.*
