
from django.db import models
from django.contrib.auth.models import User

ADMIN = 'ADMIN'
MANAGER = 'MANAGER'
VIEWER = 'VIEWER'

ROLE_CHOICES = [
    (ADMIN, 'Admin'),
    (MANAGER, 'Manager'),
    (VIEWER, 'Viewer'),
]

class UserProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=VIEWER
    )

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class RoleChangeRequest(models.Model):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (APPROVED, "Approved"),
        (REJECTED, "Rejected"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="role_requests"
    )

    current_role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    requested_role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=PENDING
    )

    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_role_requests"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'role_change'

    def __str__(self):
        return f"{self.user.username}: {self.current_role} → {self.requested_role} ({self.status})"
