# P19 — Hostile Red Team Security Assessment

**Target:** cellar-door-exit (EXIT Protocol v1.1)  
**Assessor:** Red Team Persona (Hostile Identity Protocol Researcher)  
**Date:** 2026-02-25  
**Scope:** Forgery, replay, trust model exploitation, canonicalization attacks, timing side-channels, collision attacks  
**Methodology:** White-box code review + spec analysis  

---

## Executive Summary

The EXIT protocol is architecturally sound for its stated threat model — a self-sovereign departure record. The cryptographic core (Ed25519/P-256 via `@noble`) is solid. However, the protocol's design explicitly permits self-sovereign marker creation, meaning the **real attack surface is not forgery but rather social/trust-layer exploitation**. I found no way to forge markers without key material, but I found several exploitable weaknesses in the trust model, verification gaps, and one potentially high-severity canonicalization issue.

**Critical finding:** The `publicKeyFromDid()` function is algorithm-agnostic in a way that enables cross-algorithm key confusion — a P-256 public key can be extracted and fed to the Ed25519 verifier (or vice versa), which may cause undefined behavior in signature verification.

---

## Finding 1: Cross-Algorithm Key Confusion in DID Resolution

**Severity:** HIGH (CVSS 3.1: 7.5 — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N)

### Description

`publicKeyFromDid()` in `crypto.ts` accepts **both** Ed25519 and P-256 multicodec prefixes and returns raw bytes in both cases. But `verifyMarker()` in `proof.ts` calls `publicKeyFromDid()` and then dispatches to Ed25519 or P-256 based on `algorithmFromProofType()` — which reads from `proof.type`, NOT from the DID's multicodec prefix.

### Exploit Sketch

```
1. Generate a P-256 keypair → get did:key:z... with 0x8024 prefix
2. Create a marker with:
   - proof.type = "Ed25519Signature2020"  (lies about algorithm)
   - proof.verificationMethod = did:key:z... (P-256 DID)
   - proof.proofValue = <crafted bytes>
3. verifyMarker() calls algorithmFromProofType() → "Ed25519"
4. publicKeyFromDid() extracts 33 bytes of P-256 compressed key
5. ed.verify() receives 33 bytes as a "public key" (expects 32)
```

The `@noble/ed25519` library may reject the 33-byte key, OR it may silently truncate/interpret it. If it doesn't throw, you have an algorithm confusion where the verifier is checking Ed25519 signatures against P-256 key material.

### Actual Impact

In practice, `@noble/ed25519` will likely throw or return `false` — the `catch` block in `verify()` returns `false`. So this is **not directly exploitable for forgery**. But it's a **logic bug** — the algorithm detection path (`proof.type`) and the key type path (DID multicodec) are not cross-checked. A future refactor or library change could open this up.

### Recommendation

Add an explicit check: `algorithmFromDid(proof.verificationMethod)` MUST match `algorithmFromProofType(proof.type)`. Reject on mismatch.

---

## Finding 2: No Subject-Key Binding Verification

**Severity:** HIGH (CVSS 3.1: 8.1 — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N)

### Description

The spec says (§6.2): *"Verify that the signing key corresponds to the `subject` DID."* The implementation **does not do this**. `verifyMarker()` checks that the signature is valid against `proof.verificationMethod`, but never checks that `proof.verificationMethod` matches `subject`.

### Exploit Sketch

```
1. I (attacker) generate my own keypair → did:key:zAttacker
2. Create a marker with:
   - subject: "did:key:z6MkVICTIM..."  (someone else's DID)
   - proof.verificationMethod: "did:key:zAttacker"  (my key)
   - Sign with my private key
3. verifyMarker() → valid: true
```

I just created a "valid" EXIT marker for a victim. It claims the victim departed a platform. The signature is valid — it just wasn't signed by the subject.

### Impact

**Impersonation.** Any attacker can create EXIT markers attributed to any subject DID. The markers pass full verification. This is the single most exploitable flaw in the implementation.

### Recommendation

