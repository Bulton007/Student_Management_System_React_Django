import datetime
from django.core.exceptions import ValidationError

def validate_date_of_birth(value):
    today = datetime.date.today()

    # ❌ Future date not allowed
    if value > today:
        raise ValidationError("Date of birth cannot be in the future.")

    # ❌ Too old / invalid date
    if value.year < 1900:
        raise ValidationError("Date of birth cannot be earlier than year 1900.")
