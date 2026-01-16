from django.db import models
from emrollments.models import Enrollment
from django.core.exceptions import ValidationError
from django.utils import timezone
import datetime


def validate_attendance_date(value):
    today = timezone.localdate()

    if value > today:
        raise ValidationError("Attendance date cannot be in the future.")

    if value < datetime.date(1900, 1, 1):
        raise ValidationError("Attendance date cannot be before year 1900.")


class Attendance(models.Model):
    STATUS_CHOICES = [
        ("Present", "Present"),
        ("Absent", "Absent"),
        ("Late", "Late"),
        ("Excused", "Excused"),
    ]

    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )

    date = models.DateField(validators=[validate_attendance_date])
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Present")
    note = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("enrollment", "date")

    def __str__(self):
        return f"{self.enrollment} | {self.date} | {self.status}"
