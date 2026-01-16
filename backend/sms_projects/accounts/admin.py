from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        "username",
        "email",
        "role",
        "is_approved",
        "is_staff",
        "is_superuser",
        "is_active",
    )

    list_filter = ("role", "is_approved", "is_staff", "is_superuser", "is_active")

    fieldsets = UserAdmin.fieldsets + (
        ("User Role", {"fields": ("role", "is_approved")}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("User Role", {"fields": ("role", "is_approved")}),
    )
