from rest_framework.viewsets import ModelViewSet
from .models import Student
from .serializers import StudentSerializer
from accounts.permissions import IsAdminOrStaffOrReadOnly

class StudentViewSet(ModelViewSet):
    queryset = Student.objects.all().order_by("-created_at")
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrStaffOrReadOnly]
