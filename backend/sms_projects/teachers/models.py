from django.db import models
from django.core.validators import RegexValidator

class Teacher(models.Model):
    phone_validator = RegexValidator(
        regex=r"^\+?\d{8,20}$",
        message="Phone must contain only numbers and can start with + (8-20 digits)."
    )

    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True, validators=[phone_validator])
    department = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.lower().strip()
        if self.phone:
            self.phone = self.phone.strip()
        if self.full_name:
            self.full_name = self.full_name.strip()
        super().save(*args, **kwargs)
