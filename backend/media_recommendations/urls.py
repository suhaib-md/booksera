from django.urls import path
from .views import (
    get_movie_recommendations_for_book,
    get_all_movie_recommendations,
    get_movie_details,
    refresh_movie_recommendations
)

urlpatterns = [
    path('movie-recommendations/movies/refresh/', refresh_movie_recommendations, name='refresh_movie_recommendations'),
    path('movie-recommendations/movies/<str:book_id>/', get_movie_recommendations_for_book, name='get_movie_recommendations_for_book'),
    path('movie-recommendations/movies/', get_all_movie_recommendations, name='get_all_movie_recommendations'),
    path('movies/<str:movie_id>/', get_movie_details, name='get_movie_details'),
]