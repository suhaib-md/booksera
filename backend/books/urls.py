from django.urls import path
from .views import *

urlpatterns = [
    path("recommendations/", get_recommendations, name="recommendations"),
    path("search/", search_books, name="search_books"),  
    path('categories/', get_popular_categories, name='get_popular_categories'),
    path('category/browse/', browse_category, name='browse_category'),
    path("personalized-recommendations/", get_personalized_recommendations, name="personalized_recommendations"),
    path('book/<str:book_id>/', get_book_details, name='get_book_details'),
    path('mood-recommendations/', get_mood_recommendations, name='mood_recommendations'),
    path('books/<str:book_id>/summary/', get_book_summary, name='book_summary'),
    path('books/advanced-summary/', get_advanced_book_summary, name='advanced_book_summary'),
]
