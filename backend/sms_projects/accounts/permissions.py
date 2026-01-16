from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrStaffOrReadOnly(BasePermission):
    """
    Admin/Staff can create/update/delete.
    Teacher/Student can only read (GET).
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # ✅ Allow read for all authenticated users
        if request.method in SAFE_METHODS:
            return True

        # ✅ Only admin/staff can write
        return user.role in ["admin", "staff"]
