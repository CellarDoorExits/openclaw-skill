# Adversarial Review: EXIT Protocol NIST RFI Submission

**Reviewer persona:** Senior NIST reviewer, 200 RFI responses deep, allergic to hype.

---

## 1. First Impression (30-second skim)

The title is decent: "Agent Transition Documentation and Portable Liability Records for Competitive AI Markets." That's specific enough to not immediately land in the "another AI thought leader" pile.

The executive summary does something smart — it names a gap rather than pitching a product. "The emerging AI agent economy has a documentation problem" is a hook. The four bullet points (enterprises, insurers, regulators, markets) ground it.

**Would I keep reading?** Grudgingly, yes. It doesn't set off my "blockchain will save democracy" alarm in the first paragraph. But I'm wary — solo submitter, no institutional affiliation, protocol nobody has heard of. I'm giving it 3 more minutes, not 30.

**Grade: B-** — Earns continued attention but hasn't earned trust.

---

## 2. Credibility Check

This is the submission's biggest weakness and the author knows it.

> **Submitted by:** Warren Koch, EXIT Protocol Project

No university. No company. No co-authors. No advisory board. No "we work with [enterprise customer]." Section 7 ("About the Submitter") is two paragraphs that essentially say "one person wrote a spec and some TypeScript."

> "The project is in early-stage development (specification drafted, reference implementation built, no production deployment)."

Credit for honesty. But this is also a death sentence in a competitive RFI where Google, Microsoft, Anthropic, and Cisco are submitting with teams of 50 and production deployments serving millions.

**What saves it partially:** The submission doesn't overclaim. It doesn't say "we've solved agent identity." It says "here's a gap, here's a minimal format, consider including this in the framework." That's the right posture for a solo contributor — but only if the technical substance holds up.

**What would help enormously:** Even one institutional co-signer. An advisor from a VC firm, an insurance company, a law school, anyone. "Warren Koch, with input from [someone at Swiss Re or Stanford]" changes the entire credibility calculus.

**Grade: D+** — Honest but fatally lightweight for this venue.

---

## 3. Technical Substance

### The Good

The core schema is genuinely minimal. Seven fields, ~335 bytes. That's refreshing — most submissions I see are 47-page frameworks that would take a team of 20 to implement. The design choices are defensible:

- Ed25519 for signatures (standard, fast, well-understood)
- JSON-LD for semantic interop (aligns with W3C ecosystem)
- Content-addressed IDs (tamper-evident by construction)
- W3C DIDs for subject identification (not reinventing the wheel)

The three transition paths (cooperative, unilateral, emergency) show someone thought about adversarial scenarios, not just the happy path.

### The Bad

**"205 passing tests"** — This is mentioned in the paper but not the RFI. Good, because it would sound defensive here. But the RFI still lacks any evidence of real-world validation. No "we tested this with X agents migrating between Y platforms." No benchmarks. No interop testing with actual A2A or MCP implementations.

**The extension modules feel speculative.** Six optional modules (Lineage, State Snapshot, Dispute Bundle, Economic, Metadata, Cross-Domain Anchoring) sounds like a protocol designed by imagining every possible future need. Which of these have been implemented? Which have been tested? The submission is silent.

**"did:keri for production"** — KERI is itself not widely deployed. Recommending it as a production DID method is aspirational, not practical.

### The Hand-Wavy

> "Zero-knowledge selective disclosure planned for privacy-preserving verification"

"Planned" is doing a lot of work in that sentence. This is a roadmap bullet, not a technical claim.

> "Economic mechanisms (staked attestation, reputation bonds) that create incentives for honest reporting"

Section 6.3 recommends NIST consider these. But the submission doesn't describe how they work in EXIT. This is "someone should figure this out" dressed up as a recommendation.

**Grade: B** — Technically sound at the core, but the ratio of implemented-to-imagined is concerning.

---

## 4. Relevance to NIST's Actual RFI Questions

