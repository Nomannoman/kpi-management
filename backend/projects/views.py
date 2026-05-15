from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .serializers import ProjectSerializer
from .models import Project
from users.permissions import IsManagerOrAdmin
from users.models import ADMIN


class ProjectListViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['id', 'owner']
    search_fields = ['name', 'description', 'owner__username', 'owner__first_name', 'owner__last_name']
    ordering = ['-updated_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManagerOrAdmin()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        if self.request.user.profile.role != ADMIN and serializer.instance.owner != self.request.user:
            raise PermissionDenied("You can only modify your own projects.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.profile.role != ADMIN and instance.owner != self.request.user:
            raise PermissionDenied("You can only delete your own projects.")
        instance.delete()