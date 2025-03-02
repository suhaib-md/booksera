from django.urls import path
from .views import signup, login_view, get_user_data, logout_view, update_preferences, get_user_profile, update_user_profile, upload_profile_picture

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('user/', get_user_data, name='get_user_data'),
    path('logout/', logout_view, name='logout'),
    path("update-preferences/", update_preferences, name="update-preferences"),
    path("profile/", get_user_profile, name="user_profile"),
    path("profile/update/", update_user_profile, name="update_profile"),
    path("profile/upload/", upload_profile_picture, name="upload_profile_picture"),]