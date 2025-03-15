import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from users.models import CustomUser
import random
from django.conf import settings
from transformers import pipeline, AutoTokenizer, AutoModel
import logging
import numpy as np
from numpy import dot
from numpy.linalg import norm
import torch
from collections import defaultdict
import json

logger = logging.getLogger(__name__)

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

# Use a more powerful model for better embeddings
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

# Maintain a cache to improve performance
embedding_cache = {}

def get_embedding(text, max_length=512):
    """Get embeddings using sentence-transformers model"""
    if not text or text == "":
        return np.zeros(384)  # Default embedding dimension for this model
        
    # Check cache first
    cache_key = text[:100]  # Use first 100 chars as key to avoid excessive memory usage
    if cache_key in embedding_cache:
        return embedding_cache[cache_key]
        
    # Encode and get embedding
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=max_length)
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Mean pooling - average all token embeddings
    token_embeddings = outputs.last_hidden_state
    attention_mask = inputs['attention_mask']
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    embedding = torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    
    # Convert to numpy for easier manipulation
    result = embedding[0].numpy()
    
    # Cache the result
    embedding_cache[cache_key] = result
    return result

def get_recommendations(request):
    """Legacy function - maintained for backward compatibility"""
    email = request.GET.get("email", None)
    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)

    book_titles = ["The Great Gatsby", "1984", "To Kill a Mockingbird", "Pride and Prejudice", "The Catcher in the Rye"]
    recommended_books = []

    for title in book_titles:
        params = {
            "q": title,
            "key": settings.GOOGLE_BOOKS_API_KEY,
            "maxResults": 1
        }
        response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
        data = response.json()

        if "items" in data and len(data["items"]) > 0:
            book = data["items"][0]
            volume_info = book.get("volumeInfo", {})
            image_links = volume_info.get("imageLinks", {})

            recommended_books.append({
                "id": book.get("id"),
                "title": volume_info.get("title", "Unknown Title"),
                "author": ", ".join(volume_info.get("authors", ["Unknown Author"])),
                "image": image_links.get("thumbnail", ""),
            })

    return JsonResponse({"books": recommended_books}, safe=False)

