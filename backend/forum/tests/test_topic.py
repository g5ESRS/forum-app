import pytest
from django.urls import reverse
from forum.models import Topic, Category, Post
from django.contrib.auth import get_user_model
from core.utils import _get_results
from forum.models import Tag


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
    # assert topic.user is user

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
    topic = Topic.objects.create(
        title="Old Title", content="Old", author=user, category=category)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client(user).patch(
        url, {"title": "Updated Title"}, format="json")

    topic.refresh_from_db()
    assert response.status_code == 200
    assert topic.title == "Updated Title"


def test_user_with_no_perm_cant_edit_topic(check_access_denied, user_without_perm):
    category = Category.objects.create(name="EditCat", slug="editcat")
    topic = Topic.objects.create(
        title="Old Title", content="Old", author=user_without_perm, category=category)

    response = check_access_denied(
        user_without_perm, "topics-detail", "patch", url_kwargs={"pk": topic.pk})
    assert response.status_code == 403


@pytest.mark.django_db
def test_user_with_perm_can_pin_topic(api_client, user_with_perm):
    user = user_with_perm("change_topic")
    category = Category.objects.create(name="PinCat", slug="pincat")
    topic = Topic.objects.create(
        title="Topic to Pin", content="Content", author=user, category=category)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client(user).patch(url, {"pinned": True}, format="json")

    topic.refresh_from_db()
    assert response.status_code == 200
    assert topic.pinned is True


@pytest.mark.django_db
def test_user_with_perm_can_delete_topic(api_client, user_with_perm):
    user = user_with_perm("delete_topic")
    category = Category.objects.create(name="DelCat", slug="delcat")
    topic = Topic.objects.create(
        title="To Delete", content="...", author=user, category=category)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client(user).delete(url)

    assert response.status_code == 204
    assert not Topic.objects.filter(pk=topic.pk).exists()


@pytest.mark.django_db
def test_everybody_can_see_topic_list(api_client):
    user = User.objects.create_user(username="user", password="testpass")
    category = Category.objects.create(name="Public", slug="public")
    t = Topic.objects.create(
        title="Visible Topic", content="This is public", author=user, category=category)
    t2 = Topic.objects.create(title="Another Visible Topic",
                              content="This is also public", author=user, category=category)

    response = api_client().get(reverse("topics-list"))
    assert response.status_code == 200

    data = response.data["results"]
    topic = next((item for item in data if item["id"] == t.id), None)

    assert len(data) == 2, "Expected 2 topics in the response"
    assert topic is not None, "Expected topic not found in response"
    assert topic["title"] == "Visible Topic"
    assert topic["content"] == "This is public"
    assert topic["author"] == user.id


@pytest.mark.django_db
def test_topic_list_contains_reply_count(api_client):
    # Setup
    category = Category.objects.create(name="General", slug="general")
    user = User.objects.create_user(username="testuser", password="testpass")
    topic = Topic.objects.create(
        title="Topic A", content="Start here", author=user, category=category)

    # Add replies
    Post.objects.create(topic=topic, author=user, content="Post 1")
    Post.objects.create(topic=topic, author=user, content="Post 2")

    url = reverse("topics-list")
    # Act
    response = api_client().get(url)
    # Assert
    assert response.status_code == 200
    results = _get_results(response)
    assert results[0]["reply_count"] == 2, f"Expected 2 replies, got {results[0]['reply_count']}"


@pytest.mark.django_db
def test_topic_list_includes_pinned_flag(api_client):
    user = User.objects.create_user(username="user", password="pass")
    category = Category.objects.create(name="General", slug="general")
    topic = Topic.objects.create(
        title="Pinned Topic", content="This topic is pinned", author=user, category=category, pinned=True)

    url = reverse("topics-list")
    response = api_client().get(url)

    assert response.status_code == 200
    results = _get_results(response)
    assert results[0]["pinned"] is True, "Expected the topic to be pinned"


@pytest.mark.django_db
def test_topic_list_contains_closed(api_client):
    user = User.objects.create_user(username="closer", password="pass")
    cat = Category.objects.create(name="ListClose", slug="listclose")
    Topic.objects.create(title="ClosedTopic", content="...",
                         author=user, category=cat, closed=True)

    response = api_client().get(reverse("topics-list"))
    results = _get_results(response)
    assert response.status_code == 200
    assert results[0]["closed"] is True


@pytest.mark.django_db
def test_topic_list_contains_tags_and_category(api_client):
    user = User.objects.create_user(username="user", password="testpass")
    category = Category.objects.create(name="General", slug="general")
    tag1 = Tag.objects.create(name="Tag1", slug="tag1")
    tag2 = Tag.objects.create(name="Tag2", slug="tag2")
    topic = Topic.objects.create(
        title="Topic A", content="Content A", author=user, category=category)
    topic.tags.add(tag1, tag2)

    url = reverse("topics-list")
    response = api_client().get(url)

    assert response.status_code == 200
    results = _get_results(response)
    assert len(results) == 1
    assert results[0]["category"]["name"] == "General"
    assert len(results[0]["tags"]) == 2
    assert results[0]["tags"][0]["name"] == "Tag1"


@pytest.mark.django_db
def test_topic_list_not_contain_posts(api_client):

    category = Category.objects.create(name="General", slug="general")
    user = User.objects.create_user(username="testuser", password="testpass")
    topic = Topic.objects.create(
        title="Topic A", content="Start here", author=user, category=category)

    url = reverse("topics-list")

    response = api_client().get(url)

    # Assert
    assert response.status_code == 200
    results = _get_results(response)
    assert "posts" not in results[0]


