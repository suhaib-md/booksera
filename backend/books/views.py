import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import CustomUser
import random
from django.conf import settings

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

def get_recommendations(request):
    email = request.GET.get("email", None)  # ✅ Use request.GET instead of requests.GET
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

# New search_books view
@csrf_exempt
def search_books(request):
    if request.method == "GET":
        query = request.GET.get("q", "").strip()
        search_type = request.GET.get("type", "all")  # New: 'title', 'author', 'isbn', or 'all'
        page = int(request.GET.get("page", 1))  # New: Pagination support
        max_results = 10  # Results per page

        if not query:
            return JsonResponse({"error": "Search query is required"}, status=400)

        # Adjust query based on search type
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
            "startIndex": (page - 1) * max_results,  # Pagination offset
            "orderBy": "relevance",  # Sort by relevance
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