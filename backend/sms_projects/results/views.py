from rest_framework.viewsets import ModelViewSet
from .models import Result
from .serializers import ResultSerializer
from accounts.permissions import IsAdminOrStaffOrReadOnly

class ResultViewSet(ModelViewSet):
    queryset = Result.objects.select_related(
        "enrollment",
        "enrollment__student",
        "enrollment__course"
    ).order_by("-published_at")

    serializer_class = ResultSerializer
    permission_classes = [IsAdminOrStaffOrReadOnly]