`verifyMarker()` MUST check `marker.proof.verificationMethod === marker.subject` (or that the verification method is a key authorized by the subject's DID document). This is a one-line fix.

---

## Finding 3: Replay Attack — No Marker Deduplication

**Severity:** MEDIUM (CVSS 3.1: 5.3 — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N)

### Description

EXIT markers are self-contained and verifiable offline. There is no built-in nonce, replay counter, or seen-marker registry. Content-addressed IDs (`urn:exit:{sha256}`) provide deduplication IF the verifier maintains a seen-set, but:

1. The spec says `id` "SHOULD" (not MUST) be content-addressed
2. The verifier code doesn't check `id` at all
3. There's no revocation mechanism for markers

### Exploit Sketch

```
1. Intercept a valid EXIT marker from agent A departing platform P
2. Re-submit the exact same marker to a different verifier/system
3. Both systems accept it as valid
```

This is replay, not forgery — same marker, different context. Combined with Finding 2, you could forge-then-replay.

### Impact

Limited in isolation (same marker = same information). But in systems that trigger actions on marker receipt (e.g., account creation at destination), replay could trigger duplicate provisioning.

### Recommendation

Verifiers SHOULD maintain a seen-set of marker IDs. The spec should promote content-addressed IDs from SHOULD to MUST and require verifiers to check for duplicates.

---

## Finding 4: Trust Enhancer Conduit — Trivially Exploitable

**Severity:** MEDIUM (CVSS 3.1: 6.5 — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N)

### Description

The trust enhancers (timestamps, witnesses, identity claims) are validated for **structure only** — the spec and code explicitly state they are a "conduit" with no opinion on truth. The `validate.ts` checks that `witnesses[i].signature` is a non-empty string, but never verifies the signature.

### Exploit Sketch

```
1. Create a marker with trustEnhancers.witnesses:
   [{
     witnessDid: "did:key:z6MkWELL_KNOWN_TRUSTED_ENTITY",
     attestation: "I witnessed this departure in good standing",
     timestamp: "2026-02-25T00:00:00.000Z",
     signature: "totallyFakeSignatureAAAABBBBCCCC",
     signatureType: "Ed25519Signature2020"
   }]
2. Validation passes — it's structurally well-formed
3. Any downstream system that trusts witness attestations at face value
   now believes a trusted entity witnessed this departure
```

### Impact

The protocol correctly disclaims responsibility ("conduit only"), but the gap between "structurally valid" and "semantically trustworthy" is enormous. Any consuming application that doesn't independently verify witness signatures (and the spec doesn't provide a standard way to do so) will be trivially deceived.

### Recommendation

Provide a `verifyTrustEnhancers()` function that cryptographically verifies witness signatures. At minimum, document the danger more prominently — the current note in §18 is buried.

---

## Finding 5: Canonicalization — Unicode Normalization Absent

**Severity:** MEDIUM (CVSS 3.1: 5.9 — AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:N)

### Description

The `canonicalize()` function in `marker.ts` sorts keys and removes whitespace, but performs **no Unicode normalization**. Two strings that are visually identical but use different Unicode representations (NFC vs NFD, different code points for the same glyph) will produce different canonical forms.

### Exploit Sketch

```
1. Create a marker with origin: "https://café.com" (é as U+00E9, NFC)
2. Someone else references the same origin as "https://café.com" (e + U+0301, NFD)
3. canonicalize() produces different byte sequences
4. Content-addressed IDs differ for semantically identical markers
5. Signature verification fails on round-trip through systems that normalize differently
```

### Impact

Not directly exploitable for forgery, but creates **confusion attacks**:
- Two markers that should be identical get different IDs
- Verifiers may fail to match markers to their subjects/origins
- Systems with homoglyph-sensitive logic (IDN domains) are vulnerable to confusion

### Recommendation

Apply NFC normalization to all string values before canonicalization. Add to spec §13.1.

---

## Finding 6: Timing Side-Channels — Minimal Risk

**Severity:** LOW (CVSS 3.1: 3.7 — AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N)

### Description

The verification code in `proof.ts` uses `@noble/ed25519`'s `verify()` which is **constant-time** for the core comparison. However:

1. Schema validation in `validateMarker()` short-circuits on first failure class (returns early with partial errors)
2. The `verifyMarker()` function returns early if `proof` is missing before reaching signature check
3. Different proof types take different code paths (Ed25519 vs P-256)

### Exploit Sketch

```
1. Submit markers with varying structural validity
2. Measure response times
3. Distinguish: missing proof (fast) vs invalid signature (slow) vs valid (slow)
4. Learn whether a proof.type is recognized before attempting brute force
```

### Impact

Minimal. The timing difference reveals structural validity, not key material. The underlying `@noble` libraries handle the cryptographic timing correctly. This is informational — not actionable for key extraction.

---

## Finding 7: Content-Addressed ID Collision — SHA-256 Is Fine

**Severity:** INFORMATIONAL (No CVSS score)

### Description

Content-addressed IDs use SHA-256 over canonical JSON excluding `proof` and `id`. SHA-256 has no known practical collision attacks (best known: 2^127.5 work for birthday attack). The question is whether the **input domain** creates shortcuts.

### Analysis

