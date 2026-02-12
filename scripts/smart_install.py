#!/usr/bin/env python3
"""Cross-platform smart installer and launcher for Recode."""

from __future__ import annotations

import argparse
import os
import platform
import re
import shlex
import shutil
import subprocess
import sys
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"
E2E_DIR = ROOT / "e2e"
MOBILE_DIR = ROOT / "mobile"

SEMVER_RE = re.compile(r"(\d+)\.(\d+)(?:\.(\d+))?")

RUNTIME_SPECS: Dict[str, Dict[str, object]] = {
    "python": {
        "label": "Python",
        "mode": "all",
        "commands": ["python"],
    },
    "javascript": {
        "label": "JavaScript (Node.js)",
        "mode": "all",
        "commands": ["node"],
    },
    "typescript": {
        "label": "TypeScript (ts-node or tsc)",
        "mode": "any",
        "commands": ["ts-node", "tsc"],
    },
    "java": {
        "label": "Java (javac + java)",
        "mode": "all",
        "commands": ["javac", "java"],
    },
    "cpp": {
        "label": "C++ (g++)",
        "mode": "all",
        "commands": ["g++"],
    },
    "csharp": {
        "label": "C# (dotnet or csc)",
        "mode": "any",
        "commands": ["dotnet", "csc"],
    },
    "go": {
        "label": "Go",
        "mode": "all",
        "commands": ["go"],
    },
    "rust": {
        "label": "Rust",
        "mode": "all",
        "commands": ["rustc"],
    },
    "sql": {
        "label": "SQL (sqlite3 CLI)",
        "mode": "all",
        "commands": ["sqlite3"],
    },
}


@dataclass
class SetupState:
    had_all_prereqs: bool = False
    performed_tool_install: bool = False
    mobile_enabled: bool = False
    flutter_ready: bool = False
    mobile_status: str = "skipped"
    runtime_statuses: Dict[str, bool] = field(default_factory=dict)
    runtime_install_attempted: bool = False
    backend_ready_before: bool = False
    frontend_ready_before: bool = False
    e2e_ready_before: bool = False
    mobile_ready_before: bool = False


