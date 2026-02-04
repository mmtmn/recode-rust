import re
import shutil
import subprocess
import sys
import tempfile
from typing import List, Tuple


BRACKET_PAIRS: List[Tuple[str, str]] = [
    ("(", ")"),
    ("{", "}"),
    ("[", "]"),
]


def _check_balanced_pairs(code: str) -> List[str]:
    stack: List[str] = []
    opening = {pair[0]: pair[1] for pair in BRACKET_PAIRS}
    closing = {pair[1]: pair[0] for pair in BRACKET_PAIRS}

    for char in code:
        if char in opening:
            stack.append(char)
        elif char in closing:
            if not stack or stack[-1] != closing[char]:
                return ["Unbalanced brackets or braces."]
            stack.pop()

    if stack:
        return ["Unbalanced brackets or braces."]

    return []


def _check_python_syntax(code: str) -> List[str]:
    try:
        compile(code, "<submission>", "exec")
    except SyntaxError as exc:
        return [f"Python syntax error on line {exc.lineno}: {exc.msg}"]
    return []


def _strip_comment_only_lines(language_slug: str, code: str) -> str:
    if language_slug == "python":
        prefix = "#"
    elif language_slug == "sql":
        prefix = "--"
    else:
        prefix = "//"
    cleaned_lines = []
    for line in code.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith(prefix):
            continue
        cleaned_lines.append(line)
    return "\n".join(cleaned_lines).strip()


def _parse_expected_output(tests: str) -> tuple[bool, List[str]]:
    if "Expected output" not in tests:
        return False, []
    strict = "include" not in tests.lower()
    parts = tests.split(":", 1)
    if len(parts) < 2:
        return False, []
    expected = parts[1].strip()
    if not expected:
        return False, []
    if strict:
        return True, [expected]
    tokens = re.split(r",|and", expected)
    cleaned = [token.strip() for token in tokens if token.strip()]
    return False, cleaned


def _runtime_error_message(language_slug: str) -> str:
    install = {
        "python": "Python",
        "javascript": "Node.js",
        "typescript": "Node.js + ts-node or TypeScript (tsc)",
        "java": "JDK (javac + java)",
        "cpp": "g++",
        "csharp": "dotnet SDK or csc + runtime",
        "go": "Go toolchain",
        "rust": "Rust toolchain (rustc)",
        "sql": "sqlite3 CLI",
    }
    return f"Missing runtime for {language_slug}. Install {install.get(language_slug, 'the language runtime')}."


