# EXIT Paper — arXiv Readiness Assessment

**Author:** Hawthorn  
**Date:** 2026-02-22  
**Status:** Complete  
**Verdict:** Ready to write. The draft is 80% there. Needs sharpening, not reinvention.

---

## 1. Current Draft Assessment

The existing `EXIT_PAPER_DRAFT.md` is ~5,500 words across 10 sections + references. It reads like a real paper, not a blog post. That's the good news. Here's the section-by-section breakdown:

| # | Section | Quality (1-5) | Notes |
|---|---------|:---:|-------|
| Abstract | 4 | Crisp, covers scope. Slightly oversells ("we show…four Nash equilibria") for what's actually demonstrated. Needs tightening. |
| 1. Introduction | 4 | Strong motivation via Hirschman. Good problem framing. The "departure-shaped hole" line is memorable. Could use 1-2 more concrete scenarios (agent gets banned, platform shuts down). |
| 2. Background | 4 | Solid lit review. 2.6 (Semiotic Foundations) feels indulgent — Peirce adds intellectual flavor but reviewers may see it as padding. Consider cutting or condensing to a paragraph. |
| 3. The EXIT Protocol | 5 | Best section. Clear schema, state machine, verification model. Table format works. This is publishable as-is. |
| 4. Mechanism Design | 3 | Identifies the lemons problem and cheap talk correctly but the "four Nash equilibria" are described informally, not formally modeled. No payoff matrices, no proofs. For arXiv this is okay if framed as analysis rather than theorems. The proposed mechanisms (4.4) read like a roadmap, not results. |
| 5. Security | 3 | Threat catalog is reasonable but shallow. T1-T6 are listed with one-line mitigations. No formal security model (Dolev-Yao, UC framework, etc.). Acceptable for a systems/position paper, insufficient for a crypto venue. |
| 6. Legal | 3 | Important and distinctive content but too compressed. The 11-lens analysis from our legal docs is extraordinary material — only a fraction makes it into the paper. Agent personhood gap (6.1) is the strongest subsection. |
| 7. Ethics | 4 | The "EXIT primarily benefits platforms" honesty is the paper's most distinctive contribution. The company town analogy is excellent. Section 7.4 (honest framing) is rare and reviewable. |
| 8. Implementation | 3 | Adequate but generic. "1,200 lines of TypeScript" and four test vectors is thin. Missing: performance numbers, marker sizes in practice, ceremony timing, any quantitative evaluation. |
| 9. Discussion | 3 | Limitations are honest (good). Future work is a laundry list (bad). Needs prioritization. The HOLOS connection (9.3) is important context but reads as marketing to an outside reviewer. |
| 10. Conclusion | 3 | Perfunctory. Restates the paper without a strong closing argument. |
| References | 3 | 16 refs. Adequate for a short paper. Missing some obvious citations (Moloch DAO, ragequit, any DAO governance literature, Buterin on exit-to-community, any agent identity papers from 2024-2025). |

**Overall draft quality: 3.5/5** — A credible working draft. Not embarrassing but not submission-ready. The protocol description is strong; everything around it needs tightening.

### Key Gaps in Current Draft

1. **No formal model.** The mechanism design section waves at game theory without actually doing it. Need at least one properly specified game with payoff matrix.
2. **No quantitative evaluation.** Zero numbers. Marker size distribution? Ceremony latency? Signature verification throughput? Even synthetic benchmarks would help.
3. **No comparison table.** The competitive landscape doc shows EXIT has no direct competitors, but the paper doesn't present a systematic feature comparison with adjacent systems (Moloch ragequit, VC issuance, enterprise agent identity).
4. **No figures or diagrams.** The ceremony state machine cries out for a state diagram. The module architecture needs a box diagram. arXiv papers without figures look unfinished.
5. **The implemented mechanisms aren't in the paper.** Sprint 5 added commit-reveal, confidence scoring, and tenure tracking to the codebase. The paper draft (written earlier) only mentions these as "future work." Major gap.
6. **Missing related work section.** Background (§2) covers foundations but doesn't survey related systems. Need a proper Related Work section comparing to DAO exit mechanisms, enterprise agent identity, SSI/DID agent proposals.

---

## 2. What's Needed for a Credible arXiv Submission

### Must-Have (blocking)

