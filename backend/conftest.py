import pytest
from django.contrib.auth.models import User, Permission
from django.contrib.auth import get_user_model
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient

User = get_user_model()

@pytest.fixture
def api_client():
    """
    Returns an APIClient instance.
    Usage:
        api_client()  # anonymous
        api_client(user)  # JWT authenticated
        api_client(user, f=True)  # DRF force-authenticated
    """
    def get_client(user=None, **kwargs):
        force_auth = kwargs.pop("f", False)
        client = APIClient()

        if user:
            if force_auth:
                client.force_authenticate(user=user)
            else:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        return client

    return get_client
@pytest.fixture
def user_with_perm(db):
    """Returns a function that creates a user with a specific permission."""
    def _create_user(permission_name):
        user = User.objects.create_user(
            username=f"user_with_{permission_name}",
            email=f"{permission_name}@example.com",
            password="securepass"
        )

        # Get or create the requested permission
        permission = Permission.objects.get(codename=permission_name)
        
        # Assign permission directly to the user
        user.user_permissions.add(permission)
        
        return user

    return _create_user

@pytest.fixture
def user_without_perm(db):
    """
    Create a regular user without the 'add_group' permission.
    """
    user = User.objects.create_user(
        username="regular_user",
        password="regularpazss",
        email="regular@example.com"
    )
    return user




import logging
@pytest.fixture
def check_access_denied(api_client):
    """
    Returns a function that checks if a given user gets a 403 Forbidden response for a specific request.
    """

    def _check(user=user_without_perm, url_name="url", method="get", data=None, url_kwargs=None):
        """
        - `user`: The user to authenticate (can be a user with or without permissions).
        - `url_name`: The name of the URL to reverse (e.g., "groups-list").
        - `method`: The HTTP method as a string ("get", "post", "patch", etc.).
        - `data`: Optional request body for POST/PATCH/PUT requests.
        - `url_kwargs`: Optional kwargs to pass into `reverse()` (e.g., {'pk': 1} for detail views).
        """

        url = reverse(url_name, kwargs=url_kwargs or {})  # Handle detail views

        # # Make request as the specified user
        response = getattr(api_client(user), method)(url, data, format="json")

        # Assert that the response status is 403 Forbidden
        assert response.status_code == status.HTTP_403_FORBIDDEN, f"Expected 403 but got {response.status_code}"
        return response  # Return response in case additional assertions are needed

    return _check  # Return function for reuse