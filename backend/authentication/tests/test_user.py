from django.contrib.auth.models import Group
from django.urls import reverse
from django.contrib.auth import get_user_model
import pytest
from authentication.factories import UserFactory
from rest_framework import status
from django.contrib.auth.models import User, Group, Permission
from django.contrib.auth import get_user_model

User = get_user_model()

def test_user_without_perm_cannot_list_users(check_access_denied, user_without_perm):
    """
    Verify that a user without 'view_customuser' permission cannot list users (GET /users/).
    """
    check_access_denied(user_without_perm, "users-list", "get")


@pytest.mark.django_db
def test_user_with_perm_can_list_users(user_with_perm, api_client):
    """
    Verify that a user with 'view_customuser' permission can list users (GET /users/).
    """
    # Arrange: Create 3 users using the factory
    UserFactory.create_batch(3)

    # Setup a user with the 'view_user' permission
    user = user_with_perm("view_customuser")

    url = reverse("users-list")

    # Act: Authenticated GET request
    response = api_client(user).get(url, format="json")

    # Assert: Check status and number of returned users
    assert response.status_code == status.HTTP_200_OK
    # 3 factory users + 1 authenticated user
    assert response.data["count"] == 4
    assert len(response.data["results"]) == 4


User = get_user_model()


@pytest.mark.django_db
def test_user_with_permission_can_list_users_with_their_group(user_with_perm, api_client):

    user = user_with_perm("view_customuser")

    # Assign groups
    groups = [Group.objects.create(name=name)
              for name in ["group1", "group2", "group3"]]
    user.groups.set(groups)

    url = reverse("users-list")

    # Act: Authenticated GET request
    response = api_client(user, f=True).get(url, format="json")

    assert response.status_code == 200

    data = response.data.get("results", [])

    user_data = data[0]
    assert user_data["username"] == user.username
    assert len(user_data["groups"]) == 3

    # Check group structure
    for group, expected in zip(user_data["groups"], groups):
        assert group["id"] == expected.id
        assert group["name"] == expected.name


@pytest.mark.django_db
def test_authorized_user_can_list_users_with_perms(api_client, user_with_perm):
    # Create user with direct permission: view_customuser
    user = user_with_perm("view_customuser")  # perm1

    # Create group and permissions
    group = Group.objects.create(name="TestGroup")
    perm2 = Permission.objects.get(codename="add_group")
    perm3 = Permission.objects.get(codename="change_group")

    # Assign permissions to group, then assign group to user
    group.permissions.set([perm2, perm3])
    user.groups.add(group)

    # Make authenticated request
    url = reverse("users-list")
    response = api_client(user, f=True).get(url, format="json")

    user_data = response.data["results"][0]

    # Assert response
    assert response.status_code == 200
    # Assert the permissions key exists and has exactly 3 items (2 from group, 1 from user)
    assert "permissions" in user_data, "Expected 'permissions' key in user response"
    assert len(user_data["permissions"]
               ) == 3, f"Expected 3 permissions, got {len(user_data['permissions'])}"


@pytest.mark.django_db
def test_list_users_has_permissions_with_id_and_codename_and_name(api_client, user_with_perm):
    # Create user with two direct permissions
    user = user_with_perm("view_customuser")
    perm2 = Permission.objects.get(codename="add_group")
    user.user_permissions.add(perm2)

    # Authenticated request
    url = reverse("users-list")
    response = api_client(user, f=True).get(url, format="json")

    assert response.status_code == 200, response.data
    user_data = response.data["results"][0]

    # Assert structure
    assert "permissions" in user_data
    for perm in user_data["permissions"]:
        assert "id" in perm
        assert "codename" in perm
        assert "name" in perm


def unauthenticated_user_cannot_see_user_details(api_client):
    """
    Verify that unauthenticated user cannot retrieve users (GET /users/<user_id>).
    """
    # Create a user whose details we'll try to access
    target_user = User.objects.create_user(username="target", password="pass")

    # Unauthenticated request
    url = reverse("users-detail", kwargs={"pk": target_user.pk})
    response = api_client().get(url)

    # Expect 401 Unauthorized
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_user_retrieve_endpoint_returns_user_details(api_client, user_with_perm):
    # Create a user with permission to view
    user = user_with_perm("view_customuser")

    # Make the request to retrieve the same user
    url = reverse("users-detail", kwargs={"pk": user.id})
    response = api_client(user, f=True).get(url, format="json")

    # Assertions
    assert response.status_code == 200, response.data
    assert response.data["id"] == user.id
    assert response.data["username"] == user.username
    assert "email" in response.data
    assert "groups" in response.data
    assert "permissions" in response.data


