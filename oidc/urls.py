from django.urls import path
from . import views

urlpatterns = [
    path(".well-known/openid-configuration", views.openid_configuration),
    path(".well-known/jwks", views.jwks),
    path("token", views.token),
]