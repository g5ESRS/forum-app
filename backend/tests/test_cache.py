# forum/tests/test_topic_cache.py
import pytest
from django.urls import reverse
from django.test.utils import CaptureQueriesContext
from django.db import connection
from forum.models import Topic, Category
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django_redis import get_redis_connection
from django.core.cache import caches

"""
these thest only run with Redis backend
"""

def is_real_redis():
    return "django_redis" in caches["default"].__module__

@pytest.mark.skipif(not is_real_redis(), reason="Only runs with Redis backend")
def test_cache_key_stored():
    r = get_redis_connection()
    r.set("test:key", "value")
    assert r.get("test:key") == b"value"  # returns bytes

@pytest.mark.django_db
@pytest.mark.skipif(not is_real_redis(), reason="Only runs with Redis backend")
def test_topic_list_is_cached():
    """
    First call: goes to DB.
    Second call (same query string): served from Redis → no extra Topic query.
    """
    # Create a user for the foreign key
    User = get_user_model()
    user = User.objects.create_user(username="testuser", password="password")

    cat = Category.objects.create(name="Gen", slug="gen")
    Topic.objects.create(title="T1", content="...", category=cat, author=user)
    Topic.objects.create(title="T2", content="...", category=cat, author=user)

    client   = APIClient()
    url      = reverse("topics-list")  # /api/forum/topics/
    url_page = f"{url}?page=1"

    # 1- FIRST request – expect at least 1 SQL query for Topic
    with CaptureQueriesContext(connection) as queries_before:
        resp1 = client.get(url_page)
    topic_queries_first = [q for q in queries_before.captured_queries if "FROM \"forum_topic\"" in q['sql']]
    assert resp1.status_code == 200
    assert len(topic_queries_first) >= 1        # DB hit happened

    # 2- SECOND identical request – should be cached ➜ zero Topic queries
    with CaptureQueriesContext(connection) as queries_after:
        resp2 = client.get(url_page)
    topic_queries_second = [q for q in queries_after.captured_queries if "FROM \"forum_topic\"" in q['sql']]

    assert resp2.status_code == 200
    assert resp1.json() == resp2.json()         # same payload
    assert len(topic_queries_second) == 0       # cached ⇒ no extra DB query
