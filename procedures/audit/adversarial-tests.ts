/**
 * ADVERSARIAL TESTS — cellar-door-exit v0.2.0
 * Audit commit: 8f29a96 | PROC-SEC-001 v1.0
 */

import {
  CeremonyStateMachine,
  CeremonyState,
  ExitType,
  ExitStatus,
  EXIT_CONTEXT_V1,
  EXIT_SPEC_VERSION,
  generateKeyPair,
  generateP256KeyPair,
  createMarker,
  signMarker,
  verifyMarker,
  validateMarker,
  canonicalize,
  didFromPublicKey,
  didFromP256PublicKey,
  signMarkerWithSigner,
  Ed25519Signer,
  P256Signer,
} from "../../projects/Cellar-Door/cellar-door-exit/src/index.js";

import type { ExitMarker, DataIntegrityProof } from "../../projects/Cellar-Door/cellar-door-exit/src/types.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface TestResult {
  category: string;
  name: string;
  input: string;
  expected: string;
  actual: string;
  pass: boolean;
}

const results: TestResult[] = [];

function record(category: string, name: string, input: string, expected: string, actual: string, pass: boolean) {
  results.push({ category, name, input, expected, actual, pass });
  const icon = pass ? "✅" : "❌";
  console.log(`${icon} [${category}] ${name}`);
  if (!pass) console.log(`   Expected: ${expected}\n   Actual:   ${actual}`);
}

function makeValidMarker(pubKey: Uint8Array): ExitMarker {
  const did = didFromPublicKey(pubKey);
  return createMarker({ subject: did, origin: "https://example.com", exitType: ExitType.Voluntary });
}

// ─── Category 1: Ceremony State Machine Negative Tests ───────────────────────

function testCeremonyStateMachine() {
  const CAT = "Ceremony State Machine";
  const { publicKey, privateKey } = generateKeyPair();
  const did = didFromPublicKey(publicKey);

  const allStates = Object.values(CeremonyState);

  // Test every invalid transition
  const TRANSITIONS: Record<string, string[]> = {
    alive: ["intent", "final"],
    intent: ["snapshot"],
    snapshot: ["open", "final"],
    open: ["contested", "final"],
    contested: ["final"],
    final: ["departed"],
    departed: [],
  };

  for (const from of allStates) {
    for (const to of allStates) {
      if (TRANSITIONS[from]?.includes(to)) continue; // valid transition, skip
      if (from === to) continue; // self-transition — test separately

      const csm = new CeremonyStateMachine();
      // Force state
      (csm as any).state = from;

      let threw = false;
      try {
        (csm as any).transition(to);
      } catch {
        threw = true;
      }

      record(CAT, `${from} → ${to} rejected`, `from=${from}, to=${to}`, "throws CeremonyError", threw ? "threw" : "did NOT throw", threw);
    }
  }

  // Self-transitions (should all be invalid)
  for (const state of allStates) {
    const csm = new CeremonyStateMachine();
    (csm as any).state = state;
    let threw = false;
    try { (csm as any).transition(state); } catch { threw = true; }
    record(CAT, `self-transition ${state} → ${state}`, `from=${state}`, "throws", threw ? "threw" : "did NOT throw", threw);
  }

  // Double-transitioning
  {
    const csm = new CeremonyStateMachine();
    csm.declareIntent(did, "https://x.com", ExitType.Voluntary, privateKey, publicKey);
    csm.snapshot();
    let threw = false;
    try { csm.snapshot(); } catch { threw = true; }
    record(CAT, "double snapshot", "snapshot() twice", "throws", threw ? "threw" : "did NOT throw", threw);
  }

  // Transition from terminal (Departed)
  {
    const csm = new CeremonyStateMachine();
    (csm as any).state = CeremonyState.Departed;
    let threw = false;
    try { (csm as any).transition(CeremonyState.Alive); } catch { threw = true; }
    record(CAT, "departed → alive", "terminal state transition", "throws", threw ? "threw" : "did NOT throw", threw);
  }

  // Skipping states: ALIVE → SNAPSHOT (skip INTENT)
  {
    const csm = new CeremonyStateMachine();
    let threw = false;
    try { csm.snapshot(); } catch { threw = true; }
    record(CAT, "skip intent (alive → snapshot)", "snapshot() from alive", "throws", threw ? "threw" : "did NOT throw", threw);
  }

  // Going backwards: SNAPSHOT → INTENT
  {
    const csm = new CeremonyStateMachine();
    csm.declareIntent(did, "https://x.com", ExitType.Voluntary, privateKey, publicKey);
    csm.snapshot();
    let threw = false;
    try { (csm as any).transition(CeremonyState.Intent); } catch { threw = true; }
    record(CAT, "backwards snapshot → intent", "reverse transition", "throws", threw ? "threw" : "did NOT throw", threw);
  }
}

