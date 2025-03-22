from django.db import models
from users.models import CustomUser

class MovieRecommendation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='movie_recommendations')
    book_id = models.CharField(max_length=100)  # Google Books API book ID this movie is related to
    book_title = models.CharField(max_length=255)
    movie_id = models.CharField(max_length=100)  # TMDB API movie ID
    movie_title = models.CharField(max_length=255)
    movie_poster = models.URLField(max_length=1000, blank=True, null=True)
    movie_overview = models.TextField(blank=True, null=True)
    movie_release_date = models.CharField(max_length=20, blank=True, null=True)
    relevance_score = models.FloatField(default=0.0)  # How relevant the movie is to the book
    recommendation_reason = models.TextField(blank=True, null=True)  # Why this movie was recommended
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'book_id', 'movie_id')  # Prevent duplicate recommendations
    
    def __str__(self):
        return f"{self.movie_title} (recommended for {self.book_title})"