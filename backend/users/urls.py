from django.urls import path
from .views import *

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('user/', get_user_data, name='get_user_data'),
    path('logout/', logout_view, name='logout'),
    path("update-preferences/", update_preferences, name="update-preferences"),
    path("profile/", get_user_profile, name="user_profile"),
    path("profile/update/", update_user_profile, name="update_profile"),
    path("profile/upload/", upload_profile_picture, name="upload_profile_picture"),
    path('bookshelf/add/', add_to_bookshelf, name='add_to_bookshelf'),
    path('bookshelf/', get_bookshelf, name='get_bookshelf'),
    path('bookshelf/update/', update_bookshelf_status, name='update_bookshelf_status'),
    path('unauthorized/', unauthorized, name='unauthorized'),
]

