import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import JenkinsClient
from .utils import generate_jwt, get_jwks


def openid_configuration(request):
    data = {
        "issuer": settings.OIDC_ISSUER,
        "jwks_uri": f"{settings.OIDC_ISSUER}/.well-known/jwks",
        "id_token_signing_alg_values_supported": ["RS256"],
        "response_types_supported": ["id_token"],
        "claims_supported": ["sub", "iss", "aud", "exp", "iat"]
    }
    return JsonResponse(data)


def jwks(request):
    return JsonResponse(get_jwks())


@csrf_exempt
def token(request):
    if request.method != "POST":
        return JsonResponse({"error": "invalid_method"}, status=405)

    api_key = request.headers.get("X-API-KEY")

    if not api_key:
        return JsonResponse({"error": "missing_api_key"}, status=401)

    client = JenkinsClient.objects.filter(
        api_key=api_key, is_active=True
    ).first()

    if not client:
        return JsonResponse({"error": "unauthorized"}, status=401)

    jwt_token = generate_jwt(sub=f"jenkins:{client.name}")

    return JsonResponse({
        "id_token": jwt_token
    })