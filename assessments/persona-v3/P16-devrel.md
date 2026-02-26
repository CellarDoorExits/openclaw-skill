# P16 — DevRel / Open Source Community Builder Assessment

**Project:** cellar-door-exit  
**Version:** 0.2.0  
**Date:** 2026-02-25  
**Assessor Persona:** Head of DevRel, mid-size OSS company (Supabase/Deno scale)

---

## Launch Readiness: Almost

---

## 1. Would I star it on Show HN? Contribute?

**Star: Yes.** The concept is genuinely novel. "Cryptographic proof of departure" is a category that doesn't exist yet, and it should. The agent-native framing is timely — anyone building multi-agent systems will immediately see the gap this fills. 399 tests, multiple signing algorithms, FIPS compliance — this isn't vaporware.

**Contribute: Not yet.** I'd watch. The CONTRIBUTING.md is too thin to make me feel confident picking up a task. There's no issue labeling guide, no `good-first-issue` tags mentioned, no architecture overview to orient me. I'd need to read the entire `src/` to know where to start.

## 2. Elevator Pitch & README Delivery

**My pitch:** "EXIT is a cryptographic primitive that lets agents, users, and DAOs produce signed, portable, offline-verifiable proof of departure. Think SSL certs but for leaving."

**Does the README deliver it?** The first two sentences are strong. But the README then does something fatal: it goes Install → CLI → API → Schema → Modules → Ceremony → Demos → Design Principles → Implementation Status. That's a reference manual, not a landing page.

The "why should I care" is buried. The design principles (non-custodial, always available, offline-verifiable, agent-native) are the *selling points* — they're in section 8 of 10. The ceremony model is genuinely interesting and differentiating — it's section 7.

**Verdict:** The README has all the right content in the wrong order.

## 3. Contributor Onboarding

**Not sufficient for a first PR.** Specific gaps:

- No architecture diagram or module map
- No `good-first-issue` label guidance
- No development setup beyond "npm install && npm run build"
- No explanation of the module system (A through F) for contributors
- GOVERNANCE.md is honest about being BDFL, which is fine at this stage
- No Discord/community channel to ask questions

A new contributor would need to reverse-engineer the codebase structure from file names. That's a 2-hour tax before writing any code.

## 4. Launch Strategy Recommendation

**Tier 1 (Week 1):**
- **Show HN** — Lead with: "I built a cryptographic primitive for agent departure." HN loves novel primitives and the agent angle is zeitgeist-perfect. Don't lead with "cellar-door" branding — lead with the problem.
- **Twitter/X thread** — Target the AI agent builder crowd. Tag @langabordi, @AndrewYNg, @kabordi, agent framework authors. Frame: "Your agents can join things. Can they *leave* things? Verifiably?"

**Tier 2 (Week 2-3):**
- **dev.to / Hashnode** — Tutorial: "How to add verifiable exit to your LangChain agent in 5 minutes" (you have @langchain/core in devDeps — use that)
- **Reddit** — r/programming, r/cryptocurrency (DAO angle), r/MachineLearning (agent angle)

**Tier 3 (Ongoing):**
- **Discord** — Create one. You need a place for early adopters to ask questions and for you to build social proof.

**Don't do:** Product Hunt (wrong audience), LinkedIn (too early).

## 5. Three Things to Change Before Public Launch

### 1. Restructure the README (Impact: Critical)

Reorder to: Problem → Why it matters → 10-second code example → Design principles → Install → The rest.

Move the schema table and ceremony model *up*. These are your differentiators. The CLI docs can go in a separate `docs/CLI.md`. The implementation status table belongs in CHANGELOG or a STATUS.md — it's internal signal, not marketing.

Add a "Who is this for?" section with three bullets: agent developers, platform builders, DAO governance designers.

### 2. Create a contributor on-ramp (Impact: High)

- Add 5-10 `good-first-issue` labels on GitHub (docs improvements, test coverage for edge cases, CLI output formatting)
- Add an `ARCHITECTURE.md` with a module dependency diagram
- Add a "Development" section to CONTRIBUTING.md (how to run tests, how modules are structured, where to add new features)
- Create a Discord server with a #contributors channel

### 3. Build the "LangChain integration" story (Impact: High)

You already have `@langchain/core` in devDeps. Ship a `examples/langchain-exit.ts` that shows an agent registering with a platform, doing work, and exiting with a verifiable marker. This is your Trojan horse into the agent ecosystem. Write this up as a blog post for launch week.

## 6. Narrative Hook

**"Your AI agent can't prove it left."**

That's the hook. Every agent framework handles joining, connecting, registering. None of them handle *departure* as a first-class, cryptographically verifiable event. In a world where agents will operate across dozens of platforms simultaneously, the ability to prove "I was there, I left, here's the receipt" is infrastructure-level important.

Secondary hook for the crypto/DAO crowd: **"Exit rights without exit scams."** A member can prove they left in good standing even if the DAO disappears.

The "ceremony" framing is also surprisingly sticky — it elevates a technical act into something meaningful. Lean into it.

---

## Action Items (Ranked by Impact)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Restructure README: problem-first, move reference docs out | 🔴 Critical | 2-3 hours |
| 2 | Write "Your AI agent can't prove it left" Show HN post | 🔴 Critical | 3-4 hours |
| 3 | Ship LangChain integration example + blog post | 🟠 High | 1 day |
| 4 | Create 5-10 good-first-issues on GitHub | 🟠 High | 1 hour |
| 5 | Add ARCHITECTURE.md with module map | 🟠 High | 2-3 hours |
| 6 | Create Discord server | 🟡 Medium | 30 min |
| 7 | Expand CONTRIBUTING.md with dev setup + structure guide | 🟡 Medium | 1-2 hours |
| 8 | Add "Who is this for?" section to README | 🟡 Medium | 30 min |
| 9 | Prepare Twitter/X thread with agent departure narrative | 🟡 Medium | 1 hour |
| 10 | Write dev.to tutorial for Week 2 | 🟢 Low (timing) | Half day |

---

## Bottom Line

This is a genuinely novel primitive with solid engineering behind it. The concept is strong enough to generate organic interest — "cryptographic proof of departure" is a category-creating idea. But the packaging is engineer-facing when it needs to be developer-facing. The README reads like internal documentation, not a launch page.

Fix the README ordering, nail the Show HN narrative, and ship the LangChain example. That's your launch week. Everything else can follow.

You're closer than most projects I see at this stage. The hard part (building something real and novel) is done. The remaining work is storytelling and on-ramp design — and those are solvable in a weekend.
