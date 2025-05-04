from django.core.cache import cache
from communication.models import Notification
from application.repositories.base_repository import BaseRepository
import logging


class NotificationRepository(BaseRepository):
    model = Notification
    UNREAD_NOTIFICATIONS_CACHE_TIMEOUT = 30
    KEY_UNREAD_COUNT = "unread_count"

    @classmethod
    def get_unread_notifications_count(cls, user, use_cache=True):
        key = cls._cache_key(cls.KEY_UNREAD_COUNT, user.id)

        if use_cache:
            cached_count = cache.get(key)
            if cached_count is not None:
                return cached_count
            logging.debug(f"Cache miss for unread count: user_id={user.id}")
            

        unread_count = cls.model.objects.filter(receiver=user, is_read=False).count()

        if use_cache:
            cache.set(key, unread_count, timeout=cls.UNREAD_NOTIFICATIONS_CACHE_TIMEOUT)

        return unread_count

    @classmethod
    def clear_unread_notifications_cache(cls, user):
        cache.delete(cls._cache_key(cls.KEY_UNREAD_COUNT, user.id))