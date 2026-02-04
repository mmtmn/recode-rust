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


def validate_code(language_slug: str, code: str) -> List[str]:
    if not code.strip():
        return ["Code is empty."]

    if language_slug == "python":
        return _check_python_syntax(code)

    errors = _check_balanced_pairs(code)
    if errors:
        return errors

    if language_slug == "sql":
        upper = code.upper()
        if not any(keyword in upper for keyword in ["SELECT", "INSERT", "UPDATE", "DELETE"]):
            return ["SQL should include a core statement like SELECT or INSERT."]
        if not code.strip().endswith(";"):
            return ["SQL statements should end with a semicolon."]

    return []
