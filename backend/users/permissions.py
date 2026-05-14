from rest_framework.permissions import BasePermission
from users.models import ADMIN, MANAGER


class IsAdmin(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.profile.role == ADMIN
        )


class IsManagerOrAdmin(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.profile.role in [ADMIN, MANAGER]
        )