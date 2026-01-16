from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import me, create_user, change_password

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("me/", me, name="me"),

    # ✅ NEW
    path("create-user/", create_user, name="create-user"),
    path("change-password/", change_password, name="change-password"),
]
