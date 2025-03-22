import random
import numpy as np
import requests
import logging
from django.conf import settings
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
from .tmdb_client import TMDBClient
import time
import random

# Setup logging
logger = logging.getLogger(__name__)

# Global model and client instances
tmdb_client = TMDBClient()
_model = None

def retry_tmdb_api_call(func, *args, max_retries=3, initial_delay=1, **kwargs):
    """
    Retry a TMDB API call with exponential backoff
    
    Args:
        func: The function to call
        max_retries: Maximum number of retries
        initial_delay: Initial delay in seconds
    
    Returns:
        The result of the function call, or None if all retries failed
    """
    retries = 0
    delay = initial_delay
    
    while retries < max_retries:
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.warning(f"TMDB API call failed (attempt {retries+1}/{max_retries}): {str(e)}")
            retries += 1
            
            if retries >= max_retries:
                logger.error(f"All {max_retries} TMDB API call attempts failed")
                return None
            
            # Add jitter to avoid thundering herd
            jitter = random.uniform(0, 0.5)
            sleep_time = delay + jitter
            
            logger.info(f"Retrying in {sleep_time:.2f} seconds...")
            time.sleep(sleep_time)
            
            # Exponential backoff
            delay *= 2

# Genre mapping from book categories to TMDB genres
GENRE_MAPPING = {
    "fiction": ["drama"],
    "literary fiction": ["drama"],
    "fantasy": ["fantasy"],
    "science fiction": ["science-fiction"],
    "mystery": ["mystery", "thriller"],
    "thriller": ["thriller"],
    "horror": ["horror"],
    "romance": ["romance"],
    "historical": ["history"],
    "historical fiction": ["history", "drama"],
    "adventure": ["adventure"],
    "action": ["action"],
    "young adult": ["family"],
    "biography": ["documentary", "biography"],
    "memoir": ["documentary", "biography"],
    "self-help": ["documentary"],
    "comedy": ["comedy"],
    "crime": ["crime"],
    "drama": ["drama"],
    "war": ["war"],
    "western": ["western"],
    "philosophy": ["documentary"],
    "politics": ["documentary", "history"],
    "psychology": ["documentary"]
}

def get_embedding_model():
    """Get or initialize embedding model for semantic similarity"""
    global _model
    if _model is None:
        try:
            # Load a smaller SBERT model for efficiency
            _model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("SentenceTransformer model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading SentenceTransformer model: {str(e)}")
            return None
    return _model

@lru_cache(maxsize=100)
def get_text_embedding(text):
    """Get embedding for text using SentenceTransformer"""
    model = get_embedding_model()
    if not model or not text:
        return None
    
    try:
        # Truncate text if too long
        text = text[:1000] if len(text) > 1000 else text
        embedding = model.encode([text])[0]
        return embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        return None

def calculate_similarity(text1, text2):
    """Calculate semantic similarity between two texts"""
    if not text1 or not text2:
        return 0.0
        
    emb1 = get_text_embedding(text1)
    emb2 = get_text_embedding(text2)
    
    if emb1 is None or emb2 is None:
        return 0.0
    
    similarity = cosine_similarity([emb1], [emb2])[0][0]
    return float(similarity)

def fetch_book_details(book_id):
    """Fetch book details from Google Books API"""
    try:
        api_key = getattr(settings, 'GOOGLE_BOOKS_API_KEY', '')
        url = f"https://www.googleapis.com/books/v1/volumes/{book_id}"
        if api_key:
            url += f"?key={api_key}"
            
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logger.error(f"Error fetching book details: {str(e)}")
        return None

def extract_book_info(book_data):
    """Extract relevant information from book data"""
    if not book_data or "volumeInfo" not in book_data:
        return {}
        
    volume_info = book_data["volumeInfo"]
    
    return {
        "title": volume_info.get("title", ""),
        "authors": volume_info.get("authors", []),
        "categories": volume_info.get("categories", []),
        "description": volume_info.get("description", ""),
        "published_date": volume_info.get("publishedDate", "")
    }

def map_book_genres_to_tmdb(book_categories):
    """Map book categories to TMDB genre IDs"""
    if not book_categories:
        return []
        
    # TMDB genre IDs mapping
    tmdb_genre_ids = {
        "action": 28,
        "adventure": 12,
        "animation": 16,
        "comedy": 35,
        "crime": 80,
        "documentary": 99,
        "drama": 18,
        "family": 10751,
        "fantasy": 14,
        "history": 36,
        "horror": 27,
        "mystery": 9648,
        "romance": 10749,
        "science-fiction": 878,
        "thriller": 53,
        "war": 10752,
        "western": 37,
        "biography": 36  # Using "history" as closest match to biography
    }
    
    # Normalize categories to lowercase for matching
    normalized_categories = [cat.lower() for cat in book_categories]
    
    # Map book categories to TMDB genres
    matched_genres = set()
    for category in normalized_categories:
        for book_genre, movie_genres in GENRE_MAPPING.items():
            if book_genre in category or category in book_genre:
                for movie_genre in movie_genres:
                    if movie_genre in tmdb_genre_ids:
                        matched_genres.add(tmdb_genre_ids[movie_genre])
    
    return list(matched_genres)

