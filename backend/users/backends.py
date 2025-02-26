from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class CustomAuthBackend(ModelBackend):
    """
    Custom authentication backend to allow login using both username and email.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Check if the username is actually an email
            user = UserModel.objects.get(email=username)
        except UserModel.DoesNotExist:
            try:
                # If not an email, try getting user by username
                user = UserModel.objects.get(username=username)
            except UserModel.DoesNotExist:
                return None

        if user.check_password(password):
            return user
        return None
