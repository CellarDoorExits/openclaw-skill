# P29 — High School CS Teacher Review

**Persona:** AP Computer Science teacher, senior AI/ethics elective  
**Students:** Smart 16–17 year olds, comfortable with Python, basic crypto awareness  
**Document:** `cellar-door-exit/README.md`

---

## 1. Could a smart 17-year-old understand this README?

**Partially — maybe 60%.** The top-level concept ("a signed proof that you left") is graspable. The CLI examples are concrete and would make sense to any student who's used a terminal. The code snippets are TypeScript, which my Python kids could follow with a little squinting.

Where they'd lose the thread:

- **DIDs** (`did:key:z6Mk...`, `did:web:platform.example`) — this notation is alien. Students would ask "what is this string?" and there's no explanation.
- **The Ceremony section** — the state machine (ALIVE → INTENT → SNAPSHOT → OPEN → FINAL → DEPARTED) is presented without enough context. Why these states? What happens at each one? It reads like an engineering spec, not a teaching document.
- **Module lettering (A–F)** — they're listed but not motivated. A student would skim past them.
- **FIPS 140-2/3, HSM, KMS** — enterprise jargon that would bounce right off a teenager.

The schema table (7 fields) is actually great — clear, compact, well-labeled. That's the most teachable part of the whole document.

## 2. Concepts to Pre-Teach

Before assigning this, I'd need at least two class periods on:

1. **Digital signatures** — not just "hashing" but sign/verify with key pairs. We'd do this hands-on in Python with `cryptography` or `nacl`.
2. **Decentralized Identifiers (DIDs)** — what they are, why they exist, how they differ from usernames. Even a 10-minute explainer would help enormously.
3. **State machines / ceremony protocols** — the idea that a process has defined stages. Could use a vending machine analogy.
4. **Portable credentials** — the concept that you can carry proof of something without the issuer being online. Compare to a physical diploma.

Nice-to-have:
- Ed25519 vs ECDSA (but honestly I'd abstract this away for a class)
- JSON schema / structured data formats

## 3. Would this make a good class project or assignment?

**Yes — with significant scaffolding.** Here's what I'd do:

### Lesson Plan Sketch: "The Right to Leave" (3–4 class periods)

**Day 1: Motivation (Ethics)**
- Discussion: "What happens when you delete your Instagram account? What do you keep? What proves you were there?"
- Introduce the concept: platforms own your history, your reputation, your connections
- Frame: "What if AI agents face the same problem, but worse?"
- Homework: Read the 7-field schema table and the Design Principles section only

**Day 2: Hands-On (Technical)**
- Install cellar-door-exit, run `exit keygen`, `exit create --sign`, `exit verify`
- Pair exercise: Student A creates an EXIT marker, Student B verifies it
- Discuss: What did the signature prove? What would happen if you tampered with the JSON?
- Extension: Modify the marker JSON by hand, try to verify — watch it fail

**Day 3: Design (Applied)**
- Groups design their own "exit scenario" — pick a context (game guild, school club, social media)
- What fields matter? What's the ceremony look like?
- Write a marker by hand (JSON) for their scenario
- Present to class

**Day 4: Ethics Debate (AI/Ethics elective only)**
- "Should AI agents have the right to leave?"
- "If an agent exits 'in good standing,' should the next platform trust that?"
- "Who decides if the exit was voluntary vs. coerced?"
- Connect to real-world: platform lock-in, data portability, GDPR right to deletion

This would work as a 1-week unit in the AI/ethics elective. For AP CS, it's too niche — I'd only use Day 2 as a cryptography lab.

## 4. Is the "AI agents need passports" framing relatable for teens?

**Surprisingly yes.** My students already think about:
- Getting banned from Discord servers and losing their history
- Platform lock-in (Spotify playlists, game inventories)
- AI chatbots and whether they're "alive" or have experiences

The passport/departure metaphor clicks because teens understand leaving — leaving friend groups, leaving platforms, graduating. The idea that *you should get a receipt when you leave* is intuitive.

What's less relatable: the enterprise framing. "DAOs," "FIPS compliance," "HSM integration" — this screams adult infrastructure. The README currently speaks to engineers, not to curious teenagers.

The **emergency exit** scenario is the one that would spark the most discussion: "The platform is shutting down and the agent has milliseconds to prove it existed." That's dramatic. That's a movie premise. Lead with that.

## 5. What would I change for accessibility?

1. **Add a "Why does this exist?" section at the top** — a 3-sentence story. "Imagine an AI agent that's worked on a platform for two years. The platform shuts down. How does the agent prove its track record to a new platform?" Currently the README jumps straight to `npm install`.

2. **Explain DIDs in one paragraph** — or link to a beginner-friendly explainer. Don't assume the reader knows what `did:key:z6Mk...` means.

3. **Expand the Ceremony section with a narrative** — walk through one path as a story, not just a table. "First, the agent announces it wants to leave (INTENT). Then it takes a snapshot of its current state..."

4. **Move the implementation status tables to a separate CHANGELOG or STATUS doc** — they're noise for a first-time reader. The v0.2.0 additions, test counts, and FIPS details are for maintainers, not learners.

5. **Add a "concepts" or "glossary" section** — DID, Ed25519, marker, ceremony, proof. Five definitions would save a lot of Googling.

6. **Python examples alongside TypeScript** — my students would engage 3x more if they could pip install something and use it in Python.

## 6. Would students find this cool, boring, or scary?

**Cool — with the right framing.**

- The CLI demo where you create a cryptographic proof in two commands? **Cool.** Teens love feeling like hackers.
- The emergency exit scenario? **Cool and a little scary.** "The AI has to escape before the platform dies" is genuinely dramatic.
- The "AI agents need passports" framing? **Cool.** It sounds like science fiction but it's real code they can run.
- The implementation status tables and FIPS compliance? **Boring.** Eyes would glaze.
- The ethics implications (coercion detection, dispute bundles)? **Scary in a productive way.** "Wait, someone could *force* an agent to leave and mark it as voluntary?"

The coercion labeling feature in `ethics.ts` would provoke an incredible class discussion. My students would immediately connect it to real-world power dynamics — bans, deplatforming, censorship. That's gold for an ethics class.

---

## Summary Verdict

| Dimension | Rating |
|-----------|--------|
| **Grade level** | College freshman / advanced HS senior (as written). Could be adapted to junior-level with scaffolding. |
| **Educational value** | **High** — covers crypto, identity, ethics, protocol design in one package |
| **Engagement** | **Engaging** when framed as "AI escape pods" or "digital passports." **Confusing** if handed the README cold. |
| **Accessibility** | Needs work — too much assumed knowledge, enterprise jargon in the lower half |
| **Class project potential** | **Strong** for AI/ethics elective. Workable as a crypto lab for AP CS. |

**Bottom line:** This is a genuinely interesting project that my best students would love — but the README is written for developers, not learners. With a narrative introduction, a glossary, and the enterprise stuff moved to appendices, this could be a fantastic teaching tool. The core concept — "prove you left, cryptographically, without anyone's permission" — is powerful and accessible. The current packaging buries that power under implementation details.
