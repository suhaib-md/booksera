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
    reading_goal_target = models.IntegerField(default=0)
    reading_goal_completed = models.IntegerField(default=0)
    reading_goal_year = models.IntegerField(default=2025)
    
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
    
class Bookshelf(models.Model):
    STATUS_CHOICES = (
        ('to_read', 'To Read'),
        ('read', 'Read'),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookshelf')
    book_id = models.CharField(max_length=100)  # Google Books API book ID
    title = models.CharField(max_length=255)
    authors = models.CharField(max_length=255, blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='to_read')
    added_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book_id')  # Prevent duplicate entries

    def __str__(self):
        return f"{self.title} - {self.user.username}"