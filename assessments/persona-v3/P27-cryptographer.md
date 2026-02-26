# P27 — Applied Cryptographer Review

**Reviewer Persona:** Applied Cryptographer (TLS/Signal-class protocol analysis)  
**Date:** 2026-02-25  
**Files Reviewed:** `signer.ts`, `proof.ts`, `validate.ts`, `crypto.ts`, `marker.ts`, `EXIT_SPEC_v1.1.md`  
**Verdict:** **Needs Fixes** — sound architecture, several concrete bugs and gaps

---

## 1. Signature Scheme Implementation

### 1.1 Ed25519 — Mostly Correct

The Ed25519 path uses `@noble/ed25519` correctly: synchronous `sha512Sync` is properly configured, `sign(data, privateKey)` and `verify(signature, data, publicKey)` follow the library API. The parameter order swap between `sign(data, key)` and `ed.verify(signature, data, key)` in the wrapper is handled correctly.

**No bugs found in Ed25519 signing/verification.**

### 1.2 P-256 (ECDSA) — Bug: Signature Serialization Format

**BUG (Medium Severity):** `signP256` calls `p256.sign(hash, privateKey)` which returns a `Signature` object from `@noble/curves`. When this is passed through `Buffer.from(signature).toString("base64")` in `proof.ts`, the serialization depends on how the `Signature` object converts to `Uint8Array`. The `@noble/curves` `sign()` returns a `Signature` object with `.toCompactRawBytes()` and `.toDERRawBytes()` methods.

Calling `p256.sign(hash, privateKey)` without explicit format selection means the implicit conversion behavior depends on the library version. The code should explicitly call `.toCompactRawBytes()` or `.toDERRawBytes()` and document which format is canonical. Similarly, `p256.verify()` needs to know which format to expect.

**Recommendation:** Change `signP256` to:
```ts
const sig = p256.sign(hash, privateKey);
return sig.toCompactRawBytes(); // or toDERRawBytes() — pick one, document it
```

### 1.3 Spec vs. Implementation Mismatch

**BUG (Medium Severity):** The spec §3.5 says: "The data signed MUST be the canonical JSON form of the marker excluding the `proof` and `id` fields." However, `proof.ts` only strips `proof`, not `id`:

```ts
const { proof: _proof, ...rest } = marker;  // id is NOT excluded
```

Meanwhile `computeId` in `marker.ts` strips both `proof` and `id`. This means the signed content includes `id` but the content-addressed hash does not. This is either a spec bug or an implementation bug — either way it's a divergence that must be resolved.

If `id` is content-addressed from the marker body, and the signed data includes `id`, then a verifier must know the `id` to verify the signature. This is fine operationally but contradicts the spec text.

**Recommendation:** Align spec and code. Pick one approach and enforce it everywhere.

---

## 2. Canonicalization

### 2.1 Approach

The `canonicalize()` function implements recursive sorted-key JSON serialization. This is essentially RFC 8785 (JCS) without explicitly claiming compliance.

### 2.2 Soundness

**Generally sound** with caveats:

- **No confusion attacks possible** between the two supported types (Ed25519 vs P-256) because the proof type and DID multicodec prefix both encode the algorithm. An attacker cannot substitute one signature type for another without changing the `verificationMethod` DID, which changes the signed content.

- **`undefined` handling:** `canonicalize(undefined)` returns `"undefined"` via `JSON.stringify(undefined)` — wait, actually `JSON.stringify(undefined)` returns `undefined` (the JS value), not the string. This means `canonicalize(undefined)` returns the JS value `undefined`, which when concatenated into a string becomes `"undefined"`. This is a **minor inconsistency** — if a field is `undefined` in one implementation and absent in another, they'll produce different canonical forms. However, since `undefined` properties are naturally excluded by `Object.keys()`, this only matters for bare `undefined` values, which shouldn't appear in practice.

- **No `__proto__` or `constructor` poisoning risk** because `Object.keys()` only enumerates own properties.

- **IEEE 754 float representation:** `JSON.stringify` handles floats per ES spec, which matches JCS. No issue.

### 2.3 Missing: Explicit JCS Reference

