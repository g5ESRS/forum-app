import pytest
from django.urls import reverse
from communication.models import Message, Notification
from django.contrib.auth import get_user_model
from core.utils import _get_results
User = get_user_model()


@pytest.mark.django_db
def test_user_can_send_private_message(api_client):
    sender = User.objects.create_user(username="alice", password="pass")
    receiver = User.objects.create_user(username="bob", password="pass")

    url = reverse("message-list")
    data = {
        "receiver": receiver.id,
        "content": "Hello Bob!"
    }

    response = api_client(sender).post(url, data, format="json")
    assert response.status_code == 201
    assert Message.objects.filter(sender=sender, receiver=receiver).exists()


@pytest.mark.django_db
def test_user_cannot_create_message_on_behalf_of_other_user(api_client):
    alice = User.objects.create_user(username="alice", password="pass")
    bob   = User.objects.create_user(username="bob", password="pass")
    eve   = User.objects.create_user(username="eve", password="pass")

    url = reverse("message-list")
    data = {
        "sender": bob.id,             #attempt to fake sender
        "receiver": eve.id,
        "content": "This should be from Alice"
    }

    response = api_client(alice).post(url, data, format="json")
    
    message = Message.objects.get(id=response.data["id"])
    assert response.status_code == 201
    assert message.sender == alice
    assert message.receiver == eve


@pytest.mark.django_db
def test_user_can_list_their_messages(api_client):
    sender = User.objects.create_user(username="alice", password="pass")
    receiver = User.objects.create_user(username="bob", password="pass")

    Message.objects.create(sender=sender, receiver=receiver, content="Hey Bob!")
    Message.objects.create(sender=receiver, receiver=sender, content="Hi Alice!")

    url = reverse("message-list")
    response = api_client(sender).get(url)

    assert response.status_code == 200
    assert len(response.data["results"]) == 2



@pytest.mark.django_db
def test_user_cannot_view_others_messages(api_client):
    sender = User.objects.create_user(username="alice", password="pass")
    receiver = User.objects.create_user(username="bob", password="pass")
    other_user = User.objects.create_user(username="charlie", password="pass")

    Message.objects.create(sender=sender, receiver=receiver, content="Hey Bob!")
    Message.objects.create(sender=receiver, receiver=sender, content="Hi Alice!")

    url = reverse("message-list")
    response = api_client(other_user).get(url)

    assert response.status_code == 200
    assert len(response.data["results"]) == 0

@pytest.mark.django_db
def test_user_can_filter_sent_messages(api_client):
    sender = User.objects.create_user(username="alice", password="pass")
    receiver = User.objects.create_user(username="bob", password="pass")

    Message.objects.create(sender=sender, receiver=receiver, content="Hey Bob!")
    Message.objects.create(sender=receiver, receiver=sender, content="Hi Alice!")

    # user can also filter received messages
    url = reverse("message-list") + "?type=sent"
    response = api_client(sender).get(url) 

    assert response.status_code == 200
    assert len(response.data["results"]) == 1
    assert response.data["results"][0]["content"] == "Hey Bob!"

def test_unuthenticated_usesr_cant_send_message(api_client):
    url = reverse("message-list")
    data = {
        "receiver": 1,
        "content": "Hello Bob!"
    }

    response = api_client().post(url, data, format="json")
    assert response.status_code == 401

def test_unauthenticated_user_cannot_list_messages(api_client):
    url = reverse("message-list")
    response = api_client().get(url)
    assert response.status_code == 401



@pytest.mark.django_db
def test_notification_created_after_sending_message(api_client):
    sender = User.objects.create_user(username="alice", password="pass")
    receiver = User.objects.create_user(username="bob", password="pass")

    url = reverse("message-list")
    data = {
        "receiver": receiver.id,
        "content": "Hi Bob!"
    }

    response = api_client(sender).post(url, data, format="json")

    assert response.status_code == 201

     # Verify a notification was created for the receiver
    notification = Notification.objects.filter(receiver=receiver).first()
    
    assert notification is not None
    assert notification.message == "Hi Bob!"

@pytest.mark.django_db
def test_user_can_filter_messages_by_sender(api_client):
    sender = User.objects.create_user(username="alice", password="pass")
    receiver = User.objects.create_user(username="bob", password="pass")
    another_sender = User.objects.create_user(username="charlie", password="pass")

    # Create messages
    Message.objects.create(sender=sender, receiver=receiver, content="Message from Alice")
    Message.objects.create(sender=another_sender, receiver=receiver, content="Message from Charlie")

    # Filter messages by sender
    url = reverse("message-list") + f"?sender={sender.id}"
    response = api_client(receiver).get(url)

    assert response.status_code == 200
    assert len(response.data["results"]) == 1
    assert response.data["results"][0]["content"] == "Message from Alice"  



