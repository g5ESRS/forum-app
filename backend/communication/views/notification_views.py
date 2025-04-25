from rest_framework import viewsets
from  core.permissions import IsOwner
from communication.models import Notification
from communication.serializers import NotificationSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response



class UserNotificationViewSet(viewsets.ModelViewSet):
    """
    user API endpoint for managing notifications.
    """
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend]  
    permission_classes = [IsOwner]
    owner_field = 'receiver'    

    filterset_fields = ['is_read']  #GET /?is_read=true

    def get_queryset(self):
        return Notification.objects.all()
        

    #only return notifications which belogs to the user
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().filter(receiver=request.user))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_update(self, serializer):
        serializer.save(receiver=self.request.user)




# class AdminNotificationViewSet(viewsets.ModelViewSet):
#     """
#     admin API endpoint for managing notifications.
#     """
#     queryset = Notification.objects.all()
#     serializer_class = NotificationSerializer
#     filter_backends = [DjangoFilterBackend]  
#     filterset_fields = ['is_read']  #GET /?is_read=true
    