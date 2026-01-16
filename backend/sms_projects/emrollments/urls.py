from rest_framework.routers import DefaultRouter
from .views import EnrollmentViewSet

router = DefaultRouter()
router.register('enrollments', EnrollmentViewSet)

urlpatterns = router.urls
