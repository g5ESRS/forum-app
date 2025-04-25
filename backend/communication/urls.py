from communication.views.notification_views import UserNotificationViewSet
from communication.views.message_views import PrivateMessageViewSet,UnreadMessageCountViewSet
from django.urls import path

urlpatterns = [
    # Notifications
    #path('admin/notifications/', AdminNotificationViewSet.as_view({'get': 'list'}), name='notifications-list'),
    path('user/notifications/', UserNotificationViewSet.as_view({'get': 'list'}), name='notifications-list'),
    path('user/notifications/<int:pk>/', UserNotificationViewSet.as_view({'patch': 'partial_update'}), name='notifications-detail'),
    
    path("messages/", PrivateMessageViewSet.as_view({"get": "list", "post": "create"}), name="message-list"),
    path("messages/mark-all-read/", PrivateMessageViewSet.as_view({"post": "mark_all_as_read"}), name="messages-mark-all-read"),
    path("messages/unread-count/", UnreadMessageCountViewSet.as_view({"get": "list"}), name="unread-message-count"),


]