**Critical issue:** The submission references a "NIST AI Agent Standards Initiative RFI (February 17, 2026)." At time of review, NIST's actual agent-related work centers on:

- The **NCCoE** project on AI Agent Identity and Authorization
- The **AI Risk Management Framework (AI RMF)**
- General calls for input on AI standards gaps

A real NIST RFI would likely ask specific questions about: identity/authentication standards, authorization frameworks, interoperability requirements, risk management approaches, security considerations, and governance mechanisms.

**What the submission does well:**
- Section 3.1 directly addresses agent identity at lifecycle boundaries
- Section 3.2 maps EXIT to the protocol stack (A2A, MCP, AP2) — shows awareness of the landscape
- Section 3.3 addresses trust and risk management
- Section 3.4 addresses security with specific threat categories

**What it misses:**
- No mention of how EXIT relates to the AI RMF's risk tiers
- No mapping to NIST's existing identity frameworks (SP 800-63, etc.)
- No discussion of how EXIT interacts with federal procurement or FedRAMP
- The competitive/economic arguments (Section 4) feel more like op-ed material than standards input — "US must lead" is fine for a blog post but NIST reviewers care about technical merit, not geopolitics
- No discussion of testing, conformance, or how NIST would evaluate implementations

**The fundamental question:** Does NIST's initiative even consider "agent departure" in scope? The submission assumes this is a gap NIST should care about. That's a risky bet. If the RFI asks "how should agents authenticate?" and you answer "here's how they should document leaving," you're answering a different question.

**Grade: C+** — Addresses adjacent concerns competently but may be answering the wrong question.

---

## 5. Competitive Context

Let's be honest about what this is competing against.

**Google** will submit something backed by A2A deployment data from millions of agent interactions, with 30 co-authors from DeepMind and Cloud.

**Microsoft** will submit Entra Agent ID documentation with enterprise deployment numbers, co-authored with Azure identity architects and referencing billions of authentications.

**Anthropic** will submit MCP ecosystem data showing tool-use patterns across thousands of integrations.

**Cisco/OASF** will submit with enterprise networking credibility and Fortune 500 deployment references.

**This submission** is one person with a spec, a TypeScript reference implementation, and zero production deployments.

The *only* winning strategy for this submission is: **identify a gap that none of the big players address.** And to be fair, it does. Nobody else is talking about agent departure documentation. Google's A2A doesn't cover it. Microsoft's Entra doesn't cover it. The submission correctly identifies this gap.

But "identifying a gap" and "having a credible solution" are different things. The big players could absorb this idea into their next protocol revision in a week. The submission's value is in the *framing*, not the *implementation*.

**Grade: C** — Right gap, but a whisper in a room of megaphones.

---

## 6. Red Flags

### 🚩 The website is down
> https://cellar-door-exit.netlify.app — **returns 404**

This is an instant credibility destroyer. You link to your project site in a federal submission and it's *not there*? If I'm a reviewer who actually clicks links (and some of us do), this submission just died. Fix this before anything else.

### 🚩 Self-referential standard
The `@context` URL is `https://cellar-door.org/exit/v1`. Does cellar-door.org exist? Does this URL resolve? If not, you're referencing a JSON-LD context that doesn't exist from a domain you may not own. This is how you get laughed out of a standards review.

### 🚩 "Cellar Door" as a project name
I get the Tolkien reference (or the phonaesthetics thing). But in a federal submission, "Cellar Door" sounds like a hobby project or a band name. It undermines seriousness. The submission would be stronger referring to "the EXIT Protocol" throughout and never mentioning "Cellar Door."

### 🚩 Referencing a future NIST document
> "NIST. (2026). 'NIST Launches AI Agent Standards Initiative.'"

If this RFI hasn't been published yet, you're citing something that doesn't exist. If it has, cite it properly with the Federal Register notice number.

### 🚩 The Hirschman/Akerlof framing
Invoking *Exit, Voice, and Loyalty* and the "market for lemons" is clever but risky. An academic reviewer would appreciate it. A standards engineer will think "cool theory, where's the interop test?" The economic framing takes up space that could be used for technical specifics.

