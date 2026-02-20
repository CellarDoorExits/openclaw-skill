#!/usr/bin/env node
/**
 * cellar-door-exit — CLI
 */

import { Command } from "commander";
import { readFileSync, writeFileSync } from "node:fs";
import {
  createMarker,
  signMarker,
  verifyMarker,
  generateKeyPair,
  didFromPublicKey,
  addModule,
  ExitType,
  ExitStatus,
  CeremonyState,
  computeAnchorHash,
  createAnchorRecord,
  saveMarker as storageSave,
  loadMarker as storageLoad,
  listMarkers as storageList,
  redactMarker,
  type ExitMarker,
  type ModuleE,
} from "./index.js";

const program = new Command();

program
  .name("exit")
  .description("cellar-door-exit — Verifiable EXIT markers for agents")
  .version("0.1.0");

// ─── exit create ─────────────────────────────────────────────────────────────

program
  .command("create")
  .description("Create an EXIT marker")
  .requiredOption("--origin <uri>", "Origin URI (what is being exited)")
  .option("--subject <did>", "Subject DID (who is exiting; generates keypair if omitted)")
  .option("--type <type>", "Exit type: voluntary, forced, emergency", "voluntary")
  .option("--status <status>", "Standing: good_standing, disputed, unverified", "good_standing")
  .option("--reason <text>", "Reason for departure")
  .option("--sign", "Sign the marker")
  .option("--key <path>", "Private key file (hex or base64)")
  .action((opts) => {
    let privateKey: Uint8Array | undefined;
    let publicKey: Uint8Array | undefined;
    let subject = opts.subject;

    // Resolve keys
    if (opts.key) {
      const raw = readFileSync(opts.key, "utf-8").trim();
      privateKey = fromHexOrBase64(raw);
      // Derive public key — ed25519 private keys are 32 bytes, pubkey via noble
      const ed = require("@noble/ed25519") as typeof import("@noble/ed25519");
      publicKey = ed.getPublicKey(privateKey);
      if (!subject) subject = didFromPublicKey(publicKey);
    } else if (opts.sign || !subject) {
      const kp = generateKeyPair();
      privateKey = kp.privateKey;
      publicKey = kp.publicKey;
      if (!subject) subject = didFromPublicKey(publicKey);
      // Print generated key info to stderr so stdout stays clean JSON
      process.stderr.write(
        JSON.stringify({
          _generated_keypair: {
            did: didFromPublicKey(publicKey),
            publicKey: toHex(publicKey),
            privateKey: toHex(privateKey),
          },
        }) + "\n"
      );
    }

    const exitType = parseExitType(opts.type);
    const status = parseExitStatus(opts.status);

    let marker = createMarker({ subject, origin: opts.origin, exitType, status });

    if (opts.reason) {
      const meta: ModuleE = { reason: opts.reason };
      marker = addModule(marker, "metadata", meta);
    }

    if (opts.sign && privateKey && publicKey) {
      marker = signMarker(marker, privateKey, publicKey);
    }

    process.stdout.write(JSON.stringify(marker, null, 2) + "\n");
  });

// ─── exit verify ─────────────────────────────────────────────────────────────

program
  .command("verify <file>")
  .description("Verify an EXIT marker from a JSON file")
  .action((file) => {
    const marker = JSON.parse(readFileSync(file, "utf-8")) as ExitMarker;
    const result = verifyMarker(marker);

    if (result.valid) {
      console.log("✓ VALID");
      console.log(`  Subject: ${marker.subject}`);
      console.log(`  Origin:  ${marker.origin}`);
      console.log(`  Type:    ${marker.exitType}`);
      console.log(`  Status:  ${marker.status}`);
    } else {
      console.log("✗ INVALID");
      for (const err of result.errors) {
        console.log(`  - ${err}`);
      }
      process.exit(1);
    }
  });

// ─── exit inspect ────────────────────────────────────────────────────────────

