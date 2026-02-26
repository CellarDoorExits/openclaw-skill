# Security Audit Procedure v1.1 — Independent Reviews

**Document Under Review:** PROC-SEC-001 v1.1  
**Review Date:** 2026-02-26  
**Reviews Requested By:** Hawthorn  
**Context:** Reviewers have seen v1.0 executed against cellar-door-exit (30 findings, 0 CRITICAL, 1 HIGH, 12 MEDIUM, 17 LOW). They are evaluating v1.1 improvements with the benefit of execution experience.

---

## Review 1: Red Team Operator (P19)

### Overall Verdict: **APPROVED**

v1.0 was a solid framework. v1.1 is a *tested* framework — and that's the difference between theory and practice.

### What Improved

1. **Effort estimates are grounded in reality.** The 4–6 hour estimate for ~4000 LOC matches what I'd expect. This prevents scope creep and sets honest expectations. Useful.

2. **Evidence depth requirements (§1.1) close the gameability gap.** My biggest concern with v1.0 was that an auditor could write "PASS" with zero proof. The mandatory code snippets, test references, and "NOT ASSESSED" fallback directly address this. The v1.0 execution showed this working — the crypto review included actual code blocks for every finding, while some other passes were thinner. Now they can't be.

3. **Attack tree integration (§7) is a real addition.** The seven minimum attack trees cover the right scenarios for a crypto protocol library. Requiring findings to map to attack paths ensures the audit is threat-driven, not just checklist-driven. This was my Priority 3 ask and it's been done well.

4. **"ALL signing paths" emphasis in domain separation checks.** The v1.0 execution found exactly this bug — `createCompromiseMarker` signing without the domain prefix, plus intent/witness/dispute signing paths all lacking domain separation. The checklist now explicitly says "enumerate every signing path." Good — that's the lesson learned, baked into the procedure.

5. **Adversarial testing failure triage.** The v1.0 adversarial pass had 3 failures, 2 were false positives from test logic errors. Formalizing the triage requirement (TRUE FINDING vs FALSE POSITIVE with rationale) prevents noise from polluting the findings count.

### Remaining Gaps

1. **No "gameability" self-check yet (Priority 4).** I understand deferring this — the evidence depth requirements partially address it. But a dedicated "how could this audit be fooled?" step would add meta-level assurance. Track it.

2. **Multi-party collusion still deferred.** The v1.0 audit found no collusion vectors, but that's partly because nobody looked hard. For a ceremony protocol with multiple participants, collusion scenarios should be in the attack trees by v1.2.

3. **Reproducible builds still deferred.** Understood — it's a supply chain hardening measure, not a procedure gap. But the v1.0 supply chain pass was the thinnest (0 findings, 10 min). Adding build reproducibility would give it more teeth.

4. **No requirement to run adversarial tests against *fixed* code.** The procedure says "re-run affected passes after fixes" but the adversarial pass should also be re-run with tests specifically targeting the fixed code. Regression adversarial testing.

### Assessment

These are quibbles, not blockers. The v1.1 procedure addresses my core concerns from v1.0 — evidence depth, attack tree mapping, and the domain separation lesson learned. The execution of v1.0 proved the framework works; v1.1 hardens it based on what was learned.

> I approve PROC-SEC-001 v1.1 without conditions. The procedure is fit for purpose as a self-assessment framework for cryptographic protocol libraries. The remaining gaps (gameability check, collusion scenarios, reproducible builds) are appropriate for v1.2.
>
> — **P19, Red Team Operator**  
> Status: **APPROVED**

---

## Review 2: Applied Cryptographer (P27)

### Overall Verdict: **APPROVED**

The v1.0 execution was a meaningful stress test. 8 findings in the crypto pass (1 HIGH, 3 MEDIUM, 4 LOW) is a healthy distribution for a well-architected library — it means the audit was looking at the right depth. v1.1 incorporates the lessons well.

### What Improved

1. **Cryptographic agility assessment is now in Pass 1.** This was my Priority 3 ask. The four checklist items (algorithm identifiers, additive changes, post-quantum readiness, deprecation path) are the right questions. The v1.0 execution showed that algorithm cross-checking is already implemented (DID multicodec → proof.type), but the *migration* story hadn't been assessed. Now it will be.

