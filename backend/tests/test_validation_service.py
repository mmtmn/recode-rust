from app.services.validation_service import validate_code


def test_python_valid():
    errors = validate_code("python", "print('hi')", "print('hi')", "Expected output: hi")
    assert errors == []


def test_python_invalid():
    errors = validate_code("python", "print('hi'", "print('hi')", "Expected output: hi")
    assert errors


def test_js_requires_runtime():
    errors = validate_code("javascript", "console.log('hi');", "", "Expected output: hi")
    assert errors
