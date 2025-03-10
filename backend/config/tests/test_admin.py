import pytest
from django.contrib.auth.models import User

@pytest.mark.django_db
def test_admin_access(client):
    # Create a superuser
    User.objects.create_superuser(username='admin', password='adminpass', email='admin@example.com')

    # Log in as the superuser
    client.login(username='admin', password='adminpass')

    # Attempt to access the admin page
    response = client.get('/admin/')

    # Check if the page loads successfully (200 OK)
    assert response.status_code == 200