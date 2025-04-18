# your_app/views/group_views.py
from rest_framework import viewsets
from forum.models import Topic
from core.permissions import AnyReadOrDjangoPermission
from forum.serializers import TopicSerializer
from rest_framework.permissions import SAFE_METHODS




class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [AnyReadOrDjangoPermission]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