2. **Entropy assessment formalized.** Three checklist items covering source identification, insufficient entropy behavior, and CI/CD considerations. Simple and sufficient. The v1.0 audit found CSPRNG usage was correct but didn't probe whether the entropy pool was adequate in all deployment contexts. This closes that gap.

3. **Canonicalization security is now a sub-checklist in Pass 3.** The v1.0 adversarial testing pass actually validated canonicalization quite well (8/8 edge cases passed), but it was emergent rather than planned. Making it a checklist item ensures it happens even if the adversarial pass uses different test vectors.

4. **Domain separation emphasis is excellent.** The v1.0 execution found domain separation failures in 4 different signing paths (compromise markers, intents, witnesses, dispute resolution). The updated checklist item ("check ALL signing paths, not just the primary one" + "enumerate every signing path") directly prevents this class of oversight. This is the most valuable single change in v1.1.

5. **SAST correlation in finding format.** Requiring auditors to note whether SAST flagged the same issue creates a feedback loop: we learn what automated tools catch vs. miss, which informs tool selection for future audits. The v1.0 execution ran SAST but didn't systematically correlate results with manual findings.

6. **Signature malleability checklist now acknowledges ZIP-215.** The v1.0 crypto review found that @noble/ed25519 uses ZIP-215 (non-strict) verification. The v1.0 checklist said "rejects non-canonical S values" which would have made ZIP-215 a failure. v1.1 says "or ZIP-215 choice is documented with justification" — pragmatic and correct.

### Remaining Gaps

1. **CVSS is still the sole scoring system for crypto findings.** I flagged this in v1.0 — CVSS is a poor fit for timing side-channels, entropy weaknesses, and key lifecycle gaps. It's tracked as Priority 4 (#22). The v1.0 execution didn't need CVSS for any crypto finding except the HIGH (domain separation), where CVSS worked fine. So the practical impact is low, but the conceptual gap remains.

2. **Formal verification still deferred.** The ceremony state machine tested perfectly in adversarial testing (44/44 invalid transitions rejected), which reduces urgency. But a formal model would provide proof rather than evidence. Appropriate for Priority 4.

3. **Post-quantum readiness is assessment-only.** The checklist asks to "document which components would need replacement" but doesn't require any action. This is correct for 2026 — PQC migration is assessment-stage for most protocols. By v1.3, consider requiring a concrete migration plan.

4. **No key escrow / multi-sig considerations.** The v1.0 execution found solid KERI-style key rotation and pre-rotation commitment, but didn't assess scenarios where key management involves multiple parties (m-of-n signing, social recovery). This may be out of scope for the current codebase but worth noting for future versions.

### Assessment

v1.1 promotes exactly the right Priority 3 items. The crypto agility and entropy additions fill real gaps without adding excessive overhead. The canonicalization security checklist and domain separation emphasis are direct responses to v1.0 findings — this is how a procedure should evolve.

> I approve PROC-SEC-001 v1.1 without conditions. The cryptographic coverage is now comprehensive for a self-assessment of this scope. The remaining gaps (crypto-specific scoring, formal verification, PQC migration planning) are correctly positioned as future work.
>
> — **P27, Applied Cryptographer**  
> Status: **APPROVED**

---

## Review 3: Enterprise CISO (P03r)

### Overall Verdict: **APPROVED**

I had the most conditions on v1.0, and v1.1 addresses the structural governance gaps that concerned me most. More importantly, the v1.0 execution demonstrated that the procedure produces actionable output — 30 findings with clear severity, remediation paths, and a consolidated attestation. That's real evidence, not theater.

### What Improved

1. **Consolidated Implementation Plan template (§6).** This was created ad-hoc during v1.0 execution because the procedure didn't have one. Now it's standardized with sections for immediate/short-term/backlog/accepted risks/dependencies/re-audit triggers. This is the artifact that actually drives remediation — without it, findings sit in review documents and nothing happens.

2. **Evidence retention policy (§2.6).** 3-year minimum, stored in version control, attestation references the storage commit. This was my Priority 3 ask. Simple, auditable, and sufficient for SOC 2 evidence requests. The v1.0 audit artifacts are already committed to git, so the practice exists — now it's policy.

