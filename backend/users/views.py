from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as django_login
from django.contrib.auth.decorators import login_required
from .models import CustomUser

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
            user.set_password(password)  # ✅ Ensures password is hashed
            user.save()

            return JsonResponse({"message": "Signup successful"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            identifier = data.get("identifier")  # Can be email or username
            password = data.get("password")

            if not identifier or not password:
                return JsonResponse({"error": "Username/Email and password are required"}, status=400)

            user = None

            # If identifier is an email, use it to get the username
            if "@" in identifier:
                try:
                    user_obj = CustomUser.objects.get(email=identifier)
                    user = authenticate(username=user_obj.email, password=password)
                except CustomUser.DoesNotExist:
                    return JsonResponse({"error": "Invalid credentials"}, status=400)
            else:
                # Try logging in directly with username
                user = authenticate(username=identifier, password=password)

            if user:
                django_login(request, user)
                return JsonResponse({
                    "message": "Login successful",
                    "user": {
                        "email": user.email,
                        "username": user.username
                    }
                }, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@login_required
def get_user_data(request):
    return JsonResponse({"email": request.user.email})