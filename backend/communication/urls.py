from communication.views.notification_views import UserNotificationViewSet,UnreadNotifCountViewSet
from communication.views.message_views import PrivateMessageViewSet
from django.urls import path

urlpatterns = [
    # Notifications
    #path('admin/notifications/', AdminNotificationViewSet.as_view({'get': 'list'}), name='notifications-list'),
    path('user/notifications/', UserNotificationViewSet.as_view({'get': 'list'}), name='notifications-list'), #"?is_read=true"
    path('user/notifications/<int:pk>/', UserNotificationViewSet.as_view({'patch': 'partial_update'}), name='notifications-detail'),
    path("notifications/unread-count/", UnreadNotifCountViewSet.as_view({"get": "list"}), name="unread-notification-count"),
    path("notifications/mark-all-read/", UserNotificationViewSet.as_view({"post": "mark_all_as_read"}), name="notifications-mark-all-read"),

    
    path("messages/", PrivateMessageViewSet.as_view({"get": "list", "post": "create"}), name="message-list"), #"?type=sent"


]