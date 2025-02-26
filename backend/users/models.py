from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'  # ✅ Authenticate using email by default
    REQUIRED_FIELDS = ['username']  # ✅ Username is still required

    def __str__(self):
        return self.email
