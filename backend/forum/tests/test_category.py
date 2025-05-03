from django.contrib.auth import get_user_model
from forum.models import Category, Topic
import pytest
from rest_framework import status
from forum.models import Category
from django.urls import reverse
from forum.models import Category


@pytest.mark.django_db
def test_user_with_no_perm_cant_create_category(check_access_denied, user_without_perm):
    """
    Verify that a user without 'add_category' permission cannot create a category.
    """
    response = check_access_denied(
        user_without_perm, "categories-list", "post")

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert not Category.objects.all().exists()


def test_user_with_perm_can_create_category(api_client, user_with_perm):
    """
    Verify that a user with 'add_category' permission can create a category.
    """
    user = user_with_perm("add_category")

    url = reverse("categories-list")  # or your actual endpoint name
    data = {
        "name": "test_category",
        "slug": "test-category",
        "description": "Technology related discussions"
    }

    response = api_client(user).post(url, data, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert Category.objects.filter(name="test_category").exists()


@pytest.mark.django_db
def test_user_with_perm_can_edit_category(api_client, user_with_perm):
    """
    Verify that a user with 'change_category' permission can update a category.
    """
    user = user_with_perm("change_category")
    category = Category.objects.create(
        name="Old Name", slug="old-name", description="Old description")
    url = reverse("categories-detail", kwargs={"pk": category.pk})
    data = {"name": "Updated Name", "description": "Updated description"}

    response = api_client(user).patch(url, data, format="json")

    category.refresh_from_db()
    assert response.status_code == status.HTTP_200_OK
    assert category.name == "Updated Name"
    assert category.description == "Updated description"


@pytest.mark.django_db
def test_user_with_perm_can_delete_category(api_client, user_with_perm):
    """
    Verify that a user with 'delete_category' permission can delete a category.
    """
    user = user_with_perm("delete_category")
    category = Category.objects.create(
        name="ToDelete", slug="to-delete", description="Temp")

    url = reverse("categories-detail", kwargs={"pk": category.pk})
    response = api_client(user).delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Category.objects.filter(pk=category.pk).exists()


@pytest.mark.django_db
def test_everybody_can_see_category_list(api_client):
    """
    Verify that any user, even without permissions, can list categories.
    """
    Category.objects.create(
        name="Public", slug="public", description="Visible")
    Category.objects.create(name="Another", slug="another",
                            description="Another category")

    url = reverse("categories-list")
    response = api_client().get(url)

    # Handle pagination if enabled
    response_data = response.data.get("results", response.data)

    # Explicitly order the queryset by name in the test
    categories = Category.objects.order_by("name")
    assert response.status_code == status.HTTP_200_OK
    assert len(response_data) == categories.count()


User = get_user_model()


@pytest.mark.django_db
def test_category_detail_includes_its_topics(api_client):
    user = User.objects.create_user(username="user", password="pass")
    category = Category.objects.create(name="General", slug="general")

    Topic.objects.create(title="A", content="1",
                         author=user, category=category)
    Topic.objects.create(title="B", content="2",
                         author=user, category=category)

    url = reverse("categories-detail", kwargs={"pk": category.pk})
    response = api_client().get(url)

    assert response.status_code == 200
    assert "topics" in response.data
    assert len(response.data["topics"]) == 2

# TODO: user_with_no_perm_cant_edit_category
# TODO: user_with_no_perm_cant_delete_category
# TODO: #user_with_perm_can_delete_category_and(_preserve_threads OR delete_threads)
# TODO: #user_with_perm_can_(add,remove,change)_thread_to_category
# TODO: make category simpler by having only name and description
# TODO: nested categories
