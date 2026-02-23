#!/bin/bash
# Usage: transfer.sh <exit-marker.json> <entry-marker.json>
# Verifies a full EXIT→ENTRY transfer: both markers valid, subjects match, timestamps ordered.
set -euo pipefail

EXIT_FILE="${1:?Usage: transfer.sh <exit-marker.json> <entry-marker.json>}"
ENTRY_FILE="${2:?Usage: transfer.sh <exit-marker.json> <entry-marker.json>}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$SCRIPT_DIR/.."

if [ ! -d "$PKG_DIR/node_modules/cellar-door-exit" ]; then
  npm install --prefix "$PKG_DIR" cellar-door-exit >/dev/null 2>&1
fi

node -e "
const fs = require('fs');
const { quickVerify } = require('$PKG_DIR/node_modules/cellar-door-exit/dist/index.cjs');

const exitJson = fs.readFileSync(process.argv[1], 'utf8');
const entryJson = fs.readFileSync(process.argv[2], 'utf8');
const exit = JSON.parse(exitJson);
const entry = JSON.parse(entryJson);

const errors = [];

// 1. Verify EXIT signature
const exitResult = quickVerify(exitJson);
if (!exitResult.valid) errors.push('EXIT marker signature invalid');

// 2. Verify ENTRY structure
if (!entry.id || !entry.subject || !entry.destination || !entry.exitMarkerId)
  errors.push('ENTRY record missing required fields');

// 3. Subject match
if (exit.subject !== entry.subject)
  errors.push('Subject mismatch: EXIT=' + exit.subject + ' ENTRY=' + entry.subject);

// 4. Link match
if (entry.exitMarkerId !== exit.id)
  errors.push('ENTRY does not reference this EXIT marker');

// 5. Timestamp ordering
if (new Date(entry.timestamp) <= new Date(exit.timestamp))
  errors.push('ENTRY timestamp must be after EXIT timestamp');

if (errors.length === 0) {
  console.log('✓ TRANSFER VALID');
  console.log('  Subject:     ' + exit.subject);
  console.log('  From:        ' + exit.origin);
  console.log('  To:          ' + entry.destination);
  console.log('  Exit Type:   ' + exit.exitType);
  console.log('  Status:      ' + exit.status);
} else {
  console.error('✗ TRANSFER INVALID');
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
" "$EXIT_FILE" "$ENTRY_FILE"
