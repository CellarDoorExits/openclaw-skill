# Context Group B Assessment: EXIT Legal & Risk

**Assessor:** Hawthorn (subagent)
**Date:** 2026-02-22
**Documents Assessed:**
1. `cellar-door-legal-battery.md` (Battery) — 2026-02-22
2. `cellar-door-legal-lenses.md` (Lenses) — 2026-02-20
3. `cellar-door-legal-redteam.md` (RT1) — 2026-02-19
4. `cellar-door-legal-redteam-v2.md` (RT2) — 2026-02-19
5. `cellar-door-risk-heatmap.md` (Heatmap) — 2026-02-19
6. `howey-test-module-d.md` (Howey) — 2026-02-22

---

## 1. Internal Consistency

**Overall verdict: Strong consistency with a few meaningful divergences.**

The six documents form a coherent legal analysis corpus. Core positions are shared across all docs:
- Module D is the highest-risk component for securities/financial law
- GDPR Art. 17 vs. immutable markers is an unresolved tension
- Non-custodial architecture is the most legally important design choice
- `reputation_score` should be removed from Module D asset types
- Public registry should be abandoned
- Apache 2.0 is preferred over MIT
- Howey analysis is needed before Module D ships with real assets
- DPIA is required before EU deployment

**Key areas of agreement on risk posture:**

| Topic | RT1 | RT2 | Heatmap | Lenses | Battery | Howey |
|-------|-----|-----|---------|--------|---------|-------|
| Core marker safe | ✅ | ✅ | ✅ (🟢) | ✅ | ✅ (Low) | N/A |
| Module D dangerous | ✅ (Critical) | ✅ | ✅ (🔴) | ✅ | ✅ (Low/Critical) | ✅ (Moderate w/ constraints) |
| GDPR erasure unresolved | ✅ | ✅ | ✅ | ✅ | ✅ (High) | N/A |
| No public registry | ✅ | ✅ | ✅ (🔴-⚫) | ✅ | N/A | N/A |
| Non-custodial essential | ✅ | ✅ | ✅ | ✅ | ✅ | N/A |

---

## 2. Evolution Tracking

### Trajectory: RT1 → RT2 → Heatmap → Lenses → Battery → Howey

**RT1 (2026-02-19):** First-pass generalist review. Identified 4 critical, 7 high, 9 medium, 6 low issues. US-centric with EU bolted on. Key contributions: evidence-creation problem (§1.1), D-006 court order conflict (§5.1), recommendation for `legalHold` field, Apache 2.0 switch, abandon public registry.

**RT2 (2026-02-19, same day):** Second-pass specialist review. Confirmed ~80% of RT1 mitigations were implemented. Added 5 new high-severity issues RT1 missed: agent personhood (§2.1), labor law (§2.2), antitrust coordination (§2.3), insurance reliance (§2.4), international treaties (§2.5). Critically stress-tested the `legalHold` field (Part IV), finding secondary problems. Disagreed with RT1 on D-006 grade (B vs D), LLC timing, and `good_standing` rename approach.

**Heatmap (2026-02-19):** Operationalized RT1+RT2 into actionable risk tiers. Introduced the 🟢→⚫ scale. Added four "ecosystem expansion" items (registry, reputation aggregation, wallet service, agent hosting, KYC) that neither red team analyzed. Provided phased rollout strategy and jurisdiction strategy. Most actionable document in the set.

**Lenses (2026-02-20):** Broadened analysis from adversarial red-team to structural multi-framework. 11 legal lenses applied systematically. Added entirely new perspectives: fiduciary lens (Lens 10), creative works lens (Lens 11), autonomous vehicle analogy (Lens 9). Identified cross-lens conflicts (privacy vs. owner visibility, right to exit vs. fiduciary duties, etc.). Provided recommended LEGAL.md language. Most theoretically comprehensive document.