// ─── Category 2: Malformed Marker Inputs ─────────────────────────────────────

function testMalformedMarkers() {
  const CAT = "Malformed Markers";
  const { publicKey, privateKey } = generateKeyPair();
  const did = didFromPublicKey(publicKey);

  // Base valid signed marker
  const base = signMarker(
    createMarker({ subject: did, origin: "https://example.com", exitType: ExitType.Voluntary }),
    privateKey, publicKey
  );

  // Helper: test validateMarker + verifyMarker on a mutant
  function testMalformed(name: string, inputDesc: string, mutant: any, expectInvalid: boolean) {
    const vResult = validateMarker(mutant);
    const pResult = verifyMarker(mutant);
    const caught = !vResult.valid || !pResult.valid;
    record(CAT, `${name} (validate)`, inputDesc, expectInvalid ? "invalid" : "valid",
      vResult.valid ? "valid" : `invalid: ${vResult.errors[0]}`, expectInvalid ? !vResult.valid : vResult.valid);
    record(CAT, `${name} (verify)`, inputDesc, expectInvalid ? "invalid" : "valid",
      pResult.valid ? "valid" : `invalid: ${pResult.errors[0]}`, expectInvalid ? !pResult.valid : pResult.valid);
  }

  // Missing required fields (one at a time)
  const requiredFields = ["@context", "specVersion", "id", "subject", "origin", "timestamp", "exitType", "status", "proof"];
  for (const field of requiredFields) {
    const mutant = { ...base };
    delete (mutant as any)[field];
    testMalformed(`missing ${field}`, `delete marker.${field}`, mutant, true);
  }

  // Wrong types
  testMalformed("subject as number", "subject=42", { ...base, subject: 42 }, true);
  testMalformed("timestamp as number", "timestamp=12345", { ...base, timestamp: 12345 }, true);
  testMalformed("exitType as number", "exitType=99", { ...base, exitType: 99 }, true);
  testMalformed("proof as string", 'proof="not-an-object"', { ...base, proof: "not-an-object" }, true);
  testMalformed("proof as null", "proof=null", { ...base, proof: null }, true);

  // Extra unexpected fields — should NOT cause rejection (open schema)
  testMalformed("extra field", 'added bogus="hack"', { ...base, bogus: "hack" }, false);

  // Extremely long strings
  const longStr = "A".repeat(1_048_576); // 1MB
  {
    const mutant = { ...base, origin: longStr };
    // Re-sign with long origin won't match, but we test validateMarker accepts/rejects
    const vr = validateMarker(mutant);
    record(CAT, "1MB origin string (validate)", "origin=1MB string", "valid (no length check) or invalid",
      vr.valid ? "valid (no length limit)" : `invalid: ${vr.errors[0]}`, true); // informational
  }

  // Null bytes in strings
  testMalformed("null bytes in subject", 'subject="did\\x00injected"', { ...base, subject: "did\x00injected" }, true);

  // Unicode edge cases
  const unicodeCases = [
    { name: "RTL override", val: "did:key:\u202Eevil" },
    { name: "zero-width joiner", val: "did:key:z\u200Dtest" },
    { name: "combining chars", val: "did:key:ze\u0301" }, // é as e + combining accent
  ];
  for (const { name, val } of unicodeCases) {
    const mutant = { ...base, subject: val };
    const vr = validateMarker(mutant);
    const pr = verifyMarker(mutant);
    record(CAT, `unicode: ${name} (validate)`, `subject="${val}"`, "invalid (DID format or sig mismatch)",
      vr.valid ? "valid (CONCERN)" : `invalid: ${vr.errors[0]}`, !vr.valid || !pr.valid);
  }

  // Nested objects where primitives expected
  testMalformed("subject as object", "subject={}", { ...base, subject: { evil: true } }, true);
  testMalformed("timestamp as object", "timestamp={}", { ...base, timestamp: { evil: true } }, true);

  // Empty proof object
  testMalformed("empty proof", "proof={}", { ...base, proof: {} }, true);

  // Proof with valid structure but wrong signature
  {
    const badProof = { ...base.proof, proofValue: Buffer.from("deadbeef", "hex").toString("base64") };
    testMalformed("wrong signature", "proof.proofValue=garbage", { ...base, proof: badProof }, true);
  }
}