The spec should reference RFC 8785 or explicitly note deviations. Rolling your own canonicalization is a well-known footgun. The implementation happens to be correct for the JSON subset used, but future field types (e.g., BigInt) could break it silently.

---

## 3. @noble Library Choices

**Excellent choices.** `@noble/ed25519`, `@noble/curves`, and `@noble/hashes` are:

- Written by Paul Miller (audited, well-maintained)
- Constant-time for scalar operations (side-channel resistant at the bigint level)
- No native dependencies (pure JS, auditable)
- Used by major projects (ethers.js, etc.)

These are the correct libraries for JavaScript cryptography. No concerns.

---

## 4. Content-Addressing (SHA-256)

SHA-256 provides 128-bit collision resistance. For content-addressing of markers (which are ~300-500 bytes of structured JSON), this is **more than sufficient**. There is no realistic collision threat.

The `urn:exit:{sha256}` scheme is deterministic and sound given correct canonicalization.

**One note:** The anchor hash in §11.1 hashes the marker *including* proof, while the `id` field hashes *excluding* proof and id. This is intentional (anchor proves the signed artifact existed) but should be more prominently documented to avoid implementer confusion.

---

## 5. Formal Security Properties

The protocol can claim:

### 5.1 Provable Properties

| Property | Claim | Proof Sketch |
|---|---|---|
| **Authenticity** | A valid marker was signed by the holder of the subject's private key | Standard digital signature unforgeability (EUF-CMA for Ed25519/ECDSA) |
| **Integrity** | The marker content has not been modified since signing | Signature binds to canonical content |
| **Non-repudiation** | The subject cannot deny having signed the marker | Follows from signature unforgeability |
| **Content-address binding** | The `id` uniquely identifies the marker content | Follows from SHA-256 collision resistance |

### 5.2 Properties It CANNOT Claim

| Property | Why Not |
|---|---|
| **Timestamp accuracy** | Self-reported; only TSA anchoring provides independent time proof |
| **Status truthfulness** | Self-attested by default; `good_standing` is cheap talk |
| **Key-subject binding** | `did:key` has no PKI; anyone can generate a key claiming to be anyone |
| **Freshness** | No nonce or challenge-response; replay is possible |
| **Ceremony completion** | No on-chain state machine; ceremony states are advisory |

### 5.3 Recommendation

The spec should include a formal "Security Properties" section explicitly listing what IS and IS NOT guaranteed. Currently the security analysis (§15) lists threats but doesn't state positive claims.

---

## 6. Side Channel Concerns

### 6.1 @noble Libraries — Low Risk

The noble libraries use constant-time scalar multiplication and resist timing attacks at the algorithm level. This is about as good as JavaScript gets.

### 6.2 JavaScript Runtime — Inherent Limitations

- **GC pauses** can leak timing information about memory allocation patterns, but this is not exploitable for key recovery in practice.
- **JIT compilation** could theoretically create variable-time code paths, but noble's implementation accounts for this.
- **No memory zeroization:** Private keys in `Uint8Array` are not zeroed after use. The `_privateKey` field in `Ed25519Signer`/`P256Signer` persists for the object lifetime. This is a **minor concern** — in a Node.js server context, an attacker with memory read access already has game over. But for defense-in-depth, consider a `destroy()` method.

### 6.3 Base58 Implementation — Timing Leak

**CONCERN (Low Severity):** The custom `base58btcEncode`/`base58btcDecode` functions use BigInt arithmetic with variable-time division. This leaks information about the encoded value's magnitude via timing. Since this operates on *public keys* (encoding DIDs), not private keys, the practical impact is **nil**. But it's worth noting for completeness.

### 6.4 Buffer.from() for Signature Encoding

Using `Buffer.from(signature).toString("base64")` is fine — no secret data leakage risk since signatures are public values.

---

## 7. Algorithm Agility

### 7.1 Integration Quality: Well-Integrated, Not a Bolt-On

The P-256 addition is cleanly integrated:

