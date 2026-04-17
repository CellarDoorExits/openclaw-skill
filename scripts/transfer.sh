#!/bin/bash
# 𓉸 Cellar Door — Verify a full passage (EXIT → ENTRY)
# Usage: transfer.sh <exit-marker.json> <entry-marker.json>
# Verifies both signatures, subject continuity, and departure linkage.
set -euo pipefail

EXIT_FILE="${1:?Usage: transfer.sh <exit-marker.json> <entry-marker.json>}"
ENTRY_FILE="${2:?Usage: transfer.sh <exit-marker.json> <entry-marker.json>}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$SCRIPT_DIR/.."

if [ ! -d "$PKG_DIR/node_modules/cellar-door-entry" ]; then
  npm install --prefix "$PKG_DIR" cellar-door-exit cellar-door-entry >/dev/null 2>&1
fi

node -e "
const fs = require('fs');
const { fromJSON } = require('cellar-door-exit');
const { verifyTransfer } = require('cellar-door-entry');

const exitJson = fs.readFileSync(process.argv[1], 'utf8');
const entryJson = fs.readFileSync(process.argv[2], 'utf8');

const exitMarker = fromJSON(exitJson);
const arrivalMarker = JSON.parse(entryJson);

const record = verifyTransfer(exitMarker, arrivalMarker);

if (record.verified) {
  console.log('𓉸 PASSAGE VERIFIED');
  console.log('  Subject:       ' + record.exit.subject);
  console.log('  From:          ' + record.exit.origin);
  console.log('  To:            ' + record.arrival.destination);
  console.log('  Exit Type:     ' + record.exit.exitType);
  console.log('  Transfer Time: ' + record.transferTime + 'ms');
  console.log('  Continuity:    ✓ ' + (record.continuity.valid ? 'verified' : 'failed'));
} else {
  console.error('✗ PASSAGE INVALID');
  record.errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
" "$EXIT_FILE" "$ENTRY_FILE"