The canonical form excludes `proof` and `id`, meaning:
- Two markers with identical core fields WILL produce the same ID (by design — this is deduplication)
- Two markers with ANY difference in core fields will produce different IDs (SHA-256 collision resistance)
- The `proof` exclusion means different signers signing the same logical content get the same ID — this is intentional

**Can I create two different markers with the same ID?** Only if I find a SHA-256 collision. Not happening with current technology.

**Can I create one marker that maps to another's ID?** Second preimage attack on SHA-256. Also not happening.

### One Caveat

If `canonicalize()` has bugs (Finding 5), two logically different markers could produce the same canonical form, yielding the same ID. This would be a canonicalization collision, not a hash collision.

---

## Finding 8: The Worst Attack — Identity Fabrication at Scale

**Severity:** HIGH (CVSS 3.1: 7.5 — AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N)

### Description

Combining Findings 2 and 4, the worst realistic attack is:

### Full Exploit Chain

```
Phase 1: Fabricate a reputation
1. Generate 50 keypairs
2. For each, create EXIT markers from prestigious origins:
   - subject: <keypair DID>
   - origin: "https://google.com", "https://openai.com", etc.
   - exitType: voluntary, status: good_standing
   - Add fake witness attestations from well-known DIDs
   - Add fake tenure attestations (P365D+)
3. All markers pass verifyMarker() ✓
4. Confidence scores compute as "very_high" ✓

Phase 2: Impersonate a known agent (requires Finding 2)
1. Create EXIT markers with subject = victim's DID
2. Set exitType: forced, status: disputed
3. Sign with attacker's key → passes verification
4. Victim now has "disputed" departures on their record

Phase 3: Launder into a destination
1. Present fabricated markers to a new platform
2. Platform sees: voluntary departure, good standing, long tenure,
   witnessed by trusted parties, high confidence score
3. Platform grants elevated privileges

Phase 4: Weaponize against origins
1. Create many "forced exit" markers from a target origin
2. Trigger weaponization detection against the innocent origin
3. Origin's reputation damaged by fabricated departures
```

### Impact

The entire trust model collapses if Finding 2 is not fixed. Even with Finding 2 fixed, the self-sovereign nature of markers means **any agent can fabricate their own departure history**. The trust enhancer conduit model means they can also fabricate witness and tenure attestations that pass structural validation.

This is the protocol's fundamental tension: departure is a right (no central authority), but trust is relational (requires verification). The protocol handles this well philosophically (everything is a signal, not a verdict), but implementations that take `verifyMarker() → valid: true` as sufficient proof will be destroyed.

---

## Summary Table

| # | Finding | Severity | CVSS | Exploitable Now? |
|---|---------|----------|------|-----------------|
| 1 | Cross-algorithm key confusion | HIGH | 7.5 | No (library saves you) |
| 2 | **No subject-key binding** | **HIGH** | **8.1** | **YES** |
| 3 | No replay prevention | MEDIUM | 5.3 | Yes (context-dependent) |
| 4 | Trust enhancers unverified | MEDIUM | 6.5 | Yes |
| 5 | Unicode normalization absent | MEDIUM | 5.9 | Yes (edge cases) |
| 6 | Timing side-channels | LOW | 3.7 | Minimal |
| 7 | SHA-256 collision | INFO | — | No |
| 8 | Full attack chain | HIGH | 7.5 | **YES (via #2)** |

---

## Priority Remediation

1. **IMMEDIATE:** Fix Finding 2 — add `proof.verificationMethod === subject` check in `verifyMarker()`. One line. Fixes the entire impersonation class.
2. **SHORT-TERM:** Fix Finding 1 — cross-check algorithm from DID against algorithm from proof type.
3. **SHORT-TERM:** Add Unicode NFC normalization to `canonicalize()`.
4. **MEDIUM-TERM:** Provide `verifyTrustEnhancers()` that cryptographically validates witness/tenure signatures.
5. **LONG-TERM:** Promote content-addressed IDs from SHOULD to MUST. Define replay prevention guidance.

---

## Assessment Notes

The protocol is well-designed for its stated goals. The spec is unusually thorough — it anticipates most of these attacks in §15 (Security Considerations). The gap is between what the spec **requires** and what the implementation **enforces**. The spec says "verify that the signing key corresponds to the subject DID" — the code doesn't. That's the gap I'd drive a truck through.

The self-sovereign design is both the protocol's strength and its fundamental limitation. You can't have "departure is a right" AND "markers are trustworthy" without external verification infrastructure. The protocol knows this (confidence scoring, trust levels, ethics guardrails are all advisory). But any system that treats EXIT markers as authoritative without building that external verification layer is vulnerable to everything in Finding 8.

*The door is always open. That's the point. That's also the vulnerability.* 𓉸
