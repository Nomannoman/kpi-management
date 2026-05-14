from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .serializers import KPISerializer
from .models import KPI
from users.permissions import IsManagerOrAdmin
from users.models import ADMIN


# GET /api/kpis/  POST /api/kpis/
# GET /api/kpis/<id>/  PUT /api/kpis/<id>/  PATCH /api/kpis/<id>/  DELETE /api/kpis/<id>/
class KPIViewSet(viewsets.ModelViewSet):
    serializer_class = KPISerializer
    queryset = KPI.objects.all()

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['id', 'status', 'project', 'owner', 'project_id']
    search_fields = ['name', 'description']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManagerOrAdmin()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        kpi = serializer.instance
        if self.request.user.profile.role != ADMIN and kpi.project.owner != self.request.user:
            raise PermissionDenied("You can only modify KPIs in your own projects.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.profile.role != ADMIN and instance.project.owner != self.request.user:
            raise PermissionDenied("You can only delete KPIs in your own projects.")
        instance.delete()