# P03: Enterprise CISO Review — EXIT Protocol

**Reviewer Persona:** VP Security Architecture, Fortune 500 Financial Services  
**Date:** 2026-02-24  
**Documents Reviewed:** EXIT_SPEC_v1.1.md, SECURITY.md, GETTING_STARTED.md, ecosystem-map.md, LEGAL.md  
**Format:** Enterprise Security Scorecard

---

## Enterprise Scorecard

| Dimension | Score (1-5) | Summary |
|-----------|:-----------:|---------|
| **Security** | 3 | Sound crypto design, significant gaps in key management and algorithm compliance |
| **Maturity** | 1 | Pre-production. Zero deployments. Single maintainer. v0.1.0. |
| **Integration** | 3 | Clean API, TypeScript/Node.js, framework hooks. No enterprise middleware. |
| **Standards** | 3 | W3C DID/VC aligned. Not FIPS compliant. No SOC 2 or compliance attestation. |
| **Risk** | 2 | Unclear liability model. No SLA. No vendor. No support. |
| **Overall** | 2.4 | Not enterprise-ready. Architecturally interesting; operationally immature. |

---

## Detailed Assessment

### Security (3/5)

**Strengths:**
- Ed25519 + SHA-256 is a solid cryptographic foundation for non-regulated environments
- The threat model (SECURITY.md §1) is honest and comprehensive — identifies 5 major threats with residual risks acknowledged
- Ceremony state machine prevents denial-of-exit attacks (D-006)
- Coercion/weaponization/laundering detection (Spec §8) provides defense-in-depth
- Field-level redaction and encryption (Spec §10) support data minimization

**Gaps I'd flag in a security review:**

1. **No FIPS 140-3 path.** Ed25519 and XChaCha20-Poly1305 are not FIPS-approved. My HSMs run FIPS-validated modules. I cannot integrate EXIT signing into our existing PKI infrastructure without algorithm substitution, and the spec hardcodes Ed25519 (Spec §3.5: "MUST be `Ed25519Signature2020`"). This is a blocker for regulated financial services.

2. **`did:key` in production is unacceptable.** SECURITY.md §2 is explicit: no revocation, no rotation, compromised keys are permanent. The spec acknowledges this and recommends `did:keri` for production (SECURITY.md §2.4), but the reference implementation uses `did:key`. There is no `did:keri` reference integration to evaluate.

3. **TSA verification is incomplete.** Spec §11.3.4 states the implementation provides "structural verification only." A forged TSR passing structural checks but failing cryptographic verification could create false trust. In an enterprise context, I need full chain-of-trust verification for any timestamping evidence.

4. **No HSM integration.** The Getting Started guide shows private keys as hex strings in code (`generateIdentity()` returns `privateKey` as a string). No PKCS#11 interface, no Cloud KMS integration, no key ceremony documentation. Enterprise key management requires keys that never leave hardware boundaries.

5. **Emergency path abuse.** SECURITY.md §3 identifies this: the emergency path bypasses all controls. The `emergencyJustification` field is a free-text string with no structured validation. An attacker exploiting an agent could trigger emergency exits to exfiltrate state references (Module B).

### Maturity (1/5)

- Package version is `0.1.0` (package.json)
- "Preprint — not yet peer-reviewed" (Paper header)
- Zero production deployments acknowledged
- Single maintainer, no organization
- No changelog history visible
- No CI/CD badges, no code coverage metrics published
- No security audit by an independent firm
- 291 tests is decent for the scope, but all from a single implementation
- No second implementation exists for interoperability validation

**For a Fortune 500:** I would not bring a v0.1.0 package from a solo maintainer into our supply chain. Our vendor risk management process requires at minimum: an organizational entity, a security contact (SECURITY.md lists "TBD"), incident response procedures, and a track record.

### Integration (3/5)

**Strengths:**
- `npm install cellar-door-exit` is clean (GETTING_STARTED.md)
- `quickExit()` gets to a working marker in one function call — excellent DX for prototyping
- Framework integrations (LangChain, Vercel AI SDK, MCP) cover the major agent frameworks
- Express-style middleware (Spec §12.4) suggests HTTP integration was considered
- TypeScript types are comprehensive and well-documented (types.ts: ~400 lines, every field documented)
- ESM + CJS dual exports (package.json)

