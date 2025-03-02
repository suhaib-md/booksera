from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth import get_user_model

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True)
    favorite_genres = models.CharField(max_length=255, blank=True, null=True)
    favorite_authors = models.CharField(max_length=255, blank=True, null=True)
    books_read = models.JSONField(default=list, help_text="List of books read")
    
    USERNAME_FIELD = 'email'  # ✅ Authenticate using email by default
    REQUIRED_FIELDS = ['username']  # ✅ Username is still required

    def __str__(self):
        return self.email
    
User = get_user_model()

class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="preferences")
    favorite_genres = models.TextField(help_text="Comma-separated genres", blank=True, null=True)
    favorite_authors = models.TextField(help_text="Comma-separated authors", blank=True, null=True)
    books_read = models.JSONField(default=list, help_text="List of books read")

    def __str__(self):
        return f"{self.user.username}'s Preferences"