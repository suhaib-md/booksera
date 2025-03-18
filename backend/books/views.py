import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from users.models import CustomUser
import random
from django.conf import settings
from transformers import pipeline, AutoTokenizer, AutoModel
from transformers import BartForConditionalGeneration, BartTokenizer, T5ForConditionalGeneration, T5Tokenizer
import logging
import os
import time
from django.core.cache import cache
import numpy as np
from numpy import dot
from numpy.linalg import norm
import torch
from collections import defaultdict
from sklearn.metrics.pairwise import cosine_similarity
import json
from functools import lru_cache
from sentence_transformers import SentenceTransformer

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
def browse_category(request):
    """Get books for a specific category from Google Books API"""
    if request.method == "GET":
        category = request.GET.get("category", "").strip()
        max_results = int(request.GET.get("max_results", 10))
        
        if not category:
            return JsonResponse({"error": "Category is required"}, status=400)
        
        # Build the query for the category
        query = f"subject:{category}"
        
        params = {
            "q": query,
            "key": settings.GOOGLE_BOOKS_API_KEY,
            "maxResults": max_results,
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
                        "description": volume_info.get("description", "No description available"),
                    })
            
            return JsonResponse({
                "books": books,
                "totalItems": total_items,
                "category": category,
            }, safe=False)
        except requests.RequestException as e:
            return JsonResponse({"error": f"Failed to fetch category books: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def get_popular_categories(request):
    """Get popular or featured book categories"""
    if request.method == "GET":
        # You could make this dynamic in the future based on trending categories
        # or user preferences, but for now we'll use a static list
        categories = [
            {"id": "fiction", "name": "Fiction", "emoji": "📚", "color": "from-blue-500 to-indigo-600"},
            {"id": "mystery", "name": "Mystery", "emoji": "🔍", "color": "from-purple-500 to-pink-600"},
            {"id": "fantasy", "name": "Fantasy", "emoji": "🧙", "color": "from-teal-500 to-green-600"},
            {"id": "romance", "name": "Romance", "emoji": "❤️", "color": "from-red-500 to-pink-600"},
            {"id": "biography", "name": "Biography", "emoji": "👤", "color": "from-yellow-500 to-amber-600"},
            {"id": "history", "name": "History", "emoji": "🏛️", "color": "from-gray-600 to-gray-800"},
            {"id": "science", "name": "Science", "emoji": "🔬", "color": "from-cyan-500 to-blue-600"},
            {"id": "self-help", "name": "Self-Help", "emoji": "🌱", "color": "from-green-500 to-teal-600"}
        ]
        
        # Optional: randomly select a subset if requested
        limit = request.GET.get("limit")
        if limit and limit.isdigit():
            import random
            limit = min(int(limit), len(categories))
            categories = random.sample(categories, limit)
        
        return JsonResponse({
            "categories": categories
        }, safe=False)
        
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

# Enhanced mood mapping with more nuanced keywords and weighted aspects
MOOD_MAPPING = {
    "happy": {
        "keywords": ["uplifting", "joyful", "comedy", "humor", "feel-good", "optimistic", "cheerful", "delightful", "amusing"],
        "genres": ["humor", "comedy", "romance comedy", "light fantasy", "satire", "slice of life"],
        "tone": ["light", "playful", "cheerful", "upbeat", "warm"],
        "themes": ["friendship", "success", "personal growth", "overcoming obstacles", "humor", "joy"],
        "avoid": ["tragedy", "horror", "psychological thriller", "true crime"]
    },
    "sad": {
        "keywords": ["melancholy", "moving", "emotional", "bittersweet", "poignant", "reflective", "sorrow", "grief"],
        "genres": ["drama", "tragedy", "literary fiction", "memoir", "psychological fiction", "historical drama"],
        "tone": ["contemplative", "melancholic", "somber", "reflective", "thoughtful"],
        "themes": ["loss", "redemption", "relationships", "meaning", "memory", "healing", "grief"],
        "avoid": ["comedy", "parody", "satire", "light romance"]
    },
    "inspired": {
        "keywords": ["motivational", "inspiring", "success", "achievement", "resilience", "purpose", "mindset", "transformation"],
        "genres": ["self-help", "biography", "business", "personal development", "philosophy", "psychology"],
        "tone": ["encouraging", "energetic", "confident", "passionate", "authoritative"],
        "themes": ["overcoming obstacles", "personal growth", "achievement", "purpose", "leadership", "transformation"],
        "avoid": ["nihilistic", "dystopian", "horror", "cynical"]
    },
    "adventurous": {
        "keywords": ["action", "adventure", "journey", "exploration", "thrill", "quest", "discovery", "expedition"],
        "genres": ["adventure", "action", "travel", "fantasy", "historical adventure", "science fiction"],
        "tone": ["fast-paced", "exciting", "suspenseful", "dynamic", "bold"],
        "themes": ["discovery", "courage", "challenge", "survival", "journey", "exploration", "quest"],
        "avoid": ["slow-paced", "philosophical treatise", "academic", "slice of life"]
    },
    "relaxed": {
        "keywords": ["cozy", "calm", "peaceful", "gentle", "heartwarming", "serene", "soothing", "tranquil", "comforting"],
        "genres": ["cozy mystery", "gentle fiction", "nature writing", "slow-paced fiction", "slice of life", "pastoral"],
        "tone": ["calm", "gentle", "warm", "peaceful", "contemplative", "unhurried"],
        "themes": ["everyday life", "simple pleasures", "nature", "small communities", "comfort", "harmony"],
        "avoid": ["suspense", "horror", "violent", "fast-paced thrillers", "dystopian"]
    },
    "anxious": {
        "keywords": ["soothing", "mindfulness", "calming", "stress-relief", "reassuring", "grounding", "centering", "therapeutic"],
        "genres": ["meditation", "self-help", "psychology", "mindfulness", "practical philosophy", "nature writing"],
        "tone": ["calming", "reassuring", "steady", "supportive", "gentle", "structured"],
        "themes": ["coping", "resilience", "balance", "perspective", "self-care", "mindfulness", "healing"],
        "avoid": ["horror", "suspense", "true crime", "dystopian", "apocalyptic"]
    },
    "romantic": {
        "keywords": ["love", "passion", "romance", "relationship", "affection", "attraction", "intimacy", "devotion", "desire"],
        "genres": ["romance", "love stories", "contemporary romance", "historical romance", "romantic comedy", "women's fiction"],
        "tone": ["passionate", "tender", "intimate", "emotional", "warm", "hopeful"],
        "themes": ["love", "connection", "relationships", "attraction", "commitment", "passion", "romance"],
        "avoid": ["horror", "gritty crime", "violent thrillers", "dystopian", "nihilistic"]
    },
    "curious": {
        "keywords": ["fascinating", "surprising", "knowledge", "discovery", "intriguing", "thought-provoking", "educational", "revealing"],
        "genres": ["popular science", "history", "psychology", "educational", "narrative nonfiction", "anthropology", "biography"],
        "tone": ["inquisitive", "engaging", "informative", "thought-provoking", "accessible", "clear"],
        "themes": ["discovery", "learning", "understanding", "exploration", "insight", "curiosity", "knowledge"],
        "avoid": ["purely fictional", "fantasy without substance", "overly simplistic"]
    },
    "nostalgic": {
        "keywords": ["classic", "retro", "memory", "childhood", "reminiscence", "bygone", "timeless", "vintage", "heritage"],
        "genres": ["historical fiction", "memoir", "classic literature", "coming-of-age", "period drama", "family saga"],
        "tone": ["reflective", "wistful", "warm", "evocative", "sentimental", "timeless"],
        "themes": ["memory", "time", "childhood", "heritage", "tradition", "looking back", "history", "family"],
        "avoid": ["futuristic", "cutting-edge technology", "modern problems", "contemporary issues"]
    },
    "scared": {
        "keywords": ["horror", "thriller", "suspense", "spooky", "supernatural", "eerie", "chilling", "creepy", "terrifying"],
        "genres": ["horror", "thriller", "supernatural", "mystery", "psychological suspense", "gothic"],
        "tone": ["suspenseful", "tense", "mysterious", "ominous", "eerie", "foreboding"],
        "themes": ["fear", "survival", "unknown", "danger", "supernatural", "psychological terror", "suspense"],
        "avoid": ["light comedy", "heartwarming", "feel-good", "children's books"]
    },
    "angry": {
        "keywords": ["justice", "revenge", "empowerment", "revolution", "outrage", "rebellion", "resistance", "confrontation"],
        "genres": ["thriller", "social justice", "action", "dystopian", "political fiction", "crime", "revenge stories"],
        "tone": ["intense", "passionate", "direct", "powerful", "assertive", "unflinching"],
        "themes": ["justice", "resistance", "empowerment", "conflict", "fighting back", "standing up", "overcoming oppression"],
        "avoid": ["passive protagonists", "escapist fantasy", "light-hearted comedy", "stories without conflict"]
    },
    "bored": {
        "keywords": ["engrossing", "page-turner", "unputdownable", "gripping", "captivating", "compelling", "fast-paced", "addictive"],
        "genres": ["thriller", "mystery", "fantasy", "science fiction", "adventure", "suspense", "action"],
        "tone": ["fast-paced", "engaging", "suspenseful", "dynamic", "surprising", "unpredictable"],
        "themes": ["adventure", "mystery", "conflict", "challenge", "excitement", "discovery", "unexpected"],
        "avoid": ["slow-paced", "highly descriptive", "academic", "philosophical", "overly complex"]
    },
    "confused": {
        "keywords": ["clarity", "explanation", "understanding", "insight", "accessible", "straightforward", "illuminating", "instructive"],
        "genres": ["self-help", "philosophy", "psychology", "educational", "how-to", "popular science", "guides"],
        "tone": ["clear", "straightforward", "organized", "methodical", "accessible", "logical"],
        "themes": ["understanding", "clarity", "knowledge", "insight", "explanation", "guidance", "organization"],
        "avoid": ["experimental fiction", "stream of consciousness", "complex postmodern", "abstract"]
    },
    "hopeful": {
        "keywords": ["optimistic", "hope", "positivity", "inspiring", "encouraging", "uplifting", "promising", "bright"],
        "genres": ["inspirational", "feel-good fiction", "motivational", "uplifting memoir", "positive psychology"],
        "tone": ["optimistic", "uplifting", "encouraging", "positive", "forward-looking", "bright"],
        "themes": ["hope", "perseverance", "overcoming obstacles", "new beginnings", "resilience", "possibility", "future"],
        "avoid": ["nihilistic", "dystopian", "apocalyptic", "bleak", "depressing"]
    }
}

# Use a more powerful sentence transformer model
def initialize_ai_model():
    """Initialize the advanced recommendation models"""
    # Load SentenceTransformer for better semantic understanding
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Keep BERT for backward compatibility or specific tasks
    bert_tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
    bert_model = AutoModel.from_pretrained("bert-base-uncased")
    
    return {
        'sentence_transformer': sentence_model,
        'bert_tokenizer': bert_tokenizer,
        'bert_model': bert_model
    }

# Global models
AI_MODELS = initialize_ai_model()

# Enhanced mood descriptions for better embeddings
def initialize_mood_embeddings():
    mood_descriptions = {
        "happy": """Content that brings joy and positive emotions. Books with uplifting stories, 
                humor, light-hearted comedy, and happy endings. Characters who overcome challenges 
                with optimism and find happiness. Narratives that are upbeat, warm, and leave the 
                reader feeling good. Stories that celebrate life's simple pleasures and human connection.""",
        
        "sad": """Content that explores deeper emotions and provides catharsis. Books with moving stories 
                about loss, grief, and emotional journeys. Thoughtful examinations of human suffering 
                and resilience. Literary works that acknowledge sadness as part of life and help 
                process complex feelings. Stories that find meaning and beauty in melancholy.""",
        
        "inspired": """Content that motivates and empowers. Books with stories of remarkable achievement, 
                    perseverance, and transformation. Works that share wisdom and strategies for 
                    personal growth. Narratives that showcase human potential and the power of 
                    determination. Stories that ignite passion and encourage action.""",
        
        "adventurous": """Content that excites and thrills with journeys and exploration. Books featuring 
                        quests, expeditions, and discovery of new worlds or ideas. Fast-paced narratives 
                        with dynamic characters facing challenges and dangers. Stories of courage, survival, 
                        and the human drive to explore the unknown. Works that transport readers to exotic 
                        locations and extraordinary circumstances.""",
        
        "relaxed": """Content that soothes and comforts. Books with gentle pacing and peaceful atmospheres 
                    that provide an escape from stress. Cozy narratives set in charming locations with 
                    likeable characters and minimal conflict. Stories that celebrate everyday life, simple 
                    pleasures, and harmony with nature. Works that create a sense of tranquility and contentment.""",
        
        "anxious": """Content that helps manage worry and stress. Books offering practical guidance on 
                mindfulness and stress-relief techniques. Reassuring narratives that provide perspective 
                on anxiety-inducing situations. Stories of characters finding balance and developing 
                resilience. Works that create a sense of calm and offer tools for emotional regulation 
                and self-care.""",
        
        "romantic": """Content that celebrates love and passion. Books exploring the development of romantic 
                    relationships and emotional connections. Stories of attraction, desire, and commitment 
                    between characters. Narratives that capture the intensity and tenderness of love in its 
                    many forms. Works that evoke warmth and hope through meaningful relationships and 
                    intimate moments.""",
        
        "curious": """Content that satisfies the thirst for knowledge and discovery. Books that reveal 
                fascinating information and unexpected insights about our world. Thought-provoking 
                explorations of ideas, history, science, and human behavior. Educational narratives 
                that make complex subjects accessible and engaging. Works that inspire wonder and 
                expand understanding through clear, informative approaches.""",
        
        "nostalgic": """Content that evokes the bittersweet pleasure of remembering. Books that transport 
                    readers to bygone eras with rich historical detail. Stories that capture the essence 
                    of childhood memories and cultural heritage. Reflective narratives about family, 
                    tradition, and the passage of time. Works that create a sense of connection to the 
                    past through evocative, wistful storytelling.""",
        
        "scared": """Content that thrills with suspense and fear. Books with eerie atmospheres, supernatural 
                elements, or psychological tension. Stories featuring characters facing danger, the unknown, 
                or terrifying situations. Narratives that build suspense and create a sense of foreboding. 
                Works that explore primal fears and the darker aspects of human experience through chilling, 
                suspenseful storytelling.""",
        
        "angry": """Content that channels and explores righteous indignation. Books featuring characters 
                standing up against injustice and fighting for change. Intense narratives of resistance, 
                rebellion, and empowerment. Stories that confront difficult truths about society and power. 
                Works that transform outrage into action through powerful, unflinching portrayals of conflict 
                and the struggle for justice.""",
        
        "bored": """Content that captivates with excitement and engagement. Books with gripping plots that 
                keep pages turning and attention focused. Fast-paced, dynamic stories with unexpected twists 
                and compelling conflicts. Narratives that transport readers away from monotony into worlds 
                of adventure and intrigue. Works that stimulate the mind and imagination through surprising, 
                unpredictable storytelling.""",
        
        "confused": """Content that brings clarity and understanding. Books that explain complex concepts 
                in accessible, straightforward language. Well-organized narratives that guide readers 
                step-by-step through difficult topics. Stories that illuminate confusing aspects of life 
                and human behavior. Works that create order from chaos through logical, methodical approaches 
                to knowledge and insight.""",
        
        "hopeful": """Content that inspires optimism and positive expectation. Books with uplifting narratives 
                about new beginnings and positive change. Stories of characters persevering through difficult 
                circumstances and finding light in darkness. Forward-looking works that emphasize possibility 
                and potential. Narratives that reinforce belief in a better future through encouraging, 
                bright perspectives on life's challenges."""
    }
    
    # Generate embeddings using SentenceTransformer for better semantic understanding
    mood_embeddings = {}
    for mood, description in mood_descriptions.items():
        mood_embeddings[mood] = AI_MODELS['sentence_transformer'].encode([description])[0]
    
    return mood_embeddings

# Cache the mood embeddings
MOOD_EMBEDDINGS = initialize_mood_embeddings()

def get_user_preference_embedding(user):
    """Generate embeddings for user preferences based on reading history and explicit preferences"""
    preferences_text = ""
    
    # Add favorite genres if available
    if hasattr(user, 'favorite_genres') and user.favorite_genres:
        genres = user.favorite_genres.split(",")
        preferences_text += f"Enjoys reading {', '.join(genres)}. "
    
    # Add reading history if available - this assumes a user_book_history model exists
    if hasattr(user, 'reading_history') and user.reading_history.exists():
        history = user.reading_history.all()[:5]  # Get recent history
        history_titles = [item.book.title for item in history if hasattr(item, 'book')]
        if history_titles:
            preferences_text += f"Has recently read {', '.join(history_titles)}. "
    
    # Add reading preferences if available
    if hasattr(user, 'reading_preferences') and user.reading_preferences:
        preferences_text += user.reading_preferences
    
    # If we have preference data, create an embedding
    if preferences_text:
        return AI_MODELS['sentence_transformer'].encode([preferences_text])[0]
    
    return None

def analyze_book_emotional_tone(volume_info):
    """Analyze the emotional tone and themes of a book based on available metadata"""
    # Extract all meaningful text from the book info
    text_elements = []
    
    if volume_info.get('title'):
        text_elements.append(volume_info['title'])
    
    if volume_info.get('subtitle'):
        text_elements.append(volume_info['subtitle'])
    
    if volume_info.get('description'):
        text_elements.append(volume_info['description'])
    
    if volume_info.get('categories'):
        text_elements.append(' '.join(volume_info['categories']))
    
    # Join all text elements
    full_text = ' '.join(text_elements)
    
    # Create emotion markers to detect in the text
    emotion_markers = {
        'joy': ['happiness', 'joyful', 'celebration', 'delightful', 'cheerful', 'happy', 'uplifting'],
        'sadness': ['sad', 'grief', 'melancholy', 'heartbreaking', 'sorrow', 'tragic', 'loss'],
        'fear': ['frightening', 'scary', 'terrifying', 'horror', 'dread', 'suspense', 'threat'],
        'anger': ['angry', 'rage', 'fury', 'outrage', 'vengeance', 'injustice', 'conflict'],
        'surprise': ['unexpected', 'twist', 'surprising', 'shocking', 'revelation', 'discovery'],
        'anticipation': ['quest', 'journey', 'adventure', 'suspense', 'anticipate', 'awaiting'],
        'trust': ['friendship', 'loyalty', 'reliability', 'honesty', 'faith', 'steadfast'],
        'disgust': ['revulsion', 'disturbing', 'grotesque', 'repulsive', 'stomach-turning']
    }
    
    # Simple sentiment scoring
    emotions = {}
    for emotion, markers in emotion_markers.items():
        score = sum(1 for marker in markers if marker.lower() in full_text.lower())
        emotions[emotion] = score / len(markers)  # Normalize
    
    # Extract prominent themes
    theme_markers = {
        'adventure': ['journey', 'quest', 'expedition', 'travel', 'exploration', 'discovery'],
        'romance': ['love', 'relationship', 'romantic', 'passion', 'affair', 'marriage'],
        'mystery': ['mystery', 'puzzle', 'detective', 'clue', 'investigation', 'solve'],
        'growth': ['development', 'learning', 'improvement', 'maturity', 'wisdom', 'realization'],
        'conflict': ['battle', 'struggle', 'fight', 'conflict', 'confrontation', 'war', 'opposition'],
        'family': ['family', 'parent', 'child', 'sibling', 'generation', 'household', 'relatives'],
        'identity': ['identity', 'self', 'discovery', 'understanding', 'realization', 'purpose'],
        'society': ['social', 'community', 'culture', 'society', 'political', 'class', 'status']
    }
    
    themes = {}
    for theme, markers in theme_markers.items():
        score = sum(1 for marker in markers if marker.lower() in full_text.lower())
        themes[theme] = score / len(markers)  # Normalize
    
    return {
        'emotions': emotions,
        'themes': themes,
        'embedding': AI_MODELS['sentence_transformer'].encode([full_text])[0]
    }

@csrf_exempt
@login_required
def get_mood_recommendations(request):
    """Enhanced recommendation system based on user's mood with advanced AI matching"""
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    user = request.user
    mood = request.GET.get("mood", "").lower()
    limit = int(request.GET.get("limit", 10))
    variety = request.GET.get("variety", "medium")  # Allow user to control recommendation variety
    
    logger.info(f"Generating enhanced AI-based mood recommendations for user: {user.username}, Mood: {mood}")
    
    if not mood or mood not in MOOD_MAPPING:
        return JsonResponse({"error": "Valid mood parameter is required"}, status=400)
    
    try:
        # Get the mood embedding and data
        current_mood_embedding = MOOD_EMBEDDINGS.get(mood)
        mood_data = MOOD_MAPPING[mood]
        
        # Get user preference embedding if available
        user_embedding = get_user_preference_embedding(user)
        
        # Create a diverse set of search queries to ensure variety
        search_queries = []
        
        # Add mood-based queries
        keywords = random.sample(mood_data["keywords"], min(3, len(mood_data["keywords"])))
        genres = random.sample(mood_data["genres"], min(2, len(mood_data["genres"])))
        themes = random.sample(mood_data.get("themes", []), min(2, len(mood_data.get("themes", []))))
        
        # Create primary mood-based query
        primary_terms = keywords + genres + themes
        random.shuffle(primary_terms)
        search_queries.append(" OR ".join(primary_terms[:4]))  # Limit terms for better results
        
        # Add user preference-based query if available
        if hasattr(user, 'favorite_genres') and user.favorite_genres:
            favorite_genres = user.favorite_genres.split(",")
            if favorite_genres:
                genre_query = f"{mood} {random.choice(keywords)} {random.choice(favorite_genres)}"
                search_queries.append(genre_query)
        
        # Add reading level or target audience if set in user preferences
        if hasattr(user, 'reading_level') and user.reading_level:
            level_query = f"{mood} {user.reading_level}"
            search_queries.append(level_query)
        
        # Collect all results from multiple queries
        all_items = []
        
        for query in search_queries:
            params = {
                "q": query,
                "key": settings.GOOGLE_BOOKS_API_KEY,
                "maxResults": limit * 2,  # Request more for AI filtering
                "orderBy": "relevance",
                "fields": "items(id,volumeInfo)",  # Reduce response size
            }
            
            response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            if "items" in data:
                all_items.extend(data["items"])
        
        # De-duplicate items
        unique_items = {}
        for item in all_items:
            if item["id"] not in unique_items:
                unique_items[item["id"]] = item
        
        # Process results using advanced AI analysis
        books_with_scores = []
        for item in unique_items.values():
            volume_info = item.get("volumeInfo", {})
            image_links = volume_info.get("imageLinks", {})
            
            # Skip books without sufficient information
            if not volume_info.get("description") or "thumbnail" not in image_links:
                continue
                
            # Perform emotional analysis
            book_analysis = analyze_book_emotional_tone(volume_info)
            book_embedding = book_analysis['embedding']
            
            # Calculate multiple similarity scores
            mood_similarity = float(cosine_similarity([current_mood_embedding], [book_embedding])[0][0])
            
            # Calculate user preference similarity if available
            user_similarity = 0.5  # Default neutral value
            if user_embedding is not None:
                user_similarity = float(cosine_similarity([user_embedding], [book_embedding])[0][0])
            
            # Check for themes that match the current mood
            theme_match = 0
            if mood in ["happy", "joyful"]:
                theme_match = book_analysis['emotions'].get('joy', 0)
            elif mood in ["sad", "melancholy"]:
                theme_match = book_analysis['emotions'].get('sadness', 0)
            elif mood in ["scared", "frightened"]:
                theme_match = book_analysis['emotions'].get('fear', 0)
            elif mood in ["angry", "outraged"]:
                theme_match = book_analysis['emotions'].get('anger', 0)
            elif mood in ["adventurous"]:
                theme_match = book_analysis['themes'].get('adventure', 0)
            elif mood in ["romantic"]:
                theme_match = book_analysis['themes'].get('romance', 0)
            
            # Combine scores with weighting
            # Adjust these weights based on what seems to give the best results
            combined_score = (
                mood_similarity * 0.6 +
                user_similarity * 0.25 +
                theme_match * 0.15
            )
            
            # Check for mood mismatch (avoid inappropriate content for the mood)
            if mood_data.get("avoid"):
                avoid_terms = mood_data["avoid"]
                desc_lower = volume_info.get("description", "").lower()
                categories = [c.lower() for c in volume_info.get("categories", [])]
                
                # Check if book contains avoided terms
                for term in avoid_terms:
                    if term.lower() in desc_lower or any(term.lower() in category for category in categories):
                        combined_score *= 0.7  # Reduce score but don't eliminate entirely
            
            # Add diversity factor based on user's variety preference
            if variety == "high":
                # Add some randomness to encourage diverse recommendations
                combined_score = combined_score * 0.8 + random.uniform(0, 0.2)
            elif variety == "low":
                # Prioritize the closest matches
                combined_score = combined_score * 0.95 + random.uniform(0, 0.05)
            
            books_with_scores.append({
                "item": item,
                "volume_info": volume_info,
                "image_links": image_links,
                "similarity_score": combined_score,
                "mood_similarity": mood_similarity,
                "user_similarity": user_similarity,
                "theme_match": theme_match,
                "emotional_profile": book_analysis['emotions'],
                "thematic_profile": book_analysis['themes']
            })
        
        # Sort by similarity score and take top matches
        books_with_scores.sort(key=lambda x: x["similarity_score"], reverse=True)
        top_matches = books_with_scores[:limit]
        
        # Format final results
        books = []
        for match in top_matches:
            item = match["item"]
            volume_info = match["volume_info"]
            image_links = match["image_links"]
            
            # Generate personalized recommendation reason
            recommendation_reason = generate_personalized_recommendation_reason(
                mood, 
                volume_info, 
                match["similarity_score"],
                match["emotional_profile"],
                match["thematic_profile"],
                user
            )
            
            books.append({
                "id": item.get("id"),
                "title": volume_info.get("title", "Unknown Title"),
                "authors": ", ".join(volume_info.get("authors", ["Unknown Author"])),
                "image": image_links.get("thumbnail", ""),
                "publishedDate": volume_info.get("publishedDate", "N/A"),
                "description": volume_info.get("description", "")[:150] + "..." if volume_info.get("description") else "",
                "categories": ", ".join(volume_info.get("categories", [])),
                "mood_relevance": mood,
                "similarity_score": round(match["similarity_score"] * 100, 1),  # Convert to percentage
                "recommendation_reason": recommendation_reason
            })
        
        return JsonResponse({
            "books": books,
            "mood": mood,
            "mood_description": get_enhanced_mood_description(mood, user)
        }, safe=False)
        
    except requests.RequestException as e:
        logger.error(f"Error fetching mood recommendations: {str(e)}")
        return JsonResponse({"error": f"Failed to fetch recommendations: {str(e)}"}, status=500)
    except Exception as e:
        logger.error(f"Error processing mood recommendations: {str(e)}")
        return JsonResponse({"error": f"Error processing recommendations: {str(e)}"}, status=500)

def generate_personalized_recommendation_reason(mood, volume_info, similarity_score, emotional_profile, thematic_profile, user):
    """Generate a highly personalized recommendation reason based on comprehensive analysis"""
    # Base mood phrases (enhanced from original)
    mood_phrases = {
    "happy": [
        "Perfect for maintaining your upbeat mood",
        "A joyful read that aligns with your happy state",
        "Will keep your spirits high with its delightful content",
        "Matches your cheerful mood with its uplifting story"
    ],
    "sad": [
        "A moving story that resonates with your current emotional state",
        "Provides thoughtful reflection when you're feeling melancholic",
        "A beautifully written companion for your contemplative mood",
        "Explores emotional depths that mirror your current feelings"
    ],
    "inspired": [
        "Fuels your motivation with powerful stories of achievement",
        "Amplifies your inspired state with transformative narratives",
        "Channels your energy into meaningful personal growth",
        "Reinforces your drive with accounts of remarkable perseverance"
    ],
    "adventurous": [
        "Satisfies your thirst for excitement and discovery",
        "Takes your adventurous spirit on an unforgettable journey",
        "Matches your bold mood with thrilling quests and challenges",
        "Fuels your desire for exploration with dynamic storytelling"
    ],
    "relaxed": [
        "Maintains your peaceful state with gentle, soothing narrative",
        "A comforting read that complements your tranquil mood",
        "Enhances your calm with its warm, unhurried storytelling",
        "Preserves your serene feeling with cozy, heartwarming content"
    ],
    "anxious": [
        "Offers reassurance and perspective when you're feeling on edge",
        "Provides calming insights to help manage your anxious thoughts",
        "A grounding read that brings balance to your worried mind",
        "Therapeutic storytelling that eases tension and builds resilience"
    ],
    "romantic": [
        "Embraces your passionate mood with intimate, moving relationships",
        "Complements your romantic feelings with heartfelt connections",
        "Indulges your desire for love stories with tender narratives",
        "Matches your affectionate state with tales of deep emotional bonds"
    ],
    "curious": [
        "Satisfies your inquisitive mind with fascinating insights",
        "Feeds your curiosity with thought-provoking discoveries",
        "Expands your knowledge in exactly the way you're craving",
        "Rewards your questioning nature with illuminating content"
    ],
    "nostalgic": [
        "Embraces your reflective mood with evocative glimpses of the past",
        "Complements your wistful feelings with rich historical atmosphere",
        "Resonates with your sentimental state through timeless storytelling",
        "Honors your connection to the past with memory-infused narratives"
    ],
    "scared": [
        "Intensifies your thrill-seeking mood with suspenseful storytelling",
        "Channels your desire for spine-tingling tension into perfect frights",
        "Matches your appetite for eerie experiences with chilling tales",
        "Complements your brave exploration of fear with haunting narratives"
    ],
    "angry": [
        "Channels your passionate energy into stories of justice and resistance",
        "Reflects your righteous indignation with powerful accounts of change",
        "Transforms your intensity into meaningful engagement with conflict",
        "Honors your strong emotions with unflinching portrayals of struggle"
    ],
    "bored": [
        "Captivates your attention with unputdownable, gripping storytelling",
        "Rescues you from monotony with fast-paced, engaging adventures",
        "Banishes your restlessness with addictive, surprising narratives",
        "Transforms your boredom into excitement with compelling action"
    ],
    "confused": [
        "Brings clarity and understanding when you need straightforward guidance",
        "Organizes complex ideas into accessible insights for your clouded mind",
        "Illuminates your path with clear, methodical explanations",
        "Transforms confusion into comprehension with logical, structured content"
    ],
    "hopeful": [
        "Nurtures your optimism with inspiring stories of possibility",
        "Reinforces your positive outlook with uplifting narratives",
        "Brightens your forward-looking perspective with encouraging themes",
        "Celebrates your hopeful spirit with tales of resilience and new beginnings"
    ]
}
    
    # Select base phrase for the mood
    phrases = mood_phrases.get(mood, ["A perfect match for your current mood"])
    reason = random.choice(phrases)
    
    # Add match quality based on similarity score
    if similarity_score > 0.85:
        match_quality = "Outstanding emotional match"
    elif similarity_score > 0.75:
        match_quality = "Excellent emotional match"
    elif similarity_score > 0.65:
        match_quality = "Strong emotional match"
    else:
        match_quality = "Good emotional match"
    
    # Add specific book elements that match the mood
    book_elements = []
    
    # Add genre information if available
    genres = volume_info.get("categories", [])
    if genres:
        genre = random.choice(genres)
        book_elements.append(f"its {genre} elements")
    
    # Add emotional tone information
    dominant_emotions = sorted(emotional_profile.items(), key=lambda x: x[1], reverse=True)
    if dominant_emotions and dominant_emotions[0][1] > 0.3:
        top_emotion = dominant_emotions[0][0]
        emotion_phrases = {
            "joy": "uplifting tone",
            "sadness": "poignant storytelling",
            "fear": "suspenseful narrative",
            "anger": "powerful emotional intensity",
            "surprise": "unexpected twists",
            "anticipation": "engaging suspense",
            "trust": "heartwarming relationships",
            "disgust": "challenging subject matter"
        }
        book_elements.append(emotion_phrases.get(top_emotion, f"{top_emotion} elements"))
    
    # Add thematic information
    dominant_themes = sorted(thematic_profile.items(), key=lambda x: x[1], reverse=True)
    if dominant_themes and dominant_themes[0][1] > 0.3:
        top_theme = dominant_themes[0][0]
        theme_phrases = {
            "adventure": "sense of adventure",
            "romance": "romantic storyline",
            "mystery": "intriguing mysteries",
            "growth": "character development",
            "conflict": "meaningful conflicts",
            "family": "family dynamics",
            "identity": "exploration of identity",
            "society": "social commentary"
        }
        book_elements.append(theme_phrases.get(top_theme, f"focus on {top_theme}"))
    
    # Add specific user preference match if available
    if hasattr(user, 'favorite_genres') and user.favorite_genres:
        user_genres = [genre.strip().lower() for genre in user.favorite_genres.split(",")]
        book_categories = [category.lower() for category in volume_info.get("categories", [])]
        
        # Check for matches between user genres and book categories
        matches = [genre for genre in user_genres if any(genre in category for category in book_categories)]
        if matches:
            book_elements.append(f"alignment with your interest in {matches[0]}")
    
    # Combine elements into the reason
    if book_elements:
        elements_text = ", ".join(book_elements[:2])  # Limit to 2 elements for conciseness
        reason += f" with {elements_text}"
    
    # Add AI matching information more subtly
    reason += f". {match_quality}."
    
    return reason

def get_enhanced_mood_description(mood, user=None):
    """Return a personalized description for each mood category"""
    # Base descriptions
    descriptions = {
        "happy": "Uplifting books curated to match and enhance your joyful mood",
        "sad": "Emotionally resonant books that acknowledge and provide companionship for your melancholy", 
        "inspired": "Motivational reads carefully selected to fuel your inspiration and drive",
        "adventurous": "Thrilling stories perfectly matched to your adventurous spirit",
        "relaxed": "Gentle, soothing reads to maintain your peaceful state of mind",
        "anxious": "Calming books offering reassurance and perspective for your worried mind",
        "romantic": "Passionate stories celebrating intimate connections that embrace your affectionate mood",
        "curious": "Thought-provoking books filled with fascinating insights to satisfy your inquisitive nature",
        "nostalgic": "Evocative tales with rich historical atmosphere to complement your reflective feelings",
        "scared": "Spine-tingling narratives that perfectly channel your desire for thrilling suspense",
        "angry": "Powerful accounts of justice and resistance that honor your intense emotions",
        "bored": "Captivating, unputdownable stories guaranteed to transform monotony into excitement",
        "confused": "Clear, accessible books offering straightforward guidance to bring clarity to your mind",
        "hopeful": "Inspiring stories of possibility and resilience to nurture your optimistic outlook"
    }
    
    base_description = descriptions.get(mood, "Books selected to match your current mood with AI-powered emotional analysis")
    
    # Add personalization if user information is available
    personalized_elements = []
    
    if user and hasattr(user, 'favorite_genres') and user.favorite_genres:
        genres = user.favorite_genres.split(",")[:2]  # Limit to 2 for conciseness
        if genres:
            genres_text = " and ".join(genres)
            personalized_elements.append(f"with attention to your interest in {genres_text}")
    
    if user and hasattr(user, 'reading_level') and user.reading_level:
        personalized_elements.append(f"at your preferred {user.reading_level} reading level")
    
    # Add personalization to the description
    if personalized_elements:
        personalized_text = " ".join(personalized_elements)
        base_description += f", {personalized_text}"
    
    return base_description

# Initialize models lazily to avoid loading them until needed
_models = {}

def get_model(model_name="bart", max_retries=5):
    """Lazy-load AI models to save memory with retry logic"""
    if model_name in _models:
        return _models[model_name]
        
    logger.info(f"Loading {model_name} model for summarization...")
    
    # Retry logic for model loading
    for attempt in range(max_retries):
        try:
            if model_name == "bart":
                tokenizer = BartTokenizer.from_pretrained(
                    "facebook/bart-large-cnn",
                    local_files_only=False,  # Allow downloading if not in cache
                    use_fast=True
                )
                model = BartForConditionalGeneration.from_pretrained(
                    "facebook/bart-large-cnn",
                    local_files_only=False
                )
            elif model_name == "t5":
                tokenizer = T5Tokenizer.from_pretrained("t5-base", local_files_only=False)
                model = T5ForConditionalGeneration.from_pretrained("t5-base", local_files_only=False)
            else:
                raise ValueError(f"Unsupported model: {model_name}")
                
            _models[model_name] = {
                "model": model,
                "tokenizer": tokenizer
            }
            
            return _models[model_name]
        
        except Exception as e:
            if attempt < max_retries - 1:
                # Exponential backoff with jitter
                wait_time = (2 ** attempt) + random()
                logger.warning(f"Attempt {attempt+1} failed to load model: {str(e)}. Retrying in {wait_time:.2f} seconds...")
                time.sleep(wait_time)
            else:
                logger.error(f"Failed to load model after {max_retries} attempts: {str(e)}")
                raise

def summarize_text(text, model_name="bart", max_length=150, min_length=40):
    """Summarize text using the specified model"""
    if not text or len(text) < 100:
        return "Text is too short to summarize."
        
    # Create a cache key based on text, model and length parameters
    cache_key = f"summary_{model_name}_{hash(text)}_{max_length}_{min_length}"
    cached_summary = cache.get(cache_key)
    if cached_summary:
        return cached_summary
    
    # Get model and tokenizer
    try:
        model_dict = get_model(model_name)
        model = model_dict["model"]
        tokenizer = model_dict["tokenizer"]
        
        # Ensure text is within model token limits - BART can handle ~1024 tokens
        inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True)
        
        # Generate summary
        if model_name == "bart":
            summary_ids = model.generate(
                inputs["input_ids"],
                max_length=max_length,
                min_length=min_length,
                length_penalty=2.0,
                num_beams=4,
                early_stopping=True
            )
            summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        elif model_name == "t5":
            # T5 requires a "summarize: " prefix
            input_text = "summarize: " + text
            inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)
            summary_ids = model.generate(
                inputs["input_ids"],
                max_length=max_length,
                min_length=min_length,
                length_penalty=2.0,
                num_beams=4,
                early_stopping=True
            )
            summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        
        # Cache the result for 24 hours
        cache.set(cache_key, summary, 60*60*24)
        return summary
        
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        return f"Error generating summary: {str(e)}"

