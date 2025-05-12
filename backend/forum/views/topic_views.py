# your_app/views/group_views.py
from rest_framework import viewsets
from forum.models import Topic, Tag, TopicViewLog  # Add TopicViewLog import
from core.permissions import AnyReadOrDjangoPermission
from forum.serializers import TopicDetailSerializer, TopicListSerializer
from rest_framework.permissions import SAFE_METHODS
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.response import Response
from django.utils.timezone import now
from datetime import timedelta
from django.db.models import F


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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.is_authenticated:
            current_time = now()

            # Check if a view log exists for this user and topic
            view_log, created = TopicViewLog.objects.get_or_create(
                user=request.user,
                topic=instance,
                defaults={'viewed_at': current_time}
            )
            # If the view is new or old enough to be counted again
            if created or (current_time - view_log.viewed_at > timedelta(hours=1)):
                Topic.objects.filter(pk=instance.pk).update(views=F('views') + 1)

                if not created:
                    view_log.viewed_at = current_time
                    view_log.save(update_fields=['viewed_at'])

        serializer = self.get_serializer(instance)
        return Response(serializer.data)