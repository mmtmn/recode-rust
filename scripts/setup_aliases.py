#!/usr/bin/env python3
"""Create cross-platform shell aliases/functions for Recode dev commands."""

from __future__ import annotations

import argparse
import platform
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List

ROOT = Path(__file__).resolve().parents[1]
START_MARKER = "# >>> recode aliases >>>"
END_MARKER = "# <<< recode aliases <<<"


@dataclass(frozen=True)
class ProfileUpdate:
    path: Path
    changed: bool
    created: bool


def main() -> int:
    args = parse_args()
    os_name = detect_os()

    print("\n" + "=" * 72)
    print("Recode Alias Setup")
    print("=" * 72)
    print(f"Workspace : {ROOT}")
    print(f"OS        : {platform.system()} {platform.release()}")

    if os_name == "windows":
        updates = setup_windows_profiles(dry_run=args.dry_run)
        print_results(updates, dry_run=args.dry_run)
        print_windows_next_steps()
        return 0

    profiles = unix_profile_paths(shell=args.shell)
    if not profiles:
        print("No unix profile files selected. Nothing to do.")
        return 0

    updates = setup_unix_profiles(profiles, dry_run=args.dry_run)
    print_results(updates, dry_run=args.dry_run)
    print_unix_next_steps(profiles)
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create Recode aliases/functions for Linux, macOS, and Windows.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change without writing profile files.",
    )
    parser.add_argument(
        "--shell",
        choices=["all", "bash", "zsh"],
        default="all",
        help="Unix only: choose which shell profile(s) to update.",
    )
    return parser.parse_args()


def detect_os() -> str:
    system = platform.system().lower()
    if system.startswith("win"):
        return "windows"
    if system == "darwin":
        return "darwin"
    return "linux"


def unix_profile_paths(*, shell: str) -> List[Path]:
    home = Path.home()
    paths: List[Path] = []
    if shell in {"all", "bash"}:
        paths.append(home / ".bashrc")
    if shell in {"all", "zsh"}:
        paths.append(home / ".zshrc")
    return paths


def setup_unix_profiles(paths: Iterable[Path], *, dry_run: bool) -> List[ProfileUpdate]:
    block = unix_alias_block()
    return [upsert_profile_block(path, block, dry_run=dry_run) for path in paths]


def setup_windows_profiles(*, dry_run: bool) -> List[ProfileUpdate]:
    home = Path.home()
    profile_paths = [
        home / "Documents" / "PowerShell" / "Microsoft.PowerShell_profile.ps1",
        home / "Documents" / "WindowsPowerShell" / "Microsoft.PowerShell_profile.ps1",
    ]
    block = windows_alias_block()
    return [upsert_profile_block(path, block, dry_run=dry_run) for path in profile_paths]


def unix_alias_block() -> str:
    backend_dir = quote_sh(ROOT / "backend")
    frontend_dir = quote_sh(ROOT / "frontend")
    venv_python = quote_sh(ROOT / "backend" / ".venv" / "bin" / "python")
    return (
        f"{START_MARKER}\n"
        "reback() {\n"
        f"  cd {backend_dir} || return\n"
        f"  if [ -x {venv_python} ]; then\n"
        f"    {venv_python} -m uvicorn app.main:app --reload\n"
        "  elif command -v python3 >/dev/null 2>&1; then\n"
        "    python3 -m uvicorn app.main:app --reload\n"
        "  else\n"
        "    python -m uvicorn app.main:app --reload\n"
        "  fi\n"
        "}\n\n"
        "refront() {\n"
        f"  cd {frontend_dir} || return\n"
        "  npm run dev\n"
        "}\n"
        f"{END_MARKER}"
    )


def windows_alias_block() -> str:
    backend_dir = quote_ps(ROOT / "backend")
    frontend_dir = quote_ps(ROOT / "frontend")
    return (
        f"{START_MARKER}\n"
        "function reback {\n"
        f"    Set-Location -Path {backend_dir}\n"
        "    if (Test-Path '.\\.venv\\Scripts\\python.exe') {\n"
        "        & '.\\.venv\\Scripts\\python.exe' -m uvicorn app.main:app --reload\n"
        "    } elseif (Get-Command py -ErrorAction SilentlyContinue) {\n"
        "        py -m uvicorn app.main:app --reload\n"
        "    } else {\n"
        "        python -m uvicorn app.main:app --reload\n"
        "    }\n"
        "}\n\n"
        "function refront {\n"
        f"    Set-Location -Path {frontend_dir}\n"
        "    npm run dev\n"
        "}\n"
        f"{END_MARKER}"
    )


def upsert_profile_block(path: Path, block: str, *, dry_run: bool) -> ProfileUpdate:
    target = path.expanduser()
    created = not target.exists()
    current = target.read_text(encoding="utf-8") if target.exists() else ""
    newline = "\r\n" if "\r\n" in current else "\n"
    normalized_block = block.replace("\n", newline)
    updated = merge_block(current, normalized_block, newline=newline)
    changed = updated != current

    if changed and not dry_run:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(updated, encoding="utf-8")

    return ProfileUpdate(path=target, changed=changed, created=created)


def merge_block(current: str, block: str, *, newline: str) -> str:
    pattern = re.compile(rf"{re.escape(START_MARKER)}.*?{re.escape(END_MARKER)}\s*", re.DOTALL)
    replacement = f"{block}{newline}"
    if pattern.search(current):
        return pattern.sub(replacement, current, count=1)

    joiner = "" if not current or current.endswith(("\n", "\r\n")) else newline
    return f"{current}{joiner}{replacement}"


def quote_sh(path: Path) -> str:
    raw = str(path)
    return "'" + raw.replace("'", "'\"'\"'") + "'"


def quote_ps(path: Path) -> str:
    raw = str(path)
    return "'" + raw.replace("'", "''") + "'"


def print_results(updates: Iterable[ProfileUpdate], *, dry_run: bool) -> None:
    print("\nProfile updates:")
    for item in updates:
        if item.changed:
            action = "would update" if dry_run else ("created" if item.created else "updated")
        else:
            action = "already up to date"
        print(f"- {item.path}: {action}")


def print_unix_next_steps(paths: Iterable[Path]) -> None:
    print("\nAliases configured: reback, refront")
    print("Open a new terminal or source one of these files:")
    for path in paths:
        print(f"- source {path}")


def print_windows_next_steps() -> None:
    print("\nAliases configured: reback, refront")
    print("Restart PowerShell, or run:")
    print("- . $PROFILE")


if __name__ == "__main__":
    raise SystemExit(main())
