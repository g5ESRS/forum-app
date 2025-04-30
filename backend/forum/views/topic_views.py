# your_app/views/group_views.py
from rest_framework import viewsets
from forum.models import Topic
from core.permissions import AnyReadOrDjangoPermission
from forum.serializers import TopicSerializer
from rest_framework.permissions import SAFE_METHODS
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page



CACHE_TTL = 60  # seconds – adjust as needed  ⏱

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [AnyReadOrDjangoPermission]

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
