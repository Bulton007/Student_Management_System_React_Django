from rest_framework import serializers
from .models import Teacher


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = "__all__"

        # ✅ custom unique error messages
        extra_kwargs = {
            "email": {
                "error_messages": {
                    "unique": "This email is already used by another teacher."
                }
            },
            "phone": {
                "error_messages": {
                    "unique": "This phone number is already used by another teacher."
                }
            },
        }

    # ✅ format + validate full_name
    def validate_full_name(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters.")

        return value

    # ✅ clean email
    def validate_email(self, value):
        return value.lower().strip()

    # ✅ clean phone
    def validate_phone(self, value):
        return value.strip()

    # ✅ clean department
    def validate_department(self, value):
        return value.strip()