@dataclass(frozen=True)
class RunOption:
    key: str
    label: str


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(line_buffering=True)

    args = parse_args()
    state = SetupState()

    os_name = detect_os()
    pm = detect_package_manager(os_name)

    print_header("Recode Smart Install")
    print(f"Workspace : {ROOT}")
    print(f"OS        : {platform.system()} {platform.release()}")
    print(f"Pkg mgr   : {pm or 'not detected'}")

    state.backend_ready_before = get_venv_python_path().exists()
    state.frontend_ready_before = (FRONTEND_DIR / "node_modules").exists()
    state.e2e_ready_before = (E2E_DIR / "node_modules").exists()
    state.mobile_ready_before = (MOBILE_DIR / ".dart_tool" / "package_config.json").exists()

    prereq_ok, tool_install_happened, flutter_available = ensure_prerequisites(
        os_name=os_name,
        package_manager=pm,
        dry_run=args.dry_run,
        setup_mobile=not args.no_mobile,
    )
    state.had_all_prereqs = prereq_ok
    state.performed_tool_install = tool_install_happened

    if not prereq_ok and not args.dry_run:
        print("\nSome required tools are still missing. Fix the warnings above and re-run the installer.")
        return 1

    runtime_statuses, runtime_installs = ensure_language_runtimes(
        os_name=os_name,
        package_manager=pm,
        dry_run=args.dry_run,
        skip_runtimes=args.skip_runtimes,
    )
    state.runtime_statuses = runtime_statuses
    state.runtime_install_attempted = runtime_installs
    state.performed_tool_install = state.performed_tool_install or runtime_installs

    if not setup_backend(args.dry_run):
        return 1
    if not setup_frontend(args.dry_run):
        return 1
    if not setup_e2e(args.dry_run, skip_playwright=args.skip_playwright):
        return 1

    state.mobile_enabled = not args.no_mobile
    if state.mobile_enabled:
        if not flutter_available:
            if args.dry_run:
                print("\nFlutter is unavailable in the current environment.")
                print("Showing planned mobile setup commands because this is a dry run.")
                setup_mobile(args.dry_run)
                state.mobile_status = "planned (Flutter missing in current env)"
            else:
                print("\nSkipping mobile dependency sync because Flutter is unavailable.")
                print("Tip: re-run with Flutter installed or use `--no-mobile`.")
                state.mobile_status = "skipped (Flutter missing)"
        else:
            state.flutter_ready = setup_mobile(args.dry_run)
            state.mobile_status = "ready" if state.flutter_ready else "setup failed"
    else:
        print("\nMobile setup skipped (`--no-mobile`).")
        state.mobile_status = "skipped (--no-mobile)"

    print_summary(state)

    choice = choose_run_option(
        dry_run=args.dry_run,
        selected=args.run,
        non_interactive=args.yes,
        allow_mobile=state.mobile_enabled and (state.flutter_ready or args.dry_run or flutter_available),
    )

    if not choice or choice == "none":
        print("\nSetup complete. No runtime command selected.")
        return 0

    return launch(choice=choice, dry_run=args.dry_run)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Smart installer for Recode (Linux, macOS, Windows).")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned actions without executing commands.",
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Non-interactive mode. Skip prompts.",
    )
    parser.add_argument(
        "--no-mobile",
        action="store_true",
        help="Skip Flutter setup and mobile dependency install.",
    )
    parser.add_argument(
        "--skip-playwright",
        action="store_true",
        help="Skip Playwright browser installation step.",
    )
    parser.add_argument(
        "--skip-runtimes",
        action="store_true",
        help="Skip language runtime verification and auto-install attempts.",
    )
    parser.add_argument(
        "--run",
        choices=[
            "none",
            "backend",
            "frontend",
            "fullstack",
            "backend-test",
            "frontend-test",
            "e2e-test",
            "mobile-test",
        ],
        default=None,
        help="Launch a command after setup.",
    )
    return parser.parse_args()


def print_header(title: str) -> None:
    print(f"\n{'=' * 72}")
    print(title)
    print(f"{'=' * 72}\n")


def detect_os() -> str:
    system = platform.system().lower()
    if system.startswith("win"):
        return "windows"
    if system == "darwin":
        return "darwin"
    return "linux"


def detect_package_manager(os_name: str) -> Optional[str]:
    if os_name == "windows":
        for cmd, key in (("winget", "winget"), ("choco", "choco"), ("scoop", "scoop")):
            if command_exists(cmd):
                return key
        return None

    if os_name == "darwin":
        if command_exists("brew"):
            return "brew"
        return None

    for cmd, key in (
        ("apt-get", "apt"),
        ("dnf", "dnf"),
        ("yum", "yum"),
        ("pacman", "pacman"),
        ("zypper", "zypper"),
        ("brew", "brew"),
    ):
        if command_exists(cmd):
            return key
    return None


def command_exists(command: str) -> bool:
    return shutil.which(command) is not None


def run_command(
    command: Sequence[str],
    *,
    cwd: Optional[Path] = None,
    check: bool = True,
    dry_run: bool = False,
    capture: bool = False,
) -> subprocess.CompletedProcess:
    cmd_display = format_command(command)
    location = f" (cwd: {cwd})" if cwd else ""
    print(f"$ {cmd_display}{location}")

    if dry_run:
        return subprocess.CompletedProcess(command, 0, "", "")

    kwargs = {
        "cwd": str(cwd) if cwd else None,
        "check": False,
        "text": True,
    }
    if capture:
        kwargs.update({"stdout": subprocess.PIPE, "stderr": subprocess.PIPE})

    result = subprocess.run(list(command), **kwargs)

    if check and result.returncode != 0:
        raise RuntimeError(f"Command failed ({result.returncode}): {cmd_display}")

    return result


