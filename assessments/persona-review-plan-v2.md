# Persona-Based Review Plan v2 — EXIT Protocol / Cellar Door

**Created:** 2026-02-24 | **Status:** Ready for execution
**Previous round:** `projects/Cellar-Door/assessments/multi-lens-*` (15 personas, 5 batches — all "Needs Work", core sound)

---

## Design Principles

- **Realistic attention budgets** — layman personas get ≤2 files, NIST reviewers get the full stack
- **Actionable output** — each persona produces a verdict + specific recommendations
- **NIST-submission focus** — priority personas weighted toward federal/enterprise readiness

---

## File Path Reference

All paths relative to `projects/Cellar-Door/`:

| Alias | Path | ~Size |
|-------|------|-------|
| SPEC | `cellar-door-exit/specs/EXIT_SPEC_v1.1.md` | 26K |
| PAPER | `docs/papers/EXIT_PAPER_v5.md` | ~30K |
| NIST_RFI | `cellar-door-exit/docs/NIST_RFI_PRAGMATIC.md` | ~15K |
| NIST_RFI_DRAFT | `docs/papers/NIST_RFI_v2.md` | ~20K |
| README_EXIT | `cellar-door-exit/README.md` | ~8K |
| README_ENTRY | `cellar-door-entry/README.md` | ~5K |
| SECURITY | `cellar-door-exit/SECURITY.md` | ~5K |
| LEGAL | `cellar-door-exit/LEGAL.md` | ~8K |
| GETTING_STARTED | `cellar-door-exit/docs/GETTING_STARTED.md` | ~8K |
| LANGCHAIN_README | `integrations/langchain/README.md` | ~5K |
| VERCEL_README | `integrations/vercel-ai-sdk/README.md` | ~5K |
| MCP_README | `integrations/mcp-server/README.md` | ~5K |
| ENTRY_SPEC | `cellar-door-entry/ENTRY_SPEC_v1.0.md` | ~15K |
| SHOW_HN | `docs/show-hn-drafts.md` | ~8K |
| BRAND | `docs/brand-guide.md` | ~5K |
| ECOSYSTEM | `docs/ecosystem-map.md` | ~5K |
| SITE_HOME | `../../site/cellar-door/index.html` | ~15K |
| DECISIONS | `cellar-door-exit/DECISIONS.md` | ~10K |
| TYPES_EXIT | `cellar-door-exit/src/types.ts` | ~5K |
| INDEX_EXIT | `cellar-door-exit/src/index.ts` | ~3K |
| PKG_EXIT | `cellar-door-exit/package.json` | ~2K |

---

## Batch 1 — NIST & Enterprise (4 personas)

### P01: NIST Technical Reviewer
- **Profile:** Computer scientist at NIST/ITL, reviews standards proposals. Expertise in cryptographic protocols, identity management, FIPS compliance. Has read NIST AI 100-series.
- **Context pack:** NIST_RFI, NIST_RFI_DRAFT, SPEC, PAPER
- **Questions:**
  1. Does this proposal address a real gap in the NIST AI RMF or existing identity standards?
  2. Are the cryptographic choices (Ed25519, SHA-256, RFC 3161) appropriate and FIPS-compliant?
  3. Is the spec precise enough to be independently implementable?
  4. What's missing for this to be taken seriously as a standards-track proposal?
- **Review format:** Formal technical review memo (1-2 pages). Verdict: Accept / Revise & Resubmit / Reject. Section-by-section comments.

### P02: NIST Policy Reviewer
- **Profile:** Policy analyst in NIST's AI Standards Coordination team. Evaluates proposals for alignment with Executive Orders, existing frameworks, international harmonization.
- **Context pack:** NIST_RFI, NIST_RFI_DRAFT, PAPER (skim sections 1-3 only), LEGAL
- **Questions:**
  1. Does this align with EO 14110 priorities and NIST AI RMF?
  2. Is there evidence of industry demand or multi-stakeholder input?
  3. How does this interact with existing W3C DID / VC standards work?
  4. Would NIST be criticized for engaging with this? What's the reputational risk?
- **Review format:** Policy assessment memo. Verdict: Recommend engagement / Monitor / Pass. Flag risks.

### P03: Enterprise Architect / CISO
- **Profile:** VP of Security Architecture at a Fortune 500 tech company. Evaluates new protocols for enterprise adoption. Cares about: threat model, key management, compliance, integration cost.
- **Context pack:** SPEC, SECURITY, GETTING_STARTED, ECOSYSTEM, LEGAL
- **Questions:**
  1. Would I integrate this into our AI agent infrastructure? What's the adoption cost?
  2. Is the threat model comprehensive? What attack vectors are missing?
  3. How does this fit with our existing PKI, HSM, and identity infrastructure?
  4. What's the liability exposure if we adopt and it fails?
  5. Is there vendor lock-in risk?
