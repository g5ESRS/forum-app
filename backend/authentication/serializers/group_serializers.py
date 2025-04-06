# your_app/serializers/group_serializers.py
from django.contrib.auth.models import Group, Permission
from rest_framework import serializers

class PermissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = ['id', 'codename', 'name', 'content_type']

class GroupSerializer(serializers.ModelSerializer):
    
    permissions = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Permission.objects.all(), required=False
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']
