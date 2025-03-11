# authentication/tests/test_auth.py

import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

pytestmark = pytest.mark.django_db  # Each test runs with a fresh test database

@pytest.fixture
def api_client():
    return APIClient()

def test_registration(api_client):
    url = reverse('rest_register')  # /api/auth/registration/
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password1": "TestPass123!",
        "password2": "TestPass123!"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 201
    # Should contain "access" and "refresh" if using JWT
    assert "access" in response.data
    assert "refresh" in response.data

def test_login(api_client):
    # Create user first
    User.objects.create_user(
        username="loginuser",
        email="loginuser@example.com",
        password="TestPass123!"
    )
    url = reverse('rest_login')  # /api/auth/login/
    data = {
        "email": "loginuser@example.com",
        "password": "TestPass123!"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data

def test_password_reset(api_client):
    User.objects.create_user(
        username="resetuser",
        email="reset@example.com",
        password="ResetPass123!"
    )
    url = reverse('rest_password_reset')  # /api/auth/password/reset/
    data = {"email": "reset@example.com"}
    response = api_client.post(url, data, format='json')
    assert response.status_code == 200
    # Normally you'd parse the email to confirm the token, but this is enough for a basic test.
