# application/services/notification_service.py
from application.repositories.notification_repository import NotificationRepository

class NotificationService:
    @classmethod
    def count_unread_notifications(cls, user):
        """
        Returns cached unread count. Uses the cached list from repository,
        so no extra DB hit.
        """
        count = NotificationRepository.get_unread_notifications_count(user)
        return count

    # Call this after marking messages read or sending new ones
    @classmethod
    def invalidate_unread_cache(cls, user):
        NotificationRepository.clear_unread_notifications_cache(user)
