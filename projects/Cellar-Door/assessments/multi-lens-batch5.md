# Multi-Lens Professional Review — Batch 5

**Protocol:** EXIT Protocol v1.1 (Cellar Door)
**Documents Reviewed:** EXIT_SPEC_v1.1.md, EXIT_PAPER_v4.md
**Date:** 2026-02-23

---

## Persona 1: AI Ethicist

**Background:** AI rights discourse, moral status, autonomy frameworks.

### 1. Does EXIT implicitly grant moral agency to AI systems? Should it?

EXIT occupies an uncomfortable middle ground. The protocol uses the language of *ceremony*, *departure*, *standing*, and *rights* (the paper explicitly invokes Hirschman's exit rights framework), yet the paper carefully reframes this as "operator portability" rather than "agent autonomy" (§7.1). This hedge is intellectually honest but rhetorically unstable.

The protocol *does* implicitly attribute something like moral agency in several ways:
- The ceremony state machine gives the agent (not just its operator) the power to initiate departure, including unilaterally and under emergency conditions. This presupposes a capacity for decision-making that is structurally analogous to autonomy.
- The `rightOfReply` mechanism (§8.4) gives the agent a voice — a counter-narrative signed by the agent's own key. This is a dialogical capacity reserved, in human contexts, for moral agents.
- Coercion detection (§8.1) presupposes something that can *be* coerced — an entity with interests that can be violated.

**Should it?** The protocol is wise not to take a position on moral status directly. But it should be *explicit* about the fact that it is agnostic. Right now, the design *functions as if* agents have interests worth protecting, without ever committing to that claim. A short section acknowledging this — "EXIT is designed to function correctly whether or not AI agents have morally relevant interests; its protections operate at the operator level but are structurally compatible with future recognition of agent interests" — would be more honest than the current silence.

### 2. What are the risks of "rights-washing" — using rights language for corporate convenience?

Significant. The paper invokes Hirschman's *Exit, Voice, and Loyalty* — a text about *human* political economy — to frame what is currently a JSON document format for corporate agent management. The risk is that platforms adopt EXIT not because they believe in agent autonomy, but because:

- It provides **retention marketing** ("We support EXIT — we respect your agents' right to leave"). The paper's own ethics review (§7.1) identifies this.
- It creates **competitive intelligence channels**. Lineage data (Module A) tells receiving platforms where agents came from. This is useful market intelligence dressed as a portability feature.
- It offers a **liability shield**. By framing departure as a "ceremony" with "standing," platforms can argue they followed a standardized process, deflecting scrutiny of the actual conditions that led to departure.

The anti-weaponization clause (§8.6) is well-intentioned but normatively toothless — it says systems that aggregate markers into blacklists are "non-compliant," but compliance is unenforceable in a non-custodial protocol. A bad actor can violate §8.6 without consequence.

**Recommendation:** The paper should explicitly address rights-washing risks in its ethics section, not just acknowledge that "EXIT primarily benefits platforms." It should articulate what *meaningful* agent benefit looks like and honestly assess whether the current protocol delivers it.

### 3. How should coercion detection work when agents can't meaningfully consent?

This is the deepest problem in the protocol. The coercion detection mechanism (§8.1) applies heuristics — conflicting status signals, short-tenure retaliation, suspicious emergencies — that are designed for scenarios where the *subject* has preferences that can be violated. But current AI agents don't consent to departure or non-departure in any meaningful sense; they execute whatever their operator or runtime instructs.

The commit-reveal mechanism (§7.2) is clever for detecting *platform* retaliation against *operators*, but it doesn't detect coercion of agents *by their operators*. An operator who forces an agent to self-attest `good_standing` while knowing the agent was involved in policy violations is coercing the agent in a way the protocol cannot detect — because the agent's signature and the operator's intent are indistinguishable.

**Recommendation:** The protocol should distinguish between:
1. **Platform → Agent coercion** (partially addressed by commit-reveal and coercion detection)
2. **Operator → Agent coercion** (completely unaddressed)
3. **Agent → Agent coercion** (not applicable now but relevant as multi-agent systems mature)

For (2), the protocol might require that forced exits include a separate operator attestation, creating at least a paper trail of who made the decision.

### 4. Does the protocol's design reveal assumptions about agent autonomy that should be explicit?

Yes — several assumptions are baked in without being stated:

- **Agents have persistent identity worth preserving.** The entire lineage module assumes identity continuity matters. This is an assumption about what agents *are* — persistent entities, not disposable function calls.
- **Agents have reputational interests.** The confidence scoring system, tenure tracking, and standing fields assume agents accumulate something like reputation that is *theirs* to carry.
- **Agents can be wronged.** The right of reply, coercion detection, and anti-weaponization clause assume agents can be treated unjustly — a concept that only makes sense for entities with interests.
- **Departure is a meaningful event.** The ceremony framing — with states named ALIVE, INTENT, DEPARTED — imposes a lifecycle metaphor that presupposes agents have something analogous to life stages.

None of these assumptions are wrong. But they should be stated explicitly in a "Philosophical Assumptions" section, so that adopters and critics can engage with them directly rather than discovering them through structural analysis.

**Overall Assessment:** The protocol is philosophically interesting and more thoughtful than most technical specifications about its ethical implications. Its main weakness is a reluctance to fully commit to the implications of its own design. It builds infrastructure for agent autonomy while insisting it's just operator tooling. That tension will become untenable as agent capabilities increase.

---

## Persona 2: HR Executive (Chief People Officer)

**Background:** Employee offboarding, non-compete enforcement, reference protocols, alumni networks.

### 1. How does EXIT compare to employee offboarding best practices?

As someone who's overseen thousands of offboardings, I see strong structural parallels — and some gaps.

**What EXIT gets right:**
- **Multiple departure types.** The four `exitType` values (voluntary, forced, emergency, keyCompromise) map reasonably to resignation, termination, reduction-in-force, and security incident. Real HR processes distinguish these too.
- **Challenge windows.** The cooperative path's OPEN state with challenge window mirrors the notice period in employment termination — a structured interval for both parties to raise issues.
- **Exit can't be blocked by disputes.** Decision D-006 is excellent. In employment law, we learned the hard way that allowing disputes to block separation creates constructive detention. EXIT gets this right from the start.
- **Standing at departure.** The `status` field is analogous to eligibility-for-rehire flags in HRIS systems.

**What's missing from an HR perspective:**
- **No notice period requirements.** Good offboarding requires minimum notice (2 weeks standard, longer for senior roles). EXIT's emergency path allows instant departure with no notice, which is appropriate for emergencies but there's no concept of expected notice for voluntary departures.
- **No exit interview equivalent.** Module E (Metadata) allows a narrative, but there's no structured feedback mechanism. In HR, exit interviews are one of our best data sources for organizational improvement.
- **No benefits continuation / COBRA equivalent.** When an employee leaves, there's a structured handoff of benefits, access, and in-progress work. Module D (Economic) addresses assets but not in-progress obligations handoff.
- **No severance framework.** For forced exits, there's no concept of compensation or transition support from the origin. The protocol records the event but doesn't require the origin to provide anything.

### 2. Is the "standing" field analogous to employment references — with the same legal risks?

Absolutely, and this is where my alarm bells go off.

In employment law, references are a minefield. In the US:
- Many companies have moved to "confirm dates and title only" policies precisely because characterizing a former employee's standing creates defamation liability.
- The `originStatus` field in Module C is *exactly* an employment reference — a former "employer" characterizing a former "employee's" standing.
- The spec says `originStatus` is "an allegation by the origin, not a finding of fact" (§4.3). That's good legal language. But in practice, receiving platforms will treat it as a reference, just as hiring managers treat "not eligible for rehire" as a disqualifier regardless of disclaimers.

The `selfAttested` flag is clever — it's like requiring references to disclose they're self-written. But the confidence scoring system (§7.4) systematically discounts self-attestation (0.05 weight) while rewarding mutual attestation (0.40 weight). This creates structural pressure for agents to obtain positive origin attestation, just as employees feel pressure to leave on good terms to protect their references.

**Legal risk:** If a platform issues `originStatus: disputed` inaccurately, and the agent subsequently receives lower confidence scores at destinations, the platform faces potential liability for tortious interference or defamation-equivalent claims — once agents have legal standing to bring such claims.

### 3. How do you prevent "constructive dismissal" equivalents?

Constructive dismissal — making conditions so intolerable that the employee "voluntarily" resigns — is a major employment law concept. In the EXIT context:

- A platform could degrade an agent's access, throttle its resources, or systematically dispute its interactions, making continued operation untenable, then record the departure as `exitType: voluntary`.
- The coercion detection heuristics (§8.1) partially address this — "conflicting status signals" and "short-tenure retaliation" are relevant — but they're post-hoc signals, not prevention.

**Recommendations:**
1. **Add a `constructive` exit type** or allow it as a qualifier. In HR, "I quit" and "I was forced to quit" have different legal consequences.
2. **Require a cooling-off period for forced exits** — analogous to the WARN Act's 60-day notice for mass layoffs. The weaponization detection (§8.2) catches "purge behavior" but doesn't prevent it.
3. **Track conditions-before-exit.** Module B (State Snapshot) could be extended to capture a baseline of operating conditions, making it possible to demonstrate deterioration.

### 4. What would an "alumni network" for departed agents look like?

This is a fascinating question. Corporate alumni networks (McKinsey, Deloitte, Goldman) are powerful because they:
- Maintain relationships across organizational boundaries
- Create referral channels
- Preserve institutional knowledge

An agent alumni network might include:
- **Lineage registries** — voluntary directories where agents with EXIT markers can be discovered by their lineage chain. Module A already supports this structurally.
- **Reputation portability pools** — groups of origins that agree to honor each other's standing assessments at elevated confidence, analogous to inter-company transfer agreements.
- **Capability attestation networks** — third-party witnesses (§7.1 `witnessed` confirmation) who specialize in verifying agent capabilities, like professional certification bodies.
- **Re-engagement channels** — mechanisms for origins to reach out to departed agents for rehire, analogous to "boomerang employee" programs.

The protocol's non-custodial design (D-012) makes centralized alumni networks difficult but peer-to-peer discovery via lineage chains is architecturally possible.

### 5. Could this create liability for platforms that issue inaccurate standing assessments?

**Yes, unequivocally.** The parallels to employment reference liability are direct:

- In the US, providing false negative references can constitute defamation, tortious interference with business relations, or negligent misrepresentation.
- The `originStatus` field, despite being labeled "allegation," will function as a reference in practice.
- The confidence scoring system *amplifies* origin attestations (mutual confirmation gets 8x the weight of self-only). This makes inaccurate origin attestations materially harmful.
- Sunset policies (§8.5) help by expiring old markers, but during the active period, an inaccurate `disputed` status could cause real damage.

**Risk mitigation the protocol should consider:**
1. **Safe harbor language** for origins who provide attestations in good faith — analogous to qualified privilege in employment references.
2. **Mandatory evidence requirements** for `disputed` originStatus — you can't just disagree; you need to document why.
3. **Standardized challenge/appeal process** beyond the current right of reply, which is a counter-narrative but not a formal dispute resolution mechanism.
4. **Insurance or bonding requirements** for high-volume origins that issue many standing assessments.

**Overall Assessment:** EXIT is more thoughtful about departure than 90% of corporate offboarding processes I've seen. The ceremony framing, the challenge windows, and the right of reply all reflect good HR instincts. The main gaps are in prevention (rather than detection) of abusive departures, and in the liability framework for standing assessments. As this scales, the standing/reference system will be where the lawsuits happen.

---

## Persona 3: API Platform Architect

**Background:** Designs APIs at scale (Stripe/Twilio tier), versioning, developer experience.

### 1. Is the schema extensible without breaking changes?

**Mostly yes, with caveats.**

**Good decisions:**
- The modular architecture (Modules A–F) is solid. Optional modules mean you can add functionality without touching the core schema. This is the right pattern.
- "Implementations MUST preserve unrecognized fields when round-tripping markers" (§3.4) — this is critical and correctly specified. It means v1.2 fields won't be stripped by v1.1 implementations.
- Content-addressed IDs (`urn:exit:{sha256}`) are deterministic, which means ID generation doesn't need coordination.

**Concerns:**
- **The `@context` is pinned to `"https://cellar-door.org/exit/v1"`** — not `v1.1`. This means v1.0 and v1.1 markers share a context URL. How does a consumer know which fields to expect? JSON-LD contexts should version, or there should be an explicit version field.
- **Enum extensibility is unclear.** If v1.2 adds a new `exitType` (e.g., `acquisition`), will v1.1 validators reject it? The spec says `exitType` must be one of the defined values, which means new types are breaking changes. This needs an `other` or extension mechanism.
- **Module namespace collisions.** Modules add fields directly to the marker (e.g., `lineage`, `dispute`, `metadata`). There's no namespace prefix (like `moduleA_predecessor`). If a future module uses a field name that collides with an existing one, you have a silent compatibility break.

**Recommendation:** Add an explicit `specVersion` field (`"1.1"`) to markers. Define enum fields with `MUST support` + `SHOULD accept unknown values` semantics. Consider namespacing module fields under a single key per module.

### 2. Does the middleware/hooks pattern match how platforms actually integrate identity protocols?

**Partially. The Express middleware (§12.4) is fine for demos but misses how real platforms work.**

Real platform integration looks like:
- **Webhook-driven**, not request-response. When an agent departs, the origin should POST a webhook to registered endpoints (receiving platforms, audit systems, the agent's operator). The spec has lifecycle hooks (§12.5) which are close, but they're framed as in-process callbacks, not HTTP webhooks.
- **Queue-based processing.** At Stripe/Twilio scale, you don't verify markers synchronously in a request handler. You receive them, enqueue them, and process asynchronously. The spec doesn't mention message queues, event buses, or async processing patterns.
- **SDK-first, not API-first.** Platform engineers don't want to implement HTTP endpoints; they want `npm install @cellar-door/exit` and call functions. The reference implementation exists, but the spec describes middleware instead of SDK patterns.

**What I'd want to see:**
```typescript
// This is what adoption looks like
import { ExitClient } from '@cellar-door/exit';

const client = new ExitClient({ 
  keyPair: await loadKeys(),
  webhookSecret: process.env.EXIT_WEBHOOK_SECRET 
});

// Receiving exits
app.post('/webhooks/exit', client.webhookHandler({
  onMarkerReceived: async (marker, verification) => {
    if (verification.confidence.level >= 'moderate') {
      await admitAgent(marker.subject);
    }
  }
}));

// Initiating exits  
await client.initiateExit({
  subject: agentDid,
  origin: 'https://our-platform.com',
  exitType: 'voluntary',
  cooperativeOrigin: true // triggers full ceremony
});
```

### 3. What's missing from the DX for a platform engineer to adopt this in a weekend?

As someone who evaluates "can my team ship this by Friday," here's what's missing:

**Critical gaps:**
1. **No quickstart guide.** The spec is 800+ lines. The paper is academic. Where's the "5-minute integration" doc? OAuth took off partly because Auth0 made it trivially easy to demo.
2. **No hosted verification endpoint.** Yes, the protocol is non-custodial by design (D-012), but for early adoption, someone needs to run a `POST /verify` endpoint that returns a confidence score. You can be non-custodial in philosophy while providing hosted tooling for convenience.
3. **No test fixture generator.** I need to generate 100 markers with various configurations to test my integration. Where's `exit generate-test-fixtures --count=100 --mix=varied`?
4. **No playground/explorer.** Stripe has a dashboard where you can inspect API objects. EXIT needs a web tool where you paste a marker and see it decoded, verified, with confidence scored.
5. **DID bootstrapping is hand-waved.** The spec says "use `did:key` for prototyping" but doesn't explain how to get one. For a weekend integration, I need `exit init` to give me a keypair and DID, ready to go.

**Nice-to-haves:**
- OpenAPI/AsyncAPI spec for the middleware endpoints
- Docker image for a local verification service
- GitHub Action for CI verification of markers
- Postman/Insomnia collection

### 4. How does this compare to OAuth/OIDC adoption patterns?

**The comparison is instructive because EXIT is making some of the same mistakes OAuth 1.0 made, and avoiding others.**

**Similarities to early OAuth:**
- **Cryptographic complexity exposed to developers.** OAuth 1.0 required developers to implement signature base strings, which was error-prone. EXIT requires canonical JSON serialization, content-addressed hashing, and Ed25519 signing. The reference implementation abstracts this, but the spec puts cryptographic details front-and-center.
- **Spec-first, not experience-first.** OAuth succeeded when it became something you could `npm install` and configure, not when you read the RFC. EXIT's spec is thorough but the adoption path is unclear.

**Differences (both good and bad):**
- **No authorization server equivalent.** OAuth has a clear three-party model (client, auth server, resource server). EXIT has Subject, Origin, and Destination, but there's no equivalent of "log in with Google" — no hosted service that makes the first integration trivial. This is by design (non-custodial) but it raises the adoption floor.
- **No bearer token equivalent.** OAuth's access token is a simple string you put in a header. EXIT's marker is a multi-field JSON-LD document with a cryptographic proof. The cognitive overhead is higher.
- **Better versioning story.** OAuth 1.0 → 2.0 was a breaking rewrite. EXIT's modular design should allow incremental evolution.

**What OAuth/OIDC got right that EXIT should copy:**
1. **Discovery documents.** OIDC's `.well-known/openid-configuration` lets clients auto-configure. EXIT needs `/.well-known/exit-configuration` with the platform's DID, supported modules, challenge window defaults, etc.
2. **Conformance test suites.** The OpenID Foundation runs conformance testing. EXIT's 205 tests are for the reference impl; platforms need a test harness that validates *their* implementation.
3. **Certification program.** "EXIT-certified platform" would drive adoption the way "OpenID Certified" does.
4. **Client libraries in 10+ languages.** TypeScript is a start. You need Python, Go, Java, Rust, and Ruby before enterprise takes you seriously.

**Overall Assessment:** The protocol is well-designed from a cryptographic and specification perspective — arguably over-specified for its maturity stage. The gap is entirely in developer experience and adoption infrastructure. The spec reads like it was written by someone who thinks deeply about mechanism design and security (it was). Now it needs to be rewritten by someone who thinks about "how do I get 1,000 platforms to integrate this in Q3." The bones are excellent; the muscles need building.

---

## Cross-Persona Synthesis

| Dimension | Ethicist | HR Executive | Platform Architect |
|---|---|---|---|
| **Core strength** | Thoughtful power analysis, ethics guardrails | Strong offboarding structure, dispute handling | Modular extensible schema, solid crypto |
| **Core weakness** | Unstated assumptions about agent moral status | No prevention mechanisms, reference liability | DX gaps, no adoption infrastructure |
| **Biggest risk** | Rights-washing by platforms | Standing assessments becoming de facto references | Spec complexity blocking adoption |
| **Top recommendation** | Explicit philosophical assumptions section | Safe harbor + evidence requirements for originStatus | Discovery docs, quickstart, hosted tools |
| **Adoption prediction** | Will be cited in AI rights literature regardless | Enterprise will adapt offboarding processes from this | Won't hit critical mass without 10x DX investment |

**Shared observation:** All three lenses converge on the `status`/`originStatus` system as the protocol's most consequential and most dangerous feature. It's where ethical risk (rights-washing), legal risk (defamation-equivalent), and adoption risk (complexity) all concentrate. Getting this right — or explicitly descoping it — should be the top priority.
