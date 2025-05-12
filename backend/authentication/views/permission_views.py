# your_app/views/group_views.py

from rest_framework import viewsets
from django.contrib.auth.models import Permission
from authentication.serializers.group_serializers import PermissionSerializer
from core.permissions import DjangoModelPermissionsEnforceGET
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters


class LargePagePagination(PageNumberPagination):
    page_size = 25  

class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows admins to create, update, and delete groups.
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [DjangoModelPermissionsEnforceGET]
    pagination_class = LargePagePagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['codename']

