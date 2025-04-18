import pytest
from django.urls import reverse
from forum.models import Topic, Category,Post
from django.contrib.auth import get_user_model


User = get_user_model()

def test_user_with_no_perm_cant_create_topic(check_access_denied, user_without_perm):
    response = check_access_denied(user_without_perm, "topics-list", "post")
    assert response.status_code == 403


@pytest.mark.django_db
def test_user_with_perm_can_create_topic(api_client, user_with_perm):
    user = user_with_perm("add_topic")
    category = Category.objects.create(name="General", slug="general")
    url = reverse("topics-list")
    
    data = {
        "title": "New Topic",
        "content": "Here is the content",
        "category_ref": category.slug
    }

    response = api_client(user).post(url, data, format="json")
    assert response.status_code == 201
    #assert topic.user is user

    # Fetch the created topic
    topic = Topic.objects.get(title="New Topic")
    assert Topic.objects.filter(title="New Topic").exists()
    
    # Assert that the topic's author is the user TODO:create a new test for this
    assert topic.author == user
    
    # Assert that the topic's category is the created category
    assert topic.category == category

@pytest.mark.django_db
def test_user_with_perm_can_edit_topic(api_client, user_with_perm):
    user = user_with_perm("change_topic")
    category = Category.objects.create(name="EditCat", slug="editcat")
    topic = Topic.objects.create(title="Old Title", content="Old", author=user, category=category)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client(user).patch(url, {"title": "Updated Title"}, format="json")

    topic.refresh_from_db()
    assert response.status_code == 200
    assert topic.title == "Updated Title"

@pytest.mark.django_db
def test_user_with_perm_can_delete_topic(api_client, user_with_perm):
    user = user_with_perm("delete_topic")
    category = Category.objects.create(name="DelCat", slug="delcat")
    topic = Topic.objects.create(title="To Delete", content="...", author=user, category=category)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client(user).delete(url)

    assert response.status_code == 204
    assert not Topic.objects.filter(pk=topic.pk).exists()

@pytest.mark.django_db
def test_everybody_can_see_topic_list(api_client):
    category = Category.objects.create(name="Public", slug="public")
    Topic.objects.create(title="Visible Topic", content="This is public", author=None, category=category)

    url = reverse("topics-list")

    response = api_client().get(url)

    assert response.status_code == 200
    assert any(topic["title"] == "Visible Topic" for topic in response.data["results"])


@pytest.mark.django_db
def test_everybody_can_see_topic_detail(api_client): #including posts
    # Setup
    user = User.objects.create_user(username="viewer", password="testpass")
    category = Category.objects.create(name="General", slug="general")
    topic = Topic.objects.create(title="Topic A", content="Start here", author=user, category=category)

    Post.objects.create(topic=topic, author=user, content="Post 1")
    Post.objects.create(topic=topic, author=user, content="Post 2")

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    
    # Act
    response = api_client().get(url)

    # Assert
    assert response.status_code == 200
    assert response.data["title"] == "Topic A"
    assert "posts" in response.data
    assert len(response.data["posts"]) == 2
    assert response.data["posts"][0]["content"] == "Post 1"


"""
TODO: IMPORTANT after user is created automatically get topic(add,view,) permissions 
OR maybe create a new Permission class for TopicViewSet
 """
#TODO: IMPORTANT user needs no permission only an should be AUTHENTICATED

#TODO: add user_with_no_perm cant tests
#TODO: test tags were added to the topic and topic tag update
#TODO: create a new test for created topic has the user as author
#TODO: add pin_topic, close_topic, move_topic, add_file to Topic model to change the state of the topic
#TODO: slugify the title of the topic
#TODO: add like functionality to Topic model
#TODO: add number of users who replied to the topic
#TODO: @property def participants(self): return User.objects.filter(posts__topic=self).distinct() 
#TODO: when a new post is added to the topic, update the last_activity field of the topic
#TODO: add attachment to the topic by creating a new model called Attachment class Attachment(models.Model): topic = models.ForeignKey(Topic, related_name='attachments', on_delete=models.CASCADE)
#TODO: increase the views count when the topic is viewed
#TODO: add edit and delete functionality to the topic and check if user is the author of the topic for editing