def extract_keywords_from_text(text):
    """Extract potential keywords from book description"""
    # This is a simple implementation
    # In production, you might use NLP libraries for keyword extraction
    if not text:
        return []
        
    # Remove common words and punctuation
    common_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'like', 
                   'through', 'over', 'before', 'between', 'after', 'from', 'up', 'down', 'as', 'of', 'a', 'an'}
    
    # Filter and normalize words
    words = text.lower().split()
    filtered_words = [word.strip('.,!?:;()[]{}""\'') for word in words if len(word) > 3]
    keywords = [word for word in filtered_words if word not in common_words]
    
    # Get unique keywords
    unique_keywords = list(set(keywords))
    
    # Return top keywords (adjust count as needed)
    return unique_keywords[:20]

def generate_recommendation_reason(book_info, movie_info, similarity_score):
    """Generate a personalized reason for recommending this movie"""
    if not book_info or not movie_info:
        return "This movie has themes similar to your book."
    
    # Get book and movie titles
    book_title = book_info.get("title", "your book")
    movie_title = movie_info.get("title", "this movie")
    
    # Base templates for recommendation reasons
    templates = [
        f"If you enjoyed '{book_title}', you might like '{movie_title}'.",
        f"'{movie_title}' explores themes similar to '{book_title}'.",
        f"Fans of '{book_title}' often enjoy '{movie_title}'.",
        f"'{movie_title}' offers a cinematic experience that complements '{book_title}'.",
        f"The narrative style of '{book_title}' is reflected in '{movie_title}'."
    ]
    
    # Add genre-specific reasons if available
    book_categories = book_info.get("categories", [])
    movie_genres = []
    for genre in movie_info.get("genres", []):
        if "name" in genre:
            movie_genres.append(genre["name"])
    
    if book_categories and movie_genres:
        book_genre = book_categories[0]
        movie_genre = movie_genres[0]
        templates.append(f"Both '{book_title}' ({book_genre}) and '{movie_title}' ({movie_genre}) share similar genres.")
    
    # Add similarity strength indicators
    if similarity_score > 0.8:
        templates.append(f"'{movie_title}' is an excellent match for readers of '{book_title}'.")
    elif similarity_score > 0.6:
        templates.append(f"'{movie_title}' shares significant thematic elements with '{book_title}'.")
    
    # Return a randomly selected reason
    return random.choice(templates)

def find_movies_for_book(book_id):
    """Find movies that are related to a specific book"""
    # Get book details
    book_data = fetch_book_details(book_id)
    if not book_data:
        return []
    
    book_info = extract_book_info(book_data)
    if not book_info:
        return []
    
    # Extract data for searching
    book_title = book_info.get("title", "")
    book_author = ", ".join(book_info.get("authors", []))
    book_description = book_info.get("description", "")
    book_categories = book_info.get("categories", [])
    
    # Search for potential movie matches
    movie_matches = tmdb_client.search_movie_by_book(book_title, book_author, book_categories)
    
    # Prepare results list
    results = []
    
    # Process each potential match
    for movie in movie_matches:
        # Get detailed movie info
        movie_id = movie.get("id")
        movie_details = tmdb_client.get_movie_details(movie_id)
        
        if not movie_details:
            continue
        
        # Calculate semantic similarity between book and movie
        movie_overview = movie_details.get("overview", "")
        combined_book_text = f"{book_title} {book_description}"
        combined_movie_text = f"{movie_details.get('title', '')} {movie_overview}"
        
        similarity_score = calculate_similarity(combined_book_text, combined_movie_text)
        
        # Generate recommendation reason
        reason = generate_recommendation_reason(book_info, movie_details, similarity_score)
        
        # Add to results if reasonably similar
        if similarity_score > 0.3:  # Adjust threshold as needed
            results.append({
                "book_id": book_id,
                "book_title": book_title,
                "movie_id": movie_id,
                "movie_title": movie_details.get("title", "Unknown Title"),
                "movie_poster": f"https://image.tmdb.org/t/p/w500{movie_details.get('poster_path')}" if movie_details.get("poster_path") else None,
                "movie_overview": movie_overview,
                "movie_release_date": movie_details.get("release_date", ""),
                "relevance_score": similarity_score,
                "recommendation_reason": reason
            })
    
    # Sort by relevance score
    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    
    return results[:5]  # Return top 5 most relevant movies