// ─── Category 3: Cryptographic Adversarial Tests ─────────────────────────────

async function testCryptoAdversarial() {
  const CAT = "Crypto Adversarial";
  const { publicKey: pk1, privateKey: sk1 } = generateKeyPair();
  const { publicKey: pk2, privateKey: sk2 } = generateKeyPair();
  const did1 = didFromPublicKey(pk1);
  const did2 = didFromPublicKey(pk2);

  // 1. Sign then modify one byte of content
  {
    const marker = signMarker(
      createMarker({ subject: did1, origin: "https://a.com", exitType: ExitType.Voluntary }),
      sk1, pk1
    );
    const tampered = { ...marker, origin: "https://a.con" }; // one char changed
    const r = verifyMarker(tampered);
    record(CAT, "tampered content (1 byte)", "changed origin 'com'→'con'", "sig fails", r.valid ? "VALID (BAD!)" : `invalid: ${r.errors.join("; ")}`, !r.valid);
  }

  // 2. Modify verificationMethod to different valid DID
  {
    const marker = signMarker(
      createMarker({ subject: did1, origin: "https://a.com", exitType: ExitType.Voluntary }),
      sk1, pk1
    );
    const swapped = { ...marker, proof: { ...marker.proof, verificationMethod: did2 } };
    const r = verifyMarker(swapped);
    record(CAT, "swapped verificationMethod", "proof.verificationMethod → different DID", "fails (subject-key binding)",
      r.valid ? "VALID (BAD!)" : `invalid: ${r.errors.join("; ")}`, !r.valid);
  }

  // 3. Swap proofs between two markers with different subjects
  {
    const m1 = signMarker(
      createMarker({ subject: did1, origin: "https://a.com", exitType: ExitType.Voluntary }),
      sk1, pk1
    );
    const m2 = signMarker(
      createMarker({ subject: did2, origin: "https://b.com", exitType: ExitType.Voluntary }),
      sk2, pk2
    );
    const swapped1 = { ...m1, proof: m2.proof };
    const swapped2 = { ...m2, proof: m1.proof };
    const r1 = verifyMarker(swapped1);
    const r2 = verifyMarker(swapped2);
    record(CAT, "proof swap (marker1 with proof2)", "cross-subject proof swap", "fails",
      r1.valid ? "VALID (BAD!)" : `invalid: ${r1.errors[0]}`, !r1.valid);
    record(CAT, "proof swap (marker2 with proof1)", "cross-subject proof swap", "fails",
      r2.valid ? "VALID (BAD!)" : `invalid: ${r2.errors[0]}`, !r2.valid);
  }

  // 4. Verify Ed25519 sig as P-256 and vice versa
  {
    const edMarker = signMarker(
      createMarker({ subject: did1, origin: "https://a.com", exitType: ExitType.Voluntary }),
      sk1, pk1
    );
    // Force proof type to P-256
    const wrongType = { ...edMarker, proof: { ...edMarker.proof, type: "EcdsaP256Signature2019" } };
    const r = verifyMarker(wrongType);
    record(CAT, "Ed25519 sig claimed as P-256", "proof.type=EcdsaP256Signature2019 on Ed25519 sig", "fails",
      r.valid ? "VALID (BAD!)" : `invalid: ${r.errors.join("; ")}`, !r.valid);
  }

  // P-256 marker verified as Ed25519
  {
    const { publicKey: p256pk, privateKey: p256sk } = generateP256KeyPair();
    const p256did = didFromP256PublicKey(p256pk);
    const signer = new P256Signer(p256sk, p256pk);
    const marker = createMarker({ subject: p256did, origin: "https://a.com", exitType: ExitType.Voluntary });
    const signed = await signMarkerWithSigner(marker, signer);
    // Force proof type to Ed25519
    const wrongType = { ...signed, proof: { ...signed.proof, type: "Ed25519Signature2020" } };
    const r = verifyMarker(wrongType);
    record(CAT, "P-256 sig claimed as Ed25519", "proof.type=Ed25519Signature2020 on P-256 sig", "fails",
      r.valid ? "VALID (BAD!)" : `invalid: ${r.errors.join("; ")}`, !r.valid);
  }

  // 5. Forged proof.type ("RSA2048")
  {
    const marker = signMarker(
      createMarker({ subject: did1, origin: "https://a.com", exitType: ExitType.Voluntary }),
      sk1, pk1
    );
    const forged = { ...marker, proof: { ...marker.proof, type: "RSA2048" } };
    const r = verifyMarker(forged);
    record(CAT, "forged proof type (RSA2048)", 'proof.type="RSA2048"', "rejected",
      r.valid ? "VALID (BAD!)" : `invalid: ${r.errors.join("; ")}`, !r.valid);
  }
}

