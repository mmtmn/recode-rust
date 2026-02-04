
def _get_python_lesson(client):
    languages = client.get("/api/languages").json()
    python = next(lang for lang in languages if lang["slug"] == "python")
    detail = client.get(f"/api/languages/{python['slug']}").json()
    return detail["lessons"][0]


def test_validate_challenge_success(client):
    lesson = _get_python_lesson(client)
    lesson_detail = client.get(f"/api/lessons/{lesson['id']}").json()
    challenge_id = lesson_detail["challenges"][0]["id"]

    response = client.post(
        f"/api/challenges/{challenge_id}/validate",
        json={"code": "print('hi')"},
    )
    assert response.status_code == 200
    assert response.json()["is_valid"] is True


def test_validate_challenge_empty(client):
    lesson = _get_python_lesson(client)
    lesson_detail = client.get(f"/api/lessons/{lesson['id']}").json()
    challenge_id = lesson_detail["challenges"][0]["id"]

    response = client.post(
        f"/api/challenges/{challenge_id}/validate",
        json={"code": ""},
    )
    assert response.status_code == 200
    assert response.json()["is_valid"] is False
    assert response.json()["errors"]