- **Review format:** Enterprise evaluation scorecard. Categories: Security (1-5), Maturity (1-5), Integration Cost (1-5), Standards Alignment (1-5), Risk (1-5). Written rationale per category.

### P04: Senior Backend Developer (SDK Evaluator)
- **Profile:** Staff engineer at a mid-size SaaS company. Evaluates libraries for DX, API quality, test coverage, maintainability. Pragmatic, hates over-engineering.
- **Context pack:** README_EXIT, GETTING_STARTED, PKG_EXIT, TYPES_EXIT, INDEX_EXIT, DECISIONS
- **Questions:**
  1. Can I go from `npm install` to working exit certificate in under 10 minutes?
  2. Is the API surface intuitive? Are the types well-designed?
  3. Zero runtime deps — is that actually true and is it a positive?
  4. Would I trust this in production? What's missing?
  5. How's the error handling and edge case coverage?
- **Review format:** DX review. Time-to-hello-world estimate. API critique. Would-use / would-not-use verdict with reasons.

---

## Batch 2 — Practitioners (4 personas)

### P05: AI Agent Developer (LangChain/CrewAI)
- **Profile:** Building multi-agent systems with LangChain. Needs tools that compose well with agent loops. Cares about: tool interface, callback patterns, token cost.
- **Context pack:** LANGCHAIN_README, README_EXIT (skim), GETTING_STARTED (first section only)
- **Questions:**
  1. Can I add EXIT Protocol to my existing LangChain agent in <30 min?
  2. Does the tool interface make sense in an agent loop context?
  3. What happens when my agent needs to exit mid-conversation?
  4. Is this worth the complexity overhead for my use case?
- **Review format:** Integration journal — narrate the experience of trying to add this to an agent. Blockers, confusion points, "aha" moments. Verdict: Would integrate / Would skip.

### P06: Senior Full-Stack Developer (Vercel/Next.js)
- **Profile:** Building AI-powered SaaS on Vercel. Uses AI SDK daily. Cares about: middleware patterns, edge runtime compat, bundle size.
- **Context pack:** VERCEL_README, README_EXIT, PKG_EXIT
- **Questions:**
  1. Does the Vercel AI SDK integration follow established patterns?
  2. Would this work in edge runtime / serverless?
  3. What's the bundle size impact?
  4. Is the middleware approach the right abstraction?
- **Review format:** Code review style. Inline comments on API design. Ship / Don't ship verdict.

### P07: Platform Operator
- **Profile:** DevOps/SRE lead at a platform that hosts AI agents (think: Replit, Railway, or a large LLM API provider). Would need to implement EXIT support at scale.
- **Context pack:** SPEC, SECURITY, ECOSYSTEM, MCP_README
- **Questions:**
  1. What does it cost me (infra, eng time) to support EXIT at my scale?
  2. How do I handle 10K exits/second? What are the bottlenecks?
  3. What's my liability if I implement this wrong?
  4. Is the MCP server approach the right integration pattern for platforms?
  5. How do I handle key management for thousands of agents?
- **Review format:** Operational feasibility assessment. Cost estimate (rough). Go / No-go / Conditional-go verdict.

### P08: Compliance Officer (Regulated Industry)
- **Profile:** Compliance lead at a financial services firm. Evaluates new tech against SOX, FINRA, EU AI Act, and internal risk frameworks. Conservative, evidence-driven.
- **Context pack:** LEGAL, SPEC (sections on dispute + revocation only), NIST_RFI, SECURITY
- **Questions:**
  1. Does this help or hinder our regulatory compliance posture?
  2. Can exit certificates serve as audit trail evidence?
  3. What are the data retention implications?
  4. How does this interact with the EU AI Act's transparency requirements?
  5. Would our legal team approve this?
- **Review format:** Compliance risk assessment. Traffic light rating per regulation. Recommended conditions for adoption.

---

## Batch 3 — Layman Perspectives (3 personas)

### P09: Tech Journalist (2-Minute Skim)
- **Profile:** Writes for The Verge / Ars Technica. Scanning for a story angle. Has 2 minutes before moving to the next pitch.
- **Context pack:** SITE_HOME only (skim), SHOW_HN (Version 1 title + first paragraph)
- **Attention budget:** 2 minutes. Will not click through to spec or paper.
- **Questions:**
  1. Do I understand what this is in 30 seconds?
  2. Is there a story here? Who cares about this?
  3. What headline would I write?
  4. Would I cover this or skip it?
