import pytest
from django.urls import reverse
from forum.models import Tag
from core.utils import _get_results

@pytest.mark.django_db
def test_everybody_can_see_tag_list(api_client):
    # Setup
    Tag.objects.create(name="Python", slug="python")
    Tag.objects.create(name="Django", slug="django")

    url = reverse("tags-list")

    # Act
    response = api_client().get(url)

    # Assert
    assert response.status_code == 200

    # Normalize result list
    tags = _get_results(response)
    slugs = [tag["slug"] for tag in tags]

    assert "python" in slugs
    assert "django" in slugs