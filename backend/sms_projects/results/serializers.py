from rest_framework import serializers
from .models import Result


class ResultSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField(read_only=True)
    course_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Result
        fields = "__all__"

    def get_student_name(self, obj):
        return f"{obj.enrollment.student.first_name} {obj.enrollment.student.last_name}"

    def get_course_name(self, obj):
        return f"{obj.enrollment.course.code} - {obj.enrollment.course.name}"

    def validate_final_score(self, value):
        if value < 0:
            raise serializers.ValidationError("Final score cannot be negative.")
        if value > 100:
            raise serializers.ValidationError("Final score cannot be more than 100.")
        return value

    def validate_gpa(self, value):
        if value < 0:
            raise serializers.ValidationError("GPA cannot be negative.")
        if value > 4:
            raise serializers.ValidationError("GPA cannot be more than 4.00.")
        return value

    def validate(self, attrs):
        enrollment = attrs.get("enrollment")
        instance = getattr(self, "instance", None)

        # ✅ friendly one-to-one error
        if not instance and Result.objects.filter(enrollment=enrollment).exists():
            raise serializers.ValidationError(
                {"detail": "This enrollment already has a result."}
            )

        return attrs