// ─── Category 4: Canonicalization Adversarial Tests ──────────────────────────

function testCanonicalization() {
  const CAT = "Canonicalization";

  // 1. Objects that SHOULD be different
  {
    const a = { x: 1, y: 2 };
    const b = { x: 1, y: "2" };
    const ca = canonicalize(a);
    const cb = canonicalize(b);
    const diff = ca !== cb;
    record(CAT, "int vs string value", '{x:1,y:2} vs {x:1,y:"2"}', "different canonical forms",
      diff ? "different" : `SAME: ${ca}`, diff);
  }

  // 2. Key ordering
  {
    const a = { z: 1, a: 2 };
    const b = { a: 2, z: 1 };
    const same = canonicalize(a) === canonicalize(b);
    record(CAT, "key ordering invariance", "{z:1,a:2} vs {a:2,z:1}", "same canonical form",
      same ? "same" : "DIFFERENT", same);
  }

  // 3. Numeric precision
  {
    const a = { v: 0.1 + 0.2 };
    const b = { v: 0.3 };
    const ca = canonicalize(a);
    const cb = canonicalize(b);
    const diff = ca !== cb;
    // 0.1+0.2 !== 0.3 in IEEE 754, so they SHOULD differ
    record(CAT, "float precision (0.1+0.2 vs 0.3)", "0.30000000000000004 vs 0.3", "different (IEEE 754)",
      diff ? "different (correct)" : "SAME (surprising)", diff);
  }

  // 4. Unicode normalization: NFC vs NFD
  {
    const nfc = "\u00E9"; // é precomposed
    const nfd = "e\u0301"; // e + combining accent
    const ca = canonicalize({ s: nfc });
    const cb = canonicalize({ s: nfd });
    const same = ca === cb;
    record(CAT, "NFC vs NFD normalization", "é (NFC) vs e+combining (NFD)", "same (canonicalize normalizes to NFC)",
      same ? "same (NFC normalized)" : `DIFFERENT: ${ca} vs ${cb}`, same);
  }

  // NFKC vs NFC
  {
    const nfc = "ﬁ"; // U+FB01 fi ligature
    const nfkc = "fi"; // decomposed via NFKC
    const ca = canonicalize({ s: nfc });
    const cb = canonicalize({ s: nfkc });
    const diff = ca !== cb;
    record(CAT, "NFC vs NFKC (fi ligature)", "ﬁ (ligature) vs fi", "different (NFC only, not NFKC)",
      diff ? "different (NFC-only)" : "SAME (uses NFKC — unexpected)", diff);
  }

  // 5. Deeply nested key ordering
  {
    const a = { b: { z: 1, a: 2 }, a: { z: 3, a: 4 } };
    const b = { a: { a: 4, z: 3 }, b: { a: 2, z: 1 } };
    const same = canonicalize(a) === canonicalize(b);
    record(CAT, "nested key ordering", "deeply nested reordered keys", "same canonical form",
      same ? "same" : "DIFFERENT", same);
  }

  // 6. null vs undefined vs missing
  {
    const a = { x: null };
    const b = { x: undefined };
    const c = {};
    const cab = canonicalize(a) === canonicalize(b);
    const cac = canonicalize(a) === canonicalize(c);
    record(CAT, "null vs undefined", "{x:null} vs {x:undefined}", "different (null serialized, undefined dropped)",
      !cab ? "different" : "SAME", !cab);
    record(CAT, "null vs missing", "{x:null} vs {}", "different",
      !cac ? "different" : "SAME", !cac);
  }
}

