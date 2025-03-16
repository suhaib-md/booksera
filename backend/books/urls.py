from django.urls import path
from .views import *

urlpatterns = [
    path("api/recommendations/", get_recommendations, name="recommendations"),
    path("api/search/", search_books, name="search_books"),  
    path("api/personalized-recommendations/", get_personalized_recommendations, name="personalized_recommendations"),
    path('api/book/<str:book_id>/', get_book_details, name='get_book_details'),
    path('api/mood-recommendations/', get_mood_recommendations, name='mood_recommendations'),
    path('api/books/<str:book_id>/summary/', get_book_summary, name='book_summary'),
    path('api/books/advanced-summary/', get_advanced_book_summary, name='advanced_book_summary'),
]