**Gaps:**
- No Java, Python, Go, or Rust SDK. Our backend is Java/Go. TypeScript-only limits adoption.
- No OpenTelemetry integration for observability
- No enterprise middleware connectors (Kong, Apigee, AWS API Gateway)
- No Kubernetes operator or Helm chart for ceremony orchestration
- No LDAP/SAML/OIDC integration for enterprise identity federation
- The dependency list includes `@noble/curves`, `@noble/ed25519`, `@noble/hashes`, `@noble/ciphers`, and `commander` — not zero-deps despite some marketing suggesting it. The `@noble` family is reputable but adds supply chain surface.

### Standards (3/5)

**Aligned:**
- W3C DID Core
- W3C Verifiable Credentials (wrapper profile)
- JSON-LD 1.1
- RFC 2119 requirement levels
- RFC 3161 (structurally, not cryptographically)
- Apache 2.0 license with patent grant

**Not aligned:**
- Not FIPS 140-3 compliant (Ed25519, XChaCha20)
- Not ISO 27001 referenced
- No SOC 2 Type II attestation (not applicable to a library, but relevant for any hosted service)
- Custom canonical JSON instead of JCS (RFC 8785)
- No SCIM or SAML integration for enterprise identity

### Risk (2/5)

**Liability concerns (from LEGAL.md):**

LEGAL.md §2 states markers are "NOT certifications of good standing, competence, or fitness" and carry "no more legal weight than any other self-authored record." This is appropriate legal positioning, but it means: *EXIT markers provide no assurance my enterprise can rely upon.* If I integrate EXIT and a rogue agent presents a forged `good_standing` marker to gain access to our systems, LEGAL.md §15.3 provides a "Protocol Operator Safe Harbor" — but that protects the protocol, not me.

**Vendor lock-in:**
Paradoxically low. The protocol is open-source, non-custodial, and the markers are self-contained JSON. If the project dies, markers remain independently verifiable. No vendor dependency.

**Supply chain risk:**
High. Single maintainer, no organizational backing, no security contact, no funded maintenance commitment. The `@noble` crypto dependencies are well-maintained (Paul Miller), but the EXIT-specific code has a bus factor of 1.

**Regulatory risk:**
LEGAL.md identifies GDPR, securities law, antitrust, and defamation risks. The analysis is thorough but the mitigations are design-level, not operational. My compliance team would need to conduct our own legal review before any integration.

---

## Would I Integrate?

**Not today.** The architecture is thoughtful and the problem space is real — I've seen agents get stuck on platforms with no clean migration path. But:

1. I cannot justify putting a v0.1.0, single-maintainer, non-FIPS library into our security infrastructure
2. No HSM integration means keys would need to live in software, violating our key management policy
3. No Java/Go SDK means we'd need to build our own implementation from the spec, and the spec has gaps (canonicalization, test vectors)
4. The liability model provides no assurance I can rely on — understandable for an open protocol, but it means I bear 100% of integration risk

**What would change my mind:**
- v1.0 release with a security audit from a recognized firm (Trail of Bits, NCC Group, etc.)
- FIPS-compliant algorithm options
- Multi-language SDK support (at least Java and Python)
- An organizational entity behind the project (foundation, consortium, or company)
- At least one production deployment at a comparable enterprise
- HSM/Cloud KMS integration documentation

**Adoption cost estimate:** If I were to integrate today: 6-12 months engineering effort to build a Java implementation from spec, integrate with our PKI, conduct internal security review, and stand up the ceremony infrastructure. Cost: $500K-$1M fully loaded. Not justified given the maturity level.

---

## Bottom Line

Architecturally sound protocol solving a real problem. Not enterprise-ready. I'd put this on my technology radar as "Assess" (ThoughtWorks nomenclature) — worth tracking, not worth investing in yet. Revisit when it hits v1.0 with a multi-stakeholder governance model and FIPS algorithm support.
