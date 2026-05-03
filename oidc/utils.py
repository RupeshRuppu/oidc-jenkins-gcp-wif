import base64
import jwt
from datetime import datetime, timedelta
from cryptography.hazmat.primitives import serialization
from django.conf import settings


def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def load_private_key():
    with open(settings.PRIVATE_KEY_PATH, "rb") as f:
        return f.read()


def load_public_key():
    with open(settings.PUBLIC_KEY_PATH, "rb") as f:
        return f.read()


def generate_jwt(sub: str):
    private_key = load_private_key()
    now = datetime.utcnow()
    payload = {
        "iss": settings.OIDC_ISSUER,
        "sub": sub,
        "aud": "gcp",
        "iat": now,
        "exp": now + timedelta(minutes=10),
    }
    token = jwt.encode(payload, private_key, algorithm="RS256")
    return token


def get_jwks():
    public_key = serialization.load_pem_public_key(load_public_key())
    numbers = public_key.public_numbers()
    n = base64url_encode(numbers.n.to_bytes(256, "big"))
    e = base64url_encode(numbers.e.to_bytes(3, "big"))
    kid = 'f3d31c42-53bf-4cd9-8912-74df7be06bb7'
    return {
        "keys": [
            {
                "kty": "RSA",
                "alg": "RS256",
                "use": "sig",
                "kid": kid,
                "n": n,
                "e": e,
            }
        ]
    }