def format_command(command: Sequence[str]) -> str:
    if os.name == "nt":
        return subprocess.list2cmdline(list(command))
    return shlex.join(list(command))


def semver(text: str) -> Optional[Tuple[int, int, int]]:
    match = SEMVER_RE.search(text)
    if not match:
        return None
    major = int(match.group(1))
    minor = int(match.group(2))
    patch = int(match.group(3) or 0)
    return major, minor, patch


def version_string(version: Optional[Tuple[int, int, int]]) -> str:
    if not version:
        return "not found"
    return f"{version[0]}.{version[1]}.{version[2]}"


def get_command_version(command: Sequence[str]) -> Optional[Tuple[int, int, int]]:
    try:
        result = run_command(command, check=False, capture=True, dry_run=False)
    except FileNotFoundError:
        return None

    output = f"{result.stdout or ''}\n{result.stderr or ''}".strip()
    return semver(output)


def ensure_prerequisites(
    *,
    os_name: str,
    package_manager: Optional[str],
    dry_run: bool,
    setup_mobile: bool,
) -> Tuple[bool, bool, bool]:
    print_header("1) Checking Prerequisites")

    min_python = (3, 11, 0)
    current_python = sys.version_info[:3]
    python_ok = current_python >= min_python
    print(f"Python   : {version_string(current_python)} (required >= {version_string(min_python)})")
    if not python_ok:
        print("[WARN] Python 3.11+ is required.")

    node_version = get_command_version(["node", "--version"]) if command_exists("node") else None
    npm_version = get_command_version(["npm", "--version"]) if command_exists("npm") else None

    min_node = (18, 0, 0)
    min_npm = (9, 0, 0)
    node_ok = node_version is not None and node_version >= min_node
    npm_ok = npm_version is not None and npm_version >= min_npm

    print(f"Node.js  : {version_string(node_version)} (required >= {version_string(min_node)})")
    print(f"npm      : {version_string(npm_version)} (required >= {version_string(min_npm)})")

    tool_install_happened = False

    if (not node_ok or not npm_ok) and package_manager:
        print("\nTrying to install/upgrade Node.js + npm using your package manager...")
        tool_install_happened = True
        refresh_package_index(package_manager, os_name=os_name, dry_run=dry_run)
        install_success = install_tool(
            tool_name="node",
            package_manager=package_manager,
            os_name=os_name,
            dry_run=dry_run,
        )
        if not install_success and not dry_run:
            print("[WARN] Auto-install for Node.js/npm failed.")

        if not dry_run:
            node_version = get_command_version(["node", "--version"]) if command_exists("node") else None
            npm_version = get_command_version(["npm", "--version"]) if command_exists("npm") else None
            node_ok = node_version is not None and node_version >= min_node
            npm_ok = npm_version is not None and npm_version >= min_npm
            print(f"Node.js  : {version_string(node_version)}")
            print(f"npm      : {version_string(npm_version)}")
    elif (not node_ok or not npm_ok) and not package_manager:
        print("[WARN] Node.js/npm missing and no supported package manager was detected.")
        print("       Install Node.js manually: https://nodejs.org/en/download")

    flutter_ok = True
    if setup_mobile:
        flutter_version = get_command_version(["flutter", "--version"]) if command_exists("flutter") else None
        flutter_ok = flutter_version is not None
        print(f"Flutter  : {version_string(flutter_version)} (required for mobile)")

        if not flutter_ok and package_manager:
            print("\nTrying to install Flutter for mobile support...")
            tool_install_happened = True
            install_success = install_tool(
                tool_name="flutter",
                package_manager=package_manager,
                os_name=os_name,
                dry_run=dry_run,
            )
            if not install_success and os_name == "linux" and command_exists("snap"):
                print("Trying Linux snap fallback for Flutter...")
                install_success = install_with_snap("flutter", dry_run=dry_run)

            if not install_success and not dry_run:
                print("[WARN] Auto-install for Flutter failed.")

            if not dry_run:
                flutter_version = get_command_version(["flutter", "--version"]) if command_exists("flutter") else None
                flutter_ok = flutter_version is not None
                print(f"Flutter  : {version_string(flutter_version)}")

        if not flutter_ok and not dry_run:
            print("[WARN] Mobile setup may be skipped. Install Flutter manually: https://docs.flutter.dev/get-started/install")

    core_prereq_ok = python_ok and node_ok and npm_ok

    if core_prereq_ok:
        print("\nCore prerequisite check passed.")
    else:
        print("\nPrerequisite check has issues.")

    return core_prereq_ok, tool_install_happened, flutter_ok