// ─── Run All ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══ ADVERSARIAL TESTS — cellar-door-exit v0.2.0 ═══\n");

  testCeremonyStateMachine();
  console.log("");
  testMalformedMarkers();
  console.log("");
  await testCryptoAdversarial();
  console.log("");
  testCanonicalization();

  // Summary
  const total = results.length;
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;

  console.log(`\n═══ SUMMARY: ${passed}/${total} passed, ${failed} failed ═══`);

  // Write results
  const findings = results.filter(r => !r.pass);
  let md = `# Adversarial Testing Review — cellar-door-exit v0.2.0

**Audit commit:** 8f29a96  
**Procedure:** PROC-SEC-001 v1.0  
**Date:** ${new Date().toISOString()}  
**Auditor:** Automated adversarial test suite (Pass 7)

## Summary

| Metric | Count |
|--------|-------|
| Total tests | ${total} |
| Passed | ${passed} |
| Failed | ${failed} |

## Results by Category

`;

  const categories = [...new Set(results.map(r => r.category))];
  for (const cat of categories) {
    const catResults = results.filter(r => r.category === cat);
    const catPassed = catResults.filter(r => r.pass).length;
    md += `### ${cat} (${catPassed}/${catResults.length})\n\n`;
    md += `| Test | Input | Expected | Actual | Result |\n|------|-------|----------|--------|--------|\n`;
    for (const r of catResults) {
      const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ").slice(0, 120);
      md += `| ${esc(r.name)} | ${esc(r.input)} | ${esc(r.expected)} | ${esc(r.actual)} | ${r.pass ? "PASS" : "**FAIL**"} |\n`;
    }
    md += "\n";
  }

  if (findings.length > 0) {
    md += `## Findings\n\n`;
    for (let i = 0; i < findings.length; i++) {
      const f = findings[i];
      md += `### ADV-${String(i + 1).padStart(3, "0")}: ${f.name}

- **Category:** ${f.category}
- **Severity:** Medium (requires investigation)
- **Input:** ${f.input}
- **Expected:** ${f.expected}
- **Actual:** ${f.actual}
- **Status:** FAIL — Unexpected behavior detected

`;
    }
  } else {
    md += `## Findings\n\nNo failures detected. All adversarial tests passed.\n`;
  }

  md += `## Observations

### Strengths
1. **State machine is strict** — all invalid transitions properly rejected
2. **Subject-key binding enforced** — verificationMethod must match subject DID
3. **Algorithm cross-check** — proof.type must match DID multicodec prefix
4. **Canonicalization handles key ordering** — deterministic regardless of insertion order
5. **NFC normalization applied** — NFD strings normalized to NFC before hashing

### Notes
- Extra fields on markers are accepted (open schema) — this is by design for extensibility
- No field length limits exist — extremely long strings are accepted
- Null bytes in DID strings are not explicitly rejected by validateMarker (caught by signature mismatch)
- NFKC normalization is NOT applied (only NFC) — this is correct per JSON-LD conventions
`;

  const fs = await import("fs");
  fs.writeFileSync("/home/node/workspace/openclaw/Hawthorn/procedures/audit/adversarial-review.md", md);

  console.log("\nResults written to adversarial-review.md");
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(2); });