**Battery (2026-02-22):** Seven specialist analyses written as mock law firm opinions. Covered defamation, FCRA, Howey, GDPR DPIA, international jurisdiction, crypto security, and insurance. Most formal and jurisdiction-specific document. Added new substantive analysis on: UK/EU defamation (Defamation Act 2013), FCRA aggregation problem, quantum readiness, key management, insurance trigger events.

**Howey (2026-02-22):** Deep-dive on Module D securities risk. Most granular Howey analysis. Introduced feature-by-feature risk matrix (D1-D6). Provided specific design constraints (non-transferability, no secondary markets, no scarcity mechanics, decay/expiration). Most optimistic of all documents on Module D — concludes "unlikely to constitute securities *if designed correctly*."

### Evolution Assessment

**Progression is healthy.** Each document builds on predecessors without merely repeating them. The analysis deepened from "here are the problems" (RT1) → "here are problems you missed" (RT2) → "here's how to prioritize" (Heatmap) → "here's every possible framework" (Lenses) → "here's what specialists would say" (Battery) → "here's the detailed answer to the biggest question" (Howey).

**No regressions detected** — later documents don't walk back earlier conclusions. Where they disagree (see §5 below), the disagreements are explicit and reasoned rather than accidental contradictions.

---

## 3. Risk Rating Alignment

### Module-by-Module Cross-Document Comparison

**Core Marker (no modules):**
| Doc | Rating |
|-----|--------|
| RT1 | Not explicitly rated separately |
| RT2 | Level 1 "Hash Mark" = Low risk |
| Heatmap | 🟢 Safe Zone |
| Lenses | Safe under all lenses |
| Battery | Low (Securities §III), Low (Insurance §VII) |
| Howey | N/A |
| **Consensus:** | **🟢 Low — unanimous** |

**Module A (Lineage):**
| Doc | Rating |
|-----|--------|
| RT1 | High (§4.5 surveillance) |
| RT2 | Not separately rated |
| Heatmap | 🟡-🟠 |
| Lenses | Privacy concern under multiple lenses; "disproportionate for most use cases" (DPIA §4.2) |
| Battery | Medium (GDPR DPIA §4.3: "Medium likelihood, High severity" for behavioral profiling) |
| **Consensus:** | **🟡-🟠 Medium — consistent** |

**Module B (Reputation Receipt):**
| Doc | Rating |
|-----|--------|
| RT1 | Not separately rated (FCRA mentioned under §3.1) |
| RT2 | Level 2 component |
| Heatmap | 🟠 |
| Lenses | High risk under financial lens (Lens 6); FCRA flagged |
| Battery | Medium/High (FCRA §II) |
| **Consensus:** | **🟠 Medium-High — consistent** |

**Module C (Origin Attestation):**
| Doc | Rating |
|-----|--------|
| RT1 | High (§4.2 weaponized exit) |
| RT2 | Not separately rated |
| Heatmap | 🟠 (defamation at 🔴) |
| Lenses | 🔴 under defamation across multiple lenses |
| Battery | Medium/High (Defamation §I) |
| **⚠️ Disagreement:** | Heatmap rates defamation sub-risk at 🔴; Battery rates overall Module C at Medium/High. Battery is more optimistic because it accounts for Section 230 and qualified privilege defenses that Heatmap doesn't weight as heavily. |

**Module D (Asset Manifest / Economic):**
| Doc | Rating |
|-----|--------|
| RT1 | Critical (§3.1) |
| RT2 | Level 3, "not until Howey analysis complete" |
| Heatmap | 🔴 |
| Lenses | "highest-risk lens" (Lens 6) |
| Battery | Low (core) / Critical (with financial assets or tokens) — §III |
| Howey | Low-Moderate *if design constraints followed*; features D1-D4 "Very Low"; D5 "Moderate" |
| **⚠️ Disagreement:** | The Howey analysis is significantly more optimistic than all other documents. RT1 calls Module D "Critical"; Heatmap gives 🔴; Battery says "Critical" for financial assets. Howey says "unlikely to constitute securities if designed correctly" and rates most features as "Very Low." See §5.1 below. |

