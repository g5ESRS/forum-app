from django.urls import path, include
from dj_rest_auth.views import PasswordResetConfirmView
from rest_framework.routers import DefaultRouter
from authentication.views.group_views import GroupViewSet
from authentication.views.user_views import UserViewSet
from authentication.views.permission_views import PermissionViewSet

urlpatterns = [
    # Includes login, logout, password reset
    path('', include('dj_rest_auth.urls')),
    # Registration endpoint
    path('registration/', include('dj_rest_auth.registration.urls')),

    path(
        'auth/password/reset/confirm/<uidb64>/<token>/',
        PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'
    ),

    path(
        'groups/', GroupViewSet.as_view({'post': 'create', 'get': 'list'}), name='groups-list'),

    # use patch for updating groups if all fields are not required for update
    path(
        'groups/<int:pk>/', GroupViewSet.as_view({'patch': 'partial_update'}), name='groups-detail'),

    path('users/',UserViewSet.as_view({ 'get': 'list'}),name='users-list'),
    path('users/<int:pk>/',UserViewSet.as_view({'get': 'retrieve','patch': 'partial_update'}),name='users-detail'),

    #permissions 
    path('permissions/', PermissionViewSet.as_view({'get': 'list'}), name="permissions-list"),

]
