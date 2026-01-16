from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from emrollments.models import Enrollment

class Grade(models.Model):
    GRADE_CHOICES = [
        ("A", "A"),
        ("B", "B"),
        ("C", "C"),
        ("D", "D"),
        ("F", "F"),
    ]

    enrollment = models.OneToOneField(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="grade"
    )

    grade = models.CharField(max_length=2, choices=GRADE_CHOICES)

    # ✅ score must be between 0 and 100
    score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ]
    )

    remark = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                check=models.Q(score__gte=0),
                name="grade_score_not_negative"
            )
        ]

    def __str__(self):
        return f"{self.enrollment} => {self.grade}"
