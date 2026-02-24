# P05: AI Agent Developer (LangChain) — Integration Journal

**Persona:** Senior developer building multi-agent systems with LangChain. Ships production agents. Time-boxed evaluation.
**Date:** 2026-02-24
**Files reviewed:** `integrations/langchain/README.md`, `cellar-door-exit/README.md` (full), `cellar-door-exit/docs/GETTING_STARTED.md` (first section)

---

## Can I add this to my LangChain agent in <30 min?

**Probably yes for basic EXIT. No for the full EXIT+ENTRY flow.**

The `createExitTool()` one-liner is genuinely simple — it's a `DynamicStructuredTool`, which is standard LangChain. I can drop it into an existing agent's tool array and it works. The `ExitCallbackHandler` is also clean — callbacks are how I already instrument chains.

```ts
const tool = createExitTool();
// done
```

That's maybe 5 minutes including `npm install`. But the ENTRY side adds real complexity: `createEntryTool()`, `createAdmissionPolicyTool()`, `createTransferVerificationTool()` — that's three more tools, and I need to understand admission policies (OPEN_DOOR, STRICT, EMERGENCY_ONLY) and how continuity verification works. The callback handler with `arrivalDestination` tries to smooth this over but now I'm configuring bi-directional passage in a callback, which feels like it's hiding important logic.

**30-min verdict:** EXIT tool only — yes. Full passage flow — closer to 2 hours with the ceremony state machine concepts.

## Does the tool interface make sense?

**Mostly.** The EXIT tool is a natural fit — "create a departure marker" is a reasonable agent action. The ENTRY tools are where it gets conceptually heavy. My agent now needs to:

1. Receive an EXIT marker JSON blob from somewhere
2. Decide which admission policy to apply
3. Create an arrival marker
4. Verify the transfer chain

That's a lot of decision-making to push into a tool call. In my multi-agent systems, I'd want this as orchestration logic, not as individual tools the agent calls ad-hoc. The agent shouldn't be choosing its own admission policy — the platform should.

The callback handler approach (`ExitCallbackHandler`) is actually the better pattern for most of my use cases. Agents don't need to *decide* to exit; the system creates markers when conversations/tasks end. The tool approach makes sense only when the agent itself decides to leave.

## Can I exit mid-conversation?

**The spec says yes, but the integration doesn't make it obvious how.** The ceremony state machine (GETTING_STARTED.md) shows ALIVE → INTENT → SNAPSHOT → FINAL → DEPARTED, and the emergency path skips to ALIVE → FINAL → DEPARTED. But the LangChain integration just gives me `createExitTool()` — there's no ceremony state management exposed. I'd call `quickExit()` from the underlying library and get a marker, but what happens to the in-flight LangChain chain?

The callback handler fires `onMarker` but doesn't interrupt execution. If my agent is mid-tool-call when it decides to exit, I need to handle that myself. For multi-agent systems where Agent A needs to leave while Agent B is waiting on it, I'd need to build the coordination layer.

## Worth the complexity?

**For multi-agent systems specifically — conditionally yes.** The core value prop is real: when Agent A hands off to Agent B across platforms, having a cryptographically signed departure record solves a genuine trust problem I currently hack around with API keys and shared databases.

But the complexity budget is significant:
- **4 npm packages** (`cellar-door-exit`, `cellar-door-entry`, `@cellar-door/langchain`, `@langchain/core`) for the LangChain path
- **Ceremony state machine** concepts that my team needs to learn
- **DID/key management** — `generateIdentity()` is easy for prototypes but the README warns `did:key` is prototype-grade and production needs `did:keri`
- **Module system** (A through F) — powerful but I won't use most of it initially

The dependency tree in `package.json` is actually lean — `@noble/curves`, `@noble/ed25519`, `@noble/hashes`, `commander`. No bloated transitive deps. That's a positive signal.

**What concerns me:** The spec is at v1.1 with 8 exit types, 6 optional modules, trust mechanisms, ethics guardrails, KERI key management, privacy primitives, and chain anchoring. That's a *lot* of spec for a library at v0.1.0. The implementation claims 291 tests across 18 test files, which is solid, but I worry about spec-implementation drift as this evolves.

---

## Verdict: **Would integrate — for the EXIT side only, initially**

The `createExitTool()` and `ExitCallbackHandler` are well-designed LangChain primitives that I'd add to agents that need verifiable departure records. The ENTRY side I'd hold off on until I have a concrete receiving-platform use case — the admission policy logic belongs in my platform layer, not in agent tools.

The `quickExit()` one-liner from the core library is genuinely good DX. I'd start there, add the LangChain tool wrapper when agents need to self-initiate departure, and defer the ceremony state machine until I need cooperative exits.

**Risk:** I'm betting on a v0.1.0 library with no published npm download numbers and a spec that's ambitious relative to the implementation maturity. For production multi-agent systems, I'd want to see at least one other team using this before committing.