program
  .command("inspect <file>")
  .description("Human-readable display of an EXIT marker")
  .action((file) => {
    const marker = JSON.parse(readFileSync(file, "utf-8")) as ExitMarker;

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║                    EXIT MARKER                          ║");
    console.log("╚══════════════════════════════════════════════════════════╝");
    console.log();
    console.log(`  ID:        ${marker.id}`);
    console.log(`  Subject:   ${marker.subject}`);
    console.log(`  Origin:    ${marker.origin}`);
    console.log(`  Timestamp: ${marker.timestamp}`);
    console.log(`  Type:      ${marker.exitType}`);
    console.log(`  Status:    ${marker.status}`);
    console.log();

    // Proof
    console.log("  ── Proof ──");
    console.log(`  Algorithm:    ${marker.proof.type}`);
    console.log(`  Created:      ${marker.proof.created}`);
    console.log(`  Verification: ${marker.proof.verificationMethod}`);
    console.log(`  Signature:    ${marker.proof.proofValue ? marker.proof.proofValue.slice(0, 32) + "..." : "(unsigned)"}`);
    console.log();

    // Modules
    if (marker.lineage) {
      console.log("  ── Module A: Lineage ──");
      if (marker.lineage.predecessor) console.log(`  Predecessor: ${marker.lineage.predecessor}`);
      if (marker.lineage.successor) console.log(`  Successor:   ${marker.lineage.successor}`);
      if (marker.lineage.lineageChain) console.log(`  Chain:       ${marker.lineage.lineageChain.join(" → ")}`);
      if (marker.lineage.continuityProof) console.log(`  Proof type:  ${marker.lineage.continuityProof.type}`);
      console.log();
    }

    if (marker.stateSnapshot) {
      console.log("  ── Module B: State Snapshot ──");
      console.log(`  Hash:     ${marker.stateSnapshot.stateHash}`);
      if (marker.stateSnapshot.stateLocation) console.log(`  Location: ${marker.stateSnapshot.stateLocation}`);
      console.log();
    }

    if (marker.dispute) {
      console.log("  ── Module C: Dispute ──");
      if (marker.dispute.disputes) console.log(`  Active disputes: ${marker.dispute.disputes.length}`);
      if (marker.dispute.challengeWindow) {
        console.log(`  Challenge: ${marker.dispute.challengeWindow.opens} → ${marker.dispute.challengeWindow.closes}`);
      }
      console.log();
    }

    if (marker.economic) {
      console.log("  ── Module D: Economic ──");
      if (marker.economic.assetManifest) console.log(`  Assets: ${marker.economic.assetManifest.length}`);
      if (marker.economic.exitFee) console.log(`  Exit fee: ${marker.economic.exitFee.amount}`);
      console.log();
    }

    if (marker.metadata) {
      console.log("  ── Module E: Metadata ──");
      if (marker.metadata.reason) console.log(`  Reason:    ${marker.metadata.reason}`);
      if (marker.metadata.narrative) console.log(`  Narrative: ${marker.metadata.narrative}`);
      if (marker.metadata.tags) console.log(`  Tags:      ${marker.metadata.tags.join(", ")}`);
      console.log();
    }

    if (marker.crossDomain) {
      console.log("  ── Module F: Cross-Domain ──");
      if (marker.crossDomain.anchors) {
        for (const a of marker.crossDomain.anchors) {
          console.log(`  ${a.chain}: ${a.txHash}`);
        }
      }
      console.log();
    }

    // Verification
    const result = verifyMarker(marker);
    console.log(`  Verification: ${result.valid ? "✓ VALID" : "✗ INVALID"}`);
    if (!result.valid) {
      for (const err of result.errors) console.log(`    - ${err}`);
    }
  });

// ─── exit keygen ─────────────────────────────────────────────────────────────

program
  .command("keygen")
  .description("Generate a new Ed25519 keypair")
  .action(() => {
    const kp = generateKeyPair();
    const did = didFromPublicKey(kp.publicKey);
    console.log(
      JSON.stringify(
        {
          did,
          publicKey: toHex(kp.publicKey),
          privateKey: toHex(kp.privateKey),
        },
        null,
        2
      )
    );
  });

// ─── exit anchor ─────────────────────────────────────────────────────────────

program
  .command("anchor <file>")
  .description("Compute and display anchor hash for a marker")
  .action((file) => {
    const marker = JSON.parse(readFileSync(file, "utf-8")) as ExitMarker;
    const record = createAnchorRecord(marker);
    console.log(JSON.stringify(record, null, 2));
  });

// ─── exit store ──────────────────────────────────────────────────────────────

program
  .command("store <file>")
  .description("Save a marker to local storage")
  .option("--dir <path>", "Storage directory", "./exit-markers")
  .action((file, opts) => {
    const marker = JSON.parse(readFileSync(file, "utf-8")) as ExitMarker;
    const path = storageSave(marker, opts.dir);
    console.log(`Saved to ${path}`);
  });

// ─── exit list ───────────────────────────────────────────────────────────────

program
  .command("list")
  .description("List stored markers")
  .option("--dir <path>", "Storage directory", "./exit-markers")
  .action((opts) => {
    const ids = storageList(opts.dir);
    if (ids.length === 0) {
      console.log("No markers found.");
    } else {
      for (const id of ids) console.log(id);
    }
  });

// ─── exit redact ─────────────────────────────────────────────────────────────

program
  .command("redact <file>")
  .description("Create a redacted version of a marker")
  .requiredOption("--fields <fields>", "Comma-separated fields to redact")
  .action((file, opts) => {
    const marker = JSON.parse(readFileSync(file, "utf-8")) as ExitMarker;
    const fields = (opts.fields as string).split(",").map((f: string) => f.trim());
    const redacted = redactMarker(marker, fields);
    process.stdout.write(JSON.stringify(redacted, null, 2) + "\n");
  });

program.parse();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHexOrBase64(s: string): Uint8Array {
  if (/^[0-9a-fA-F]+$/.test(s)) {
    const bytes = new Uint8Array(s.length / 2);
    for (let i = 0; i < s.length; i += 2) bytes[i / 2] = parseInt(s.slice(i, i + 2), 16);
    return bytes;
  }
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

function parseExitType(s: string): ExitType {
  const map: Record<string, ExitType> = {
    voluntary: ExitType.Voluntary,
    forced: ExitType.Forced,
    emergency: ExitType.Emergency,
  };
  if (!map[s]) throw new Error(`Invalid exit type: ${s}. Use: voluntary, forced, emergency`);
  return map[s];
}

function parseExitStatus(s: string): ExitStatus {
  const map: Record<string, ExitStatus> = {
    good_standing: ExitStatus.GoodStanding,
    disputed: ExitStatus.Disputed,
    unverified: ExitStatus.Unverified,
  };
  if (!map[s]) throw new Error(`Invalid status: ${s}. Use: good_standing, disputed, unverified`);
  return map[s];
}
