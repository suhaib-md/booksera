from django.urls import path
from .views import get_recommendations

urlpatterns = [
    path("api/recommendations/", get_recommendations, name="recommendations"),
]
