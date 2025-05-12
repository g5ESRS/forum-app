import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    """Fixture to return a rest_framework API client."""
    return APIClient()


@pytest.fixture
def user_without_permission(db):
    """
    Create a regular user without the 'auth.add_group' permission.
    """
    user = User.objects.create_user(
        username="regular_user",
        password="regularpass",
        email="regular@example.com"
    )
    return user


@pytest.fixture
def jwt_authenticated_client(api_client, user_without_permission):
    """
    Logs in the user via the JWT endpoint and attaches the token to the API client.
    Replaces `api_client.login(username="regular_user", password="regularpass")`.
    """
    # 1) Post to your JWT login endpoint (e.g. /api/auth/login/)
    login_url = reverse("rest_login")  # Adjust if yours is different
    data = {
        "email": "regular@example.com",
        "password": "regularpass"
    }
    response = api_client.post(login_url, data, format="json")

    # 2) Ensure it succeeded and a JWT token is returned
    assert response.status_code == 200, "JWT login failed"
    assert "access" in response.data, "No JWT token found in login response"

    # 3) Attach the JWT token to subsequent requests
    access_token = response.data["access"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    return api_client


@pytest.mark.django_db
def test_user_without_permission_cannot_create_group(jwt_authenticated_client):
    """
    Verify that a user lacking 'auth.add_group' permission cannot create a group (POST /groups/).
    """
    url = reverse("groups-list")
    data = {
        "name": "Should Fail Group",
        "permissions": []
    }
    response = jwt_authenticated_client.post(url, data, format="json")

    # Expect 403 Forbidden because the user does not have 'auth.add_group'
    assert response.status_code == status.HTTP_403_FORBIDDEN
