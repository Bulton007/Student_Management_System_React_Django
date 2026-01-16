from rest_framework.viewsets import ModelViewSet
from .models import Enrollment
from .serializers import EnrollmentSerializer
from accounts.permissions import IsAdminOrStaffOrReadOnly

class EnrollmentViewSet(ModelViewSet):
    queryset = Enrollment.objects.all().order_by("-enrollment_date")
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAdminOrStaffOrReadOnly]
