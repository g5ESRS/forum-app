# application/repositories/base_repository.py
from django.core.cache import cache


class BaseRepository:
    model = None
    CACHE_TIMEOUT = 300
    cache_namespace = None  # can be overridden manually

    @classmethod
    def _get_namespace(cls):
        # Use defined cache_namespace or fallback to class name (e.g., "notificationrepository" → "notification")
        return cls.cache_namespace or cls.__name__.replace("Repository", "").lower()

    @classmethod
    def _cache_key(cls, *parts):
        prefix = cls._get_namespace()
        return ":".join([prefix, *map(str, parts)])

    # ----- single-object helper (unchanged) ---------------
    @classmethod
    def get_by_id(cls, obj_id, use_cache=True):
        key = cls._cache_key(obj_id)
        if use_cache and (cached := cache.get(key)):
            return cached
        obj = cls.model.objects.get(id=obj_id)
        if use_cache:
            cache.set(key, obj, timeout=cls.CACHE_TIMEOUT)
        return obj

    @classmethod
    def invalidate_by_id(cls, obj_id):
        cache.delete(cls._cache_key(obj_id))
