from django.http import HttpResponse
from django.urls import path, include

def health(request):
    return HttpResponse("OK", status=200)

urlpatterns = [
    path("", include("oidc.urls")),
    path("/health", health)
]