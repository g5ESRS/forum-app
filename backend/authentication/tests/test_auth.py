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

def test_invalid_login(api_client):
     
    User.objects.create_user(
        username="validuser",
        email="valid@example.com",
        password="ValidPass123!"
    )
    url = reverse('rest_login')
    data = {
        "email": "valid@example.com",
        "password": "WrongPassword123!"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 400
    data = {
        "email": "nonexistent@example.com",
        "password": "AnyPassword123!"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 400

def test_logout(api_client, test_user):
    # First login
    login_url = reverse('rest_login')
    login_data = {
        "email": "testuser@example.com",
        "password": "TestPass123!"
    }
    login_response = api_client.post(login_url, login_data, format='json')
    access_token = login_response.data["access"]
    
    # Set authentication header
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    # Logout
    url = reverse('rest_logout')
    response = api_client.post(url)
    assert response.status_code == 200
    
    # Try to access a protected endpoint
    url = reverse('rest_user_details')
    response = api_client.get(url)
    assert response.status_code == 401  # Should be unauthorized after logout

def test_registration_with_missing_data(api_client):
    url = reverse('rest_register')
    # Missing password2
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password1": "TestPass123!"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 400
    
    # Missing password1
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password2": "TestPass123!"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 400

def test_registration_with_invalid_password(api_client):
    url = reverse('rest_register')
    # Too short password
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password1": "short",
        "password2": "short"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 400

    # Common password
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password1": "password123",
        "password2": "password123"
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == 400