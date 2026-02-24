#!/bin/bash
# 𓉸 Cellar Door — Create a signed ENTRY (arrival) marker from an EXIT marker
# Usage: entry.sh <exit-marker.json> <destination-uri>
set -euo pipefail

EXIT_MARKER="${1:?Usage: entry.sh <exit-marker.json> <destination-uri>}"
DESTINATION="${2:?Usage: entry.sh <exit-marker.json> <destination-uri>}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$SCRIPT_DIR/.."

# Install if needed
if [ ! -d "$PKG_DIR/node_modules/cellar-door-entry" ]; then
  npm install --prefix "$PKG_DIR" cellar-door-exit cellar-door-entry >/dev/null 2>&1
fi

node -e "
const fs = require('fs');
const { quickEntry } = require('cellar-door-entry');

const exitJson = fs.readFileSync(process.argv[1], 'utf8');
const destination = process.argv[2];

const { arrivalMarker, exitMarker, continuity } = quickEntry(exitJson, destination);

// Output the signed arrival marker
console.log(JSON.stringify(arrivalMarker, null, 2));

// Log continuity info to stderr
console.error('𓉸 ENTRY marker created');
console.error('  Subject:       ' + exitMarker.subject);
console.error('  Destination:   ' + destination);
console.error('  Departure Ref: ' + arrivalMarker.departureRef);
console.error('  Continuity:    ' + (continuity.valid ? '✓ verified' : '✗ ' + continuity.errors.join(', ')));
" "$EXIT_MARKER" "$DESTINATION"
