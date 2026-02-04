from app.services.validation_service import validate_code


def test_python_valid():
    errors = validate_code("python", "print('hi')")
    assert errors == []


def test_python_invalid():
    errors = validate_code("python", "print('hi'")
    assert errors


def test_js_unbalanced():
    errors = validate_code("javascript", "function test() {")
    assert errors
