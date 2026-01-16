from rest_framework import serializers
from .models import Enrollment


class EnrollmentSerializer(serializers.ModelSerializer):
    # ✅ readable fields for frontend
    student_name = serializers.SerializerMethodField(read_only=True)
    course_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Enrollment
        fields = "__all__"

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    def get_course_name(self, obj):
        return f"{obj.course.code} - {obj.course.name}"

    # ✅ cleaner error message for duplicate enrollments
    def validate(self, attrs):
        student = attrs.get("student")
        course = attrs.get("course")

        # When updating, ignore current record
        instance = getattr(self, "instance", None)

        qs = Enrollment.objects.filter(student=student, course=course)
        if instance:
            qs = qs.exclude(pk=instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                {"detail": "This student is already enrolled in this course."}
            )

        return attrs
