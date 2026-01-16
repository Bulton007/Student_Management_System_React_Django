from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # ✅ Auth / Accounts
    path("api/auth/", include("accounts.urls")),

    # ✅ SMS APIs
    path("api/", include("students.urls")),
    path("api/", include("teachers.urls")),
    path("api/", include("courses.urls")),
    path("api/", include("emrollments.urls")),
    path("api/", include("departments.urls")),
    path("api/", include("grades.urls")),
    path("api/", include("attendences.urls")),
    path("api/", include("results.urls")),
]
