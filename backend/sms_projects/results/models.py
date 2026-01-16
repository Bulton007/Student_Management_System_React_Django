from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from emrollments.models import Enrollment

class Result(models.Model):
    STATUS_CHOICES = [
        ("Pass", "Pass"),
        ("Fail", "Fail"),
    ]

    enrollment = models.OneToOneField(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="result"
    )

    # ✅ final_score must be between 0 - 100
    final_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ]
    )

    # ✅ GPA must be between 0 - 4.00
    gpa = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(4),
        ]
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="Pass"
    )

    published_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at"]
        constraints = [
            models.CheckConstraint(
                check=models.Q(final_score__gte=0),
                name="result_final_score_not_negative"
            ),
            models.CheckConstraint(
                check=models.Q(gpa__gte=0),
                name="result_gpa_not_negative"
            ),
        ]

    def __str__(self):
        return f"{self.enrollment} => {self.final_score} ({self.status})"
