#!/bin/bash
# Usage: verify.sh <marker.json>
# Verifies the cryptographic signature of an EXIT or ENTRY marker.
set -euo pipefail

MARKER="${1:?Usage: verify.sh <marker.json>}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$SCRIPT_DIR/.."

if [ ! -d "$PKG_DIR/node_modules/cellar-door-exit" ]; then
  npm install --prefix "$PKG_DIR" cellar-door-exit >/dev/null 2>&1
fi

# Use CLI for EXIT markers (has proof field), JS for ENTRY records
node -e "
const fs = require('fs');
const json = fs.readFileSync(process.argv[1], 'utf8');
const marker = JSON.parse(json);

if (marker['@context'] && marker['@context'].includes('entry')) {
  // ENTRY record — check structural validity and exit link
  const ok = marker.id && marker.subject && marker.destination && marker.exitMarkerId && marker.exitVerified;
  if (ok) {
    console.log('✓ VALID ENTRY record');
    console.log('  Subject:     ' + marker.subject);
    console.log('  Origin:      ' + marker.origin);
    console.log('  Destination: ' + marker.destination);
    console.log('  Exit Link:   ' + marker.exitMarkerId);
  } else {
    console.error('✗ INVALID ENTRY record — missing required fields');
    process.exit(1);
  }
} else {
  // EXIT marker — cryptographic verification
  const { quickVerify } = require('$PKG_DIR/node_modules/cellar-door-exit/dist/index.cjs');
  const result = quickVerify(json);
  if (result.valid) {
    console.log('✓ VALID');
    console.log('  Subject: ' + marker.subject);
    console.log('  Origin:  ' + marker.origin);
    console.log('  Type:    ' + marker.exitType);
    console.log('  Status:  ' + marker.status);
  } else {
    console.error('✗ INVALID');
    console.error('  Errors: ' + JSON.stringify(result.errors));
    process.exit(1);
  }
}
" "$MARKER"
