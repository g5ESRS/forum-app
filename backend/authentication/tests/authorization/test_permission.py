from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import Permission
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType


# test_user_without_perm_cant_see_permission_list
# test_user_with_perm_can_see_permission_list


def test_user_without_perm_cant_see_permission_list(check_access_denied, user_without_perm):
    """
    Verify that a user without 'view_permission' permission cannot see the permission list (GET /permissions/).
    """
    # Use fixture to check that user_without_perm cannot access the endpoint
    check_access_denied(user_without_perm, "permissions-list", "get")


def test_user_with_perm_can_see_permission_list(api_client, user_with_perm):
    """
    Verify that a user with 'view_permission' permission can see the permission list (GET /permissions/).
    """
    user = user_with_perm("view_permission")

    url = reverse("permissions-list")
    response = api_client(user).get(url, format="json")

    assert response.status_code == status.HTTP_200_OK


# test_user_with_perm_can_get_permission_id_by_name


def test_user_can_get_permission_id_by_name(api_client, user_with_perm):
    """
    Verify that a user with 'view_permission' can fetch a permission id by its codename.
    """

    #target_perm = Permission.objects.get(codename="add_customuser")
    content_type = ContentType.objects.get_for_model(get_user_model())
    target_perm = Permission.objects.create(codename="add_testmodel",name="Can add test model",content_type=content_type,
    )
    user= user_with_perm("view_permission")

    url = reverse("permissions-list") + f"?codename={target_perm.codename}"

    # Act
    response = api_client(user, f=True).get(url, format="json")

    # Assert
    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1

    result = response.data["results"][0]
    assert result["id"] == target_perm.id
    assert result["codename"] == "add_testmodel"
    assert "name" in result

