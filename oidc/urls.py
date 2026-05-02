from django.http import HttpResponse
from django.urls import path
from . import views

def root(request):
    return HttpResponse("OIDC Provider", status=200)

urlpatterns = [
    path("", root),
    path(".well-known/openid-configuration", views.openid_configuration),
    path(".well-known/jwks", views.jwks),
    path("token", views.token),
]