from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from .models import BookClub, ClubMembership, Message
from django.db.models import Count, Q

@csrf_exempt
@login_required
def create_book_club(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            description = data.get("description")
            category = data.get("category")
            image = data.get("image", "")
            
            if not name or not description or not category:
                return JsonResponse({"error": "Name, description, and category are required"}, status=400)
            
            # Create book club
            book_club = BookClub.objects.create(
                name=name,
                description=description,
                category=category,
                creator=request.user,
                image=image
            )
            
            # Add creator as admin
            ClubMembership.objects.create(
                user=request.user,
                book_club=book_club,
                role='admin'
            )
            
            return JsonResponse({
                "message": "Book club created successfully",
                "book_club_id": book_club.id,
                "name": book_club.name
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@login_required
def get_all_book_clubs(request):
    category = request.GET.get('category', '')
    search = request.GET.get('search', '')
    
    query = BookClub.objects.all()
    
    if category:
        query = query.filter(category=category)
    
    if search:
        query = query.filter(
            Q(name__icontains=search) | 
            Q(description__icontains=search)
        )
    
    # Annotate with member count
    query = query.annotate(members_count=Count('members'))
    
    book_clubs = []
    for club in query:
        book_clubs.append({
            "id": club.id,
            "name": club.name,
            "description": club.description,
            "category": club.category,
            "creator": club.creator.username,
            "created_at": club.created_at.strftime("%Y-%m-%d"),
            "members_count": club.members_count,
            "image": club.image,
            "current_book": club.current_book,
            "current_book_image": club.current_book_image,
            "is_member": request.user in club.members.all()
        })
    
    return JsonResponse({"book_clubs": book_clubs})

@login_required
def get_book_club(request, club_id):
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        membership = None
        try:
            membership = ClubMembership.objects.get(user=request.user, book_club=book_club)
            role = membership.role
        except ClubMembership.DoesNotExist:
            role = None
        
        return JsonResponse({
            "id": book_club.id,
            "name": book_club.name,
            "description": book_club.description,
            "category": book_club.category,
            "creator": {
                "id": book_club.creator.id,
                "username": book_club.creator.username
            },
            "created_at": book_club.created_at.strftime("%Y-%m-%d"),
            "members_count": book_club.members.count(),
            "image": book_club.image,
            "current_book": book_club.current_book,
            "current_book_id": book_club.current_book_id,
            "current_book_image": book_club.current_book_image,
            "is_member": membership is not None,
            "role": role
        })
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)

@csrf_exempt
@login_required
def join_book_club(request, club_id):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        # Check if already a member
        if ClubMembership.objects.filter(user=request.user, book_club=book_club).exists():
            return JsonResponse({"error": "Already a member of this book club"}, status=400)
        
        # Add as member
        ClubMembership.objects.create(
            user=request.user,
            book_club=book_club,
            role='member'
        )
        
        return JsonResponse({"message": "Successfully joined the book club"})
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)

@csrf_exempt
@login_required
def leave_book_club(request, club_id):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        try:
            membership = ClubMembership.objects.get(user=request.user, book_club=book_club)
            
            # Creator can't leave, they must delete the club instead
            if book_club.creator == request.user:
                return JsonResponse({"error": "As the creator, you cannot leave. You must delete the club instead."}, status=400)
            
            membership.delete()
            return JsonResponse({"message": "Successfully left the book club"})
        except ClubMembership.DoesNotExist:
            return JsonResponse({"error": "Not a member of this book club"}, status=400)
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)

