from django.urls import path
from .views import *

urlpatterns = [
    path("api/recommendations/", get_recommendations, name="recommendations"),
    path("api/search/", search_books, name="search_books"),  
    path("api/personalized-recommendations/", get_personalized_recommendations, name="personalized_recommendations"),
]
