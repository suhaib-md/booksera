import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class TMDbService:
    BASE_URL = "https://api.themoviedb.org/3"
    
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        
    def search_media(self, query, media_type="movie"):
        """Search for movies or TV shows based on a query"""
        endpoint = f"{self.BASE_URL}/search/{media_type}"
        params = {
            "api_key": self.api_key,
            "query": query,
            "language": "en-US",
            "page": 1,
            "include_adult": False
        }
        
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"TMDb API error: {str(e)}")
            return {"results": []}
    
    def get_movie_details(self, movie_id):
        """Get detailed information about a specific movie"""
        endpoint = f"{self.BASE_URL}/movie/{movie_id}"
        params = {
            "api_key": self.api_key,
            "language": "en-US",
            "append_to_response": "credits,similar"
        }
        
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"TMDb API error: {str(e)}")
            return {}
            
    def get_tv_details(self, tv_id):
        """Get detailed information about a specific TV show"""
        endpoint = f"{self.BASE_URL}/tv/{tv_id}"
        params = {
            "api_key": self.api_key,
            "language": "en-US",
            "append_to_response": "credits,similar"
        }
        
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"TMDb API error: {str(e)}")
            return {}   