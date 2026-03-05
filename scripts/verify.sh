#!/bin/bash
# 𓉸 Cellar Door — Verify any marker's cryptographic signature
# Usage: verify.sh <marker.json>
# Works for both EXIT markers and ENTRY (arrival) markers.
set -euo pipefail

MARKER="${1:?Usage: verify.sh <marker.json>}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$SCRIPT_DIR/.."

if [ ! -d "$PKG_DIR/node_modules/cellar-door-exit" ]; then
  npm install --prefix "$PKG_DIR" cellar-door-exit cellar-door-entry >/dev/null 2>&1
fi

node -e "
const fs = require('fs');
const json = fs.readFileSync(process.argv[1], 'utf8');
const marker = JSON.parse(json);

// Detect marker type by context field
const context = marker['@context'] || '';
const isEntry = context.includes('entry') || marker.departureRef !== undefined;

if (isEntry) {
  // ENTRY (arrival) marker — use cellar-door-entry verification
  const { verifyArrivalMarker } = require('cellar-door-entry');
  const result = verifyArrivalMarker(marker);
  if (result.valid) {
    console.log('✓ VALID ENTRY marker');
    console.log('  Subject:       ' + marker.subject);
    console.log('  Destination:   ' + marker.destination);
    console.log('  Departure Ref: ' + marker.departureRef);
  } else {
    console.error('✗ INVALID ENTRY marker');
    result.errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  }
} else {
  // EXIT marker — use cellar-door-exit verification
  const { quickVerify } = require('cellar-door-exit');
  const result = quickVerify(json);
  if (result.valid) {
    console.log('✓ VALID EXIT marker');
    console.log('  Subject: ' + marker.subject);
    console.log('  Origin:  ' + marker.origin);
    console.log('  Type:    ' + marker.exitType);
    console.log('  Status:  ' + marker.status);
  } else {
    console.error('✗ INVALID EXIT marker');
    result.errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  }
}
" "$MARKER"
