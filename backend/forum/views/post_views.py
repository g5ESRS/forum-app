# your_app/views/group_views.py
from rest_framework import viewsets
from forum.models import Topic
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from forum.serializers import PostSerializer
#from core.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import SAFE_METHODS
from rest_framework.exceptions import PermissionDenied




class PostViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        topic = serializer.validated_data.get("topic")
        if topic.closed:
            raise PermissionDenied("You cannot reply to a closed topic.")
        
        serializer.save(author=self.request.user)
