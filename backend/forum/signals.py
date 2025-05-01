from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from forum.models import Topic, Post

User = get_user_model()


@receiver(post_save, sender=User)
def assign_topic_permissions_to_user(sender, instance, created, **kwargs):

    if created:  # Add a flag for flexibility
        assign_user_permissions(instance)

    """
    Assigns 'add_topic', 'view_topic', 'add_post', and 'view_post' permissions to a user when they are created.
    """


def assign_user_permissions(user):
    # Assign topic permissions
    topic_content_type = ContentType.objects.get_for_model(Topic)
    add_topic_permission = Permission.objects.get(
        codename="add_topic", content_type=topic_content_type)
    view_topic_permission = Permission.objects.get(
        codename="view_topic", content_type=topic_content_type)

    # Assign post permissions
    post_content_type = ContentType.objects.get_for_model(Post)
    add_post_permission = Permission.objects.get(
        codename="add_post", content_type=post_content_type)
    view_post_permission = Permission.objects.get(
        codename="view_post", content_type=post_content_type)

    # Add all permissions to the user
    user.user_permissions.add(
        add_topic_permission, view_topic_permission,
        add_post_permission, view_post_permission
    )
