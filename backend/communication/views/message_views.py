from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from communication.models import Message
from communication.serializers import MessageSerializer  # Ensure this serializer exists
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from communication.filters import PrivateMessageFilter
from core.permissions import IsFieldOwner
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet


class PrivateMessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PrivateMessageFilter
    permission_classes = [IsAuthenticated,IsFieldOwner]
    owner_field = 'sender' # Assuming 'sender' is the field that identifies the owner of the message

    #only shows user's messages by default
    def get_queryset(self):
        user= self.request.user
        return Message.objects.filter(Q(sender=user) | Q(receiver=user))

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    def mark_all_as_read(self, request):
        """
        Marks all messages for the authenticated user as read.
        """
        user = request.user
        Message.objects.filter(receiver=user, is_read=False).update(is_read=True)
        return Response({"detail": "All messages marked as read."}, status=200)

