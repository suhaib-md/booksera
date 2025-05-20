from django.http import JsonResponse
from django.core.cache import cache
from functools import wraps
import time
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def rate_limit_decorator(max_requests=100, period=86400):  # Default: 100 requests per day (86400 seconds)
    """
    Decorator to implement rate limiting for API endpoints.
    
    Parameters:
    - max_requests: Maximum number of requests allowed in the specified period
    - period: Time period in seconds (default: 86400 seconds = 1 day)
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Identify the user - either by user ID if authenticated or by IP address
            if request.user.is_authenticated:
                user_identifier = f"rate_limit_user_{request.user.id}"
            else:
                user_identifier = f"rate_limit_ip_{request.META.get('REMOTE_ADDR', '')}"
            
            # Get the current day as a string (for daily reset)
            current_day = datetime.now().strftime("%Y-%m-%d")
            
            # Create a unique cache key that includes the day (for daily reset)
            cache_key = f"{user_identifier}_{current_day}"
            
            # Get current usage count from cache
            usage_count = cache.get(cache_key, 0)
            
            # Check if the user has exceeded their limit
            if usage_count >= max_requests:
                logger.warning(f"Rate limit exceeded for {user_identifier}")
                return JsonResponse({
                    "error": "Rate limit exceeded. Please try again tomorrow.",
                    "limit": max_requests,
                    "usage": usage_count,
                    "resets_at": f"Midnight {current_day}"
                }, status=429)
            
            # Increment the usage count
            cache.set(cache_key, usage_count + 1, timeout=period)
            
            # Log the request (optional)
            logger.debug(f"API request from {user_identifier}: {usage_count + 1}/{max_requests}")
            
            # Add rate limit info to the response
            response = view_func(request, *args, **kwargs)
            
            # If the response is a JsonResponse, add rate limit headers
            if isinstance(response, JsonResponse):
                response['X-RateLimit-Limit'] = str(max_requests)
                response['X-RateLimit-Remaining'] = str(max_requests - (usage_count + 1))
                response['X-RateLimit-Reset'] = str(int(time.time() + period))
            
            return response
        return _wrapped_view
    return decorator

# For admin usage - to check current rate limits
def get_user_rate_limit_usage(request):
    """View to check current rate limit usage for admins"""
    if not request.user.is_staff:
        return JsonResponse({"error": "Permission denied"}, status=403)
    
    user_id = request.GET.get("user_id")
    ip_address = request.GET.get("ip")
    
    if user_id:
        identifier = f"rate_limit_user_{user_id}"
    elif ip_address:
        identifier = f"rate_limit_ip_{ip_address}"
    else:
        return JsonResponse({"error": "Either user_id or ip parameter is required"}, status=400)
    
    current_day = datetime.now().strftime("%Y-%m-%d")
    cache_key = f"{identifier}_{current_day}"
    
    usage = cache.get(cache_key, 0)
    
    return JsonResponse({
        "identifier": identifier,
        "usage": usage,
        "day": current_day
    })

# Function to reset rate limits (useful for testing or emergencies)
def reset_rate_limit(request):
    """Admin function to reset rate limits"""
    if not request.user.is_staff:
        return JsonResponse({"error": "Permission denied"}, status=403)
    
    user_id = request.POST.get("user_id")
    ip_address = request.POST.get("ip")
    
    if user_id:
        identifier = f"rate_limit_user_{user_id}"
    elif ip_address:
        identifier = f"rate_limit_ip_{ip_address}"
    else:
        return JsonResponse({"error": "Either user_id or ip parameter is required"}, status=400)
    
    current_day = datetime.now().strftime("%Y-%m-%d")
    cache_key = f"{identifier}_{current_day}"
    
    cache.delete(cache_key)
    
    return JsonResponse({
        "success": True,
        "message": f"Rate limit reset for {identifier}"
    })