from django.urls import path
from .views import *

urlpatterns = [
    # Book Club Routes
    path('book-clubs/', get_all_book_clubs, name='get-all-book-clubs'),
    path('book-clubs/create/', create_book_club, name='create-book-club'),
    path('book-clubs/my-clubs/', get_my_book_clubs, name='get-my-book-clubs'),
    path('book-clubs/<int:club_id>/', get_book_club, name='get-book-club'),
    path('book-clubs/<int:club_id>/join/', join_book_club, name='join-book-club'),
    path('book-clubs/<int:club_id>/leave/', leave_book_club, name='leave-book-club'),
    path('book-clubs/<int:club_id>/update/', update_book_club, name='update-book-club'),
    path('book-clubs/<int:club_id>/delete/', delete_book_club, name='delete-book-club'),
    
    # Chat and Members Routes
    path('book-clubs/<int:club_id>/messages/', get_messages, name='get-messages'),
    path('book-clubs/<int:club_id>/messages/send/', send_message, name='send-message'),
    path('book-clubs/<int:club_id>/members/', get_club_members, name='get-club-members'),
    path('book-clubs/<int:club_id>/members/<int:user_id>/update-role/', update_member_role, name='update-member-role'),
]