from rest_framework.viewsets import ModelViewSet
from .models import Attendance
from .serializers import AttendanceSerializer
from accounts.permissions import IsAdminOrStaffOrReadOnly

class AttendanceViewSet(ModelViewSet):
    queryset = Attendance.objects.select_related(
        "enrollment",
        "enrollment__student",
        "enrollment__course",
    ).order_by("-date")

    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminOrStaffOrReadOnly]
