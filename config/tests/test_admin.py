import pytest
from django.contrib.auth import get_user_model

User = get_user_model()  # Ensures we're using the correct user model

@pytest.mark.django_db
def test_admin_access(client):
    # Create a superuser using the correct User model
    admin_user = User.objects.create_superuser(
        username='admin',
        password='adminpass',
        email='admin@example.com'
    )

    # Use force_login to bypass password hashing in tests
    client.force_login(admin_user)

    # Access the Django Admin panel
    response = client.get('/admin/')

    # Assert that the admin page loads successfully (200 OK)
    assert response.status_code == 200
