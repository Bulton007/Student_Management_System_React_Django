from rest_framework.viewsets import ModelViewSet
from .models import Grade
from .serializers import GradeSerializer
from accounts.permissions import IsAdminOrStaffOrReadOnly

class GradeViewSet(ModelViewSet):
    queryset = Grade.objects.select_related(
        "enrollment",
        "enrollment__student",
        "enrollment__course"
    ).order_by("-created_at")

    serializer_class = GradeSerializer
    permission_classes = [IsAdminOrStaffOrReadOnly]
