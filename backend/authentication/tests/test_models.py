# your_app/tests/test_models.py
import pytest
from authentication.factories import UserFactory
from django.contrib.auth import get_user_model


User = get_user_model()

@pytest.mark.django_db
def test_create_user():
    """Test creating a user with minimal information."""
    user = UserFactory(username="testuser", email="testuser@example.com")
    assert user.username == "testuser"
    assert user.email == "testuser@example.com"
    assert user.is_active