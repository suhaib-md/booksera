import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from users.models import CustomUser, Bookshelf
from .models import MovieRecommendation
from .tmdb_client import TMDBClient
from .recommendation_engine import find_movies_for_book

# Setup logging
logger = logging.getLogger(__name__)

# Initialize TMDB client
tmdb_client = TMDBClient()


@csrf_exempt
@login_required
def get_movie_recommendations_for_book(request, book_id):
    """Get movie recommendations for a specific book"""
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        # First check if we already have recommendations for this book
        existing_recommendations = MovieRecommendation.objects.filter(
            user=request.user,
            book_id=book_id
        ).order_by('-relevance_score')
        
        # If we have recommendations, return them
        if existing_recommendations.exists():
            recommendations = []
            for rec in existing_recommendations:
                recommendations.append({
                    "id": rec.id,
                    "book_id": rec.book_id,
                    "book_title": rec.book_title,
                    "movie_id": rec.movie_id,
                    "movie_title": rec.movie_title,
                    "movie_poster": rec.movie_poster,
                    "movie_overview": rec.movie_overview,
                    "movie_release_date": rec.movie_release_date,
                    "relevance_score": rec.relevance_score,
                    "recommendation_reason": rec.recommendation_reason
                })
            
            return JsonResponse({
                "recommendations": recommendations,
                "source": "cached"
            })
            
        # Otherwise, generate new recommendations
        movie_recommendations = find_movies_for_book(book_id)
        
        # Check if the book exists in user's bookshelf to get the title
        book_title = None
        try:
            book = Bookshelf.objects.get(user=request.user, book_id=book_id)
            book_title = book.title
        except Bookshelf.DoesNotExist:
            # Use title from recommendations if available
            if movie_recommendations and len(movie_recommendations) > 0:
                book_title = movie_recommendations[0].get("book_title", "Unknown Book")
        
        # Save recommendations to database
        saved_recommendations = []
        for movie in movie_recommendations:
            # Make sure we have a book title
            if not book_title and "book_title" in movie:
                book_title = movie["book_title"]
            
            recommendation = MovieRecommendation(
                user=request.user,
                book_id=book_id,
                book_title=book_title or "Unknown Book",
                movie_id=movie["movie_id"],
                movie_title=movie["movie_title"],
                movie_poster=movie["movie_poster"],
                movie_overview=movie["movie_overview"],
                movie_release_date=movie["movie_release_date"],
                relevance_score=movie["relevance_score"],
                recommendation_reason=movie["recommendation_reason"]
            )
            recommendation.save()
            saved_recommendations.append({
                "id": recommendation.id,
                "book_id": recommendation.book_id,
                "book_title": recommendation.book_title,
                "movie_id": recommendation.movie_id,
                "movie_title": recommendation.movie_title,
                "movie_poster": recommendation.movie_poster,
                "movie_overview": recommendation.movie_overview,
                "movie_release_date": recommendation.movie_release_date,
                "relevance_score": recommendation.relevance_score,
                "recommendation_reason": recommendation.recommendation_reason
            })
        
        return JsonResponse({
            "recommendations": saved_recommendations,
            "source": "generated"
        })
        
    except Exception as e:
        logger.error(f"Error generating movie recommendations: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
@login_required
def get_all_movie_recommendations(request):
    """Get all movie recommendations for the user's bookshelf"""
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        # Get the page number for pagination
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 10))
        
        # Calculate offset for pagination
        offset = (page - 1) * page_size
        
        # Get books from user's bookshelf
        bookshelf_items = Bookshelf.objects.filter(user=request.user)
        
        # Check if we need to filter by status
        status_filter = request.GET.get("status", None)
        if status_filter:
            bookshelf_items = bookshelf_items.filter(status=status_filter)
        
        # Get book IDs for recommendations
        book_ids = bookshelf_items.values_list('book_id', flat=True)
        
        # Get existing recommendations
        existing_recommendations = MovieRecommendation.objects.filter(
            user=request.user,
            book_id__in=book_ids
        ).order_by('-relevance_score')[offset:offset+page_size]
        
        # Prepare response
        recommendations_by_book = {}
        
        for rec in existing_recommendations:
            if rec.book_id not in recommendations_by_book:
                recommendations_by_book[rec.book_id] = {
                    "book_id": rec.book_id,
                    "book_title": rec.book_title,
                    "recommendations": []
                }
            
            recommendations_by_book[rec.book_id]["recommendations"].append({
                "id": rec.id,
                "movie_id": rec.movie_id,
                "movie_title": rec.movie_title,
                "movie_poster": rec.movie_poster,
                "movie_overview": rec.movie_overview,
                "movie_release_date": rec.movie_release_date,
                "relevance_score": rec.relevance_score,
                "recommendation_reason": rec.recommendation_reason
            })
        
        # Convert to list for response
        results = list(recommendations_by_book.values())
        
        # Check if we need to generate recommendations for books without any
        books_with_recommendations = set(recommendations_by_book.keys())
        books_without_recommendations = [
            book_id for book_id in book_ids if book_id not in books_with_recommendations
        ]
        
        # If this is the first page and we have books without recommendations, generate some
        generate_count = 0
        if page == 1 and books_without_recommendations:
            # Limit how many we generate at once to avoid overwhelming the API
            books_to_generate = books_without_recommendations
            
            for book_id in books_to_generate:
                try:
                    # Get the book title
                    book = Bookshelf.objects.get(user=request.user, book_id=book_id)
                    
                    # Find movies for this book
                    movie_recommendations = find_movies_for_book(book_id)
                    
                    if movie_recommendations:
                        # Save recommendations
                        book_result = {
                            "book_id": book_id,
                            "book_title": book.title,
                            "recommendations": []
                        }
                        
                        for movie in movie_recommendations:
                            recommendation = MovieRecommendation(
                                user=request.user,
                                book_id=book_id,
                                book_title=book.title,
                                movie_id=movie["movie_id"],
                                movie_title=movie["movie_title"],
                                movie_poster=movie["movie_poster"],
                                movie_overview=movie["movie_overview"],
                                movie_release_date=movie["movie_release_date"],
                                relevance_score=movie["relevance_score"],
                                recommendation_reason=movie["recommendation_reason"]
                            )
                            recommendation.save()
                            
                            book_result["recommendations"].append({
                                "id": recommendation.id,
                                "movie_id": recommendation.movie_id,
                                "movie_title": recommendation.movie_title,
                                "movie_poster": recommendation.movie_poster,
                                "movie_overview": recommendation.movie_overview, 
                                "movie_release_date": recommendation.movie_release_date,
                                "relevance_score": recommendation.relevance_score,
                                "recommendation_reason": recommendation.recommendation_reason
                            })
                        
                        results.append(book_result)
                        generate_count += 1
                    
                except Exception as e:
                    logger.error(f"Error generating recommendations for book {book_id}: {str(e)}")
                    continue
        
        # Calculate total pages
        total_books = bookshelf_items.count()
        total_pages = (total_books + page_size - 1) // page_size  # Ceiling division
        
        return JsonResponse({
            "results": results,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "total_items": total_books,
            "newly_generated": generate_count
        })
        
    except Exception as e:
        logger.error(f"Error retrieving movie recommendations: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@login_required
def get_movie_details(request, movie_id):
    """Get detailed information about a specific movie"""
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        # Fetch detailed movie info from TMDB
        movie_details = tmdb_client.get_movie_details(movie_id)
        
        if not movie_details:
            return JsonResponse({"error": "Movie not found"}, status=404)
        
        # Format movie poster URL
        if "poster_path" in movie_details and movie_details["poster_path"]:
            movie_details["poster_url"] = f"https://image.tmdb.org/t/p/w500{movie_details['poster_path']}"
        else:
            movie_details["poster_url"] = None
            
        # Format backdrop URL
        if "backdrop_path" in movie_details and movie_details["backdrop_path"]:
            movie_details["backdrop_url"] = f"https://image.tmdb.org/t/p/original{movie_details['backdrop_path']}"
        else:
            movie_details["backdrop_url"] = None
        
        return JsonResponse(movie_details)
        
    except Exception as e:
        logger.error(f"Error fetching movie details: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@login_required
def refresh_movie_recommendations(request):
    """Refresh movie recommendations for a specific book"""
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        import json
        data = json.loads(request.body)
        book_id = data.get("book_id")
        
        if not book_id:
            return JsonResponse({"error": "Book ID is required"}, status=400)
        
        # Delete existing recommendations for this book
        MovieRecommendation.objects.filter(
            user=request.user,
            book_id=book_id
        ).delete()
        
        # Generate new recommendations
        movie_recommendations = find_movies_for_book(book_id)
        
        # Get book title
        try:
            book = Bookshelf.objects.get(user=request.user, book_id=book_id)
            book_title = book.title
        except Bookshelf.DoesNotExist:
            if movie_recommendations and len(movie_recommendations) > 0:
                book_title = movie_recommendations[0].get("book_title", "Unknown Book")
            else:
                book_title = "Unknown Book"
        
        # Save new recommendations
        saved_recommendations = []
        for movie in movie_recommendations:
            recommendation = MovieRecommendation(
                user=request.user,
                book_id=book_id,
                book_title=book_title,
                movie_id=movie["movie_id"],
                movie_title=movie["movie_title"],
                movie_poster=movie["movie_poster"],
                movie_overview=movie["movie_overview"],
                movie_release_date=movie["movie_release_date"],
                relevance_score=movie["relevance_score"],
                recommendation_reason=movie["recommendation_reason"]
            )
            recommendation.save()
            saved_recommendations.append({
                "id": recommendation.id,
                "book_id": recommendation.book_id,
                "book_title": recommendation.book_title,
                "movie_id": recommendation.movie_id,
                "movie_title": recommendation.movie_title,
                "movie_poster": recommendation.movie_poster,
                "movie_overview": recommendation.movie_overview,
                "movie_release_date": recommendation.movie_release_date,
                "relevance_score": recommendation.relevance_score,
                "recommendation_reason": recommendation.recommendation_reason
            })
        
        return JsonResponse({
            "recommendations": saved_recommendations,
            "source": "refreshed"
        })
        
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        logger.error(f"Error refreshing movie recommendations: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)