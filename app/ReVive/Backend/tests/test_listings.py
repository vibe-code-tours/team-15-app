import pytest


@pytest.fixture
def test_region(db_session):
    region = models.Region(city="Test City", postal_code="12345", country="US")
    db_session.add(region)
    db_session.commit()
    db_session.refresh(region)
    return region


@pytest.fixture
def test_category(db_session):
    category = models.Category(name="Electronics")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category


import models


def test_create_listing(client, auth_headers, test_region, test_category):
    response = client.post("/api/listings/", json={
        "category_id": str(test_category.id),
        "region_id": str(test_region.id),
        "title": "Old Laptop",
        "description": "Works fine, just upgraded",
        "brand": "Dell",
        "condition": "working",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Old Laptop"
    assert data["status"] == "available"


def test_create_listing_unauthorized(client, test_region, test_category):
    response = client.post("/api/listings/", json={
        "category_id": str(test_category.id),
        "region_id": str(test_region.id),
        "title": "Old Laptop",
        "condition": "working",
    })
    assert response.status_code == 401


def test_list_listings(client, auth_headers, test_region, test_category):
    # Create a listing first
    client.post("/api/listings/", json={
        "category_id": str(test_category.id),
        "region_id": str(test_region.id),
        "title": "Test Item",
        "condition": "working",
    }, headers=auth_headers)

    response = client.get("/api/listings/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


def test_get_listing(client, auth_headers, test_region, test_category):
    create_resp = client.post("/api/listings/", json={
        "category_id": str(test_category.id),
        "region_id": str(test_region.id),
        "title": "Get Me",
        "condition": "working",
    }, headers=auth_headers)
    listing_id = create_resp.json()["id"]

    response = client.get(f"/api/listings/{listing_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Get Me"


def test_update_listing(client, auth_headers, test_region, test_category):
    create_resp = client.post("/api/listings/", json={
        "category_id": str(test_category.id),
        "region_id": str(test_region.id),
        "title": "Original",
        "condition": "working",
    }, headers=auth_headers)
    listing_id = create_resp.json()["id"]

    response = client.put(f"/api/listings/{listing_id}", json={
        "title": "Updated",
    }, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated"


def test_delete_listing(client, auth_headers, test_region, test_category):
    create_resp = client.post("/api/listings/", json={
        "category_id": str(test_category.id),
        "region_id": str(test_region.id),
        "title": "Delete Me",
        "condition": "working",
    }, headers=auth_headers)
    listing_id = create_resp.json()["id"]

    response = client.delete(f"/api/listings/{listing_id}", headers=auth_headers)
    assert response.status_code == 204
