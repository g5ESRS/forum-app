import pytest
from forum.models import Category
from forum.models import Topic, Tag, Post
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_create_category():
    """Test creating a Category instance with valid data."""
    category = Category.objects.create(
        name="Programming",
        description="This is a category",
        slug="programming"
    )

    assert category.name == "Programming"
    assert category.description == "This is a category"
    assert category.slug == "programming"
    assert category.is_active is True
    assert category.created_at is not None
    assert category.updated_at is not None
    assert str(category) == "Programming"

@pytest.mark.django_db
def test_create_topic():
    """Test creating a Topic instance with valid data."""
    user = User.objects.create_user(username="testuser", password="pass")
    category = Category.objects.create(name="General", description="General discussion", slug="general")
    tag1 = Tag.objects.create(name="Django")
    tag2 = Tag.objects.create(name="Python")

    topic = Topic.objects.create(
        title="Getting Started with Django",
        content="Here is a guide to help you start...",
        author=user,
        category=category,
        pinned=True,
        closed=False,
        views=10
    )
    topic.tags.set([tag1, tag2])

    assert topic.title == "Getting Started with Django"
    assert topic.author == user
    assert topic.category == category
    assert topic.pinned is True
    assert topic.closed is False
    assert topic.views == 10
    assert tag1 in topic.tags.all()
    assert tag2 in topic.tags.all()
    assert str(topic) == "Getting Started with Django"

@pytest.mark.django_db
def test_create_tag():
    tag = Tag.objects.create(name="Python")
    assert tag.name == "Python"

@pytest.mark.django_db
def test_create_post():
    user = User.objects.create_user(username="poster", password="pass123")
    category = Category.objects.create(name="Help", description="Ask for help", slug="help")
    topic = Topic.objects.create(title="Need Help", content="How do I do X?", author=user, category=category)
    
    post = Post.objects.create(topic=topic, author=user, content="Here's how you do X")

    assert post.topic == topic
    assert post.author == user
    assert post.content == "Here's how you do X"
    assert str(post) == f"{user} on {topic}"
