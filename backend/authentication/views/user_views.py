#from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from core.permissions import DjangoModelPermissionsEnforceGET
from rest_framework.permissions import IsAuthenticated
from authentication.serializers.user_serializers import UserSerializer
User=get_user_model()
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from authentication.serializers.user_serializers import UserSerializer

User = get_user_model()

class UserViewSet(ModelViewSet):
    queryset = User.objects
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch'] 

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user == instance:
            return Response(self.get_serializer(instance).data)

        # Dynamically construct view permission from model
        model = self.get_queryset().model
        perm_codename = f"{model._meta.app_label}.view_{model._meta.model_name}"

        if request.user.has_perm(perm_codename):
            return Response(self.get_serializer(instance).data)

        return Response(
            {"detail": "You do not have permission to view this user."},
            status=status.HTTP_403_FORBIDDEN
        )
        
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user == instance:
            return super().partial_update(request, *args, **kwargs)

        # Dynamically build permission string from the queryset's model
        model = self.get_queryset().model
        perm_codename = f"{model._meta.app_label}.change_{model._meta.model_name}"

        if request.user.has_perm(perm_codename):
            return super().partial_update(request, *args, **kwargs)

        return Response(
            {"detail": "You do not have permission to update this user."},
            status=status.HTTP_403_FORBIDDEN
    )


#only for admins
class UserListViewSet(ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [DjangoModelPermissionsEnforceGET]