from rest_framework import serializers
from communication.models import Notification

class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ["id","receiver", "message", "is_read", "created_at", "link"]
        read_only_fields = ['id','receiver',"message", 'created_at', ]
