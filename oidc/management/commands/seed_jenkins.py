# oidc/management/commands/seed_jenkins.py

from django.core.management.base import BaseCommand
from oidc.models import JenkinsClient
import secrets


class Command(BaseCommand):
    help = "Seed Jenkins client"

    def handle(self, *args, **kwargs):
        api_key = secrets.token_urlsafe(32)

        obj, created = JenkinsClient.objects.update_or_create(
            name="jenkins-prod",
            defaults={"api_key": api_key}
        )

        self.stdout.write(self.style.SUCCESS(f"API KEY: created={created}, api_key={api_key}"))