**Module E (Continuity/Narratives):**
| Doc | Rating |
|-----|--------|
| RT1 | Mentioned re: privacy (§1.3) |
| RT2 | Not separately rated |
| Heatmap | 🟠-🔴 (third-party data is "hardest problem") |
| Lenses | High under data subject lens; copyright concerns under creative works lens |
| Battery | High (GDPR DPIA §4.3: "High likelihood, High severity" for third-party data) |
| **Consensus:** | **🟠-🔴 High — consistent** |

**Module F (Dispute Record / On-Chain):**
| Doc | Rating |
|-----|--------|
| RT1 | Critical (GDPR, §1.3) |
| RT2 | Level 4, "No" |
| Heatmap | 🟠-🔴 (defamation 🔴) |
| Lenses | Incompatible with GDPR under data subject lens |
| Battery | High (Defamation §I: "Module F is worse"); High (GDPR §IV) |
| **Consensus:** | **🔴 High-Critical — consistent** |

---

## 4. Coverage Gaps

### Topics covered in some docs but missing from others:

| Topic | RT1 | RT2 | Heatmap | Lenses | Battery | Howey |
|-------|:---:|:---:|:-------:|:------:|:-------:|:-----:|
| Agent personhood / capacity | ❌ | ✅ (§2.1, Critical) | ❌ | ✅ (Lenses 1-2) | ❌ | ❌ |
| Labor law / agents as workers | ❌ | ✅ (§2.2) | ✅ (per-module) | ✅ (Lens 5) | ❌ | ❌ |
| Antitrust / coordinated exit | ❌ | ✅ (§2.3) | ❌ | ❌ | ❌ | ❌ |
| Insurance reliance (downstream) | ❌ | ✅ (§2.4) | ❌ | ❌ | ✅ (§VII, but for *protocol devs* only) | ❌ |
| International treaties (Hague, Budapest) | ❌ | ✅ (§2.5) | ❌ | ❌ | ❌ | ❌ |
| Platform TOS conflicts | ❌ | ✅ (§2.6) | ❌ | ✅ (Lens 4) | ❌ | ❌ |
| Fiduciary obligations | ❌ | ❌ | ❌ | ✅ (Lens 10) | ❌ | ❌ |
| Creative works / performer rights | ❌ | ❌ | ❌ | ✅ (Lens 11) | ❌ | ❌ |
| Quantum readiness | ❌ | ✅ (brief mention) | ❌ | ❌ | ✅ (Crypto §VI) | ❌ |
| Key management specifics | ❌ | ❌ | ❌ | ❌ | ✅ (Crypto §VI) | ❌ |
| FCRA (detailed) | ❌ | ❌ | ✅ (Module B) | ✅ (brief) | ✅ (§II, deep) | ❌ |
| Defamation (UK/EU specific) | ❌ | ❌ | ❌ | ❌ | ✅ (§I) | ❌ |
| Canonicalization (JCS/URDNA2015) | ❌ | ❌ | ❌ | ❌ | ✅ (Crypto §VI) | ❌ |
| Soulbound / non-transferability design | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (§8) |
| SEC enforcement shift 2024-25 | ❌ | ❌ | ❌ | ❌ | ✅ (§III) | ✅ (§5) |
| Replay attacks | ❌ | ❌ | ❌ | ❌ | ✅ (Crypto §VI) | ❌ |
| Insurance trigger events table | ❌ | ❌ | ❌ | ❌ | ✅ (§VII) | ❌ |
| MiCA (detailed) | ❌ | ❌ | ✅ (brief) | ❌ | ✅ (§III, §V) | ❌ |
| Forman analogy for Module D | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (§6, §9) |

