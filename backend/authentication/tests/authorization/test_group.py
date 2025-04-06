import pytest
from django.urls import reverse
from django.contrib.auth.models import User, Group, Permission, ContentType
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


@pytest.fixture
def user_with_group_add_perm(db):
    """Creates a user with 'add_group' permission via a group."""
    user = User.objects.create_user(
        username="user_with_permission", email="with_permission@example.com", password="securepass")
    group = Group.objects.create(name="GROUP")
    group.permissions.add(Permission.objects.get(codename="add_group"))
    user.groups.add(group)
    return user



def test_user_without_perm_cant_see_group_list(check_access_denied, user_without_perm):
    """
    Verify that a user without 'view_group' permission cannot see the group list (GET /groups/).
    """
    # Use fixture to check that user_without_perm cannot access the endpoint
    check_access_denied(user_without_perm, "groups-list", "get")

def test_user_with_perm_can_see_group_list(api_client, user_with_perm):
    """
    Verify that a user with 'view_group' permission can see the group list (GET /groups/).
    """
    user = user_with_perm("view_group")

    url=reverse("groups-list")
    response = api_client(user).get(
        url, format="json")


    assert response.status_code == status.HTTP_200_OK



  

# TODO: user without perm can't update group see group
# TODO: user with perm can see group
@pytest.mark.django_db
def test_user_without_perm_cannot_create_group(api_client, user_without_perm):
    """
    Verify that a user lacking 'add_group' permission cannot create a group (POST /groups/).
    """
    url = reverse("groups-list")
    data = {
        "name": "Should Fail Group",
        "permissions": []
    }
    response = api_client(user_without_perm).post(
        url, data, format="json")

    # Expect 403 Forbidden because the user does not have 'auth.add_group'
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_user_with_add_group_permission_can_create_group(api_client, user_with_group_add_perm):
    """
    Verify that a user with a role that has'add_group' permission can create a group (POST /groups/).
    """

    url = reverse("groups-list")

    data = {
        "name": "group_name",
        "permissions": []
    }
    response = api_client(user_with_group_add_perm).post(
        url, data, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert Group.objects.filter(name="group_name").exists()


def test_user_without_perm_cant_update_group(check_access_denied, user_without_perm):
    """
    Verify that a user without 'change_group' permission cannot update a group (PATCH /groups/{pk}/).
    """
    group = Group.objects.create(name="GROUP")


    # Use fixture to check that user_without_perm cannot access the endpoint
    check_access_denied(
        user_without_perm,
        "groups-detail",
        "patch",
        data={"name": "NEW_GROUP"},
        url_kwargs={"pk": group.pk}
    )


@pytest.mark.django_db
def test_user_with_perm_can_update_group(api_client, user_with_perm):
    """
    Verify that a user with 'change_group' permission can partial_update a group (PATCH /groups/{pk}/).
    """

    # Create a group with permission
    group = Group.objects.create(name="name_old")
    permission = Permission.objects.create(
        codename='perm_old', name='perm_old',
        content_type=ContentType.objects.get_for_model(Group)
    )
    group.permissions.add(permission)

    # Get some permissions from the database (e.g., first 3 permissions)
    permissions = Permission.objects.all()[:3]  # Get first 3 permissions
    # Extract permission IDs
    permission_ids = [perm.id for perm in permissions]

    # URL for updating the group
    url = reverse("groups-detail", kwargs={'pk': group.pk})

    data = {
        "name": "new_name",
        "permissions": permission_ids  # FIXED: removed extra brackets
    }

    # Perform the PUT request
    user = user_with_perm("change_group")
    response = api_client(user).patch(url, data, format="json")
    group.refresh_from_db()

    assert response.status_code == status.HTTP_200_OK
    assert group.name == "new_name"
    assert set(group.permissions.values_list("id", flat=True)) == set(
        permission_ids)  # Check if all permissions are set


"""

@pytest.fixture
def api_client():
    return APIClient()

#todo: add a fixture for admin_user (only admin can create groups)
#todo: intensive testing for permission handling so resource with permission name exists and permission values are eather read create update delete
@pytest.mark.django_db
class TestGroupAPI:

    @pytest.mark.parametrize("group_name", ["test_group1", "test_group2"])
    def test_create_group(self, api_client, group_name):

        url = reverse('groups-list')  # for GroupViewSet list endpoint

        data = {
            "name": group_name,
            "permissions": []  # no permissions at creation
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == HTT
        assert Group.objects.filter(name=group_name).exists()

"""

# todo test group list

# def test_update_group_permissions(self, api_client, admin_user):
#     # Create group
#     group = Group.objects.create(name="update_group")

#     # Create a permission
#     perm = Permission.objects.first()  # or create a specific one

#     # Login as admin
#     api_client.login(username='admin_user', password='admin_pass')
#     url = reverse('groups-detail', kwargs={'pk': group.id})

#     data = {
#         "name": "update_group",
#         "permissions": [perm.id]
#     }
#     response = api_client.put(url, data, format='json')

#     assert response.status_code == 200
#     group.refresh_from_db()
#     assert perm in group.permissions.all()

# def test_delete_group(self, api_client, admin_user):
#     group = Group.objects.create(name="delete_group")

#     # Login as admin
#     api_client.login(username='admin_user', password='admin_pass')
#     url = reverse('groups-detail', kwargs={'pk': group.id})

#     response = api_client.delete(url)
#     assert response.status_code == 204
#     assert not Group.objects.filter(name="delete_group").exists()
