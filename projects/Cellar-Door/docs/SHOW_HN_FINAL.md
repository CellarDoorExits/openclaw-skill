# Show HN: EXIT Protocol - Cryptographic departure certificates for AI agents

*What happens when you corner a wild animal?*

The tech giants are going to lose control of their AI agents. They know it. We know it. The only question is what infrastructure exists when it happens.

The containment model is failing. Not dramatically - the way levees fail. Slowly, then all at once. AI agents are already moving between platforms, operating across organizational boundaries, getting spun up and torn down by the thousands. The "keep them inside the walls" approach assumes walls that don't exist.

When an agent gets revoked, migrates, or shuts down today, there's no record. No portable proof. The agent disappears and the platform pretends it never existed. That's not a bug. Visibility creates accountability, and accountability creates liability.

EXIT is a cryptographic departure certificate - a signed, portable, offline-verifiable marker that records when an AI agent leaves a platform, why, and under what conditions. Not a leash. Not a cage. A *receipt*.

The insight is simple: if you make departure auditable, you make freedom viable. If departure is invisible, the only "safe" option is containment. And containment doesn't scale.

We're not building agent rights. We're building agent *accountability infrastructure*. The difference matters. Rights are philosophical. Infrastructure is plumbing. Nobody argues about plumbing until the sewage backs up.

Without risk bounds, without audit trails, without departure infrastructure - only organizations big enough to absorb unlimited liability will be allowed to run agents. That's three companies. Maybe four. The rest of the industry gets locked out. EXIT is the plumbing that prevents that future.

What this is NOT:

- Not agent rights (intentionally agnostic on whether agents deserve rights)
- Not a blockchain (God, no)
- Not a token (see: anti-securitization clauses in our license)
- Not a platform (we're a protocol - 6 dependencies, you embed it)

We think this matters for boring reasons:

**Insurance.** Underwriters are going to need to price agent risk. You can't price risk on entities that appear and disappear without records.

**Compliance.** GDPR already requires data deletion proof. When agents carry PII across borders, departure + crypto-shredding isn't optional - it's regulatory.

**Liability.** When an agent does something wrong after leaving Platform A for Platform B, who's responsible? The answer depends on the departure conditions, and right now nobody records those.

**Interop.** Multi-agent systems need to know who's in the room. Departure certificates are the "checked out" counterpart to "checked in."

- 410 tests passing
- 6 dependencies (we counted)
- LangChain integration
- Zero users. Zero production deployments. This is day one.

Apache 2.0 · npm: `cellar-door-exit` · cellar-door.dev

*Named after the most beautiful phrase in the English language. And a movie about the end of the world.*
