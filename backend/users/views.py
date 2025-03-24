from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as django_login
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.db.models import Sum, Avg
from .models import CustomUser
from django.contrib.sessions.models import Session
import random, requests
from .models import UserPreferences, CustomUser, Bookshelf
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from datetime import datetime

@csrf_exempt
def check_auth_status(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "authenticated": True,
            "email": request.user.email,
            "username": request.user.username
        })
    else:
        return JsonResponse({"authenticated": False}, status=200)

@csrf_exempt
def signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            username = data.get("username")
            password = data.get("password")

            if not email or not password or not username:
                return JsonResponse({"error": "All fields are required"}, status=400)

            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"error": "User already exists"}, status=400)

            user = CustomUser(username=username, email=email)
            user.set_password(password)
            user.save()

            # Create default UserPreferences entry
            UserPreferences.objects.create(user=user, favorite_genres="", favorite_authors="", books_read=[])

            return JsonResponse({"message": "Signup successful"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            identifier = data.get("identifier")
            password = data.get("password")
            if not identifier or not password:
                return JsonResponse({"error": "Username/Email and password are required"}, status=400)

            user = None
            if "@" in identifier:
                try:
                    user_obj = CustomUser.objects.get(email=identifier)
                    user = authenticate(username=user_obj.username, password=password)
                except CustomUser.DoesNotExist:
                    return JsonResponse({"error": "Invalid credentials"}, status=400)
            else:
                user = authenticate(username=identifier, password=password)

            if user:
                django_login(request, user)  # This creates and saves the session automatically
                request.session.set_expiry(86400)  # Session valid for 1 day
                # Let Django's middleware set the session cookie automatically.
                return JsonResponse({"message": "Login successful"}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)

def unauthorized(request):
    return JsonResponse({"error": "Unauthorized"}, status=401)

@login_required
def get_user_data(request):
    return JsonResponse({
        "email": request.user.email,
        "username": request.user.username
    })
    
@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        from django.contrib.auth import logout
        logout(request)
        return JsonResponse({"message": "Logout successful"}, status=200)
    return JsonResponse({"error": "Method not allowed"}, status=405)

# Get User Profile
@login_required
def get_user_profile(request):
    user = request.user
    profile_picture_url = None

    if user.profile_picture:
        profile_picture_url = request.build_absolute_uri(settings.MEDIA_URL + str(user.profile_picture))

    return JsonResponse({
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "profile_picture": profile_picture_url,  # Ensure full URL is returned
        "favorite_genres": user.favorite_genres,
        "favorite_authors": user.favorite_authors,
        "books_read": user.books_read,
    })

# Update User Profile
@csrf_exempt
@login_required
def update_user_profile(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user
            user.bio = data.get("bio", user.bio)
            user.favorite_genres = data.get("favorite_genres", user.favorite_genres)
            user.favorite_authors = data.get("favorite_authors", user.favorite_authors)
            user.books_read = data.get("books_read", user.books_read)
            user.save()
            return JsonResponse({"message": "Profile updated successfully!"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid method"}, status=405)

# Upload Profile Picture
@csrf_exempt
@login_required
def upload_profile_picture(request):
    if request.method == "POST" and request.FILES.get("profile_picture"):
        user = request.user
        image = request.FILES["profile_picture"]

        # Save image
        filename = f"profile_pictures/{user.id}_{image.name}"
        path = default_storage.save(filename, ContentFile(image.read()))

        # Ensure user.profile_picture is stored as the relative path
        user.profile_picture = path
        user.save()

        # Construct full URL
        image_url = f"{settings.MEDIA_URL}{user.profile_picture}"

        return JsonResponse({"message": "Profile picture updated!", "profile_picture": image_url})
    
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def update_preferences(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            favorite_genres = data.get("favorite_genres", "")
            favorite_authors = data.get("favorite_authors", "")

            user = CustomUser.objects.get(email=email)
            user_prefs, created = UserPreferences.objects.get_or_create(user=user)

            user_prefs.favorite_genres = favorite_genres
            user_prefs.favorite_authors = favorite_authors
            user_prefs.save()

            return JsonResponse({"message": "Preferences updated successfully"}, status=200)

        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@login_required
def add_to_bookshelf(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            book_id = data.get("book_id")
            title = data.get("title")
            authors = data.get("authors", "")
            image = data.get("image", "")
            status = data.get("status", "to_read")
            page_count = data.get("page_count")
            user_rating = data.get("user_rating", 0)
            
            # Make sure image URL is complete (it should include http:// or https://)
            if image and not (image.startswith('http://') or image.startswith('https://')):
                image = f"https:{image}" if image.startswith('//') else f"https://{image}"
            
            # Add categories with a default value
            if 'categories' in data:
                # If categories is a string, convert to a list
                if isinstance(data['categories'], str):
                    data['categories'] = [data['categories']]
            else:
                data['categories'] = []

            if not book_id or not title:
                return JsonResponse({"error": "Book ID and title are required"}, status=400)

            # Check if book already exists in bookshelf
            try:
                existing_book = Bookshelf.objects.get(user=request.user, book_id=book_id)
                return JsonResponse({"error": "Book already in bookshelf"}, status=400)
            except Bookshelf.DoesNotExist:
                # Book doesn't exist, create new entry
                try:
                    bookshelf_item = Bookshelf.objects.create(
                        user=request.user,
                        book_id=book_id,
                        title=title,
                        authors=authors,
                        image=image,
                        status=status,
                        page_count=page_count,
                        user_rating=user_rating,
                        categories=data['categories']  # Include the categories field
                    )

                    # Update books_read if status is 'read'
                    if status == "read":
                        if book_id not in request.user.books_read:
                            request.user.books_read.append(book_id)
                            request.user.save()

                    return JsonResponse({"message": "Book added to bookshelf"}, status=201)
                except Exception as e:
                    import traceback
                    print(f"Error creating bookshelf item: {str(e)}")
                    traceback.print_exc()
                    return JsonResponse({"error": f"Error creating bookshelf item: {str(e)}"}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            print(f"Error in add_to_bookshelf: {str(e)}")
            return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@login_required
def get_bookshelf(request):
    bookshelf_items = Bookshelf.objects.filter(user=request.user)
    to_read = []
    read = []

    for item in bookshelf_items:
        book_data = {
            "id": item.book_id,
            "title": item.title,
            "authors": item.authors,
            "image": item.image,
        }
        if item.status == "to_read":
            to_read.append(book_data)
        elif item.status == "read":
            read.append(book_data)

    return JsonResponse({"to_read": to_read, "read": read})

@csrf_exempt
@login_required
def update_bookshelf_status(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            book_id = data.get("book_id")
            new_status = data.get("status")
            
            if not book_id or not new_status:
                return JsonResponse({"error": "Book ID and status are required"}, status=400)
            
            try:
                bookshelf_item = Bookshelf.objects.get(user=request.user, book_id=book_id)
                old_status = bookshelf_item.status
                bookshelf_item.status = new_status
                bookshelf_item.save()
                
                # Update books_read field and reading goal accordingly
                current_year = datetime.now().year
                
                # Ensure reading_goal_year is current
                if request.user.reading_goal_year != current_year:
                    request.user.reading_goal_year = current_year
                    request.user.reading_goal_completed = 0
                
                # Handle marking as read
                if new_status == "read" and book_id not in request.user.books_read:
                    request.user.books_read.append(book_id)
                    # Increment reading goal only if not already counted
                    request.user.reading_goal_completed += 1
                    request.user.save()
                # Handle unmarking as read
                elif new_status == "to_read" and book_id in request.user.books_read:
                    request.user.books_read.remove(book_id)
                    # Decrement reading goal only if already counted and greater than 0
                    if request.user.reading_goal_completed > 0:
                        request.user.reading_goal_completed -= 1
                    request.user.save()
                
                return JsonResponse({
                    "message": "Bookshelf status updated",
                    "reading_goal": {
                        "target": request.user.reading_goal_target,
                        "completed": request.user.reading_goal_completed
                    }
                }, status=200)
            except Bookshelf.DoesNotExist:
                return JsonResponse({"error": "Book not found in bookshelf"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@login_required
def remove_from_bookshelf(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            book_id = data.get("book_id")
            
            if not book_id:
                return JsonResponse({"error": "Book ID is required"}, status=400)
            
            try:
                bookshelf_item = Bookshelf.objects.get(user=request.user, book_id=book_id)
                
                # If the book was marked as read, remove it from books_read
                if bookshelf_item.status == "read" and book_id in request.user.books_read:
                    request.user.books_read.remove(book_id)
                    # Decrement reading goal if appropriate
                    if request.user.reading_goal_completed > 0:
                        request.user.reading_goal_completed -= 1
                    request.user.save()
                
                # Delete the bookshelf item
                bookshelf_item.delete()
                
                return JsonResponse({"message": "Book removed from bookshelf"}, status=200)
            except Bookshelf.DoesNotExist:
                return JsonResponse({"error": "Book not found in bookshelf"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@login_required
def get_reading_goal(request):
    if request.method == "GET":
        try:
            user = request.user
            current_year = datetime.now().year
            
            # If user's goal is from a previous year, reset it for the current year
            if user.reading_goal_year != current_year:
                user.reading_goal_year = current_year
                user.reading_goal_completed = 0
                # Keep the same target or set to 0 if you prefer to reset it
                user.save()
            
            return JsonResponse({
                "target": user.reading_goal_target,
                "completed": user.reading_goal_completed,
                "year": user.reading_goal_year
            }, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@login_required
def update_reading_goal(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            target = data.get("target")
            
            if target is None:
                return JsonResponse({"error": "Target is required"}, status=400)
            
            # Ensure target is a positive integer
            try:
                target = int(target)
                if target < 0:
                    raise ValueError("Target must be a positive number")
            except ValueError:
                return JsonResponse({"error": "Target must be a positive number"}, status=400)
            
            user = request.user
            current_year = datetime.now().year
            
            # Update user's reading goal
            user.reading_goal_target = target
            
            # If it's a new year, reset the completed count
            if user.reading_goal_year != current_year:
                user.reading_goal_year = current_year
                user.reading_goal_completed = 0
            
            user.save()
            
            return JsonResponse({
                "message": "Reading goal updated successfully",
                "target": user.reading_goal_target,
                "completed": user.reading_goal_completed,
                "year": user.reading_goal_year
            }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@login_required
def reading_goal_view(request):
    if request.method == "GET":
        try:
            user = request.user
            current_year = datetime.now().year
            
            # If user's goal is from a previous year, reset it for the current year
            if user.reading_goal_year != current_year:
                user.reading_goal_year = current_year
                user.reading_goal_completed = 0
                # Keep the same target or set to 0 if you prefer to reset it
                user.save()
            
            return JsonResponse({
                "target": user.reading_goal_target,
                "completed": user.reading_goal_completed,
                "year": user.reading_goal_year
            }, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            target = data.get("target")
            
            if target is None:
                return JsonResponse({"error": "Target is required"}, status=400)
            
            # Ensure target is a positive integer
            try:
                target = int(target)
                if target < 0:
                    raise ValueError("Target must be a positive number")
            except ValueError:
                return JsonResponse({"error": "Target must be a positive number"}, status=400)
            
            user = request.user
            current_year = datetime.now().year
            
            # Update user's reading goal
            user.reading_goal_target = target
            
            # If it's a new year, reset the completed count
            if user.reading_goal_year != current_year:
                user.reading_goal_year = current_year
                user.reading_goal_completed = 0
            
            user.save()
            
            return JsonResponse({
                "message": "Reading goal updated successfully",
                "target": user.reading_goal_target,
                "completed": user.reading_goal_completed,
                "year": user.reading_goal_year
            }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@login_required
def reading_stats_view(request):
    if request.method == "GET":
        try:
            user = request.user
            
            # Get books marked as 'read' from the user's bookshelf
            books_read = Bookshelf.objects.filter(user=user, status='read')
            
            # Calculate total number of books read
            total_books = books_read.count()
            
            # Initialize counters for pages and ratings
            total_pages = 0
            total_rating = 0
            rated_books_count = 0
            
            # Use cache from session if available
            if 'book_data_cache' not in request.session:
                request.session['book_data_cache'] = {}
            
            # Books we need to fetch data for
            books_to_fetch = []
            
            # First check cache
            for book in books_read:
                if book.book_id in request.session['book_data_cache']:
                    cached_data = request.session['book_data_cache'][book.book_id]
                    
                    # Add page count if available
                    if 'pageCount' in cached_data:
                        total_pages += cached_data['pageCount']
                    
                    # Add rating if available
                    if 'averageRating' in cached_data:
                        total_rating += cached_data['averageRating']
                        rated_books_count += 1
                else:
                    books_to_fetch.append(book)
            
            # Fetch data for books not in cache
            if books_to_fetch:
                api_key = getattr(settings, 'GOOGLE_BOOKS_API_KEY', '')
                
                for book in books_to_fetch:
                    try:
                        url = f"https://www.googleapis.com/books/v1/volumes/{book.book_id}"
                        if api_key:
                            url += f"?key={api_key}"
                            
                        response = requests.get(url)
                        if response.status_code == 200:
                            book_data = response.json()
                            
                            # Initialize cache entry
                            cache_entry = {}
                            
                            # Extract and store page count
                            if 'volumeInfo' in book_data:
                                volume_info = book_data['volumeInfo']
                                
                                # Get page count
                                if 'pageCount' in volume_info:
                                    page_count = volume_info['pageCount']
                                    cache_entry['pageCount'] = page_count
                                    total_pages += page_count
                                
                                # Get average rating
                                if 'averageRating' in volume_info:
                                    avg_rating = volume_info['averageRating']
                                    cache_entry['averageRating'] = avg_rating
                                    total_rating += avg_rating
                                    rated_books_count += 1
                            
                            # Save to cache if we got any useful data
                            if cache_entry:
                                request.session['book_data_cache'][book.book_id] = cache_entry
                    except Exception as e:
                        print(f"Error fetching data for book {book.book_id}: {str(e)}")
                        continue
                
                # Save updated session
                request.session.modified = True
            
            # Calculate average rating
            average_rating = round(total_rating / rated_books_count, 1) if rated_books_count > 0 else 0
            
            return JsonResponse({
                "total_books": total_books,
                "total_pages": total_pages,
                "average_rating": average_rating
            }, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

