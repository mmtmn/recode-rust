#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

is_sourced() {
  [[ "${BASH_SOURCE[0]}" != "${0}" ]]
}

finish() {
  local code="$1"
  if is_sourced; then
    return "$code"
  fi
  exit "$code"
}

if command -v python3 >/dev/null 2>&1; then
  python3 "$SCRIPT_DIR/setup_aliases.py" "$@"
elif command -v python >/dev/null 2>&1; then
  python "$SCRIPT_DIR/setup_aliases.py" "$@"
else
  echo "Python 3 is required to set up aliases." >&2
  finish 1
fi

if is_sourced; then
  if [ -f "$HOME/.bashrc" ]; then
    # If sourced, this updates aliases in the caller's current shell immediately.
    source "$HOME/.bashrc"
    echo "Loaded ~/.bashrc in the current shell."
  fi
else
  echo "Run 'source ~/.bashrc' to load aliases in this terminal."
fi

finish 0
