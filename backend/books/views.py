import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from users.models import CustomUser
import random
from django.conf import settings
from transformers import pipeline
import logging
from numpy import dot
from numpy.linalg import norm

logger = logging.getLogger(__name__)

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"
similarity_scorer = pipeline("feature-extraction", model="distilbert-base-uncased", truncation=True, max_length=512)

def get_recommendations(request):
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

@login_required
@csrf_exempt
def get_personalized_recommendations(request):
    if request.method == "GET":
        user = request.user
        logger.info(f"User: {user.username}, Email: {user.email}")

        # Log raw user data
        books_read = user.books_read or []
        favorite_genres = user.favorite_genres.split(",") if user.favorite_genres else []
        favorite_authors = user.favorite_authors.split(",") if user.favorite_authors else []
        logger.info(f"Raw books_read: {user.books_read}")
        logger.info(f"Raw favorite_genres: {user.favorite_genres}")
        logger.info(f"Raw favorite_authors: {user.favorite_authors}")
        logger.info(f"Parsed books_read: {books_read}")
        logger.info(f"Parsed favorite_genres: {favorite_genres}")
        logger.info(f"Parsed favorite_authors: {favorite_authors}")

        # Split queries: one for authors, one for titles
        all_books = {}
        
        # Author query
        if favorite_authors:
            author_query = " OR ".join(f"inauthor:\"{author.strip()}\"" for author in favorite_authors if author.strip())
            logger.info(f"Author query: {author_query}")
            params = {
                "q": author_query,
                "key": settings.GOOGLE_BOOKS_API_KEY,
                "maxResults": 20,
                "orderBy": "relevance",
            }
            api_url = requests.Request('GET', GOOGLE_BOOKS_API_URL, params=params).prepare().url
            logger.info(f"Author API URL: {api_url}")
            try:
                response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
                response.raise_for_status()
                data = response.json()
                logger.info(f"Author API response: {data.get('totalItems', 0)} items found")
                if "items" in data:
                    for item in data["items"]:
                        all_books[item["id"]] = item  # Deduplicate by ID
            except requests.RequestException as e:
                logger.error(f"Error fetching author query: {str(e)}")

        # Title query
        if books_read:
            if isinstance(books_read, str):
                books_read = books_read.split(",")
            title_query = " OR ".join(f"intitle:\"{book.strip()}\"" for book in books_read if book.strip())
            logger.info(f"Title query: {title_query}")
            params = {
                "q": title_query,
                "key": settings.GOOGLE_BOOKS_API_KEY,
                "maxResults": 20,
                "orderBy": "relevance",
            }
            api_url = requests.Request('GET', GOOGLE_BOOKS_API_URL, params=params).prepare().url
            logger.info(f"Title API URL: {api_url}")
            try:
                response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
                response.raise_for_status()
                data = response.json()
                logger.info(f"Title API response: {data.get('totalItems', 0)} items found")
                if "items" in data:
                    for item in data["items"]:
                        all_books[item["id"]] = item
            except requests.RequestException as e:
                logger.error(f"Error fetching title query: {str(e)}")

        books = []
        if all_books:
            user_interests = " ".join(
                [g.strip() for g in favorite_genres] +
                [a.strip() for a in favorite_authors] +
                (books_read if isinstance(books_read, list) else books_read.split(","))
            )
            logger.info(f"User interests for similarity: {user_interests}")

            try:
                user_embedding = similarity_scorer(user_interests, return_tensors="pt")[0][0].mean(dim=0).detach().numpy()
            except Exception as e:
                logger.error(f"Error computing user embedding: {str(e)}")
                return JsonResponse({"error": "Failed to process user interests"}, status=500)

            for item in all_books.values():
                volume_info = item.get("volumeInfo", {})
                image_links = volume_info.get("imageLinks", {})
                description = volume_info.get("description", "No description available")[:512]
                
                try:
                    book_embedding = similarity_scorer(description, return_tensors="pt")[0][0].mean(dim=0).detach().numpy()
                    similarity = dot(user_embedding, book_embedding) / (norm(user_embedding) * norm(book_embedding))
                    if norm(user_embedding) * norm(book_embedding) == 0 or not isinstance(similarity, float):
                        similarity = 0.5
                    similarity = max(0.0, min(1.0, similarity))
                except Exception as e:
                    logger.error(f"Error computing book embedding for {volume_info.get('title')}: {str(e)}")
                    similarity = 0.5

                # Boost based on preferences
                title = volume_info.get("title", "").lower()
                authors = ", ".join(volume_info.get("authors", [])).lower()
                description_lower = description.lower()
                boost = 0.0
                if any(book.lower() in title for book in books_read):
                    boost += 0.5
                if any(author.lower() in authors for author in favorite_authors):
                    boost += 0.4
                if any(genre.lower() in description_lower for genre in favorite_genres):
                    boost += 0.3
                final_score = min(1.0, similarity + boost)

                books.append({
                    "id": item.get("id"),
                    "title": volume_info.get("title", "Unknown Title"),
                    "authors": authors.title(),
                    "image": image_links.get("thumbnail", ""),
                    "publishedDate": volume_info.get("publishedDate", "N/A"),
                    "description": description[:200],
                    "relevance_score": float(final_score),
                })
            
            # Sort with diversity: Limit to 2 books per author
            author_counts = {}
            top_books = []
            books.sort(key=lambda x: (x["relevance_score"], random.random()), reverse=True)
            for book in books:
                authors = book["authors"].lower()
                author_list = [a.strip() for a in authors.split(",")]
                if all(author_counts.get(a, 0) < 2 for a in author_list):
                    top_books.append(book)
                    for a in author_list:
                        author_counts[a] = author_counts.get(a, 0) + 1
                if len(top_books) >= 10:
                    break
            
            logger.info(f"Returning {len(top_books)} recommendations with scores: {[b['relevance_score'] for b in top_books]}")
            logger.info(f"Recommended titles: {[b['title'] for b in top_books]}")
            return JsonResponse({"books": top_books}, safe=False)
        else:
            logger.warning("No items found across all queries")
            return JsonResponse({"books": []}, safe=False)
    return JsonResponse({"error": "Method not allowed"}, status=405)