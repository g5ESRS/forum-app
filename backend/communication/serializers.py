from rest_framework import serializers
from communication.models import Notification, Message

class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ["id","receiver", "message", "is_read", "created_at", "link"]
        read_only_fields = ['id','receiver',"message", 'created_at', ]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'sent_at', 'is_read']
        read_only_fields = ['id', 'sender', 'sent_at', 'is_read']
