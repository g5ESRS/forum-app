from django.urls import path, include
from dj_rest_auth.views import PasswordResetConfirmView

urlpatterns = [
    path('', include('dj_rest_auth.urls')),  # Includes login, logout, password reset
    path('registration/', include('dj_rest_auth.registration.urls')),  # Registration endpoint

    path(
        'auth/password/reset/confirm/<uidb64>/<token>/',
        PasswordResetConfirmView.as_view(), 
        name='password_reset_confirm'
    ),
]
