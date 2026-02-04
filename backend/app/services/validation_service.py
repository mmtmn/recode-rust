import re
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


def _extract_expected_tokens(solution_code: str) -> List[str]:
    string_literals = re.findall(r"\"([^\"]+)\"|'([^']+)'", solution_code)
    strings = [value for pair in string_literals for value in pair if value]
    numbers = re.findall(r"\b\d+\b", solution_code)
    booleans = []
    if "true" in solution_code.lower():
        booleans.append("true")
    if "false" in solution_code.lower():
        booleans.append("false")
    return [*strings, *numbers, *booleans]


def _check_expected_tokens(code: str, tokens: List[str]) -> List[str]:
    missing = []
    lower_code = code.lower()
    for token in tokens:
        if token.isdigit():
            if re.search(rf"\b{re.escape(token)}\b", code) is None:
                missing.append(token)
        elif token in ["true", "false"]:
            if token not in lower_code:
                missing.append(token)
        else:
            if token not in code:
                missing.append(token)
    if missing:
        return [f"Missing expected value(s): {', '.join(missing)}."]
    return []


def validate_code(language_slug: str, code: str, solution_code: str) -> List[str]:
    if not code.strip():
        return ["Code is empty."]

    expected_tokens = _extract_expected_tokens(solution_code)

    if language_slug == "python":
        syntax_errors = _check_python_syntax(code)
        if syntax_errors:
            return syntax_errors
        token_errors = _check_expected_tokens(code, expected_tokens)
        if token_errors:
            return token_errors
        return []

    errors = _check_balanced_pairs(code)
    if errors:
        return errors

    token_errors = _check_expected_tokens(code, expected_tokens)
    if token_errors:
        return token_errors

    if language_slug == "sql":
        upper = code.upper()
        if not any(keyword in upper for keyword in ["SELECT", "INSERT", "UPDATE", "DELETE"]):
            return ["SQL should include a core statement like SELECT or INSERT."]
        if not code.strip().endswith(";"):
            return ["SQL statements should end with a semicolon."]

    return []
