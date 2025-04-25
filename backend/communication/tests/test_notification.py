import pytest
from django.urls import reverse
from rest_framework import status
from communication.models import Notification
from django.contrib.auth import get_user_model


User = get_user_model()


@pytest.mark.django_db
def test_user_can_see_their_notifications(api_client):
    user = User.objects.create_user("user1", "pass")
    Notification.objects.create(receiver=user, message="Ping")

    url = reverse("notifications-list")
    resp = api_client(user).get(url)

    assert resp.status_code == 200
    assert len(resp.data["results"]) == 1
    assert resp.data["results"][0]["receiver"] == user.id


@pytest.mark.django_db
def test_user_cannot_see_others_notifications(api_client):
    user = User.objects.create_user("me",     "pass")
    other = User.objects.create_user("other",  "pass")
    Notification.objects.create(receiver=other, message="Private")

    url = reverse("notifications-list")
    resp = api_client(user).get(url)

    assert resp.status_code == 200
    assert len(resp.data["results"]) == 0


@pytest.mark.django_db
def test_user_can_filter_notifications_by_is_read(api_client):
    user = User.objects.create_user("reader", "pass")
    Notification.objects.create(receiver=user, message="Unread", is_read=False)
    Notification.objects.create(receiver=user, message="Read",   is_read=True)

    url = reverse("notifications-list") + "?is_read=true"
    resp = api_client(user).get(url)

    assert resp.status_code == 200
    assert len(resp.data["results"]) == 1              # only the read one
    assert resp.data["results"][0]["is_read"] is True



@pytest.mark.django_db
def test_user_can_mark_their_notification_as_read(api_client):
    user = User.objects.create_user("owner", "pass")
    note = Notification.objects.create(receiver=user, message="Ping", is_read=False)

    url  = reverse("notifications-detail", kwargs={"pk": note.pk})
    resp = api_client(user).patch(url, {"is_read": True}, format="json")

    assert resp.status_code == 200
    note.refresh_from_db()
    assert note.is_read is True


@pytest.mark.django_db
def test_user_cannot_update_others_notification(api_client):
    owner    = User.objects.create_user("owner",    "pass")
    stranger = User.objects.create_user("stranger", "pass")
    note     = Notification.objects.create(receiver=owner, message="Ping")

    url  = reverse("notifications-detail", kwargs={"pk": note.pk})
    resp = api_client(stranger).patch(url, {"is_read": True}, format="json")

    assert resp.status_code == 403
    note.refresh_from_db()
    assert note.is_read is False

# TODO: def test_notification_contains_link_to_target()


"""TODO: admin level notification
def test_user_with_perm_can_see_notification_list(api_client, user_with_perm):
def test_user_without_perm_cant_see_notification_list
def test_user_with_perm_can_create_notification()
"""
