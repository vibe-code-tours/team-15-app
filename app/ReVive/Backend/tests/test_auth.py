def test_register(client):
    response = client.post("/api/auth/register", json={
        "name": "New User",
        "email": "new@example.com",
        "password": "securepassword123",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "accessToken" in data["data"]


def test_register_duplicate_email(client, test_user):
    response = client.post("/api/auth/register", json={
        "name": "Another User",
        "email": "test@example.com",
        "password": "securepassword123",
    })
    assert response.status_code == 409


def test_login_success(client, test_user):
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "accessToken" in data["data"]


def test_login_wrong_password(client, test_user):
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword",
    })
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    response = client.post("/api/auth/login", json={
        "email": "nobody@example.com",
        "password": "password123",
    })
    assert response.status_code == 401


def test_get_me(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["email"] == "test@example.com"
    assert data["data"]["name"] == "Test User"


def test_get_me_no_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