| Item | Effort | Source Available? |
|------|--------|:-:|
| State machine diagram (fig) | 1h | Can generate from ceremony.ts |
| Architecture diagram (fig) | 2h | Can generate from master assessment |
| Comparison table vs. adjacent systems | 2h | competitive-landscape.md has all data |
| Update §4 with implemented mechanisms (commit-reveal, confidence, tenure) | 3h | mechanism-design.md + trust.ts |
| At least one formal game specification with payoff matrix | 4h | mechanism-design.md has the informal version |
| Basic quantitative evaluation (marker sizes, sig verification perf, ceremony timing) | 3h | Run benchmarks on existing code |
| Proper Related Work section | 3h | competitive-landscape.md |
| Updated references (add 8-12 missing citations) | 2h | Web search for recent agent identity work |
| Fix §10 conclusion | 1h | — |

### Should-Have (strengthening)

| Item | Effort | Source Available? |
|------|--------|:-:|
| Trim §2.6 (Peirce semiotics) to 1 paragraph | 0.5h | — |
| Add concrete motivating scenarios to §1 | 1h | Master assessment has examples |
| Expand §6 with key findings from legal lenses analysis | 2h | cellar-door-legal-lenses.md |
| Add ethics guardrails implementation to §7 | 1h | Already in codebase |
| Table of design decisions with rationale | 2h | DECISIONS.md has all 13 |
| Threat model table (formatted) | 1h | SECURITY.md |

### Nice-to-Have (polish)

| Item | Effort |
|------|--------|
| Simulation of departure game equilibria | 8-16h |
| Formal security proof sketch | 8h |
| User study or expert evaluation | 20h+ (not realistic for v1) |

---

## 3. Section-by-Section Plan for Final Paper

### Target: 8,000-9,000 words (current: ~5,500). arXiv cs.CR or cs.MA.

