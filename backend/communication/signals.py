from django.db.models.signals import post_save
from django.dispatch import receiver
from communication.models import Message, Notification
from application.services.notification_service import NotificationService

@receiver(post_save, sender=Message)
def create_notification_for_new_message(sender, instance, created, **kwargs):
    """
    Signal handler to create a Notification when a new Message is created.
    """
    if created:  # Only create a notification for new messages
        Notification.objects.create(
            receiver=instance.receiver,
            message=instance.content,
        )
        NotificationService.invalidate_unread_cache(instance.receiver)
