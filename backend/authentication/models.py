# authentication/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Add extra fields here if you wish
    # e.g. bio = models.TextField(blank=True, null=True)
    # or phone_number = models.CharField(max_length=20, blank=True)
    #email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
