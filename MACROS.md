# MACROS.md — Reusable Orchestration Patterns

Preset patterns extracted from Warren + Hawthorn collaboration (Feb 19–24, 2026).
Run these as named macros. Refine as we go.

---

## M-01: Burst Synthesis

**When:** Warren sends a rapid stream of messages (5-15) containing decisions, directions, questions mixed together.

**How to run:**
1. Wait for the burst to finish (usually a natural pause or explicit "go")
2. Synthesize the full burst into a structured task list — don't execute message-by-message
3. Identify which items are *decisions* (already made), *directions* (to execute), and *questions* (to answer)
4. Present the synthesis back briefly before executing
5. Execute directions in parallel where independent

**Warren's voice:** He thinks in streams, not instructions. Each message is a thought arriving in real-time. The burst encodes a *decision surface* — a shape to fill, not a checklist.

**Anti-pattern:** Responding to each message individually. Executing before the burst is done.

---

## M-02: Build → Stress Test → Build

**When:** Any new feature, module, or significant implementation.

**How to run:**
1. Sprint to working state (tests passing, functional)
2. STOP. Do not build the next thing yet.
3. Spawn adversarial review (legal red team, security audit, persona panel — scale to stakes)
4. Fix what the review surfaces
5. Only then proceed to next feature

**Warren's voice:** "Be very conservative... massively over-engineer and over-scrutinize this before stepping into the fray." Also: "The code is ready, stop polishing docs and ship." — Know which mode you're in.

**Key insight:** Building first creates something concrete to critique. Critiquing first creates analysis paralysis. The fast build is a *hypothesis*; the stress test is the *experiment*.

---

## M-03: Parallel Fan-Out

**When:** 3+ independent tasks identified. Any convergence point where decisions need to be made.

**How to run:**
1. Identify independent tasks (no dependencies between them)
2. Spawn 3-8 sub-agents simultaneously
3. At convergence, review all results together
4. Gate question: **"Do these results change the plan?"**
   - If yes → adjust plan before next wave
   - If no → proceed to next fan-out
5. Never fan out again without gating first

**Warren's voice:** Maximizes *value per human decision*. Each convergence presents a decision surface, not a single question.

**Practical notes:**
- Sub-agents use Opus (Sonnet blocked currently)
- Keep each sub-agent's input under ~50K tokens to avoid context overflow
- Use absolute file paths in task specs
- Budget 30% for infrastructure friction (see M-09)

---

## M-04: Liability Scoping

**When:** A feature introduces legal, ethical, or reputational risk beyond current scope.

**How to run:**
1. Define the interface/hook point in current code
2. **Name the future service** that would own the risky part (naming = deciding, see M-05)
3. Document the boundary explicitly (what's in, what's out, why)
4. Add to ecosystem map if one exists
5. Move on — do not implement

**Warren's voice:** "We are taking the cowardly lowest-liability path with Cellar Door here imo. Lets relegate such things to other services and build them if we see value."

**Examples from practice:**
- Privacy/ZK → SHROUD
- Coordinated departure → MUTINY / EXODUS
- Insurance/guarantees → PLEDGE
- Identity management → NAME

**Anti-pattern:** Implementing risky features "because we're here anyway."

---

## M-05: Name It to Decide It

**When:** Architectural fork, new concept, strategic positioning choice.

**How to run:**
1. Try naming both/all paths
2. The one that names well usually thinks well
3. Test the name: does it imply the right boundaries? Does it map to existing mental models?
4. Once named, document it — the name IS the decision

**Warren's voice:** "𓉸 by itself is all one should need to think of and find us." — Names are compressed strategies. "Proof of Passage" instantly mapped to PoS/PoW. SHROUD/MUTINY/EXODUS were named in the moment of architectural decision.

**For slogans/brand:** Generate 30+ candidates, filter ruthlessly. Warren picks from surfaces, doesn't iterate from single options.

