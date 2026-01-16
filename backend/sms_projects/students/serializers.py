from rest_framework import serializers
from django.utils import timezone
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

        # ✅ better error messages for unique fields
        extra_kwargs = {
            "email": {
                "error_messages": {
                    "unique": "This email is already used by another student."
                }
            },
            "phone": {
                "error_messages": {
                    "unique": "This phone number is already used by another student."
                }
            },
        }

    # ✅ clean inputs before saving
    def validate_email(self, value):
        return value.lower().strip()

    def validate_phone(self, value):
        return value.strip()

    # ✅ validate date_of_birth again (for API protection)
    def validate_date_of_birth(self, value):
        today = timezone.now().date()

        if value > today:
            raise serializers.ValidationError("Date of birth cannot be in the future.")

        if value.year < 1900:
            raise serializers.ValidationError("Date of birth cannot be earlier than year 1900.")

        return value
