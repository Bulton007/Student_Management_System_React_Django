from rest_framework.viewsets import ModelViewSet
from .models import Course
from .serializers import CourseSerializer
from accounts.permissions import IsAdminOrStaffOrReadOnly

from sms_projects.permissions import ReadOnlyForTeacherStudent

class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [ReadOnlyForTeacherStudent]
