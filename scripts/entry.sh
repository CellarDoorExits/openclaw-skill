#!/bin/bash
# Usage: entry.sh <exit-marker.json> <destination-uri>
# Verifies an EXIT marker and creates a linked ENTRY/arrival record.
# Since cellar-door-entry is not yet on npm, this uses cellar-door-exit
# to verify the EXIT marker and constructs an ENTRY record.
set -euo pipefail

EXIT_MARKER="${1:?Usage: entry.sh <exit-marker.json> <destination-uri>}"
DESTINATION="${2:?Usage: entry.sh <exit-marker.json> <destination-uri>}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$SCRIPT_DIR/.."

# Install if needed
if [ ! -d "$PKG_DIR/node_modules/cellar-door-exit" ]; then
  npm install --prefix "$PKG_DIR" cellar-door-exit >/dev/null 2>&1
fi

node -e "
const { quickVerify, quickExit, generateIdentity, toJSON } = require('$PKG_DIR/node_modules/cellar-door-exit/dist/index.cjs');
const fs = require('fs');
const crypto = require('crypto');

const exitJson = fs.readFileSync(process.argv[1], 'utf8');
const destination = process.argv[2];

// 1. Verify the EXIT marker
const vResult = quickVerify(exitJson);
if (!vResult.valid) {
  console.error('✗ EXIT marker is INVALID:', vResult.errors);
  process.exit(1);
}

const exitMarker = JSON.parse(exitJson);

// 2. Create ENTRY record linked to this EXIT
const entry = {
  '@context': 'https://cellar-door.org/entry/v1',
  id: 'urn:entry:' + crypto.randomBytes(32).toString('hex'),
  subject: exitMarker.subject,
  origin: exitMarker.origin,
  destination: destination,
  exitMarkerId: exitMarker.id,
  timestamp: new Date().toISOString(),
  status: 'admitted',
  exitVerified: true
};

console.log(JSON.stringify(entry, null, 2));
" "$EXIT_MARKER" "$DESTINATION"
