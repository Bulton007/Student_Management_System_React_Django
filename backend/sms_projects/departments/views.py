from rest_framework.viewsets import ModelViewSet
from .models import Department
from .serializers import DepartmentSerializer
from accounts.permissions import IsAdminOrStaffOrReadOnly


class DepartmentViewSet(ModelViewSet):
    queryset = Department.objects.all().order_by("-created_at")
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrStaffOrReadOnly]
