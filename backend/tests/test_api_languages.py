
def test_list_languages(client):
    response = client.get("/api/languages")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    assert any(lang["slug"] == "python" for lang in data)


def test_language_detail(client):
    response = client.get("/api/languages/python")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "python"
    assert len(data["lessons"]) >= 4