### 🚩 No threat model
The security section (3.4) lists four threat categories but doesn't present an actual threat model. Who are the adversaries? What are their capabilities? What are the trust assumptions? "Identity laundering" and "weaponized transition records" are named but not formally analyzed.

**Grade: D** — Multiple credibility-destroying issues.

---

## 7. Missing Pieces

In order of importance:

1. **A working website.** Non-negotiable.
2. **A conformance/testing section.** How would an implementer know they've done it right? How would NIST evaluate compliance?
3. **An interoperability demonstration.** Even a toy demo showing EXIT markers generated during an A2A agent migration would be transformative.
4. **Institutional support.** Even one letter of interest from an insurer, enterprise, or academic institution.
5. **Mapping to existing NIST frameworks.** SP 800-63 (identity), AI RMF risk tiers, SP 800-218 (SSDF). Show you've done homework on NIST's existing work.
6. **A proper threat model.** STRIDE or similar, applied to the protocol.
7. **Comparison to VC revocation.** W3C VC already has revocation/status mechanisms. Why isn't that sufficient for departure documentation? The submission needs to explicitly argue this.
8. **Implementation complexity estimates.** "Minimal integration cost" is claimed. What does that mean? Hours? Lines of code? Dependencies?

---

## 8. Writing Quality

**Length:** About right for an RFI response. Maybe 10% too long — the competitive/economic section (Section 4) could be halved.

**Tone:** Generally appropriate. Professional without being stiff. Avoids the worst AI hype language. Doesn't say "revolutionary" or "paradigm shift." Good.

**Problem areas:**
- Section 4 ("The Competitive Standards Argument") reads like a policy paper, not a technical submission. "The United States currently leads in AI agent development" — NIST reviewers know this. Cut the flag-waving.
- The insurance argument is repeated three times (exec summary, Section 1.2, Section 4.3). Once is enough. Twice is emphasis. Three times is "I only have one good argument."
- Some sentences are too long and try to do too much.

**Jargon:** Appropriate for the audience. Doesn't over-explain W3C standards. Assumes familiarity with DIDs and VCs. This is correct for a NIST audience.

**Grade: B** — Clean prose, slight bloat, some repetition.

---

## 9. The "So What" Test

After reading this, do I care?

**Honestly? A little.** The gap is real. Nobody IS talking about agent departure documentation. The protocol is minimal enough to be credible. The design choices are reasonable.