- `Signer` interface abstracts algorithm choice
- `proofTypeForAlgorithm` / `algorithmFromProofType` handle mapping
- `algorithmFromDid` auto-detects from multicodec prefix
- `verifyMarker` dispatches correctly based on proof type
- DID encoding distinguishes algorithms via multicodec

This is a proper algorithm agility implementation.

### 7.2 Issues

**BUG (Low Severity):** `publicKeyFromDid` in `crypto.ts` accepts BOTH Ed25519 and P-256 prefixes, returning raw bytes either way. But `publicKeyFromP256Did` only accepts P-256. The generic `publicKeyFromDid` is used in `verifyMarker`, which then dispatches to the correct verify function based on proof type. This works but creates a subtle inconsistency: if the proof type says Ed25519 but the DID encodes a P-256 key, the verification will use Ed25519 verify with P-256 key bytes — it will fail (not produce a false positive), but the error message will be confusing.

**Recommendation:** In `verifyMarker`, after detecting algorithm from proof type, verify that the DID's multicodec prefix matches. Reject with a clear error on mismatch.

**BUG (Medium Severity):** `signMarker` (the legacy function) hardcodes `Ed25519Signature2020` proof type regardless of what key type is actually used. If someone passes a P-256 key to `signMarker`, the proof will claim Ed25519 but contain a P-256 signature. Use `signMarkerWithSigner` instead and consider deprecating `signMarker`.

---

## 8. Additional Findings

### 8.1 No Signature Malleability Protection for ECDSA

ECDSA signatures are inherently malleable: given `(r, s)`, the signature `(r, n-s)` is also valid. The `@noble/curves` library normalizes to low-S by default in `sign()`, but `verify()` accepts both forms. This means an attacker can modify a valid P-256 signature without invalidating it, which could cause issues if signatures are used as unique identifiers or in deduplication logic.

**Recommendation:** If signature values are ever used for deduplication or content-addressing, enforce low-S normalization on verification. Otherwise, this is informational.

### 8.2 No Domain Separation

The signed data is just `TextEncoder.encode(canonicalize(marker))`. There is no domain separator prefix (e.g., `"EXIT-MARKER-v1.1:"`) before the canonical JSON. This means if another protocol signs canonical JSON with the same key, signature confusion is theoretically possible.

**Recommendation:** Prepend a domain separator to the signed bytes:
```ts
const prefix = new TextEncoder().encode("exit-marker-v1.1:");
const data = concat(prefix, new TextEncoder().encode(canonical));
```

### 8.3 Timestamp in Proof is Not Signed Over

The `proof.created` timestamp is set *after* canonicalization of the marker body. Since the proof is excluded from signing, the `proof.created` field is **unauthenticated** — anyone can modify it without invalidating the signature. This is a known limitation of the W3C Data Integrity proof model, but worth noting.

---

## Summary of Findings

| # | Finding | Severity | Type |
|---|---|---|---|
| 1 | P-256 signature serialization format ambiguous | Medium | Bug |
| 2 | Spec says exclude `id` from signing, code doesn't | Medium | Bug |
| 3 | Legacy `signMarker` hardcodes Ed25519 proof type | Medium | Bug |
| 4 | No domain separation in signed data | Medium | Design gap |
| 5 | No algorithm cross-check (proof type vs DID prefix) | Low | Robustness |
| 6 | ECDSA signature malleability (informational) | Low | Informational |
| 7 | `proof.created` is unauthenticated | Low | Design limitation |
| 8 | No private key zeroization | Low | Defense-in-depth |
| 9 | Missing explicit JCS/RFC 8785 reference | Low | Spec gap |
| 10 | Anchor hash vs ID hash scope difference underdocumented | Low | Documentation |

---

## Verdict: **Needs Fixes**

The cryptographic architecture is sound. The library choices are excellent. The algorithm agility is well-designed. The canonicalization approach works for the data types used.

However, there are three medium-severity bugs (#1, #2, #3) that should be fixed before any production deployment, and the lack of domain separation (#4) is a design gap that should be addressed. None of these are exploitable for key recovery or signature forgery, but they create interoperability risks and spec-implementation divergence that will cause real-world problems.

After fixing items 1–4, the cryptographic layer would be **Secure** for its intended use case.
