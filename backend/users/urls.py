from django.urls import path
from .views import signup, login_view, get_user_data

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('user/', get_user_data, name='get_user_data'),
]