def _run_command(command: List[str], cwd: str) -> tuple[int, str, str]:
    result = subprocess.run(
        command,
        cwd=cwd,
        capture_output=True,
        text=True,
        timeout=4,
    )
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def _run_code(language_slug: str, code: str) -> tuple[bool, str, str]:
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            if language_slug == "python":
                file_path = f"{tmpdir}/main.py"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                returncode, out, err = _run_command([sys.executable, file_path], tmpdir)
                return returncode == 0, out, err

            if language_slug == "javascript":
                if not shutil.which("node"):
                    return False, "", _runtime_error_message(language_slug)
                file_path = f"{tmpdir}/main.js"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                returncode, out, err = _run_command(["node", file_path], tmpdir)
                return returncode == 0, out, err

            if language_slug == "typescript":
                file_path = f"{tmpdir}/main.ts"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                if shutil.which("ts-node"):
                    returncode, out, err = _run_command(["ts-node", file_path], tmpdir)
                    return returncode == 0, out, err
                if shutil.which("tsc") and shutil.which("node"):
                    compile_code, _, compile_err = _run_command(["tsc", file_path], tmpdir)
                    if compile_code != 0:
                        return False, "", compile_err
                    returncode, out, err = _run_command(["node", f"{tmpdir}/main.js"], tmpdir)
                    return returncode == 0, out, err
                return False, "", _runtime_error_message(language_slug)

            if language_slug == "java":
                if not shutil.which("javac") or not shutil.which("java"):
                    return False, "", _runtime_error_message(language_slug)
                file_path = f"{tmpdir}/Main.java"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                compile_code, _, compile_err = _run_command(["javac", file_path], tmpdir)
                if compile_code != 0:
                    return False, "", compile_err
                returncode, out, err = _run_command(["java", "Main"], tmpdir)
                return returncode == 0, out, err

            if language_slug == "cpp":
                if not shutil.which("g++"):
                    return False, "", _runtime_error_message(language_slug)
                file_path = f"{tmpdir}/main.cpp"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                compile_code, _, compile_err = _run_command(["g++", "-std=c++17", file_path, "-o", "main"], tmpdir)
                if compile_code != 0:
                    return False, "", compile_err
                returncode, out, err = _run_command([f"{tmpdir}/main"], tmpdir)
                return returncode == 0, out, err

            if language_slug == "csharp":
                file_path = f"{tmpdir}/Program.cs"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                if shutil.which("csc"):
                    compile_code, _, compile_err = _run_command(["csc", file_path], tmpdir)
                    if compile_code != 0:
                        return False, "", compile_err
                    if shutil.which("mono"):
                        returncode, out, err = _run_command(["mono", f"{tmpdir}/Program.exe"], tmpdir)
                        return returncode == 0, out, err
                    if shutil.which("dotnet"):
                        returncode, out, err = _run_command(["dotnet", f"{tmpdir}/Program.exe"], tmpdir)
                        return returncode == 0, out, err
                    return False, "", _runtime_error_message(language_slug)
                return False, "", _runtime_error_message(language_slug)

            if language_slug == "go":
                if not shutil.which("go"):
                    return False, "", _runtime_error_message(language_slug)
                file_path = f"{tmpdir}/main.go"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                returncode, out, err = _run_command(["go", "run", file_path], tmpdir)
                return returncode == 0, out, err

            if language_slug == "rust":
                if not shutil.which("rustc"):
                    return False, "", _runtime_error_message(language_slug)
                file_path = f"{tmpdir}/main.rs"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                compile_code, _, compile_err = _run_command(["rustc", file_path, "-o", "main"], tmpdir)
                if compile_code != 0:
                    return False, "", compile_err
                returncode, out, err = _run_command([f"{tmpdir}/main"], tmpdir)
                return returncode == 0, out, err

            if language_slug == "sql":
                if not shutil.which("sqlite3"):
                    return False, "", _runtime_error_message(language_slug)
                file_path = f"{tmpdir}/main.sql"
                with open(file_path, "w", encoding="utf-8") as handle:
                    handle.write(code)
                returncode, out, err = _run_command(["sqlite3", ":memory:", f".read {file_path}"], tmpdir)
                return returncode == 0, out, err

            return False, "", _runtime_error_message(language_slug)
    except FileNotFoundError:
        return False, "", _runtime_error_message(language_slug)
    except subprocess.TimeoutExpired:
        return False, "", "Execution timed out."


def validate_code(language_slug: str, code: str, solution_code: str, tests: str) -> List[str]:
    if not code.strip():
        return ["Code is empty."]

    cleaned = _strip_comment_only_lines(language_slug, code)
    if not cleaned:
        return ["Please write code, not just the prompt."]
    if len(cleaned.strip()) < 3:
        return ["Please write a complete statement, not a single character."]

    if language_slug == "python":
        syntax_errors = _check_python_syntax(cleaned)
        if syntax_errors:
            return syntax_errors

    errors = _check_balanced_pairs(cleaned)
    if errors:
        return errors

    success, stdout, _stderr = _run_code(language_slug, cleaned)
    if not success:
        return ["Runtime error. Check your syntax and try again."]

    strict, expected_tokens = _parse_expected_output(tests)
    if not expected_tokens:
        return []

    if strict:
        return [] if stdout.strip() == expected_tokens[0].strip() else ["Output did not match expected result."]

    for token in expected_tokens:
        if token not in stdout:
            return ["Output did not include expected values."]
    return []