@pytest.mark.django_db
def test_guest_can_view_topic_detail(api_client):
    user = User.objects.create_user(username="viewer", password="testpass")
    category = Category.objects.create(name="General", slug="general")
    topic = Topic.objects.create(
        title="Topic A", content="Start here", author=user, category=category)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client().get(url)

    assert response.status_code == 200
    assert response.data["title"] == "Topic A"
    assert "content" in response.data


@pytest.mark.django_db
def test_topic_detail_contains_posts(api_client):
    user = User.objects.create_user(username="viewer", password="testpass")
    category = Category.objects.create(name="General", slug="general")
    topic = Topic.objects.create(
        title="Topic A", content="Start here", author=user, category=category)

    Post.objects.create(topic=topic, author=user, content="Post 1")
    Post.objects.create(topic=topic, author=user, content="Post 2")

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client().get(url)

    assert response.status_code == 200
    assert "posts" in response.data
    assert isinstance(response.data["posts"], list)
    assert len(response.data["posts"]) == 2
    assert response.data["posts"][0]["content"] == "Post 1"


@pytest.mark.django_db
def test_topic_detail_contains_tags_and_category(api_client):
    user = User.objects.create_user(username="user", password="testpass")
    category = Category.objects.create(name="General", slug="general")
    tag1 = Tag.objects.create(name="Tag1", slug="tag1")
    tag2 = Tag.objects.create(name="Tag2", slug="tag2")
    topic = Topic.objects.create(
        title="Topic A", content="Content A", author=user, category=category)
    topic.tags.add(tag1, tag2)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client().get(url)

    assert response.status_code == 200
    assert response.data["category"]["name"] == "General"
    assert len(response.data["tags"]) == 2
    assert response.data["tags"][1]["name"] == "Tag2"


@pytest.mark.django_db
def test_user_automatically_gets_topic_perm():
    """
    This test checks if the user automatically gets the topic permissions after being created.
    """
    # Create a new user
    user = User.objects.create_user(username="newuser", password="newpass")

    # Check if the user has the required permissions
    assert user.has_perm("forum.add_topic")
    assert user.has_perm("forum.view_topic")


@pytest.mark.django_db
def test_user_with_perm_can_change_topic_category(api_client, user_with_perm):
    user = user_with_perm("change_topic")
    old_cat = Category.objects.create(name="OldCat", slug="oldcat")
    new_cat = Category.objects.create(name="NewCat", slug="newcat")
    topic = Topic.objects.create(
        title="Topic to Move", content="Move me", author=user, category=old_cat)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client(user).patch(
        url, {"category_ref": new_cat.slug}, format="json")

    topic.refresh_from_db()
    assert response.status_code == 200
    assert topic.category == new_cat


@pytest.mark.django_db
def test_user_with_perm_can_close_a_topic(api_client, user_with_perm):
    user = user_with_perm("change_topic")
    cat = Category.objects.create(name="CloseCat", slug="closecat")
    topic = Topic.objects.create(
        title="Topic to Close", content="...", author=user, category=cat)

    url = reverse("topics-detail", kwargs={"pk": topic.pk})
    response = api_client(user).patch(url, {"closed": True}, format="json")

    topic.refresh_from_db()
    assert response.status_code == 200
    assert topic.closed is True


@pytest.mark.django_db
def test_tags_automatically_added_to_topic_on_creation(api_client):
    user = User.objects.create_user(username="author", password="pass")
    category = Category.objects.create(name="Tech", slug="tech")

    url = reverse("topics-list")
    tag_inputs = ["slug1", "slug2"]

    data = {
        "title": "topic_with_tag",
        "content": "Creating tags dynamically",
        "category_ref": category.id,
        "tag_names": tag_inputs
    }

    # Act
    response = api_client(user).post(url, data, format="json")

    # Assert topic created successfully
    assert response.status_code == 201

    # Verify tag slugs are attached to topic
    assert Tag.objects.filter(slug="slug1").exists()
    assert Tag.objects.filter(slug="slug2").exists()

    topic_tags = Topic.objects.filter(title="topic_with_tag").first().tags
    assert topic_tags.filter(slug="slug1").exists(), "Tags not found in topic"
    assert topic_tags.filter(slug="slug2").exists(), "Tags not found in topic"



"""
TODO: IMPORTANT after user is created automatically get topic(add,view,) permissions 
OR maybe create a new Permission class for TopicViewSet
 """
# TODO: IMPORTANT user needs no permission only an should be AUTHENTICATED

# TODO: add user_with_no_perm cant tests
# TODO: test tags were added to the topic and topic tag update
# TODO: create a new test for created topic has the user as author
# TODO: add pin_topic, close_topic, move_topic, add_file to Topic model to change the state of the topic
# TODO: slugify the title of the topic
# TODO: add like functionality to Topic model
# TODO: add number of users who replied to the topic
# TODO: @property def participants(self): return User.objects.filter(posts__topic=self).distinct()
# TODO: when a new post is added to the topic, update the last_activity field of the topic
# TODO: add attachment to the topic by creating a new model called Attachment class Attachment(models.Model): topic = models.ForeignKey(Topic, related_name='attachments', on_delete=models.CASCADE)
# TODO: increase the views count when the topic is viewed
# TODO: add edit and delete functionality to the topic and check if user is the author of the topic for editing