3. **Continuous monitoring (§2.5).** Dependency scanning in CI, weekly Dependabot, daily CVE watch for crypto libraries, full re-audit on major crypto dependency bumps, quarterly procedure review. This converts a point-in-time assessment into an ongoing posture. The table format is clear and auditable.

4. **SAST correlation in finding format.** This is the bridge between automated and manual review that was missing. The v1.0 execution ran SAST tools but didn't document "SAST found X, manual review confirmed/refuted." Now each finding explicitly records the correlation. This makes the audit defensible — an external reviewer can see that automated tools were used AND that human judgment was applied.

5. **Effort estimates with actuals.** Having real execution data (4–6 hours for ~4000 LOC) makes this procedure plannable and budgetable. Leadership can understand the cost and schedule impact. This is essential for any governance artifact that will be used more than once.

6. **Evidence depth requirements (§1.1).** The v1.0 execution showed varying depth — the crypto review had full code snippets while some other passes had lighter evidence. Standardizing the minimum (code snippet, test references, SAST correlation) levels the quality floor across all passes.

### Remaining Gaps

1. **Attestation template still needs legal review.** I asked for this in v1.0, it's tracked as Priority 3 for v1.2. The v1.1 attestation adds scope limitation language ("valid for assessed commit only," "void if modified without re-audit"), which is an improvement. But "not a third-party audit" is a disclaimer, not a legal framework. An attorney should review before any investor-facing use.

2. **Auditor qualification requirements still undefined.** The procedure requires "auditor independence" but doesn't define what qualifies an auditor. For AI agents, this is somewhat moot (the procedure itself defines competence). For human oversight, there should be minimum qualifications (e.g., "human overseer must have security domain knowledge").

3. **No data classification scheme.** Still deferred to Priority 4. The v1.0 legal review worked without it because the protocol's data handling is straightforward, but a classification scheme would make the legal pass more systematic for complex protocols.

4. **Re-audit trigger criteria could be more specific.** "Major version bump of any crypto dependency" is clear, but what about significant codebase changes? A threshold like "re-audit required if >20% of audited LOC changes" would be more precise.

### Assessment

The governance improvements in v1.1 transform this from a technical checklist into a managed process. The implementation plan template, evidence retention, continuous monitoring, and SAST correlation are the structural controls I asked for. The v1.0 execution proved the framework produces real findings; v1.1 ensures those findings are tracked, retained, and acted upon.

> I approve PROC-SEC-001 v1.1 without conditions. The procedure is suitable for internal governance, open-source due diligence, and as supporting evidence in investor/partner security reviews. It remains insufficient for standalone SOC 2 Type II evidence (which requires a third-party auditor), but that's a scope limitation, not a procedure deficiency. The remaining gaps (legal review of attestation, auditor qualifications, data classification) are appropriate for v1.2.
>
> — **P03r, Enterprise CISO**  
> Status: **APPROVED**

---

## CONSOLIDATED ASSESSMENT

All three reviewers approve v1.1 unconditionally. Key themes:

### What v1.1 Got Right
- **Learned from execution:** Domain separation emphasis, evidence depth, implementation plan template all came directly from v1.0 execution experience
- **Promoted the right Priority 3 items:** Crypto agility, entropy, canonicalization security, continuous monitoring, evidence retention — all practical additions with low overhead
- **SAST integration is the bridge:** Correlating automated and manual findings makes the audit defensible to external reviewers

### Tracked for v1.2
| # | Item | Source |
|---|------|--------|
| 1 | Legal review of attestation template | P03r |
| 2 | Multi-party collusion in attack trees | P19 |
| 3 | Reproducible builds verification | P19 |
| 4 | Auditor qualification requirements | P03r |
| 5 | Re-audit trigger threshold for code changes | P03r |

### Tracked for Future Versions
| # | Item | Source |
|---|------|--------|
| 1 | Gameability self-check | P19 |
| 2 | Formal verification for state machine | P27 |
| 3 | Crypto-specific risk scoring supplement | P27 |
| 4 | Data classification scheme | P03r |
| 5 | PQC concrete migration plan | P27 |

---

*All three reviewers approve. PROC-SEC-001 v1.1 is marked STABLE.*
