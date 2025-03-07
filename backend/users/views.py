from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as django_login
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import CustomUser
from django.contrib.sessions.models import Session
import random
from .models import UserPreferences, CustomUser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings


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