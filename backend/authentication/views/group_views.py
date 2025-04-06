# your_app/views/group_views.py
from rest_framework import viewsets, permissions
from django.contrib.auth.models import Group
from authentication.serializers.group_serializers import GroupSerializer
from core.permissions import DjangoModelPermissionsEnforceGET


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows admins to create, update, and delete groups.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [DjangoModelPermissionsEnforceGET]

