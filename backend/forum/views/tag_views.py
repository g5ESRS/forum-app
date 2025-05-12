from rest_framework import viewsets
from rest_framework.viewsets import ReadOnlyModelViewSet
from forum.models import Tag
from forum.serializers import TagSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


class TagViewSet(ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    