def runtime_is_available(runtime_key: str) -> bool:
    if runtime_key == "python":
        return bool(sys.executable and Path(sys.executable).exists())

    spec = RUNTIME_SPECS[runtime_key]
    commands = [str(c) for c in spec["commands"]]
    mode = str(spec["mode"])

    if mode == "any":
        return any(command_exists(command) for command in commands)
    return all(command_exists(command) for command in commands)


def ensure_language_runtimes(
    *,
    os_name: str,
    package_manager: Optional[str],
    dry_run: bool,
    skip_runtimes: bool,
) -> Tuple[Dict[str, bool], bool]:
    print_header("2) Checking Validation Runtimes")

    statuses: Dict[str, bool] = {}
    install_attempted = False

    for runtime_key, spec in RUNTIME_SPECS.items():
        label = str(spec["label"])
        available = runtime_is_available(runtime_key)
        statuses[runtime_key] = available
        print(f"{label:<28}: {'ready' if available else 'missing'}")

        if available or skip_runtimes:
            continue

        if runtime_key in {"python", "javascript"}:
            # Core runtimes are managed by prerequisite checks.
            continue

        if runtime_key == "typescript":
            print("  -> trying to install global TypeScript toolchain...")
            install_attempted = True
            install_ok = install_typescript_tooling(os_name=os_name, dry_run=dry_run)
        else:
            if not package_manager:
                install_ok = False
            else:
                print(f"  -> trying to install {label} via {package_manager}...")
                install_attempted = True
                install_ok = install_tool(
                    tool_name=runtime_key,
                    package_manager=package_manager,
                    os_name=os_name,
                    dry_run=dry_run,
                )

        if dry_run:
            continue

        available_after = runtime_is_available(runtime_key)
        statuses[runtime_key] = available_after
        if available_after:
            print("  -> runtime ready")
        else:
            if not install_ok:
                print("  -> auto-install failed; manual setup may be required")
            else:
                print("  -> install ran but runtime is still missing")

    if skip_runtimes:
        print("\nRuntime auto-install skipped (`--skip-runtimes`).")

    missing = [key for key, ok in statuses.items() if not ok]
    if not missing:
        print("\nAll validation runtimes are available.")
    else:
        missing_labels = ", ".join(str(RUNTIME_SPECS[key]["label"]) for key in missing)
        print(f"\nSome optional validation runtimes are still missing: {missing_labels}")

    return statuses, install_attempted


def install_typescript_tooling(*, os_name: str, dry_run: bool) -> bool:
    commands: List[List[str]] = []
    if os_name != "windows" and command_exists("sudo"):
        commands.append(["sudo", "npm", "install", "-g", "typescript", "ts-node"])
    commands.append(["npm", "install", "-g", "typescript", "ts-node"])

    for command in commands:
        result = run_command(command, check=False, dry_run=dry_run)
        if result.returncode == 0:
            return True
    return False


