import pytest
from django.urls import reverse
from rest_framework import status
from forum.models import Post, Topic, Category
from django.contrib.auth import get_user_model




@pytest.mark.django_db
def test_guest_cant_create_post(api_client):
    url = reverse("posts-list")
    response = api_client().post(url, {"content": "Hello"}, format="json")
    assert response.status_code == 401

@pytest.mark.django_db
def test_user_can_create_post(api_client, user_without_perm):
    user = user_without_perm
    category = Category.objects.create(name="Q&A")
    topic = Topic.objects.create(title="How to DRF?", content="Help needed", author=user, category=category)

    url = reverse("posts-list")
    data = {"content": "Here's a solution", "topic": topic.id}
    response = api_client(user).post(url, data, format="json")

    assert response.status_code == 201
    assert response.data["content"] == "Here's a solution"
    assert response.data["author"] == user.id
    assert response.data["topic"] == topic.id


def test_post_requires_topic(api_client, user_without_perm):
    user = user_without_perm
    url = reverse("posts-list")
    response = api_client(user).post(url, {"content": "Missing topic"}, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "topic" in response.data


"""
TODO: IMPORTANT after user is created automatically get post(add,view) permissions 
OR maybe create a new Permission class for POSTViewSet it is currently working with ISAuthenticated permission
"""

#TODO: Add post editing & deletion
#TODO: After post is created, topic.last_activity should be updated
#TODO: test_user_cannot_edit_or_delete_others_topics permission: IsOwnerOrReadOnly
#TODO: test quoting
#TODO: add slug to post and it's serialiezr topic
#TODO: test_post_requires_topic
