# your_app/views/group_views.py
from rest_framework import viewsets
from forum.models import Topic, Tag  # Add Tag import
from core.permissions import AnyReadOrDjangoPermission
from forum.serializers import TopicDetailSerializer, TopicListSerializer
from rest_framework.permissions import SAFE_METHODS
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page



CACHE_TTL = 60  # seconds – adjust as needed  ⏱

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    permission_classes = [AnyReadOrDjangoPermission]


    def get_serializer_class(self):
        if self.action == 'list':
            return TopicListSerializer
        return TopicDetailSerializer


    @method_decorator(cache_page(CACHE_TTL, key_prefix="topics:list"))
    def list(self, request, *args, **kwargs):
        """
        GET /topics/  (paginated)
        Response is cached in Redis for `CACHE_TTL` seconds.
        Key looks like:
          topics:list:/api/forum/topics/?page=2&tag=django
        """
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