def refresh_package_index(package_manager: str, *, os_name: str, dry_run: bool) -> None:
    sudo_prefix = privilege_prefix(os_name)

    try:
        if package_manager == "apt":
            run_command([*sudo_prefix, "apt-get", "update"], check=False, dry_run=dry_run)
        elif package_manager == "pacman":
            run_command([*sudo_prefix, "pacman", "-Sy"], check=False, dry_run=dry_run)
        elif package_manager == "zypper":
            run_command([*sudo_prefix, "zypper", "--non-interactive", "refresh"], check=False, dry_run=dry_run)
        elif package_manager == "brew":
            run_command(["brew", "update"], check=False, dry_run=dry_run)
    except Exception as exc:
        print(f"[WARN] Could not refresh package index: {exc}")


def privilege_prefix(os_name: str) -> List[str]:
    if os_name == "windows":
        return []
    geteuid = getattr(os, "geteuid", None)
    if callable(geteuid):
        try:
            if geteuid() == 0:
                return []
        except Exception:
            pass
    return ["sudo"] if command_exists("sudo") else []


def install_tool(*, tool_name: str, package_manager: str, os_name: str, dry_run: bool) -> bool:
    package_map: Dict[str, Dict[str, Iterable[str]]] = {
        "node": {
            "winget": ["OpenJS.NodeJS"],
            "choco": ["nodejs"],
            "scoop": ["nodejs"],
            "brew": ["node"],
            "apt": ["nodejs", "npm"],
            "dnf": ["nodejs", "npm"],
            "yum": ["nodejs", "npm"],
            "pacman": ["nodejs", "npm"],
            "zypper": ["nodejs", "npm"],
        },
        "flutter": {
            "winget": ["Flutter.Flutter"],
            "choco": ["flutter"],
            "scoop": ["flutter"],
            "brew": ["flutter"],
            "apt": ["flutter"],
            "dnf": ["flutter"],
            "yum": ["flutter"],
            "pacman": ["flutter"],
            "zypper": ["flutter"],
        },
        "java": {
            "winget": ["EclipseAdoptium.Temurin.17.JDK"],
            "choco": ["temurin17"],
            "scoop": ["openjdk17"],
            "brew": ["openjdk"],
            "apt": ["default-jdk"],
            "dnf": ["java-17-openjdk-devel"],
            "yum": ["java-17-openjdk-devel"],
            "pacman": ["jdk-openjdk"],
            "zypper": ["java-17-openjdk-devel"],
        },
        "cpp": {
            "choco": ["visualstudio2022buildtools"],
            "brew": ["gcc"],
            "apt": ["g++"],
            "dnf": ["gcc-c++"],
            "yum": ["gcc-c++"],
            "pacman": ["gcc"],
            "zypper": ["gcc-c++"],
        },
        "csharp": {
            "winget": ["Microsoft.DotNet.SDK.8"],
            "choco": ["dotnet-sdk"],
            "scoop": ["dotnet-sdk"],
            "brew": ["dotnet"],
            "apt": ["mono-devel"],
            "dnf": ["mono-devel"],
            "yum": ["mono-devel"],
            "pacman": ["mono"],
            "zypper": ["mono-devel"],
        },
        "go": {
            "winget": ["GoLang.Go"],
            "choco": ["golang"],
            "scoop": ["go"],
            "brew": ["go"],
            "apt": ["golang-go"],
            "dnf": ["golang"],
            "yum": ["golang"],
            "pacman": ["go"],
            "zypper": ["go"],
        },
        "rust": {
            "winget": ["Rustlang.Rustup"],
            "choco": ["rust"],
            "scoop": ["rustup"],
            "brew": ["rust"],
            "apt": ["rustc"],
            "dnf": ["rust"],
            "yum": ["rust"],
            "pacman": ["rust"],
            "zypper": ["rust"],
        },
        "sql": {
            "winget": ["SQLite.SQLite"],
            "choco": ["sqlite"],
            "scoop": ["sqlite"],
            "brew": ["sqlite"],
            "apt": ["sqlite3"],
            "dnf": ["sqlite"],
            "yum": ["sqlite"],
            "pacman": ["sqlite"],
            "zypper": ["sqlite3"],
        },
    }

    packages = list(package_map.get(tool_name, {}).get(package_manager, []))
    if not packages:
        return False

    sudo_prefix = privilege_prefix(os_name)

    success = True
    for package in packages:
        try:
            if package_manager == "winget":
                run_command(
                    [
                        "winget",
                        "upgrade",
                        "--id",
                        package,
                        "-e",
                        "--accept-package-agreements",
                        "--accept-source-agreements",
                    ],
                    check=False,
                    dry_run=dry_run,
                )
                result = run_command(
                    [
                        "winget",
                        "install",
                        "--id",
                        package,
                        "-e",
                        "--accept-package-agreements",
                        "--accept-source-agreements",
                    ],
                    check=False,
                    dry_run=dry_run,
                )
                success = success and result.returncode == 0

            elif package_manager == "choco":
                result = run_command(["choco", "upgrade", "-y", package], check=False, dry_run=dry_run)
                success = success and result.returncode == 0

            elif package_manager == "scoop":
                update_result = run_command(["scoop", "update", package], check=False, dry_run=dry_run)
                if update_result.returncode != 0:
                    install_result = run_command(["scoop", "install", package], check=False, dry_run=dry_run)
                    success = success and install_result.returncode == 0

            elif package_manager == "brew":
                listed = run_command(["brew", "list", "--versions", package], check=False, dry_run=dry_run)
                if listed.returncode == 0:
                    result = run_command(["brew", "upgrade", package], check=False, dry_run=dry_run)
                else:
                    result = run_command(["brew", "install", package], check=False, dry_run=dry_run)
                success = success and result.returncode == 0

            elif package_manager == "apt":
                result = run_command(
                    [*sudo_prefix, "apt-get", "install", "-y", package],
                    check=False,
                    dry_run=dry_run,
                )
                success = success and result.returncode == 0

            elif package_manager == "dnf":
                result = run_command(
                    [*sudo_prefix, "dnf", "install", "-y", package],
                    check=False,
                    dry_run=dry_run,
                )
                success = success and result.returncode == 0

            elif package_manager == "yum":
                result = run_command(
                    [*sudo_prefix, "yum", "install", "-y", package],
                    check=False,
                    dry_run=dry_run,
                )
                success = success and result.returncode == 0

            elif package_manager == "pacman":
                result = run_command(
                    [*sudo_prefix, "pacman", "-S", "--noconfirm", package],
                    check=False,
                    dry_run=dry_run,
                )
                success = success and result.returncode == 0

            elif package_manager == "zypper":
                result = run_command(
                    [*sudo_prefix, "zypper", "--non-interactive", "install", package],
                    check=False,
                    dry_run=dry_run,
                )
                success = success and result.returncode == 0

        except Exception as exc:
            print(f"[WARN] Failed to install {package}: {exc}")
            success = False

    return success