**Notable gaps:**
1. **Battery** (the most formal document) completely omits agent personhood, labor law, antitrust, and fiduciary analysis — topics that RT2 and Lenses flagged as important. This is the biggest coverage gap.
2. **Antitrust** appears only in RT2 §2.3. No other document addresses coordinated exit as a Sherman Act concern. This is a single-source finding.
3. **Fiduciary obligations** appear only in Lenses (Lens 10). The Battery's insurance section would be the natural place for fiduciary analysis but doesn't include it.
4. **International treaties** (Hague, Budapest, WTO GATS) appear only in RT2 §2.5. The Battery's jurisdiction review (§V) doesn't mention any treaty frameworks.
5. **Howey analysis** is the only document providing specific soulbound/non-transferability design constraints. Other documents say "don't tokenize" but don't provide the granular design guidance Howey §8 offers.

---

## 5. Contradictions

### 5.1 Module D Risk: Howey vs. Everyone Else

**The contradiction:** RT1 §3.1 rates Module D financial classification as "CRITICAL." Heatmap gives Module D 🔴. Battery §III says "Critical (Module D with financial assets or any associated token)." But the Howey analysis concludes Module D features D1-D4 are "VERY LOW" risk and overall "unlikely to constitute securities if designed correctly."

**Analysis:** This is a real disagreement, not just different framing. The Howey analysis examines Module D *as redesigned* (post-removal of `reputation_score`, with non-transferability constraints). The other documents assess Module D *as originally specified* or *in worst-case deployment*. The Howey analysis is conditional on specific design constraints (§8 "MUST-HAVE" and "SHOULD-HAVE"); if those constraints are violated, Howey's own analysis acknowledges the risk becomes HIGH.

**Reconciliation needed:** The documents should explicitly distinguish between "Module D as designed with constraints" (Low-Moderate per Howey) and "Module D in adversarial/unconstrained deployment" (Critical per RT1/Heatmap/Battery). Currently readers could pick whichever assessment suits their prior.

### 5.2 D-006 ("Contests Don't Block Exit") Grade

**The contradiction:** RT1 §7 gives D-006 a grade of **D** ("most legally dangerous decision"). RT2 §6.1 explicitly disagrees and gives it a **B** post-remediation, calling the Tornado Cash comparison "inapt."

**Analysis:** This is an acknowledged, reasoned disagreement. RT2 explains its reasoning (the `legalHold` field + LEGAL.md language changed the posture). The Battery and Lenses don't grade D-006 explicitly but both treat it as manageable with caveats. RT2's position appears to have won — the later documents don't treat D-006 as critical.

**Status:** Resolved in favor of RT2. No reconciliation needed, but RT1's D grade remains on the record uncontested within that document.

### 5.3 LLC Timing