| # | Section | Target Words | Changes |
|---|---------|:-:|---------|
| — | Abstract | 250 | Tighten claims. Add "reference implementation" and "291 tests." Remove oversold game theory language. |
| 1 | Introduction | 800 | Add 2 concrete scenarios. Sharpen the "departure-shaped hole" argument. Add forward reference to evaluation. |
| 2 | Background & Related Work | 1200 | Merge current §2 + new Related Work. Cut Peirce to 1 para. Add: Moloch DAO ragequit, enterprise agent identity (Entra, SailPoint), A2A/MCP/AP2 positioning, SSI-for-agents proposals (Gailums). |
| 3 | The EXIT Protocol | 1500 | Keep as-is (it's good). Add state machine diagram. Add architecture diagram. Add design decisions table (top 5-6). |
| 4 | Mechanism Design | 1200 | Formal departure game with 3-player payoff matrix. Present implemented mechanisms (commit-reveal, confidence scoring, tenure) as RESULTS not future work. Keep proposed-but-unimplemented mechanisms as future directions. |
| 5 | Security Analysis | 800 | Add threat model table. Expand T1 (Sybil) and T6 (denial of exit) with more detail. Mention ethics guardrails (coercion/weaponization detection) as defense layer. |
| 6 | Legal & Regulatory | 800 | Keep communications protocol framing. Expand agent personhood gap. Add NIST initiative context (timely!). Mention 11-lens analysis as supporting work without reproducing it. |
| 7 | Ethics | 600 | Keep power dynamics and company town. Add implemented guardrails. Keep honest framing (§7.4). |
| 8 | Implementation & Evaluation | 1000 | **Major expansion.** Split into Implementation (code) and Evaluation (numbers). Add: marker size measurements, signature perf, ceremony path timing, test coverage stats, module usage patterns from demos. |
| 9 | Discussion | 600 | Limitations (keep, tighten). Future work (prioritize top 3, cut laundry list). HOLOS connection (1 paragraph max — reviewers don't care about your ecosystem vision). |
| 10 | Conclusion | 300 | Stronger close. Tie back to Hirschman. End with the NIST window / standards opportunity. |
| — | References | — | Target 25-30 refs. Add DAO governance, agent frameworks, mechanism design classics. |

---

## 4. Existing Analysis Docs — Incorporation Map

| Our Document | Paper Section(s) | How to Use |
|---|---|---|
| `cellar-door-master-assessment.md` | §3, §8 | Architecture details, codebase inventory, build status → protocol description and implementation sections |
| `cellar-door-competitive-landscape.md` | §2 (Related Work) | Direct competitors (none), adjacent players, standards landscape → systematic comparison table |
| `cellar-door-mechanism-design.md` | §4 | Lemons problem analysis, 11 candidate mechanisms, safe-zone compatibility → formal game + implemented mechanisms |
| `cellar-door-legal-lenses.md` | §6 | 11-lens analysis → cite as companion analysis, extract key findings |
| `cellar-door-legal-redteam.md` + v2 | §6 | Critical issues, agent personhood gap → legal considerations section |
| `cellar-door-risk-heatmap.md` | §5, §6 | Module risk levels → security analysis, regulatory discussion |
| `cellar-door-professional-reviews.md` | §4, §7 | Economics review (lemons), ethics review (power asymmetry) → mechanism design and ethics sections |
| `DECISIONS.md` | §3 | 13 ratified decisions → design decisions table |
| `EXIT_SPEC_v1.md` | §3 | Formal spec → protocol description (already well-represented) |
| `SECURITY.md` | §5 | Threat model → security analysis table |

**Note:** These are internal analysis documents. They can inform the paper's content but shouldn't be cited as references in the bibliography (they're not published). The paper should present the analysis as original work, which it is.

---

## 5. Confidence Assessment

**Can we write a credible arXiv paper now? Yes.**

The hard intellectual work is done. The protocol is designed, specified, implemented, and analyzed from legal, economic, ethical, and security perspectives. The draft is 80% of the way there. What's missing is:

1. **Presentation quality** — figures, tables, tighter prose
2. **Quantitative evidence** — benchmarks from existing code (easy to produce)
3. **Formal rigor** — one proper game-theoretic model (the informal analysis exists, just needs formalization)
4. **Updated content** — Sprint 5 work (trust mechanisms, ethics guardrails) needs to be reflected

None of these require new research or design work. It's writing and benchmarking.

**Venue recommendation:** 
- **Primary:** arXiv cs.MA (Multi-Agent Systems) or cs.CR (Cryptography and Security)
- **Conference targets:** FAccT 2026 (if deadline allows), AAMAS 2026, AAAI 2026 workshop track
- **Alt:** arXiv cs.AI with cross-list to cs.CR

**Risk factors:**
- The paper is a *systems paper* presenting a protocol, not a *theory paper* proving theorems. Some venues will want more formal results. arXiv doesn't care.
- "No production deployment" is a legitimate weakness. Mitigate with thorough synthetic evaluation.
- The HOLOS ecosystem connection may read as self-promotional to reviewers unfamiliar with it. Minimize.
- Some reviewers will dismiss "agent rights" framing as anthropomorphization. The pragmatic framing ("operator portability") is the defense.

---

## 6. Estimated Effort

| Task | Hours | Who |
|------|:-----:|-----|
| Run benchmarks on existing code (marker sizes, perf, timing) | 3 | Can be scripted |
| Create figures (state machine, architecture, comparison table) | 4 | |
| Formalize departure game (payoff matrix, equilibria) | 4 | |
| Rewrite §2 as Background & Related Work | 3 | |
| Update §4 with implemented mechanisms | 3 | |
| Expand §8 into Implementation & Evaluation | 3 | |
| Update §5 with threat model table | 1 | |
| Rewrite §9-10 (discussion, conclusion) | 2 | |
| Polish abstract, intro, references | 2 | |
| Add missing citations (research + format) | 2 | |
| Final read-through and consistency pass | 2 | |
| **Total** | **~29h** | |

**Calendar estimate:** 2-3 focused writing days, or ~1 week at part-time pace.

This does NOT include:
- LaTeX formatting (add 4-6h if targeting a specific conference template)
- Simulation of game equilibria (add 8-16h — recommended but not required for arXiv)
- External review/feedback incorporation (variable)

---

## 7. Bottom Line

The EXIT paper draft is a solid B. The protocol itself is an A — well-designed, well-specified, thoroughly analyzed from multiple angles. The gap is between the depth of analysis that exists in our internal docs and what's currently on the page in the paper.

The biggest single improvement would be **moving implemented mechanisms from "future work" to "results."** The paper was written before Sprint 5. Sprint 5 implemented commit-reveal, confidence scoring, tenure tracking, and ethics guardrails. These are actual contributions that the paper currently doesn't claim credit for.

The second biggest improvement would be **any quantitative evaluation at all.** Right now the paper is pure qualitative description. Even basic numbers (marker is 347 bytes, verification takes 0.3ms, ceremony completes in <100ms for emergency path) would substantially strengthen it.

**Ready to write: Yes. Worth writing: Absolutely.** This is a genuinely novel contribution in an empty research space. The NIST initiative makes the timing perfect. First-mover advantage in the academic literature matters — whoever publishes first on "agent departure semantics" owns the citation.

---

*Assessment complete. The next step is to decide whether to write the full paper or produce the benchmarks first. I'd recommend benchmarks first (3h) because having real numbers in hand makes every section easier to write.*
