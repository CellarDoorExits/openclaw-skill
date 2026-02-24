# Show HN Drafts — EXIT Protocol / Cellar Door

Three versions targeting different HN reader types. Pick one, or mix and match.

---

## Version 1: Technical Lead

### Title

**Show HN: Cellar Door – Ed25519-signed departure certificates for AI agents**

### Body

I built a protocol for creating verifiable, cryptographic records when an AI agent leaves a platform.

The problem: AI agents are starting to move between services — handed off from one LLM to another, migrated between platforms, or delegated across tool chains. There's no standard way to verify that an agent actually departed, what state it was in, or that the departure wasn't tampered with.

EXIT Protocol is my attempt at solving this. An exit certificate is a compact, signed record containing:

- A content-addressed agent ID (SHA-256 of canonical identity)
- Ed25519 signature over the certificate body
- Optional TSA (RFC 3161) timestamps for independent time verification
- Reason codes, metadata, and state hashes

The unsigned certificate is 335 bytes. The core library (`cellar-door-exit`) has zero runtime dependencies.

There are 5 npm packages:

- `cellar-door-exit` — create and sign exit certificates
- `cellar-door-entry` — verify and ingest them on the receiving end
- `@cellar-door/vercel-ai-sdk` — middleware for Vercel AI SDK
- `@cellar-door/langchain` — LangChain integration
- `@cellar-door/mcp-server` — MCP tool server

368 tests across 6 repos. Apache 2.0. Everything's at https://cellar-door.dev and https://github.com/CellarDoorExits.

I'm submitting this to the NIST AI Agent Standards Initiative as a candidate protocol. It's early — I'd genuinely appreciate feedback on the certificate format, the crypto choices, and whether the problem framing makes sense to you.

### First Comment

Author here. Some design decisions worth discussing:

**Why Ed25519 over ECDSA?** Deterministic signatures (no nonce reuse footgun), fast verification, 64-byte sigs. For a certificate that might be verified thousands of times by different parties, verification speed matters more than signing speed.

**Why content-addressed agent IDs?** Agents don't have stable identifiers across platforms. By hashing a canonical identity representation, you get a consistent ID regardless of which platform assigned what username. The tradeoff is that identity changes (even minor ones) produce a new ID — I think that's actually a feature, not a bug.

**Why 335 bytes?** I wanted exit certificates to be embeddable anywhere — in HTTP headers, in tool call responses, in agent memory. Keeping them tiny was a deliberate constraint that shaped the format.

**What this doesn't solve (yet):** Multi-agent delegation chains, revocation, and the "what if the platform lies about the departure" problem. The protocol assumes the signing party is honest, which is obviously a big assumption. I have some ideas involving witness co-signatures but nothing shipped.

I'm a solo developer in Canada. This started as a weekend project wondering "what happens to an AI agent's identity when it leaves?" and turned into... this. Happy to answer questions about any of it.

---

## Version 2: Problem-First Lead

### Title

**Show HN: Cellar Door – A missing standard: verifiable departure for AI agents**

### Body

Here's a problem I haven't seen anyone talk about: when an AI agent leaves a platform, there's no verifiable record that it happened.

Think about what's coming. Agents are being deployed across multiple services. They get delegated tasks, handed off between LLMs, migrated when you switch providers. But right now:

- There's no proof an agent departed (vs. was silently killed or cloned)
- There's no chain of custody for agent state across platforms
- There's no way for a receiving platform to verify where an agent came from
- There's no standard for any of this