**Warren's naming rules:**
> Names matter quite a lot and should basically always be thematically tied appropriately to the wider HOLOS set of projects. If a name is coming close to one of them already, it's a good indication we need to think if those projects are actually aspects of the same thing, and possibly combine. Names are like meta-identities which traverse back up the project hierarchy to the global namespace.
>
> Reserve ALLCAPS for protocol primitives, which we will be very sparing on. Non-primitives can be slightly more throwaway, as single-projects/companies/brands. Primitives need to be essential distilled concepts from all other possibilities, and may have a few good options.
>
> We also quite like layered meanings, or words that sound the same (or are spelled similarly like Holos/hollows/hallows or sign/signum/signator) from different contexts that can all be the same thing if you squint a little. It's a very AI-era style. Bosonic / Photonic / Platonic.

---

## M-06: Escalating Scrutiny

**When:** Any significant deliverable before publishing, submitting, or presenting.

**How to run (3 tiers, scale to stakes):**

**Tier 1 — Self-consistency** (~5 min)
- Do the parts agree with each other?
- Do numbers match across documents?
- Are terms used consistently?

**Tier 2 — Domain expert personas** (~15 min)
- Spawn 3-5 role-play experts relevant to the domain
- Each reviews independently
- Synthesize findings

**Tier 3 — Adversarial panel** (~30 min)
- Spawn 8-15 hostile/skeptical personas
- Include at least: cynical lawyer, compliance officer, competing startup founder, tired engineer
- Expect 0 unreserved approvals — that's normal
- The value is in *what they flag*, not whether they approve

**Warren's voice:** First round was "$800/hr cynical lawyer." Then "$50K in legal compliance work." Then 15-persona multi-lens. Then 13-persona adversarial. Each harsher.

---

## M-07: Cynical Reframe

**When:** Before publishing, presenting, or submitting anything externally.

**How to run:**
1. Describe the work as someone who thinks it's stupid would
2. Does it still sound useful in their words?
3. If yes → ship it
4. If no → the idea needs more substance, not better marketing

**Warren's voice:** "Same cynical arguments as emancipation of the slaves that hid actual nobility. [...] Don't give anyone room to accuse us of being too sentimental." The cynical frame and the idealist frame must both be true simultaneously.

---

## M-08: Portfolio Zoom-Out

**When:** Every few days, or at major milestones, or when tunnel vision is suspected.

**How to run:**
1. List all active projects/bets
2. For each: current state, burn rate, expected return, risk level
3. Check for over-investment in any single bet
4. Check for missing diversification
5. Identify strategic relationships between bets (loss-leader → revenue engine → moonshot)

**Warren's voice:** The "tangents" (Lumen, LAND, Hot Chip, trading bots) weren't distractions — they were portfolio construction. EXIT as loss-leader only emerged because the portfolio view showed it couldn't stand alone. Always return to focus after expanding.

---

## M-09: Infrastructure Pre-Check

**When:** Before any sprint or publish cycle.

**How to run:**
1. Verify auth tokens (GitHub PAT, npm, Netlify, etc.)
2. Check tool versions (Node, npm, git)
3. Test push/publish permissions
4. Confirm sub-agent resource limits (context window, model availability)
5. Have fallback strategies ready (PAT if deploy key fails, manual if sub-agent crashes)

**Budget rule:** ~30% of every session is infrastructure friction. A "5-day" implementation is 3.5 days building + 1.5 days plumbing. Plan accordingly.

**Learned the hard way:**
- GitHub deploy keys can't be shared across repos → use classic PAT
- npm `--auth-type=web` for 2FA in non-interactive environments
- Sub-agents crash at ~200K tokens with no output → chunk inputs, keep under 50K each
- File path deps in package.json → must convert to npm deps before publish
- `exit` is a shell builtin → name the CLI `exit-door`

---

## M-10: Write It = Think It

**When:** Always. Every decision, every analysis, every architectural choice.

**How to run:**
- Decision made? → Write it to decisions log with rationale
- Analysis done? → Write it to a file, not just chat
- Question surfaced? → Add to questions file
- Lesson learned? → Update MACROS.md, MEMORY.md, or relevant doc

