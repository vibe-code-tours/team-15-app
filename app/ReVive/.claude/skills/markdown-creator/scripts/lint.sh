#!/usr/bin/env bash
# Lint Markdown against the markdown-creator house style.
# Usage: bash lint.sh <file-or-glob> [more...]
# Downloads markdownlint-cli2 via npx on first run; no global install needed.
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: bash lint.sh <file.md> [more.md ...]" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

npx --yes markdownlint-cli2 --config "${SCRIPT_DIR}/.markdownlint-cli2.jsonc" "$@"