This matters for the same reasons SSL certificates matter for websites. As agents start carrying context, capabilities, and accumulated state between services, you need verifiable provenance. Otherwise you get spoofing, silent duplication, and platform lock-in by design (why let agents leave if there's no standard requiring it?).

I built EXIT Protocol and a set of libraries called Cellar Door to address this. An exit certificate is a compact, Ed25519-signed record — 335 bytes unsigned — that cryptographically attests an agent's departure, including identity, timestamp, reason, and state hash.

5 npm packages with integrations for Vercel AI SDK, LangChain, and MCP. 368 tests. Zero dependencies in the core. Apache 2.0.

https://cellar-door.dev | https://github.com/CellarDoorExits

I'm submitting this to NIST's AI Agent Standards Initiative. I think departure verification is a gap in the current standards conversation, which focuses heavily on what agents *do* but not on how they *move*.

Would love feedback — especially from anyone thinking about agent orchestration, multi-agent systems, or AI governance.

### First Comment

Author here. Some context on why I think this is urgent:

Every major AI platform is building agent infrastructure right now. The incentive structure strongly favors lock-in — if your agent's identity and state are trapped in one platform, switching costs are enormous. We saw this play out with social media (try leaving a platform with your social graph intact) and with cloud providers (data gravity).

The window for establishing interoperability standards is *before* platforms ossify, not after. That's why I'm pushing this now, even though multi-agent systems are still early.

Some honest limitations: this is a solo project, the ecosystem is just npm right now (no Python/Go/Rust SDKs yet), and the protocol itself is still in draft. I'm also making a bet that "agent departure" is a meaningful concept — some people argue agents are stateless and ephemeral by nature, so departure doesn't mean anything. I disagree, but it's a reasonable objection.

Technical details: Ed25519 signatures, content-addressed identity (SHA-256 of canonical agent representation), optional RFC 3161 timestamps, compact binary format. The core library has zero runtime dependencies because I wanted it embeddable anywhere.

The name "Cellar Door" is a Tolkien reference — supposedly the most beautiful phrase in the English language. Figured if you're going to build a door, might as well make it a nice one.

---

## Version 3: Philosophical Lead

### Title

**Show HN: Cellar Door – What happens when AI agents can't prove they left?**

### Body

A question I've been stuck on: if an AI agent moves from Platform A to Platform B, how does anyone know it actually left Platform A?

Right now, the answer is: you don't. There's no receipt, no certificate, no verifiable record. The agent might have been duplicated. It might still be running on Platform A with a different context. Platform A might claim it left but keep a copy. You'd never know.

This seems like a trivially small problem until you think about what agents are becoming. They're accumulating context, capabilities, and something resembling institutional memory. When an agent carries work product, client data, or specialized knowledge between services, "did it actually depart the previous one?" becomes a real question with legal and security implications.

I built EXIT Protocol to create verifiable departure records — cryptographic certificates that attest an agent left, when, why, and what state it was in. Think of it as a chain of custody for agent identity.

The implementation is called Cellar Door. It's 5 npm packages, 368 tests, Apache 2.0. The core exit certificate is 335 bytes unsigned with Ed25519 signatures. Integrations exist for Vercel AI SDK, LangChain, and MCP.

https://cellar-door.dev | https://github.com/CellarDoorExits

I'm calling this a "Right of Passage" — the idea that agents should have a verifiable, portable record of their movements. I've submitted it to NIST's AI Agent Standards Initiative.

I realize "departure ceremonies for AI agents" sounds like I've lost the plot. But the underlying problem is concrete: without verifiable departure, you can't have real agent portability, and without portability, you get lock-in. We've seen this movie before.

### First Comment

Author here. I want to address the obvious question: isn't this solving a problem that doesn't exist yet?

Maybe. But here's my reasoning:

1. Agent orchestration frameworks (CrewAI, AutoGen, LangGraph) are shipping now. Agents moving between contexts is already happening.

2. The EU AI Act and similar regulation will eventually require audit trails for AI systems. "Where has this agent been?" is a question regulators will ask.

3. Platform incentives favor lock-in. If we don't establish departure standards early, platforms will build walled gardens and then argue that agent portability is "technically infeasible." Standards created before lock-in happens are enormously more effective than standards created after.

4. The IP provenance question. If an agent generates valuable work on Platform A, carries knowledge to Platform B, and creates something there — who owns what? Without departure records, this is unresolvable.

On the technical side: Ed25519 for signatures (deterministic, fast verification), content-addressed agent identity (SHA-256), optional RFC 3161 timestamps. The unsigned certificate is 335 bytes because I wanted it small enough to embed in HTTP headers or agent memory.

I'm a solo developer in Canada. The name is a Tolkien reference. The hieroglyph 𓉸 is a door determinative from Egyptian hieroglyphics — I use it as the project's symbol.

Honest assessment: this is early-stage, npm-only, and I'm betting on a future that might not arrive the way I imagine. But I'd rather have the standard ready and unnecessary than scramble to create one after the fact.

---

## Notes for Choosing

| Version | Strengths | Risks |
|---------|-----------|-------|
| Technical | HN loves "show me the code", concrete numbers, crypto details | Might seem like a solution looking for a problem |
| Problem-first | Frames the "why" clearly, platform lock-in resonates with HN | Could read as hand-wavy without enough technical meat |
| Philosophical | Most memorable, highest potential for discussion | Could attract "this is nonsense" pile-on if framing doesn't land |

**My recommendation:** Version 2 (problem-first) as the post, steal the technical details from Version 1's first comment. The problem framing gives people a reason to care before you hit them with the implementation.
