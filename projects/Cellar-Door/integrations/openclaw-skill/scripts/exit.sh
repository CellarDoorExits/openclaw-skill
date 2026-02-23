#!/bin/bash
# Usage: exit.sh <origin-uri> [exit-type]
# Creates a signed EXIT marker and prints JSON to stdout.
# exit-type: voluntary (default), forced, emergency
set -euo pipefail

ORIGIN="${1:?Usage: exit.sh <origin-uri> [voluntary|forced|emergency]}"
TYPE="${2:-voluntary}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXIT_CLI="$SCRIPT_DIR/../node_modules/cellar-door-exit/dist/cli.js"

# Install if needed
if [ ! -f "$EXIT_CLI" ]; then
  npm install --prefix "$SCRIPT_DIR/.." cellar-door-exit >/dev/null 2>&1
fi

node "$EXIT_CLI" create --origin "$ORIGIN" --type "$TYPE" --sign 2>/dev/null
