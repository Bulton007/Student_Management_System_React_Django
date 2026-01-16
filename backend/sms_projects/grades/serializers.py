from rest_framework import serializers
from .models import Grade


class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField(read_only=True)
    course_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Grade
        fields = "__all__"

    def get_student_name(self, obj):
        return f"{obj.enrollment.student.first_name} {obj.enrollment.student.last_name}"

    def get_course_name(self, obj):
        return f"{obj.enrollment.course.code} - {obj.enrollment.course.name}"

    def validate_score(self, value):
        if value < 0:
            raise serializers.ValidationError("Score cannot be negative.")
        if value > 100:
            raise serializers.ValidationError("Score cannot be more than 100.")
        return value

    def validate(self, attrs):
        enrollment = attrs.get("enrollment")
        instance = getattr(self, "instance", None)

        # ✅ nice error for one-to-one duplicate
        if not instance and Grade.objects.filter(enrollment=enrollment).exists():
            raise serializers.ValidationError(
                {"detail": "This enrollment already has a grade."}
            )

        return attrs