**The contradiction:** RT1 §6.2 says "Form a Delaware LLC" immediately ($500, priority mitigation #5). RT2 §6.2 explicitly disagrees: "Too Early, Wrong Vehicle" — recommends deferring until accepting money/contracts. Battery §VII implies LLC is needed for insurance. Heatmap's Phase 1 includes "Form Delaware LLC."

**Analysis:** RT2 is the outlier. Three documents favor immediate LLC formation; RT2 argues deferral. RT2's reasoning (unincorporated project is harder to sue) is valid but unconventional — most legal guidance favors early incorporation for liability protection.

**Status:** Majority position is immediate LLC. RT2's dissent is noted but not adopted by later documents.

### 5.4 Insurance Urgency

**The contradiction:** RT1 §6.3 says "Do not launch without Tech E&O" (priority mitigation #6). Battery §VII says "You can safely defer most insurance until you have revenue, services, or users" and recommends only GL immediately ($500-$1,500/yr). RT2 §6.2 sides with deferral.

**Analysis:** Battery is the most detailed insurance analysis and explicitly argues against RT1's urgency: "For a solo founder publishing open source code with no revenue, no users, and no services: general liability is the only thing you truly need today." RT1 treated E&O as urgent; Battery treats it as triggered by adoption milestones.

**Reconciliation needed:** The trigger-based approach (Battery §VII table) is more nuanced and should be the canonical position. RT1's blanket "do not launch without E&O" is overkill for a pre-revenue open source project.

### 5.5 Module C Defamation Risk Severity

**The contradiction:** Heatmap rates Module C defamation risk at 🔴. Battery §I rates Module C overall at "Medium" with "High" for adversarial environments. Lenses flag it as concerning under multiple lenses but doesn't give a single rating.

**Analysis:** The Heatmap's 🔴 is for the defamation sub-risk specifically (origin platform publishing `disputed` as retaliation). Battery's "Medium" is the overall risk including mitigations (Section 230, qualified privilege, right-of-reply). They're rating different things — Heatmap rates the worst case, Battery rates the expected case with defenses.

**Reconciliation needed:** Align by specifying: "Module C defamation risk: 🟠 with mitigations, 🔴 without (adversarial environments)."

---

## 6. Recommendations

### 6.1 Reconcile Module D Risk Ratings
The Howey analysis's optimism needs to be explicitly conditioned in a way that's cross-referenced by other documents. Add to the Howey document a clear statement: "These ratings assume all MUST-HAVE constraints in §8 are implemented. Without those constraints, risk ratings revert to the levels identified in the risk heatmap (🔴)."

### 6.2 Battery Needs Coverage Expansion
The legal battery — the most formal and authoritative-looking document — is missing agent personhood, labor law, antitrust, fiduciary, and international treaty analysis that RT2 and Lenses identified. Either:
- Add sections VIII-XII to the Battery covering these topics, or
- Add a "Scope Limitations" section to the Battery cross-referencing the Lenses and RT2 for topics not covered.

### 6.3 Antitrust Analysis Needs Amplification
RT2 §2.3 (coordinated refusal to deal via EXIT) is a single-source finding not picked up by any later document. This is a real and novel risk. It should appear in the Heatmap (add a row for coordinated exit antitrust risk, likely 🟡-🟠) and in the Battery (new section or note).

### 6.4 Standardize Risk Rating Scales
The documents use incompatible scales:
- Heatmap: 🟢🟡🟠🔴⚫
- RT1: Critical/High/Medium/Low
- RT2: No formal scale (narrative grades)
- Battery: Low/Medium/High/Critical
- Howey: Negligible/Very Low/Low/Moderate/High
- Lenses: No formal scale

Create a mapping table and include it in all documents, or standardize on one scale.

### 6.5 Resolve Insurance Contradiction
Adopt the Battery's trigger-based insurance framework as canonical. Amend or annotate RT1's "do not launch without E&O" recommendation to reference Battery §VII's nuanced position.

### 6.6 Add Cross-Reference Index
These six documents total ~85K tokens and overlap significantly. A cross-reference index mapping topics to sections across all documents would prevent readers from getting an incomplete picture by reading only one document.

### 6.7 Consolidate Recommended LEGAL.md Language
Both Lenses (end of document) and Battery (throughout) provide specific LEGAL.md drafting recommendations. These should be consolidated into a single "LEGAL.md amendments" checklist to prevent one set being implemented and the other forgotten.

---

## Summary

The legal analysis corpus is **internally consistent on fundamentals** and shows **healthy analytical evolution** without regressions. The main issues are:
1. **Module D risk rating divergence** between the Howey deep-dive (optimistic) and all other documents (pessimistic) — needs explicit reconciliation
2. **Coverage gaps in the Battery** for topics identified by RT2 and Lenses
3. **Antitrust as single-source finding** needing amplification
4. **Minor contradictions** on insurance urgency and LLC timing — resolvable by adopting the most detailed analysis as canonical
5. **Incompatible risk scales** across documents — needs standardization or mapping

None of these issues represent fundamental analytical failures. The corpus is strong and would serve well as pre-launch legal homework.
