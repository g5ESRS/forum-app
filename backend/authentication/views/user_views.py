#from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.viewsets import ModelViewSet

#from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from authentication.serializers.user_serializers import UserSerializer
from core.permissions import DjangoModelPermissionsEnforceGET
User=get_user_model()

class UserViewSet(ModelViewSet):  # Only supports GET methods
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [DjangoModelPermissionsEnforceGET]  