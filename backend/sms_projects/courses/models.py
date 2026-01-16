from django.db import models
from django.core.validators import MinValueValidator
from teachers.models import Teacher

class Course(models.Model):
    SEMESTER_CHOICES = [
        ("Semester 1", "Semester 1"),
        ("Semester 2", "Semester 2"),
        ("Semester 3", "Semester 3"),
        ("Semester 4", "Semester 4"),
    ]

    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    # ✅ credits can NOT be negative
    credits = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    semester = models.CharField(max_length=20, choices=SEMESTER_CHOICES)

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"

    def save(self, *args, **kwargs):
        if self.code:
            self.code = self.code.upper().strip()
        if self.name:
            self.name = self.name.strip()
        super().save(*args, **kwargs)