But I have 199 other submissions. Would I flag this for follow-up? Only if:
- The website worked (it doesn't)
- There was any institutional backing (there isn't)
- There was an interop demo (there isn't)

As written, this goes in the "interesting idea, might reference in our landscape survey, won't invite to listening sessions" pile. It contributes a concept (agent departure documentation as a standards gap) that might show up in a footnote of the eventual NIST framework. That's actually not nothing — ideas get absorbed. But the submitter won't get credit.

**Grade: C+** — Interesting idea, insufficient evidence of viability.

---

## 10. Specific Line-by-Line Issues

> "This is the equivalent of a used car market with no vehicle history reports, or a real estate market with no property records."

Effective analogy but slightly overblown. Agent transitions are not yet happening at the scale where this analogy lands. The used car market has billions of transactions. The agent ecosystem has... dozens? of cross-platform transitions?

> "No protocol handles what happens when an agent leaves."

Strong line. Keep it.

> "Markets cannot price agent-related risk because the information doesn't exist."

Good — specific, concrete, economically grounded.

> "The United States currently leads in AI agent development. Maintaining this lead requires..."

Cut this entire paragraph. It's pandering. NIST reviewers are not Congress; they don't need to be told America is great. It undermines the technical credibility.

> "If US-led: Open standard, interoperable, competitive market, innovation at the edges / If platform-led: Proprietary formats... / If foreign-led: US platforms retrofit..."

This is a stump speech, not a standards submission. Cut or radically compress.

> "EXIT is released under the Apache License 2.0 as a public good."

Good. Shows it's not a commercial play. Keep.

> "We welcome NIST's engagement with agent lifecycle documentation as a standards priority and would be glad to provide additional technical detail, participate in listening sessions, or collaborate on standards development."

Standard closing but appropriately humble. Keep.

> "~335 bytes (unsigned) to ~596 bytes (signed)"

Specific numbers. Good. Shows you've measured.

> "Hirschman (1970) demonstrated that the ability to exit is a fundamental governance mechanism"

Fine in the paper. In the RFI, it reads as "I've read one social science book and I'm going to make it my whole personality." Reduce to a single sentence or footnote.

---

## Prioritized Fix List

### Must-Fix (Submission is DOA without these)

1. **Fix the website.** `cellar-door-exit.netlify.app` returns 404. Either fix it or remove the link. A dead link in a federal submission is unforgivable.

2. **Verify all referenced URLs resolve.** `cellar-door.org/exit/v1` — does this exist? If not, either register and host it, or use a GitHub-hosted context file.

3. **Cut "Cellar Door" branding from the submission.** Refer only to "the EXIT Protocol" or "the EXIT project." The whimsical name hurts in this context.

### High Priority (Major credibility improvements)

4. **Cut Section 4 ("Competitive Standards Argument") by 60%.** Remove the "US must lead" rhetoric. Keep only the interoperability point and compress to 3 paragraphs max.

5. **Add a mapping to existing NIST publications.** Reference SP 800-63, AI RMF, and the NCCoE agent identity project specifically. Show you've read their work.

6. **Add a one-page conformance/testing section.** How would NIST evaluate an EXIT implementation? What are the conformance criteria?

7. **De-duplicate the insurance argument.** It appears three times. Consolidate into one strong paragraph in Section 1.

8. **Get one institutional endorsement.** Even informal. "Reviewed by [name] at [institution]" in an acknowledgments section changes the game.

### Medium Priority (Strengthens the submission)

9. **Build a 5-minute interop demo.** Show an EXIT marker being generated during a mock A2A agent migration. Record it. Link to it. This is worth more than 10 pages of spec.

10. **Add a threat model.** Even a simple one. Adversary classes, capabilities, mitigations.

11. **Address W3C VC revocation explicitly.** Why isn't StatusList2021 or BitstringStatusList sufficient? What does EXIT add that VC revocation doesn't?

12. **Compress the Hirschman/Akerlof framing.** One paragraph, one footnote. Not a recurring theme.

### Nice to Have

13. **Add implementation complexity estimates.** "Integrate EXIT in ~200 lines of code" or "~4 hours of developer time" makes the "minimal" claim concrete.

14. **Include a sequence diagram** for each of the three transition paths. Visual > text for standards reviewers.

15. **Add an FAQ.** "Isn't this just a VC?" / "Why not use existing revocation?" / "Who runs the registry?" (Answer: nobody.) Preempt the obvious objections.

---

## Overall Assessment

**The idea is better than the submission.** Agent departure documentation is a genuine gap that nobody else is addressing. The protocol design is defensible and minimal. The economic framing is sound.

But the submission is fatally undermined by: no institutional credibility, no production evidence, a dead website, and rhetorical bloat that wastes the reviewer's limited attention.

If I were advising the author, I'd say: this is a B+ idea in a D+ package. Fix the package. The idea can carry itself if you stop tripping over presentation.

**Probability of being read past page 1:** 60%
**Probability of influencing the framework:** 15%
**Probability of being invited to a listening session:** 5%
**Probability the core idea shows up somewhere in NIST's output, unattributed:** 40%

That last number is actually the most important one. If the goal is to get "agent transition documentation" into NIST's vocabulary, this submission might succeed even if the submitter never hears back. Whether that's a win depends on what you're optimizing for.

---

*Review completed. Now I need coffee and submission #201.*
