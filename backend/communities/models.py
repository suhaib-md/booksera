from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class BookClub(models.Model):
    CATEGORY_CHOICES = [
        ('fiction', 'Fiction'),
        ('non_fiction', 'Non-Fiction'),
        ('mystery', 'Mystery'),
        ('science_fiction', 'Science Fiction'),
        ('fantasy', 'Fantasy'),
        ('biography', 'Biography'),
        ('history', 'History'),
        ('romance', 'Romance'),
        ('thriller', 'Thriller'),
        ('young_adult', 'Young Adult'),
        ('classics', 'Classics'),
        ('self_help', 'Self Help'),
        ('poetry', 'Poetry'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_clubs')
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, related_name='joined_clubs', through='ClubMembership')
    image = models.TextField(blank=True, null=True)  # URL to club image
    current_book = models.CharField(max_length=255, blank=True, null=True)  # Current book being discussed
    current_book_id = models.CharField(max_length=100, blank=True, null=True)  # Google Books ID of current book
    current_book_image = models.TextField(blank=True, null=True)  # URL to current book image
    
    def __str__(self):
        return self.name
    
    @property
    def member_count(self):
        return self.members.count()

class ClubMembership(models.Model):
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('moderator', 'Moderator'),
        ('admin', 'Admin'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book_club = models.ForeignKey(BookClub, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'book_club')
    
    def __str__(self):
        return f"{self.user.username} - {self.book_club.name} ({self.role})"

class Message(models.Model):
    book_club = models.ForeignKey(BookClub, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"