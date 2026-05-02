FROM python:3.10-alpine
WORKDIR /app

RUN apk add --no-cache openssl
RUN mkdir -p /app/keys && \
    openssl genrsa -out /app/keys/private.pem 2048 && \
    openssl rsa -in /app/keys/private.pem -pubout -out /app/keys/public.pem

COPY . .

RUN pip install -r requirements.txt

EXPOSE 8000
EXPOSE 8080