def install_with_snap(package: str, *, dry_run: bool) -> bool:
    sudo_prefix = privilege_prefix("linux")
    result = run_command(
        [*sudo_prefix, "snap", "install", package, "--classic"],
        check=False,
        dry_run=dry_run,
    )
    return result.returncode == 0


def get_venv_python_path() -> Path:
    venv = BACKEND_DIR / ".venv"
    if os.name == "nt":
        return venv / "Scripts" / "python.exe"
    return venv / "bin" / "python"


def setup_backend(dry_run: bool) -> bool:
    print_header("3) Backend Setup")

    venv_python = get_venv_python_path()

    try:
        if not venv_python.exists():
            run_command([sys.executable, "-m", "venv", str(BACKEND_DIR / ".venv")], cwd=BACKEND_DIR, dry_run=dry_run)

        run_command([str(venv_python), "-m", "pip", "install", "--upgrade", "pip"], cwd=BACKEND_DIR, dry_run=dry_run)
        run_command([str(venv_python), "-m", "pip", "install", "-r", "requirements.txt"], cwd=BACKEND_DIR, dry_run=dry_run)
    except Exception as exc:
        print(f"[ERROR] Backend setup failed: {exc}")
        return False

    print("Backend is ready.")
    return True


def setup_frontend(dry_run: bool) -> bool:
    print_header("4) Frontend Setup")
    try:
        run_command(["npm", "install"], cwd=FRONTEND_DIR, dry_run=dry_run)
    except Exception as exc:
        print(f"[ERROR] Frontend setup failed: {exc}")
        return False

    print("Frontend is ready.")
    return True


