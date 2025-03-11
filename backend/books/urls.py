from django.urls import path
from .views import get_recommendations, search_books

urlpatterns = [
    path("api/recommendations/", get_recommendations, name="recommendations"),
    path("api/search/", search_books, name="search_books"),  # New endpoint
]
