from django.db import models
from django.core.validators import RegexValidator
from .validators import validate_date_of_birth


class Student(models.Model):
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    phone_validator = RegexValidator(
        regex=r"^\+?\d{8,20}$",
        message="Phone must contain only numbers and can start with + (8-20 digits)."
    )

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    # ✅ add validator here
    date_of_birth = models.DateField(validators=[validate_date_of_birth])

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True, validators=[phone_validator])

    address = models.TextField()

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Active")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.lower().strip()
        if self.phone:
            self.phone = self.phone.strip()
        super().save(*args, **kwargs)
