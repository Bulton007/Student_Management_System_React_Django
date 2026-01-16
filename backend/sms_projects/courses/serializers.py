from rest_framework import serializers
from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"

        extra_kwargs = {
            "code": {
                "error_messages": {
                    "unique": "This course code already exists."
                }
            }
        }

    def validate_code(self, value):
        return value.upper().strip()

    def validate_name(self, value):
        return value.strip()

    def validate_credits(self, value):
        if value < 1:
            raise serializers.ValidationError("Credits must be at least 1.")
        return value

    def validate_semester(self, value):
        return value.strip()