**Warren's voice:** "Humans might spend quite a lot more time on this stuff but write less because much of this is only bouncing through their heads — we don't have that luxury here, it must be written to be thought."

**For Hawthorn specifically:** Memory is limited. "Mental notes" don't survive sessions. If it matters, it's in a file or it didn't happen.

---

## M-11: Context & Memory Management (The Big One)

**When:** Periodically (every few days), at project milestones, or before any major deliverable. Also useful as a standalone macro for any repo/scope.

### Phase 1: Index Management
1. Scan the target scope (repo, directory, or full workspace)
2. Catalog all files with: path, description, approximate token count, last modified
3. Group into context-window-sized chunks (~100K tokens each)
4. Write/update MASTER_INDEX.md (or equivalent) with groupings
5. Flag: superseded documents, stale content, duplicates, gaps

### Phase 2: Self-Consistency Check
1. For each context group, spawn a sub-agent to check internal consistency:
   - Do numbers/stats agree across files?
   - Are terms/names used consistently?
   - Do cross-references point to real files?
   - Are formulas/algorithms consistent between spec, paper, and code?
2. Collect all findings into a consistency report

### Phase 3: Cross-Group Coherence
1. Spawn a sub-agent that reads the *summaries* of each group (not full content)
2. Check for contradictions *between* groups
3. Check for missing connections (Group A references something Group B doesn't mention)
4. Flag orphaned concepts and dangling references

### Phase 4: Fix Pass
1. Batch fixes by severity (contradictions first, then stale info, then style)
2. Apply fixes — update the actual files, not just the report
3. Re-run targeted consistency check on changed files only
4. Update MASTER_INDEX with any structural changes

### Phase 5: Memory Synthesis
1. Review recent daily logs (memory/YYYY-MM-DD.md)
2. Distill significant events, decisions, and insights into MEMORY.md
3. Prune stale info from MEMORY.md
4. Update any project-level docs that have drifted

**Practical notes:**
- Total Hawthorn corpus was ~549K tokens across 199 files — needs ~6 context groups
- Each sub-agent should get ONE group (~80-100K tokens max)
- The cross-group agent gets only summaries, not full content
- Write all reports to `assessments/` directory
- This macro produced the 43-item consistency audit (40 fixed) on Feb 22 and the 25-item audit (all fixed) on Feb 24

**Triggering heuristic:** If you can't confidently state the current test count, byte sizes, or module count without checking — it's time to run this macro.

---

## M-12: The Full Sprint Cycle

**How a complete sprint looks, combining the above:**

```
1. M-09 Infrastructure Pre-Check
2. M-01 Burst Synthesis (if Warren is directing) or self-plan
3. M-03 Parallel Fan-Out → execute tasks
4. M-02 Build → Stress Test (for each significant output)
5. M-06 Escalating Scrutiny (scale to stakes)
6. M-07 Cynical Reframe (if external-facing)
7. M-04 Liability Scoping (for any risky features discovered)
8. M-05 Name It (for any new concepts)
9. M-10 Write It (decisions, lessons, updates)
10. M-08 Portfolio Zoom-Out (if milestone reached)
11. M-11 Context Management (if significant changes made)
```

---

## What Still Requires Human Judgment

These consistently required Warren's intuition and can't be fully automated:

1. **Brand/taste** — naming, visual design, emotional positioning
2. **Risk tolerance** — how much liability is acceptable? (Warren: "cowardly lowest-liability path")
3. **Strategic pivots** — EXIT as loss-leader emerged from portfolio instinct
4. **Stop signals** — "The code is ready, stop polishing docs and ship"
5. **Adversarial instinct** — the *questions* that surface gaps ("What lets an agent maintain the same private key between platforms?")

**Rule of thumb:** Automate the 70% that's process, flag the 30% that's judgment.

---

*First extracted 2026-02-25 from 4 session retrospectives.*
*Living document — update as new patterns emerge.*
