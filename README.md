# oidc-jenkins-gcp-wif

A minimal OIDC provider (Node.js / Express / MongoDB) that issues short-lived,
RS256-signed `id_token`s so **Jenkins** can authenticate to **GCP Workload
Identity Federation (WIF)** without long-lived service-account keys.

Jenkins authenticates with an API key and receives a signed JWT. GCP trusts that
JWT via this provider's public JWKS endpoint.

## How it works

1. Jenkins calls `POST /token` with an `X-API-KEY` header.
2. The provider looks up an active `JenkinsClient` by that key.
3. On success it returns `{ "id_token": "<JWT>" }` (RS256, 10-minute TTL).
4. GCP WIF validates the token against `/.well-known/jwks`.

## Endpoints

| Method | Path                                   | Description                          |
| ------ | -------------------------------------- | ------------------------------------ |
| GET    | `/`                                    | Plain text `OIDC Provider`           |
| GET    | `/.well-known/openid-configuration`    | OIDC discovery document              |
| GET    | `/.well-known/jwks`                    | Public signing key (JWKS)            |
| POST   | `/token`                               | Issue an id_token (needs `X-API-KEY`)|
| GET    | `/health/`                             | Health check, `OK`                   |

### `POST /token` responses

| Status | Body                            |
| ------ | ------------------------------- |
| 200    | `{ "id_token": "<jwt>" }`       |
| 401    | `{ "error": "missing_api_key" }`|
| 401    | `{ "error": "unauthorized" }`   |
| 405    | `{ "error": "invalid_method" }` |

## JWT claims

```json
{
  "iss": "<OIDC_ISSUER>",
  "sub": "jenkins:<client-name>",
  "aud": "gcp",
  "iat": 1234567890,
  "exp": 1234568490
}
```

## Getting started (local)

```bash
# 1. Install dependencies
npm install

# 2. Generate the RSA signing keys
mkdir -p keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem

# 3. Configure environment
cp .env.example .env   # then edit OIDC_ISSUER / MONGODB_URI

# 4. Seed a Jenkins client (prints the generated API key)
npm run seed

# 5. Run
npm start
```

## Running with Docker

```bash
cp .env.example .env   # set OIDC_ISSUER
docker compose up --build
```

The compose file starts the app plus a MongoDB instance. Seed a client with:

```bash
docker compose exec app npm run seed
```

## Environment variables

| Variable           | Required | Default                                  | Description                              |
| ------------------ | -------- | ---------------------------------------- | ---------------------------------------- |
| `OIDC_ISSUER`      | yes      | —                                        | Public URL / JWT `iss`                   |
| `MONGODB_URI`      | yes      | —                                        | MongoDB connection string                |
| `PORT`             | no       | `8000`                                   | HTTP port                                |
| `DEBUG`            | no       | `False`                                  | `True` enables verbose mode              |
| `PRIVATE_KEY_PATH` | no       | `keys/private.pem`                       | RSA private key path                     |
| `PUBLIC_KEY_PATH`  | no       | `keys/public.pem`                        | RSA public key path                      |
| `OIDC_KEY_ID`      | no       | `f3d31c42-53bf-4cd9-8912-74df7be06bb7`   | JWKS `kid` (keep stable for GCP)         |

## Notes on key management

For GCP WIF to keep trusting issued tokens, the RSA key pair and `kid` must stay
**stable** across deploys. Mount the keys from a volume or secret manager rather
than regenerating them on every build.
