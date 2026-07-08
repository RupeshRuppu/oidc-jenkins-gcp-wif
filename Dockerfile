FROM --platform=linux/amd64 node:20-alpine
WORKDIR /app

# Generate the RSA signing keys used for RS256 id_tokens / JWKS.
# NOTE: keys are generated at build time here for convenience. In production,
# mount stable keys (volume or secret manager) so the JWKS GCP trusts does not
# change on every rebuild.
RUN apk add --no-cache openssl && \
    mkdir -p /app/keys && \
    openssl genrsa -out /app/keys/private.pem 2048 && \
    openssl rsa -in /app/keys/private.pem -pubout -out /app/keys/public.pem

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8000

CMD ["node", "src/server.js"]
