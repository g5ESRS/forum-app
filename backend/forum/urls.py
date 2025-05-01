from forum.views.category_views import CategoryViewSet
from forum.views.topic_views import TopicViewSet
from forum.views.post_views import PostViewSet
from forum.views.tag_views import TagViewSet  # Import the new TagViewSet


from django.urls import path

urlpatterns = [

    #categories
    path('categories/', CategoryViewSet.as_view({'post': 'create', 'get': 'list'}), name='categories-list'),
    path('categories/<int:pk>/', CategoryViewSet.as_view({'patch': 'partial_update','delete':'destroy'}), name='categories-detail'),

    #topics:
    path('topics/', TopicViewSet.as_view({'get': 'list', 'post': 'create'}), name='topics-list'),
    path('topics/<int:pk>/', TopicViewSet.as_view({'get':'retrieve','patch': 'partial_update', 'delete': 'destroy'}), name='topics-detail'),

    #posts:
    path('posts/', PostViewSet.as_view({'post': 'create'}), name='posts-list'),
    
    #tags:
    path('tags/', TagViewSet.as_view({'get': 'list'}), name='tags-list'),
    path('tags/<slug:slug>/', TagViewSet.as_view({'get': 'retrieve'}), name='tags-detail'),
]

    # use patch for updating groups if all fields are not required for update
    # path(
    #     'groups/<int:pk>/', GroupViewSet.as_view({'patch': 'partial_update'}), name='groups-detail'),



