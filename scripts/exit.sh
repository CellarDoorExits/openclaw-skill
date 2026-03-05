#!/bin/bash
# 𓉸 Cellar Door — Create a signed EXIT marker
# Usage: exit.sh <origin-uri> [voluntary|forced|emergency]
set -euo pipefail

ORIGIN="${1:?Usage: exit.sh <origin-uri> [voluntary|forced|emergency]}"
TYPE="${2:-voluntary}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$SCRIPT_DIR/.."

# Install if needed
if [ ! -d "$PKG_DIR/node_modules/cellar-door-exit" ]; then
  npm install --prefix "$PKG_DIR" cellar-door-exit cellar-door-entry >/dev/null 2>&1
fi

node -e "
const { quickExit, ExitType, toJSON } = require('cellar-door-exit');

const typeMap = {
  voluntary: ExitType.Voluntary,
  forced: ExitType.Forced,
  emergency: ExitType.Emergency,
};

const origin = process.argv[1];
const exitType = typeMap[process.argv[2]] || ExitType.Voluntary;

const { marker, identity } = quickExit(origin, { exitType });

// Output the signed marker
console.log(toJSON(marker));

// Log identity info to stderr for reference
console.error('𓉸 EXIT marker created');
console.error('  Subject: ' + identity.did);
console.error('  Origin:  ' + origin);
console.error('  Type:    ' + marker.exitType);
" "$ORIGIN" "$TYPE"
