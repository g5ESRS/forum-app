# your_app/serializers/user_serializers.py
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from authentication.serializers.group_serializers import GroupSerializer,PermissionSerializer
from django.contrib.auth.models import Permission


class UserSerializer(serializers.ModelSerializer):

    # Make groups and user_permissions writable
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True)
    user_permissions = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), many=True)
    
    # Keep this for output only
    permissions = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = get_user_model()
        
        fields = ['id', 'username', 'email', 'groups','user_permissions', 'permissions']

    def to_representation(self, instance):
        """Modify output to show group details (id + name) and keep permissions readable."""
        representation = super().to_representation(instance)
        # Modify the 'groups' field to show both id and name for each group
        representation['groups'] = [
            {'id': group.id, 'name': group.name} for group in instance.groups.all()]
        return representation
    
    def get_permissions(self, instance):
        """Return combined direct + group permissions for read-only display."""
        user_perms = set(instance.user_permissions.all())
        group_perms = set(
            Permission.objects.filter(group__user=instance).distinct()
        )
        all_perms = user_perms.union(group_perms)
        return PermissionSerializer(all_perms, many=True).data
