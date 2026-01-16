from django.db import models
from students.models import Student
from courses.models import Course

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ("Enrolled", "Enrolled"),
        ("Completed", "Completed"),
        ("Dropped", "Dropped"),
    ]

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="enrollments",
        db_index=True
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments",
        db_index=True
    )

    enrollment_date = models.DateField(auto_now_add=True)

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default="Enrolled"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course_enrollment"
            )
        ]
        ordering = ["-enrollment_date"]

    def __str__(self):
        return f"{self.student} → {self.course}"
