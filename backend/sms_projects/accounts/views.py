from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    UserSerializer,
    CreateUserSerializer,
    ChangePasswordSerializer
)

User = get_user_model()


# ✅ custom check for role admin
def is_admin(user):
    return user.is_authenticated and user.role == "admin"


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


# ✅ ADMIN ONLY - Create user
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_user(request):

    if not is_admin(request.user):
        return Response(
            {"detail": "Only admin can create users."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = CreateUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully", "user": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ ALL USERS - Change password
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    old_password = serializer.validated_data["old_password"]
    new_password = serializer.validated_data["new_password"]

    if not user.check_password(old_password):
        return Response(
            {"old_password": ["Old password is incorrect."]},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password changed successfully ✅"})
