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