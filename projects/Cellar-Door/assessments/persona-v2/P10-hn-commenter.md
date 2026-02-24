# P10: Hacker News Commenter

**Persona:** Senior dev, 15 YOE, opinionated, reads Show HN during lunch.
**Sources read:** `show-hn-drafts.md` (Version 2 — problem-first), `cellar-door-exit/README.md` (first 50 lines).
**Time spent:** ~5 minutes.

---

## The HN Comment

> Interesting problem framing but I'm not sure this solves what it claims to solve.
>
> The fundamental issue with "verifiable departure" is that the departing platform has to cooperate honestly for the record to mean anything. You mention the unilateral path, but a self-attested departure record is... just a self-attested departure record. The receiving platform still has no way to know the agent wasn't cloned, still running, or had its state tampered with before exit.
>
> Ed25519 and content-addressed IDs are fine choices but this isn't really a crypto problem — it's a trust problem. Who's the root of trust? You say "non-custodial" and "offline-verifiable" but the signature is only as good as whoever controls the private key. If the platform manages the agent's keys (which is the norm right now), the platform can forge departure records at will.
>
> Also: 5 npm packages for a protocol that has zero adoption is putting the cart before the horse. Ship the spec, get two platforms to implement it, then build the SDK ecosystem.
>
> The NIST submission angle is smart positioning though. Genuinely curious whether they engage with it.

---

## Meta-Note: Improving HN Reception

**What works:**
- Problem framing is strong. "No proof an agent departed vs. was silently killed or cloned" — that's visceral and concrete.
- 335 bytes, zero deps, 368 tests — HN loves these numbers.
- Solo developer with NIST submission = underdog narrative.

**What will get attacked:**
- The trust bootstrapping problem (my comment above). Have a clear answer ready.
- "Solution looking for a problem" — agents aren't really moving between platforms yet in production. Need concrete use cases *today*, not future projections.
- The name and the literary framing. HN will find the Tolkien reference charming or pretentious — coin flip. Keep it out of the Show HN post body.
- 5 npm packages with 0 users looks like over-engineering.

**Suggestions:**
1. Lead the first comment with the key management problem and how you're thinking about it. Don't wait for HN to find the hole.
2. Drop one concrete scenario: "Here's a LangChain agent migrating from OpenAI to Anthropic, here's the exit marker, here's verification." Make it real.
3. Cut the package count to 2 (core + one integration) for launch. Ship the others when someone asks for them.
4. **Star the repo?** — I'd read the spec. Probably wouldn't star yet. Need to see the spec doc itself, not just the SDK.
