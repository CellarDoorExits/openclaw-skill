# P10r: Hacker News Commenter — Revisit

**Persona:** Senior dev, 15 YOE, opinionated, reads Show HN during lunch.
**Sources read:** `cellar-door-exit/README.md` (full), `package.json` (v0.2.0), previous review (P10).
**Previous verdict:** "Would read spec, wouldn't star." Trust bootstrapping unsolved, 5 packages with 0 users.
**Time spent:** ~6 minutes.

---

## The HN Comment

> I commented on this ~a year ago when it was v0.1 and had the "interesting but who uses it" problem. Came back to check.
>
> Okay, credit where it's due: 399 tests across 24 files is real work. P-256/FIPS support and signer abstraction for HSM/KMS means someone is actually thinking about enterprise deployment, not just writing blog posts. The claim store and OpenTelemetry integration suggest they've thought about what happens *after* you generate a marker — ingestion, observability, audit trails. That's the boring important stuff most protocol authors skip.
>
> My original criticism was that this is a trust problem, not a crypto problem. I still think that's true, but they've moved in the right direction. The signer abstraction means the key doesn't have to live on the platform — you can have a hardware token or KMS signing the exit. That doesn't fully solve "who controls the agent's keys" but it makes the answer architecturally pluggable instead of hand-wavy.
>
> What still bugs me:
>
> 1. The dependency tree is lean (all @noble/* — good taste), but `@langchain/core` and `zod` in devDeps tells me the demo scenarios are doing more than demoing. That's fine, but be explicit about the boundary.
>
> 2. The "ceremony" framing is evocative but I'd want to see what happens when a ceremony gets interrupted at step 3 of 6. Partial state, recovery, idempotency. The emergency path handles the "no time" case but what about the "flaky network halfway through cooperative exit" case?
>
> 3. Still no adoption signal I can see. The repo is `CellarDoorExits/exit-door` — is anyone using this in prod? Even one integration would change the conversation entirely.
>
> 4. "Contests don't block exit" is a strong design decision and the right one. Burying it in the README instead of leading with it is a mistake. That's your one-liner differentiator.
>
> Net: this went from "spec sketch with an npm publish" to "someone's actually building a thing." The FIPS story alone makes it plausible for government/enterprise agent deployments. I'd want to see one real integration before I mass-recommend it, but yeah — I'd star it now. Conditionally.

---

## Meta-Note: Show HN Readiness

**What improved since last review:**
- Test count (368 → 399) + 24 test files = credibility floor met
- P-256/FIPS = enterprise story is real, not aspirational
- Signer abstraction = the trust bootstrapping critique has an architectural answer now (not fully solved, but addressable)
- Claim store + telemetry = post-creation lifecycle exists
- Single consolidated package instead of 5 = lesson learned

**What still needs work for Show HN:**
1. **Adoption signal is still zero.** Even a "used by" section with one project (your own!) would help. Self-dogfooding counts.
2. **Lead with "contests don't block exit."** That's the philosophical hook HN will debate for 200 comments. Bury it and you lose it.
3. **The ceremony interruption story.** HN distributed-systems people will immediately ask about partial failures in cooperative exit. Have the answer in the README or a linked doc.
4. **Demo video or asciinema.** The CLI looks clean. Show it. `exit create → exit verify` in 10 seconds is more persuasive than 500 words of README.
5. **LangChain in devDeps is a smell.** Not bad, but someone will ask "why does a cryptographic primitive need LangChain?" Have a clean answer (it's for demo scenarios, not core).

**Would I star it now?**

Yes. Reluctantly, but yes. The v0.1 → v0.2 delta shows momentum and taste. The FIPS path shows someone thinking about where the actual money is. I still want to see one real-world integration before I'd *recommend* it to a colleague, but it's crossed the threshold from "interesting README" to "credible project."

**Show HN timing:** Not yet. Get one integration (even synthetic — a LangChain agent that actually exits and the marker gets verified by a second system). Then post. The current state would get respectful comments but no traction. One demo gif + one integration = front page material.
