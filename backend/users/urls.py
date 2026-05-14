from django.urls import path
from users.views import MeView
from .views import (RoleRequestView,
    ActiveRoleRequestView,
    RoleRequestsView,
    ApproveRoleRequestView,
    RejectRoleRequestView,
    RoleRequestHistoryView,
    HealthCheckView,
    UserListView,
    UserDetailView
    )

urlpatterns = [
    path('me/', MeView.as_view()),
    path("role-request/", RoleRequestView.as_view()),
    path("role-request/active/", ActiveRoleRequestView.as_view()),
    path(
        "role-requests/",
        RoleRequestsView.as_view()
    ),

    path(
        "role-requests/<int:request_id>/approve/",
        ApproveRoleRequestView.as_view()
    ),

    path(
        "role-requests/<int:request_id>/reject/",
        RejectRoleRequestView.as_view()
    ),
    path("role-requests/history/", RoleRequestHistoryView.as_view()),
    path("health/", HealthCheckView.as_view()),
    path("", UserListView.as_view()),
    path("<int:user_id>/", UserDetailView.as_view()),
    ]