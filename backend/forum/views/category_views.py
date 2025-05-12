# your_app/views/group_views.py
from rest_framework import viewsets
from forum.models import Category
from core.permissions import AnyReadOrDjangoPermission
from forum.serializers import CategorySerializer,CategoryDetailSerializer
from rest_framework.permissions import SAFE_METHODS




class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows admins to create, update, and delete groups.
    Everybody can view the list of groups and their details.
    """
    queryset = Category.objects.all()
    permission_classes = [AnyReadOrDjangoPermission]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        return CategorySerializer



