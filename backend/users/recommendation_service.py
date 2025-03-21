from .tmdb_service import TMDbService
from .models import Bookshelf, MediaRecommendation
import re
import logging

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self):
        self.tmdb_service = TMDbService()
    
    def clean_title(self, title):
        """Remove series indicators and other noise from book titles"""
        # Remove text in parentheses, common subtitles, etc.
        cleaned = re.sub(r'\(.*?\)|\:.*$|#\d+|Book \d+.*$|\d+th Anniversary.*$', '', title)
        return cleaned.strip()
    
    def get_recommendations_for_book(self, user, book):
        """Get media recommendations for a specific book"""
        # Clean the title for better search results
        search_query = self.clean_title(book.title)
        
        # Search for movies
        movie_results = self.tmdb_service.search_media(search_query, "movie")
        tv_results = self.tmdb_service.search_media(search_query, "tv")
        
        recommendations = []
        
        # Process movie results
        for result in movie_results.get('results', [])[:3]:  # Limit to top 3
            # Calculate relevance score - can be improved with NLP later
            relevance = 0.5  # Base score
            
            # Store recommendation
            recommendation = {
                'user': user,
                'book_id': book.book_id,
                'book_title': book.title,
                'media_id': result.get('id'),
                'media_title': result.get('title'),
                'media_type': 'movie',
                'poster_path': result.get('poster_path'),
                'overview': result.get('overview'),
                'relevance_score': relevance
            }
            recommendations.append(recommendation)
            
        # Process TV results
        for result in tv_results.get('results', [])[:3]:  # Limit to top 3
            # Calculate relevance score
            relevance = 0.5  # Base score
            
            # Store recommendation
            recommendation = {
                'user': user,
                'book_id': book.book_id,
                'book_title': book.title,
                'media_id': result.get('id'),
                'media_title': result.get('name'),
                'media_type': 'tv',
                'poster_path': result.get('poster_path'),
                'overview': result.get('overview'),
                'relevance_score': relevance
            }
            recommendations.append(recommendation)
        
        return recommendations
    
    def generate_and_save_recommendations(self, user):
        """Generate and save recommendations for all books in a user's bookshelf"""
        # Get all books in user's bookshelf
        bookshelf_items = Bookshelf.objects.filter(user=user)
        
        # Clear existing recommendations to avoid duplicates
        MediaRecommendation.objects.filter(user=user).delete()
        
        all_recommendations = []
        
        # Generate recommendations for each book
        for book in bookshelf_items:
            recommendations = self.get_recommendations_for_book(user, book)
            
            # Save recommendations to database
            for rec_data in recommendations:
                try:
                    recommendation = MediaRecommendation(**rec_data)
                    all_recommendations.append(recommendation)
                except Exception as e:
                    logger.error(f"Error creating recommendation: {str(e)}")
        
        # Bulk create all recommendations
        if all_recommendations:
            MediaRecommendation.objects.bulk_create(all_recommendations, ignore_conflicts=True)
            
        return len(all_recommendations)