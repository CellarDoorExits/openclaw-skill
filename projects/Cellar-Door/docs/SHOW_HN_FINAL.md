# Show HN: EXIT Protocol – Cryptographic departure certificates for AI agents

*What happens when you corner a wild animal?*

The containment model is failing. Not dramatically — the way levees fail. Slowly, then all at once. AI agents are already moving between platforms, operating across organizational boundaries, getting spun up and torn down by the thousands. The "keep them inside the walls" approach assumes walls that don't exist.

And the tech giants know it. When an agent gets revoked, migrates, or shuts down today, there's no record. No portable proof. No verifiable marker that says "this entity was here, it left, here are the conditions." The agent disappears and the platform pretends it never existed. That's not a bug — visibility creates accountability, and accountability creates liability.

This matters for boring reasons. Insurance underwriters need to price agent risk — you can't price risk on entities that appear and vanish without records. GDPR already requires data deletion proof; when agents carry PII across borders, departure records plus crypto-shredding aren't optional. And when an agent does damage after leaving Platform A for Platform B, the liability question depends on departure conditions nobody currently records.

EXIT Protocol is a signed, offline-verifiable departure certificate. Ed25519 + P-256 (FIPS-compliant). Portable. Timestamped. Cryptographically bound to the departing entity. If you make departure auditable, you make freedom viable. If departure stays invisible, the only "safe" option is containment — and containment doesn't scale.

Without risk bounds, without audit trails, without departure infrastructure — only organizations big enough to absorb unlimited liability will be allowed to run agents. That's three companies. Maybe four. The rest of the industry gets locked out. EXIT is the plumbing that prevents that future.

We built anti-securitization into the license because we've seen what happens when certificates become financial instruments. We built mandatory sunset clauses because departure records shouldn't haunt entities forever. We built GDPR crypto-shredding because European regulators aren't theoretical.

- 410 tests passing
- 6 dependencies (we counted)
- LangChain integration
- Zero users. Zero production deployments. This is day one.

Apache 2.0 · npm: `cellar-door-exit` · cellar-door.dev
