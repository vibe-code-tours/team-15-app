def test_create_pickup(client, auth_headers):
    response = client.post("/api/pickups/", json={
        "category": "Laptops",
        "device_name": "Old Dell Laptop",
        "quantity": 1,
        "condition": "working",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "123 Main St",
    }, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["category"] == "Laptops"
    assert data["data"]["deviceName"] == "Old Dell Laptop"
    assert data["data"]["status"] == "available"


def test_create_pickup_unauthorized(client):
    response = client.post("/api/pickups/", json={
        "category": "Laptops",
        "device_name": "Old Dell Laptop",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "123 Main St",
    })
    assert response.status_code == 401


def test_list_pickups(client, auth_headers):
    # Create a pickup first
    client.post("/api/pickups/", json={
        "category": "Phones",
        "device_name": "Old iPhone",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "456 Oak Ave",
    }, headers=auth_headers)

    response = client.get("/api/pickups/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["items"]) >= 1


def test_list_pickups_with_status_filter(client, auth_headers):
    # Create a pickup
    client.post("/api/pickups/", json={
        "category": "Tablets",
        "device_name": "iPad",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "789 Elm St",
    }, headers=auth_headers)

    # Filter by available status
    response = client.get("/api/pickups/?status=available", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]["items"]) >= 1

    # Filter by non-existent status
    response = client.get("/api/pickups/?status=cancelled", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()["data"]["items"]) == 0


def test_get_pickup_by_id(client, auth_headers):
    create_resp = client.post("/api/pickups/", json={
        "category": "Monitors",
        "device_name": "Dell Monitor",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "321 Pine Rd",
    }, headers=auth_headers)
    pickup_id = create_resp.json()["data"]["id"]

    response = client.get(f"/api/pickups/{pickup_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["deviceName"] == "Dell Monitor"


def test_complete_pickup(client, auth_headers):
    create_resp = client.post("/api/pickups/", json={
        "category": "Keyboards",
        "device_name": "Mechanical Keyboard",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "555 Maple Dr",
    }, headers=auth_headers)
    pickup_id = create_resp.json()["data"]["id"]

    response = client.patch(f"/api/pickups/{pickup_id}", json={
        "action": "complete",
    }, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Item picked up"


def test_cancel_pickup(client, auth_headers):
    create_resp = client.post("/api/pickups/", json={
        "category": "Printers",
        "device_name": "HP Printer",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "888 Cedar Ln",
    }, headers=auth_headers)
    pickup_id = create_resp.json()["data"]["id"]

    response = client.patch(f"/api/pickups/{pickup_id}", json={
        "action": "cancel",
    }, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Listing cancelled"


def test_delete_pickup(client, auth_headers):
    create_resp = client.post("/api/pickups/", json={
        "category": "Speakers",
        "device_name": "JBL Speaker",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "999 Birch Way",
    }, headers=auth_headers)
    pickup_id = create_resp.json()["data"]["id"]

    response = client.delete(f"/api/pickups/{pickup_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_search_pickups(client, auth_headers):
    # Create a pickup
    client.post("/api/pickups/", json={
        "category": "Laptops",
        "device_name": "MacBook Pro",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "123 Tech St",
    }, headers=auth_headers)

    # Search
    response = client.post("/api/search/", json={
        "filters": {"query": "MacBook"},
        "page": 1,
        "limit": 10,
    }, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


def test_search_stats(client, auth_headers):
    # Create a pickup
    client.post("/api/pickups/", json={
        "category": "Phones",
        "device_name": "Samsung Galaxy",
        "available_from": "2026-07-15", "available_to": "2026-07-20",
        "time_slot": "10:00-12:00",
        "address": "456 Mobile Ave",
    }, headers=auth_headers)

    response = client.get("/api/search/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "byStatus" in data
    assert "byCategory" in data
    assert data["totalPickups"] >= 1


def test_referral_get_code(client, auth_headers):
    response = client.get("/api/referrals/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "code" in data["data"]
    assert len(data["data"]["code"]) == 8
    assert "stats" in data["data"]
    assert "referralUrl" in data["data"]


def test_user_stats(client, auth_headers):
    response = client.get("/api/users/me/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "totalPickups" in data["data"]
    assert "totalReferrals" in data["data"]
    assert "totalPoints" in data["data"]


def test_admin_stats(client, admin_auth_headers):
    response = client.get("/api/admin/stats", headers=admin_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "totalPickups" in data["data"]
    assert "activeUsers" in data["data"]
    assert "totalCo2Saved" in data["data"]