- **Review format:** 3-4 sentences. Headline draft. Cover / Skip verdict. What would make them cover it.

### P10: Hacker News Commenter
- **Profile:** Senior dev, opinionated, reads Show HN posts during lunch. Skims the post, maybe clicks the GitHub link. Loves to nitpick, values substance over hype.
- **Context pack:** SHOW_HN (Version 1 — technical lead), README_EXIT (first 50 lines)
- **Attention budget:** 5 minutes. Will skim, not deep-read.
- **Questions:**
  1. First reaction — is this interesting or eye-roll?
  2. What's the obvious HN critique? (over-engineering, solution looking for problem, etc.)
  3. What question would I ask in the comments?
  4. Would I star the repo?
- **Review format:** Write an actual HN comment (authentic voice — terse, technical, possibly snarky). Then a meta-note on what would improve the reception.

### P11: AI Agent (First Encounter)
- **Profile:** An LLM-based agent encountering EXIT Protocol for the first time. Given only the README. No prior context about digital rights or identity protocols.
- **Context pack:** README_EXIT only
- **Attention budget:** Single read-through, no follow-up research.
- **Questions:**
  1. Do I understand what this does and why I should care?
  2. Can I use this? What would I do with it?
  3. What's confusing or missing from my perspective as an agent?
- **Review format:** Agent's internal monologue. "Here's what I think this is... here's what I'd do with it... here's what I don't understand." Raw, first-person.

---

## Batch 4 — Skeptics & Adversarial (2 personas)

### P12: Competitor / Critic
- **Profile:** CTO at a competing identity/AI-governance startup. Looking for weaknesses to exploit in positioning. Knows the space well. Motivated to find flaws.
- **Context pack:** SPEC, PAPER (skim abstract + conclusion), ECOSYSTEM, README_EXIT
- **Questions:**
  1. What's the weakest technical claim?
  2. Where is the spec ambiguous enough to cause interop failures?
  3. What's the go-to-market vulnerability? (no adoption, no governance, no funding)
  4. If I were writing a "why EXIT Protocol will fail" blog post, what are my 3 best arguments?
  5. What would I steal for my own product?
- **Review format:** Competitive intelligence brief. Weaknesses ranked by severity. "Kill arguments" they'd use in sales. Grudging acknowledgment of what's good.

### P13: Open Source Maintainer
- **Profile:** Maintains a popular OSS project (10K+ stars). Evaluating whether to contribute to or depend on cellar-door-exit. Cares about: governance, bus factor, code quality, license, community health.
- **Context pack:** README_EXIT, PKG_EXIT, DECISIONS, `cellar-door-exit/LICENSE`, BRAND (skim)
- **Questions:**
  1. Is this project healthy? Who's behind it and will they maintain it?
  2. Is the license acceptable? (MIT/Apache/etc.)
  3. Is the code well-structured enough to contribute to?
  4. Is there a governance model or is this one person's vision?
  5. Would I add this as a dependency?
- **Review format:** OSS health assessment. Would-contribute / Would-depend / Would-watch / Would-avoid verdict. Specific concerns.

---

## Execution Notes

### Batching Strategy
- **Batch 1** (P01-P04): Run in parallel — no dependencies between reviews
- **Batch 2** (P05-P08): Run in parallel — no dependencies
- **Batch 3** (P09-P11): Run in parallel — these are fast (minimal context)
- **Batch 4** (P12-P13): Run in parallel

### Per-Persona Prompt Template

```
You are [PERSONA NAME AND DESCRIPTION].

You have been given the following documents to review:
[LIST FILES WITH ACTUAL CONTENT]

You are trying to answer these questions:
[QUESTIONS]

Write your review in this format:
[FORMAT DESCRIPTION]

Be honest, specific, and cite particular sections/lines when making claims.
Do NOT pad with generic praise. If something is good, say why specifically.
If something is bad, say exactly what's wrong and how to fix it.

Verdict: [VERDICT OPTIONS]
```

### Output Files
Each persona writes to: `assessments/persona-v2/P{NN}-{slug}.md`
Synthesis goes to: `assessments/persona-v2/synthesis.md`

### Success Criteria
A review is useful if it:
1. Identifies at least one issue not found in previous rounds
2. Gives a clear verdict (not wishy-washy)
3. Provides actionable recommendations (not just "needs improvement")

### Comparison to v1
v1 had 15 personas across 5 batches but all used similar (heavy) context packs. v2 improvements:
- Realistic attention budgets (laymen get 1-2 files max)
- NIST-submission focus in priority slots
- Adversarial/skeptic personas for stress-testing
- Specific output formats per persona type
- Agent-as-reviewer perspective (P11)