@csrf_exempt
def search_books(request):
    """Search books in Google Books API"""
    if request.method == "GET":
        query = request.GET.get("q", "").strip()
        search_type = request.GET.get("type", "all")
        page = int(request.GET.get("page", 1))
        max_results = 10

        if not query:
            return JsonResponse({"error": "Search query is required"}, status=400)

        if search_type == "title":
            query = f"intitle:{query}"
        elif search_type == "author":
            query = f"inauthor:{query}"
        elif search_type == "isbn":
            query = f"isbn:{query}"

        params = {
            "q": query,
            "key": settings.GOOGLE_BOOKS_API_KEY,
            "maxResults": max_results,
            "startIndex": (page - 1) * max_results,
            "orderBy": "relevance",
        }

        try:
            response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
            response.raise_for_status()
            data = response.json()

            books = []
            total_items = data.get("totalItems", 0)
            if "items" in data:
                for item in data["items"]:
                    volume_info = item.get("volumeInfo", {})
                    image_links = volume_info.get("imageLinks", {})
                    books.append({
                        "id": item.get("id"),
                        "title": volume_info.get("title", "Unknown Title"),
                        "authors": ", ".join(volume_info.get("authors", ["Unknown Author"])),
                        "image": image_links.get("thumbnail", ""),
                        "publishedDate": volume_info.get("publishedDate", "N/A"),
                    })

            return JsonResponse({
                "books": books,
                "totalItems": total_items,
                "currentPage": page,
                "maxResults": max_results,
            }, safe=False)
        except requests.RequestException as e:
            return JsonResponse({"error": f"Failed to fetch books: {str(e)}"}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def get_book_details(request, book_id):
    """Get detailed information about a specific book"""
    if request.method == "GET":
        try:
            # Fetch book details from Google Books API
            url = f"{GOOGLE_BOOKS_API_URL}/{book_id}"
            params = {
                "key": settings.GOOGLE_BOOKS_API_KEY
            }
            response = requests.get(url, params=params)
            response.raise_for_status()
            book_data = response.json()
            logger.info(f"Book API response for {book_id}: {book_data}")  # Add this
            
            # Extract and format the relevant information
            volume_info = book_data.get("volumeInfo", {})
            image_links = volume_info.get("imageLinks", {})
            logger.info(f"Image links: {image_links}")  # Add this
            
            # Get higher quality image if available
            image_url = image_links.get("thumbnail", 
                        image_links.get("small", 
                        image_links.get("medium", 
                        image_links.get("large", ""))))
            
            # Get industry identifiers (ISBN, etc.)
            industry_identifiers = volume_info.get("industryIdentifiers", [])
            isbn = ""
            isbn13 = ""
            for identifier in industry_identifiers:
                if identifier.get("type") == "ISBN_10":
                    isbn = identifier.get("identifier", "")
                elif identifier.get("type") == "ISBN_13":
                    isbn13 = identifier.get("identifier", "")
            
            # Format book details
            book_details = {
                "id": book_data.get("id", ""),
                "title": volume_info.get("title", "Unknown Title"),
                "subtitle": volume_info.get("subtitle", ""),
                "authors": volume_info.get("authors", ["Unknown Author"]),
                "publisher": volume_info.get("publisher", "Unknown Publisher"),
                "publishedDate": volume_info.get("publishedDate", ""),
                "description": volume_info.get("description", "No description available"),
                "pageCount": volume_info.get("pageCount", 0),
                "categories": volume_info.get("categories", []),
                "averageRating": volume_info.get("averageRating", 0),
                "ratingsCount": volume_info.get("ratingsCount", 0),
                "language": volume_info.get("language", ""),
                "previewLink": volume_info.get("previewLink", ""),
                "infoLink": volume_info.get("infoLink", ""),
                "buyLink": book_data.get("saleInfo", {}).get("buyLink", ""),
                "isbn": isbn,
                "isbn13": isbn13,
                "image": image_url,
                "thumbnail": image_links.get("thumbnail", ""),
            }
            
            # Check for user-specific data if logged in
            if request.user.is_authenticated:
                # TODO: Add logic to check if book is in user's bookshelf
                # For now, we'll just include placeholder fields
                book_details["in_bookshelf"] = False
                book_details["status"] = None
            
            return JsonResponse(book_details, safe=False)
            
        except requests.RequestException as e:
            return JsonResponse({"error": f"Failed to fetch book details: {str(e)}"}, status=500)
        except Exception as e:
            logger.error(f"Error processing book details: {str(e)}")
            return JsonResponse({"error": f"Error processing book details: {str(e)}"}, status=500)
            
    return JsonResponse({"error": "Method not allowed"}, status=405)

@login_required
@csrf_exempt
def get_personalized_recommendations(request):
    """Enhanced recommendation system with multi-strategy approach"""
    if request.method == "GET":
        user = request.user
        logger.info(f"Generating recommendations for user: {user.username}, Email: {user.email}")

        # Parse user preferences
        books_read = user.books_read or []
        if isinstance(books_read, str):
            books_read = json.loads(books_read) if books_read.startswith('[') else books_read.split(',')
        
        favorite_genres = user.favorite_genres.split(",") if user.favorite_genres else []
        favorite_authors = user.favorite_authors.split(",") if user.favorite_authors else []
        
        logger.info(f"User preferences - Books read: {len(books_read)}, Genres: {len(favorite_genres)}, Authors: {len(favorite_authors)}")
        
        # Initialize recommendation strategies
        strategies = [
            {"name": "author_based", "weight": 0.3, "books": {}},
            {"name": "genre_based", "weight": 0.25, "books": {}},
            {"name": "similar_books", "weight": 0.35, "books": {}},
            {"name": "discovery", "weight": 0.1, "books": {}}
        ]
        
        # 1. Author-based recommendations
        if favorite_authors:
            author_query = " OR ".join(f"inauthor:\"{author.strip()}\"" for author in favorite_authors if author.strip())
            params = {
                "q": author_query,
                "key": settings.GOOGLE_BOOKS_API_KEY,
                "maxResults": 20,
            }
            try:
                response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
                response.raise_for_status()
                data = response.json()
                
                if "items" in data:
                    for item in data["items"]:
                        strategies[0]["books"][item["id"]] = item
            except requests.RequestException as e:
                logger.error(f"Error fetching author recommendations: {str(e)}")
        
        # 2. Genre-based recommendations
        if favorite_genres:
            genre_queries = [f"subject:\"{genre.strip()}\"" for genre in favorite_genres if genre.strip()]
            all_genre_books = {}
            
            for query in genre_queries[:3]:  # Limit to top 3 genres to avoid API overload
                params = {
                    "q": query,
                    "key": settings.GOOGLE_BOOKS_API_KEY,
                    "maxResults": 10,
                }
                try:
                    response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
                    response.raise_for_status()
                    data = response.json()
                    
                    if "items" in data:
                        for item in data["items"]:
                            all_genre_books[item["id"]] = item
                except requests.RequestException as e:
                    logger.error(f"Error fetching genre recommendations: {str(e)}")
            
            strategies[1]["books"] = all_genre_books
        
        # 3. Similar books recommendations based on books read
        if books_read:
            similar_books = {}
            # Take most recent 3 books for similarity search
            recent_books = books_read[-3:] if len(books_read) > 3 else books_read
            
            for book_title in recent_books:
                # First get book details
                book_query = f"intitle:\"{book_title.strip()}\""
                params = {
                    "q": book_query,
                    "key": settings.GOOGLE_BOOKS_API_KEY,
                    "maxResults": 1,
                }
                
                try:
                    response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
                    response.raise_for_status()
                    data = response.json()
                    
                    if "items" in data and len(data["items"]) > 0:
                        book = data["items"][0]
                        volume_info = book.get("volumeInfo", {})
                        
                        # Extract book metadata for similar book search
                        search_terms = []
                        if "categories" in volume_info and volume_info["categories"]:
                            search_terms.extend(volume_info["categories"][:2])
                        if "authors" in volume_info and volume_info["authors"]:
                            search_terms.append(f"related:{volume_info['authors'][0]}")
                        
                        if search_terms:
                            similar_query = " ".join(search_terms)
                            params = {
                                "q": similar_query,
                                "key": settings.GOOGLE_BOOKS_API_KEY,
                                "maxResults": 5,
                            }
                            
                            sim_response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
                            sim_response.raise_for_status()
                            sim_data = sim_response.json()
                            
                            if "items" in sim_data:
                                for item in sim_data["items"]:
                                    if item["id"] != book["id"]:  # Don't recommend the same book
                                        similar_books[item["id"]] = item
                except requests.RequestException as e:
                    logger.error(f"Error fetching similar books: {str(e)}")
            
            strategies[2]["books"] = similar_books
        
        # 4. Discovery - introduce some randomness/exploration
        discovery_queries = ["best books", "award winning", "highest rated"]
        random_query = random.choice(discovery_queries)
        
        params = {
            "q": random_query,
            "key": settings.GOOGLE_BOOKS_API_KEY,
            "maxResults": 10,
        }
        
        try:
            response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            if "items" in data:
                for item in data["items"]:
                    strategies[3]["books"][item["id"]] = item
        except requests.RequestException as e:
            logger.error(f"Error fetching discovery recommendations: {str(e)}")
        
        # Generate user embedding for content-based filtering
        user_interests = " ".join(
            [g.strip() for g in favorite_genres] +
            [a.strip() for a in favorite_authors] +
            [book.strip() for book in books_read if isinstance(book, str)]
        )
        
        try:
            user_embedding = get_embedding(user_interests)
        except Exception as e:
            logger.error(f"Error computing user embedding: {str(e)}")
            user_embedding = np.zeros(384)  # Use default embedding if error
        
        # Combine and score all recommendations
        all_recommendations = {}
        books_read_set = set(b.strip().lower() for b in books_read if isinstance(b, str))
        
        for strategy in strategies:
            strategy_name = strategy["name"]
            strategy_weight = strategy["weight"]
            
            for book_id, book in strategy["books"].items():
                volume_info = book.get("volumeInfo", {})
                title = volume_info.get("title", "").lower()
                
                # Skip books already read
                if any(read_book in title or title in read_book for read_book in books_read_set):
                    continue
                
                if book_id not in all_recommendations:
                    # Initialize book entry
                    image_links = volume_info.get("imageLinks", {})
                    description = volume_info.get("description", "No description available")
                    
                    # Compute content-based similarity score
                    try:
                        book_embedding = get_embedding(description)
                        similarity = dot(user_embedding, book_embedding) / (norm(user_embedding) * norm(book_embedding))
                        if norm(user_embedding) * norm(book_embedding) == 0 or not isinstance(similarity, float):
                            similarity = 0.5
                        similarity = max(0.0, min(1.0, similarity))
                    except Exception as e:
                        logger.error(f"Error computing similarity for {title}: {str(e)}")
                        similarity = 0.5
                    
                    # Add preference boosts
                    authors = volume_info.get("authors", [])
                    authors_text = ", ".join(authors).lower() if authors else ""
                    categories = volume_info.get("categories", [])
                    categories_text = ", ".join(categories).lower() if categories else ""
                    
                    author_boost = 0.2 if any(author.lower() in authors_text for author in favorite_authors) else 0
                    genre_boost = 0.15 if any(genre.lower() in categories_text for genre in favorite_genres) else 0
                    
                    # Calculate strategy-weighted score
                    strategy_score = similarity * strategy_weight + author_boost + genre_boost
                    
                    all_recommendations[book_id] = {
                        "id": book_id,
                        "title": volume_info.get("title", "Unknown Title"),
                        "authors": authors_text.title() or "Unknown Author",
                        "image": image_links.get("thumbnail", ""),
                        "publishedDate": volume_info.get("publishedDate", "N/A"),
                        "description": description[:200] + ("..." if len(description) > 200 else ""),
                        "categories": categories_text,
                        "relevance_score": strategy_score,
                        "strategies": [strategy_name]
                    }
                else:
                    # Update existing book entry with new strategy score
                    all_recommendations[book_id]["relevance_score"] += strategy["weight"]
                    all_recommendations[book_id]["strategies"].append(strategy_name)
        
        # Normalize scores and prepare final results
        final_recommendations = list(all_recommendations.values())
        
        # Ensure diversity in recommendations
        author_counter = defaultdict(int)
        genre_counter = defaultdict(int)
        diversified_recommendations = []
        
        # Sort by relevance score and then apply diversity filtering
        final_recommendations.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        for book in final_recommendations:
            # Parse authors and genres
            authors = [a.strip().lower() for a in book["authors"].split(",") if a.strip()]
            genres = [g.strip().lower() for g in book["categories"].split(",") if g.strip()]
            
            # Apply diversity rules (max 3 books per author, max 4 books per genre)
            if all(author_counter[author] < 3 for author in authors) and all(genre_counter[genre] < 4 for genre in genres):
                diversified_recommendations.append(book)
                
                for author in authors:
                    author_counter[author] += 1
                for genre in genres:
                    genre_counter[genre] += 1
            
            # Limit to 20 recommendations
            if len(diversified_recommendations) >= 20:
                break
        
        # Add recommendation strategy and clean up output
        for book in diversified_recommendations:
            book["recommendation_reason"] = get_recommendation_reason(book, user)
            # Remove internal fields
            if "strategies" in book:
                del book["strategies"]
            if "categories" in book:
                del book["categories"]
        
        logger.info(f"Generated {len(diversified_recommendations)} diversified recommendations")
        return JsonResponse({"books": diversified_recommendations}, safe=False)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

def get_recommendation_reason(book, user):
    """Generate a personalized reason for recommendation"""
    strategies = book.get("strategies", [])
    authors = book.get("authors", "").split(",")
    categories = book.get("categories", "").split(",")
    
    favorite_authors = user.favorite_authors.split(",") if user.favorite_authors else []
    favorite_genres = user.favorite_genres.split(",") if user.favorite_genres else []
    
    reasons = []
    
    # Check for author match
    author_match = False
    for author in authors:
        if any(fav_author.lower() in author.lower() for fav_author in favorite_authors):
            reasons.append(f"By {author.strip()}, one of your favorite authors")
            author_match = True
            break
    
    # Check for genre match
    genre_match = False
    for category in categories:
        if any(fav_genre.lower() in category.lower() for fav_genre in favorite_genres):
            reasons.append(f"Matches your interest in {category.strip()}")
            genre_match = True
            break
    
    # Add strategy-based reasons
    if "similar_books" in strategies and not (author_match or genre_match):
        reasons.append("Similar to books you've read")
    elif "discovery" in strategies and not reasons:
        reasons.append("Highly rated book you might enjoy")
    
    # Default reason if none found
    if not reasons:
        reasons.append("Matches your reading preferences")
    
    return reasons[0]