def setup_e2e(dry_run: bool, *, skip_playwright: bool) -> bool:
    print_header("5) E2E Setup")
    try:
        run_command(["npm", "install"], cwd=E2E_DIR, dry_run=dry_run)
        if skip_playwright:
            print("Playwright browser install skipped (`--skip-playwright`).")
        else:
            result = run_command(["npx", "playwright", "install"], cwd=E2E_DIR, check=False, dry_run=dry_run)
            if result.returncode != 0 and not dry_run:
                print("[WARN] Playwright browser install failed. E2E tests may need manual browser setup.")
    except Exception as exc:
        print(f"[ERROR] E2E setup failed: {exc}")
        return False

    print("E2E tooling is ready.")
    return True


def setup_mobile(dry_run: bool) -> bool:
    print_header("6) Mobile Setup")
    try:
        run_command(["flutter", "pub", "get"], cwd=MOBILE_DIR, dry_run=dry_run)
    except Exception as exc:
        print(f"[WARN] Mobile setup failed: {exc}")
        return False

    print("Mobile dependencies are ready.")
    return True


def print_summary(state: SetupState) -> None:
    print_header("Setup Summary")

    runtimes_all_ready = bool(state.runtime_statuses) and all(state.runtime_statuses.values())
    already_ready = (
        state.had_all_prereqs
        and not state.performed_tool_install
        and runtimes_all_ready
        and state.backend_ready_before
        and state.frontend_ready_before
        and state.e2e_ready_before
        and (not state.mobile_enabled or state.mobile_ready_before)
    )

    if already_ready:
        print("Everything was already set up. I verified it and refreshed dependencies.")
    else:
        print("Environment setup completed and dependencies were synced.")

    print("\nComponents:")
    print("- Backend: ready")
    print("- Frontend: ready")
    print("- E2E: ready")
    if state.mobile_enabled:
        print(f"- Mobile: {state.mobile_status}")
    else:
        print("- Mobile: skipped (--no-mobile)")

    print("\nValidation runtimes:")
    for runtime_key, spec in RUNTIME_SPECS.items():
        label = str(spec["label"])
        status = "ready" if state.runtime_statuses.get(runtime_key, False) else "missing"
        print(f"- {label}: {status}")


def choose_run_option(
    *,
    dry_run: bool,
    selected: Optional[str],
    non_interactive: bool,
    allow_mobile: bool,
) -> Optional[str]:
    options: List[RunOption] = [
        RunOption("none", "Finish without running anything"),
        RunOption("backend", "Run backend API (uvicorn --reload)"),
        RunOption("frontend", "Run frontend dev server (vite)"),
        RunOption("fullstack", "Run backend + frontend together"),
        RunOption("backend-test", "Run backend tests (pytest)"),
        RunOption("frontend-test", "Run frontend tests (vitest)"),
        RunOption("e2e-test", "Run end-to-end tests (playwright)"),
    ]

    if allow_mobile:
        options.append(RunOption("mobile-test", "Run mobile tests (flutter test)"))

    valid_keys = {opt.key for opt in options}
    if selected:
        if selected in valid_keys:
            return selected
        print(f"[WARN] Ignoring unsupported --run option: {selected}")

    if non_interactive:
        return "none"

    print_header("What Would You Like To Run?")
    for index, option in enumerate(options, start=1):
        print(f"{index}. {option.label}")

    while True:
        raw = input("\nSelect an option by number (default 1): ").strip()
        if not raw:
            return "none"
        if raw.isdigit():
            idx = int(raw)
            if 1 <= idx <= len(options):
                return options[idx - 1].key
        print("Please enter a valid option number.")


