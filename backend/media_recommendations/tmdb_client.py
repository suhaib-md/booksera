import requests
import logging
import time
from django.conf import settings
from functools import lru_cache

logger = logging.getLogger(__name__)

# TMDB API configuration
TMDB_API_URL = "https://api.themoviedb.org/3"

def get_tmdb_api_key():
    """Get TMDB API key from settings"""
    return getattr(settings, 'TMDB_API_KEY', '')

class TMDBClient:
    """Client for interacting with The Movie Database (TMDB) API"""
    
    def __init__(self):
        self.api_key = get_tmdb_api_key()
        if not self.api_key:
            logger.warning("TMDB API key not configured. Please set TMDB_API_KEY in settings.")
    
    def search_movies(self, query, page=1, year=None):
        """Search for movies by title or keywords"""
        if not self.api_key:
            return {"results": []}
            
        endpoint = f"{TMDB_API_URL}/search/movie"
        params = {
            "api_key": self.api_key,
            "query": query,
            "page": page,
            "include_adult": False,
            "language": "en-US"
        }
        
        if year:
            params["year"] = year
            
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error searching TMDB: {str(e)}")
            return {"results": []}
    
    def get_movie_details(self, movie_id):
        """Get detailed information about a specific movie"""
        if not self.api_key:
            return {}
            
        endpoint = f"{TMDB_API_URL}/movie/{movie_id}"
        params = {
            "api_key": self.api_key,
            "language": "en-US",
            "append_to_response": "keywords,credits"
        }
        
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching movie details from TMDB: {str(e)}")
            return {}
    
    @lru_cache(maxsize=100)
    def get_movie_keywords(self, movie_id):
        """Get keywords associated with a specific movie"""
        if not self.api_key:
            return []
            
        endpoint = f"{TMDB_API_URL}/movie/{movie_id}/keywords"
        params = {
            "api_key": self.api_key
        }
        
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("keywords", [])
        except requests.RequestException as e:
            logger.error(f"Error fetching movie keywords from TMDB: {str(e)}")
            return []
    
    def discover_movies(self, genres=None, sort_by="popularity.desc", page=1, year=None, with_keywords=None):
        """Discover movies by various parameters"""
        if not self.api_key:
            return {"results": []}
            
        endpoint = f"{TMDB_API_URL}/discover/movie"
        params = {
            "api_key": self.api_key,
            "language": "en-US",
            "sort_by": sort_by,
            "include_adult": False,
            "include_video": False,
            "page": page,
        }
        
        if genres:
            params["with_genres"] = genres
            
        if year:
            params["primary_release_year"] = year
            
        if with_keywords:
            params["with_keywords"] = with_keywords
            
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error discovering movies from TMDB: {str(e)}")
            return {"results": []}
    
    def search_movie_by_book(self, book_title, book_author=None, book_genres=None):
        """
        Advanced search for movies that might be based on or similar to a book
        
        Strategy:
        1. Search for exact book title (might be a direct adaptation)
        2. Search for book title with author name
        3. Use discover with genres that match the book genres
        """
        results = []
        
        # Try exact title match first (potential adaptations)
        exact_matches = self.search_movies(book_title)
        if exact_matches and "results" in exact_matches:
            results.extend(exact_matches["results"][:5])  # Take top 5 results
            
        # Try title + author (more specific)
        if book_author:
            # Extract the first author if multiple authors
            if "," in book_author:
                main_author = book_author.split(",")[0].strip()
            else:
                main_author = book_author
                
            combined_query = f"{book_title} {main_author}"
            author_matches = self.search_movies(combined_query)
            if author_matches and "results" in author_matches:
                # Only add results not already in the list
                existing_ids = {movie["id"] for movie in results}
                for movie in author_matches["results"][:5]:
                    if movie["id"] not in existing_ids:
                        results.append(movie)
        
        # Deduplicate and return results
        return results[:10]  # Limit to top 10 movies