@csrf_exempt
@login_required
def update_book_club(request, club_id):
    if request.method != "PUT":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        # Check if admin or creator
        try:
            membership = ClubMembership.objects.get(user=request.user, book_club=book_club)
            if membership.role not in ['admin', 'moderator'] and book_club.creator != request.user:
                return JsonResponse({"error": "Not authorized to update this book club"}, status=403)
        except ClubMembership.DoesNotExist:
            return JsonResponse({"error": "Not a member of this book club"}, status=403)
        
        try:
            data = json.loads(request.body)
            
            if 'name' in data:
                book_club.name = data['name']
            if 'description' in data:
                book_club.description = data['description']
            if 'category' in data:
                book_club.category = data['category']
            if 'image' in data:
                book_club.image = data['image']
            if 'current_book' in data:
                book_club.current_book = data['current_book']
            if 'current_book_id' in data:
                book_club.current_book_id = data['current_book_id']
            if 'current_book_image' in data:
                book_club.current_book_image = data['current_book_image']
            
            book_club.save()
            
            return JsonResponse({"message": "Book club updated successfully"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)

@csrf_exempt
@login_required
def delete_book_club(request, club_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        # Only creator can delete
        if book_club.creator != request.user:
            return JsonResponse({"error": "Only the creator can delete the book club"}, status=403)
        
        book_club.delete()
        return JsonResponse({"message": "Book club deleted successfully"})
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)

@login_required
def get_my_book_clubs(request):
    my_clubs = request.user.joined_clubs.all()
    
    clubs_data = []
    for club in my_clubs:
        membership = ClubMembership.objects.get(user=request.user, book_club=club)
        clubs_data.append({
            "id": club.id,
            "name": club.name,
            "description": club.description,
            "category": club.category,
            "creator": club.creator.username,
            "created_at": club.created_at.strftime("%Y-%m-%d"),
            "members_count": club.members.count(),
            "image": club.image,
            "current_book": club.current_book,
            "current_book_image": club.current_book_image,
            "role": membership.role
        })
    
    return JsonResponse({"book_clubs": clubs_data})

@csrf_exempt
@login_required
def send_message(request, club_id):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        # Check if member
        if not ClubMembership.objects.filter(user=request.user, book_club=book_club).exists():
            return JsonResponse({"error": "You must be a member to send messages"}, status=403)
        
        try:
            data = json.loads(request.body)
            content = data.get("content")
            
            if not content:
                return JsonResponse({"error": "Message content is required"}, status=400)
            
            message = Message.objects.create(
                book_club=book_club,
                sender=request.user,
                content=content
            )
            
            return JsonResponse({
                "message_id": message.id,
                "sender": message.sender.username,
                "content": message.content,
                "timestamp": message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)

@login_required
def get_messages(request, club_id):
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        # Check if member
        if not ClubMembership.objects.filter(user=request.user, book_club=book_club).exists():
            return JsonResponse({"error": "You must be a member to view messages"}, status=403)
        
        # Optional pagination
        limit = int(request.GET.get("limit", 50))
        offset = int(request.GET.get("offset", 0))
        
        messages = Message.objects.filter(book_club=book_club).order_by('-timestamp')[offset:offset+limit]
        
        messages_data = []
        for msg in messages:
            messages_data.append({
                "id": msg.id,
                "sender": {
                    "id": msg.sender.id,
                    "username": msg.sender.username
                },
                "content": msg.content,
                "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            })
        
        return JsonResponse({"messages": messages_data})
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)

@login_required
def get_club_members(request, club_id):
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        memberships = ClubMembership.objects.filter(book_club=book_club)
        
        members_data = []
        for membership in memberships:
            members_data.append({
                "id": membership.user.id,
                "username": membership.user.username,
                "role": membership.role,
                "joined_at": membership.joined_at.strftime("%Y-%m-%d")
            })
        
        return JsonResponse({"members": members_data})
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)

@csrf_exempt
@login_required
def update_member_role(request, club_id, user_id):
    if request.method != "PUT":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        book_club = BookClub.objects.get(id=club_id)
        
        # Only creator or admin can update roles
        try:
            requester_membership = ClubMembership.objects.get(user=request.user, book_club=book_club)
            if requester_membership.role != 'admin' and book_club.creator != request.user:
                return JsonResponse({"error": "Not authorized to update member roles"}, status=403)
        except ClubMembership.DoesNotExist:
            return JsonResponse({"error": "Not a member of this book club"}, status=403)
        
        try:
            data = json.loads(request.body)
            new_role = data.get("role")
            
            if new_role not in ['member', 'moderator', 'admin']:
                return JsonResponse({"error": "Invalid role"}, status=400)
            
            # Find membership to update
            try:
                membership = ClubMembership.objects.get(user_id=user_id, book_club=book_club)
                
                # Creator's role cannot be changed
                if membership.user == book_club.creator:
                    return JsonResponse({"error": "Cannot change the creator's role"}, status=400)
                
                membership.role = new_role
                membership.save()
                
                return JsonResponse({"message": "Member role updated successfully"})
            except ClubMembership.DoesNotExist:
                return JsonResponse({"error": "User is not a member of this book club"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    except BookClub.DoesNotExist:
        return JsonResponse({"error": "Book club not found"}, status=404)