@csrf_exempt
@login_required
def get_book_summary(request, book_id):
    """Generate or retrieve AI summary for a book"""
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    # Get parameters
    model_type = request.GET.get("model", "bart")  # default to BART
    max_length = int(request.GET.get("max_length", 150))
    min_length = int(request.GET.get("min_length", 40))
    
    try:
        # First check if we already have this summary cached
        cache_key = f"book_summary_{book_id}_{model_type}_{max_length}_{min_length}"
        cached_summary = cache.get(cache_key)
        
        if cached_summary:
            return JsonResponse({
                "book_id": book_id,
                "summary": cached_summary,
                "model": model_type,
                "source": "cache"
            })
        
        # No cached summary, so get book details
        url = f"{GOOGLE_BOOKS_API_URL}/{book_id}"
        params = {
            "key": settings.GOOGLE_BOOKS_API_KEY
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        book_data = response.json()
        
        volume_info = book_data.get("volumeInfo", {})
        description = volume_info.get("description", "")
        
        if not description or len(description) < 100:
            return JsonResponse({
                "book_id": book_id,
                "summary": "Insufficient description to generate a summary.",
                "model": model_type,
                "error": "description_too_short"
            })
        
        # Generate summary
        summary = summarize_text(description, model_type, max_length, min_length)
        
        # Cache the result
        cache.set(cache_key, summary, 60*60*24*7)  # Cache for 7 days
        
        # Return the summary
        return JsonResponse({
            "book_id": book_id,
            "title": volume_info.get("title", "Unknown Title"),
            "summary": summary,
            "model": model_type,
            "source": "generated"
        })
        
    except requests.RequestException as e:
        logger.error(f"Error fetching book details for summary: {str(e)}")
        return JsonResponse({"error": f"Failed to fetch book details: {str(e)}"}, status=500)
    except Exception as e:
        logger.error(f"Error generating book summary: {str(e)}")
        return JsonResponse({"error": f"Error generating summary: {str(e)}"}, status=500)

# Advanced summarization with customizable parameters
@csrf_exempt
@login_required
def get_advanced_book_summary(request):
    """Generate customized AI summary for a book or provided text"""
    if request.method == "POST":
        try:
            # Get request data
            data = json.loads(request.body)
            
            book_id = data.get("book_id")
            custom_text = data.get("text")
            model_type = data.get("model", "bart")
            max_length = int(data.get("max_length", 150))
            min_length = int(data.get("min_length", 40))
            summary_style = data.get("style", "standard")  # Options: standard, concise, detailed
            
            # Adjust length based on style
            if summary_style == "concise":
                max_length = min(max_length, 100)
                min_length = min(min_length, 30)
            elif summary_style == "detailed":
                max_length = max(max_length, 200)
                min_length = max(min_length, 60)
            
            # Get the text to summarize (either from book or provided directly)
            text_to_summarize = ""
            title = "Custom Text"
            
            if book_id:
                # Get book details from API
                url = f"{GOOGLE_BOOKS_API_URL}/{book_id}"
                params = {
                    "key": settings.GOOGLE_BOOKS_API_KEY
                }
                
                response = requests.get(url, params=params)
                response.raise_for_status()
                book_data = response.json()
                
                volume_info = book_data.get("volumeInfo", {})
                text_to_summarize = volume_info.get("description", "")
                title = volume_info.get("title", "Unknown Title")
            elif custom_text:
                text_to_summarize = custom_text
            else:
                return JsonResponse({
                    "error": "Either book_id or custom text must be provided"
                }, status=400)
            
            if not text_to_summarize or len(text_to_summarize) < 100:
                return JsonResponse({
                    "error": "Insufficient text to generate a summary",
                    "model": model_type
                }, status=400)
            
            # Generate summary
            summary = summarize_text(text_to_summarize, model_type, max_length, min_length)
            
            # Return the summary
            return JsonResponse({
                "title": title,
                "summary": summary,
                "model": model_type,
                "style": summary_style,
                "word_count": len(summary.split()),
                "original_length": len(text_to_summarize.split())
            })
            
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except requests.RequestException as e:
            logger.error(f"Error fetching book details for advanced summary: {str(e)}")
            return JsonResponse({"error": f"Failed to fetch book details: {str(e)}"}, status=500)
        except Exception as e:
            logger.error(f"Error generating advanced book summary: {str(e)}")
            return JsonResponse({"error": f"Error generating summary: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)