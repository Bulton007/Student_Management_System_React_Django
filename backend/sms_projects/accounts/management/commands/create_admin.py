from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@gmail.com")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "Admin12345@")

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email},
        )

        if created:
            user.set_password(password)

            # ✅ Make it admin role
            user.role = "admin"

            # ✅ Make it admin in Django system too
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True

            user.save()

            self.stdout.write("✅ Superuser created with ADMIN role")
        else:
            # ✅ If user exists but role not admin -> upgrade it
            changed = False

            if user.role != "admin":
                user.role = "admin"
                changed = True

            if not user.is_staff:
                user.is_staff = True
                changed = True

            if not user.is_superuser:
                user.is_superuser = True
                changed = True

            if not user.is_active:
                user.is_active = True
                changed = True

            if changed:
                user.save()
                self.stdout.write("✅ Existing user updated to ADMIN role")
            else:
                self.stdout.write("✅ Superuser already exists and is ADMIN")
