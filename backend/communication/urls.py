from communication.views.notification_views import UserNotificationViewSet
from django.urls import path

urlpatterns = [
    # Notifications
    #path('admin/notifications/', AdminNotificationViewSet.as_view({'get': 'list'}), name='notifications-list'),
    path('user/notifications/', UserNotificationViewSet.as_view({'get': 'list'}), name='notifications-list'),
    path('user/notifications/<int:pk>/', UserNotificationViewSet.as_view({'patch': 'partial_update'}), name='notifications-detail'),
]