def launch(*, choice: str, dry_run: bool) -> int:
    venv_python = get_venv_python_path()

    commands = {
        "backend": ([str(venv_python), "-m", "uvicorn", "app.main:app", "--reload"], BACKEND_DIR),
        "frontend": (["npm", "run", "dev"], FRONTEND_DIR),
        "backend-test": ([str(venv_python), "-m", "pytest"], BACKEND_DIR),
        "frontend-test": (["npm", "run", "test"], FRONTEND_DIR),
        "e2e-test": (["npm", "run", "test"], E2E_DIR),
        "mobile-test": (["flutter", "test"], MOBILE_DIR),
    }

    if choice == "fullstack":
        backend_cmd, backend_cwd = commands["backend"]
        frontend_cmd, frontend_cwd = commands["frontend"]
        return run_parallel_processes(
            backend_cmd=backend_cmd,
            backend_cwd=backend_cwd,
            frontend_cmd=frontend_cmd,
            frontend_cwd=frontend_cwd,
            dry_run=dry_run,
        )

    command, cwd = commands[choice]
    print_header(f"Running: {choice}")

    if dry_run:
        print(f"$ {format_command(command)} (cwd: {cwd})")
        return 0

    try:
        result = subprocess.run(command, cwd=str(cwd), check=False)
        return result.returncode
    except KeyboardInterrupt:
        print("\nInterrupted.")
        return 130


def run_parallel_processes(
    *,
    backend_cmd: Sequence[str],
    backend_cwd: Path,
    frontend_cmd: Sequence[str],
    frontend_cwd: Path,
    dry_run: bool,
) -> int:
    print_header("Running: fullstack")
    print("Press Ctrl+C to stop both processes.")

    if dry_run:
        print(f"$ {format_command(backend_cmd)} (cwd: {backend_cwd})")
        print(f"$ {format_command(frontend_cmd)} (cwd: {frontend_cwd})")
        return 0

    backend_proc = subprocess.Popen(
        list(backend_cmd),
        cwd=str(backend_cwd),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )
    frontend_proc = subprocess.Popen(
        list(frontend_cmd),
        cwd=str(frontend_cwd),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    backend_thread = threading.Thread(target=pipe_output, args=(backend_proc, "backend"), daemon=True)
    frontend_thread = threading.Thread(target=pipe_output, args=(frontend_proc, "frontend"), daemon=True)
    backend_thread.start()
    frontend_thread.start()

    try:
        while True:
            backend_code = backend_proc.poll()
            frontend_code = frontend_proc.poll()

            if backend_code is not None or frontend_code is not None:
                if backend_code is not None and frontend_code is None:
                    print("\nBackend exited; stopping frontend...")
                    terminate_process(frontend_proc)
                if frontend_code is not None and backend_code is None:
                    print("\nFrontend exited; stopping backend...")
                    terminate_process(backend_proc)
                break

            time.sleep(0.3)

        backend_thread.join(timeout=1)
        frontend_thread.join(timeout=1)

        final_backend = backend_proc.poll() or 0
        final_frontend = frontend_proc.poll() or 0
        return final_backend if final_backend != 0 else final_frontend

    except KeyboardInterrupt:
        print("\nStopping backend and frontend...")
        terminate_process(backend_proc)
        terminate_process(frontend_proc)
        return 130


def pipe_output(process: subprocess.Popen, label: str) -> None:
    if process.stdout is None:
        return

    for line in process.stdout:
        print(f"[{label}] {line}", end="")


def terminate_process(process: subprocess.Popen) -> None:
    if process.poll() is not None:
        return

    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
