from rest_framework.viewsets import ModelViewSet
from .models import Teacher
from .serializers import TeacherSerializer
from accounts.permissions import IsAdminOrStaffOrReadOnly

class TeacherViewSet(ModelViewSet):
    queryset = Teacher.objects.all().order_by("-created_at")
    serializer_class = TeacherSerializer
    permission_classes = [IsAdminOrStaffOrReadOnly]
