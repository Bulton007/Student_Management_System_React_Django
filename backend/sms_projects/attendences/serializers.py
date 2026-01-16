from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField(read_only=True)
    course_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Attendance
        fields = "__all__"

    def get_student_name(self, obj):
        return f"{obj.enrollment.student.first_name} {obj.enrollment.student.last_name}"

    def get_course_name(self, obj):
        return f"{obj.enrollment.course.code} - {obj.enrollment.course.name}"

    # ✅ prevent duplicates (same enrollment + same date)
    def validate(self, attrs):
        enrollment = attrs.get("enrollment")
        date = attrs.get("date")

        instance = getattr(self, "instance", None)

        qs = Attendance.objects.filter(enrollment=enrollment, date=date)
        if instance:
            qs = qs.exclude(pk=instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                {"detail": "Attendance already exists for this student in this course on this date."}
            )

        return attrs