@pytest.mark.django_db
def test_user_with_permission_can_partially_update_users(api_client, user_with_perm):
    # Create a user with permission to update users
    user = user_with_perm("change_customuser")

    # Create another user to update
    target_user = User.objects.create_user(
        username="targetuser", email="old@example.com", password="testpass")

    # New data for patching
    data = {"email": "updated@example.com"}

    url = reverse("users-detail", kwargs={"pk": target_user.id})
    response = api_client(user, f=True).patch(url, data, format="json")

    # Reload the target user from DB
    target_user.refresh_from_db()

    # Assertions
    assert response.status_code == 200
    assert target_user.email == "updated@example.com"
    assert response.data["email"] == "updated@example.com"


@pytest.mark.django_db
def test_user_with_permission_can_partially_update_a_user_permissions(api_client, user_with_perm):
    # Create acting user with permission to change users
    admin_user = user_with_perm("change_customuser")

    # Create target user to update
    target_user = User.objects.create_user(
        username="targetuser", email="target@example.com", password="test")

    # Select two permissions to assign directly
    perm1 = Permission.objects.get(codename="add_group")
    perm2 = Permission.objects.get(codename="delete_group")

    # Prepare data with permission IDs
    data = {
        "user_permissions": [perm1.id, perm2.id]
    }

    # Make PATCH request to update target_user
    url = reverse("users-detail", kwargs={"pk": target_user.id})
    response = api_client(admin_user, f=True).patch(url, data, format="json")

    # Refresh target_user from DB
    target_user.refresh_from_db()

    # Assertions
    assert response.status_code == 200, response.data
    assert perm1 in target_user.user_permissions.all()
    assert perm2 in target_user.user_permissions.all()
    assert len(target_user.user_permissions.all()) == 2


def test_user_with_permission_can_partially_update_a_user_group(api_client, user_with_perm):
    # Create user with change permission
    admin_user = user_with_perm("change_customuser")

    # Create target user to be updated
    target_user = User.objects.create_user(username="targetuser", email="target@example.com", password="test")

    # Create group(s) to assign
    group1 = Group.objects.create(name="Moderators")
    group2 = Group.objects.create(name="Editors")

    # Prepare patch data
    data = {
        "groups": [group1.id, group2.id]
    }

    # Perform PATCH request
    url = reverse("users-detail", kwargs={"pk": target_user.id})
    response = api_client(admin_user, f=True).patch(url, data, format="json")

    # Refresh the target user from DB
    target_user.refresh_from_db()

    # Assertions
    assert response.status_code == 200, response.data
    assert group1 in target_user.groups.all()
    assert group2 in target_user.groups.all()
    assert target_user.groups.count() == 2


@pytest.mark.django_db
def test_user_can_see_its_profile_detail(api_client):

    user = User.objects.create_user(username="testuser", password="testpass")

    url = reverse("users-detail", kwargs={"pk": user.pk})
    response= api_client(user=user).get(url)
     

    # Assert
    assert response.status_code == 200
    assert response.data["id"] == user.id
    assert response.data["username"] == user.username

@pytest.mark.django_db
def test_user_can_see_its_groups(api_client):
    user = User.objects.create_user(username="testuser", password="testpass")

    # Create and assign group
    group = Group.objects.create(name="Moderators")
    user.groups.add(group)

    url = reverse("users-detail", kwargs={"pk": user.pk})
    response = api_client(user=user).get(url)

    assert response.status_code == 200
    group_names = [g["name"] for g in response.data["groups"]]
    assert "Moderators" in group_names


@pytest.mark.django_db
def test_user_can_see_its_permissions(api_client, user_with_perm):

    user = user_with_perm("view_group")

    url = reverse("users-detail", kwargs={"pk": user.pk})
    response = api_client(user=user).get(url)

    assert response.status_code == 200
    perm_codenames = [perm["codename"] for perm in response.data["permissions"]]
    assert "view_group" in perm_codenames


@pytest.mark.django_db
def test_user_cannot_see_others_detail(api_client):
    # requesting requesting user
    requesting_user = User.objects.create_user(username="requestinguser", password="testpass")

    # Create a second user (the one being requested)
    other_user = User.objects.create_user(username="otheruser", password="testpass")

    url = reverse("users-detail", kwargs={"pk": other_user.pk})
    response = api_client(requesting_user).get(url)

    assert response.status_code == 403


@pytest.mark.django_db
def test_user_cannot_update_others_detail(api_client):
    # Create authenticated user
    user = User.objects.create_user(username="requestinguser", password="testpass")

    # Create a second user
    other_user = User.objects.create_user(username="other", password="pass")

    url = reverse("users-detail", kwargs={"pk": other_user.pk})
    data = {"username": "hacked"}

    # Attempt to update another user's info
    response = api_client(user).patch(url, data, format="json")

    # Expect forbidden 403 status
    assert response.status_code == 403
    
# #def test_admin_can_see_all_users