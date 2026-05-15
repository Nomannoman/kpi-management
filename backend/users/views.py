from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from django.utils.timezone import now

from django.contrib.auth.models import User

from users.serializers import SignupSerializer
from users.models import RoleChangeRequest
from users.permissions import IsAdmin
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserPagination(PageNumberPagination):
    page_size = 5

class UserListView(ListAPIView):
    permission_classes = [IsAdmin]
    pagination_class = UserPagination

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id).order_by("id")

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()

        page = self.paginate_queryset(queryset)

        if page is not None:
            data = [
                {
                    "id": u.id,
                    "username": u.username,
                    "first_name": u.first_name,
                    "last_name": u.last_name,
                    "role": u.profile.role
                }
                for u in page
            ]
            return self.get_paginated_response(data)

        data = [
            {
                "id": u.id,
                "username": u.username,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "role": u.profile.role
            }
            for u in queryset
        ]

        return Response(data)


class UserDetailView(APIView):
    permission_classes = [IsAdmin]

    def put(self, request, user_id):

        user = get_object_or_404(User, id=user_id)

        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.save()

        profile = user.profile
        profile.role = request.data.get("role", profile.role)
        profile.save()

        return Response({"message": "Updated successfully"})


class LoginView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        serializer = TokenObtainPairSerializer(data=request.data)

        if serializer.is_valid():
            return Response(
                {'access': serializer.validated_data['access']}
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class SignupView(APIView):

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            is_first_user = User.objects.count() == 0
            user = serializer.save()
            if is_first_user:
                user.profile.role = "ADMIN"
                user.profile.save()
            return Response(
                {
                    "message": "User created successfully",
                    "role": "ADMIN" if is_first_user else user.profile.role
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        profile = request.user.profile

        return Response({
            "username": request.user.username,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "id": request.user.id,
            "role": profile.role
        })


class RoleRequestView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        requested_role = request.data.get("requestedRole")

        if RoleChangeRequest.objects.filter(
            user=user,
            status=RoleChangeRequest.PENDING
        ).exists():
            return Response(
                {"detail": "Already pending"},
                status=status.HTTP_400_BAD_REQUEST
            )

        RoleChangeRequest.objects.create(
            user=user,
            current_role=user.profile.role,
            requested_role=requested_role
        )

        return Response({"message": "Request submitted"})


class ActiveRoleRequestView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        req = RoleChangeRequest.objects.filter(
            user=request.user,
            status=RoleChangeRequest.PENDING
        ).first()

        if not req:
            return Response({"exists": False})

        return Response({
            "exists": True,
            "id": req.id,
            "requested_role": req.requested_role,
            "status": req.status
        })


class RoleRequestsView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        requests = RoleChangeRequest.objects.filter(
            status=RoleChangeRequest.PENDING
        ).select_related("user")

        data = [
            {
                "id": req.id,
                "username": req.user.username,
                "first_name": req.user.first_name,
                "last_name": req.user.last_name,
                "current_role": req.current_role,
                "requested_role": req.requested_role,
                "status": req.status,
            }
            for req in requests
        ]

        return Response(data)


class ApproveRoleRequestView(APIView):

    permission_classes = [IsAdmin]

    def post(self, request, request_id):

        role_request = get_object_or_404(RoleChangeRequest, id=request_id)

        role_request.status = RoleChangeRequest.APPROVED
        role_request.reviewed_by = request.user
        role_request.reviewed_at = now()

        profile = role_request.user.profile
        profile.role = role_request.requested_role
        profile.save()

        role_request.save()

        return Response({"message": "Role request approved"})


class RejectRoleRequestView(APIView):

    permission_classes = [IsAdmin]

    def post(self, request, request_id):

        role_request = get_object_or_404(RoleChangeRequest, id=request_id)

        role_request.status = RoleChangeRequest.REJECTED
        role_request.reviewed_by = request.user
        role_request.reviewed_at = now()

        role_request.save()

        return Response({"message": "Role request rejected"})


class RoleRequestHistoryView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        requests = (
            RoleChangeRequest.objects
            .exclude(status=RoleChangeRequest.PENDING)
            .select_related("user", "reviewed_by")
            .order_by("-reviewed_at")
        )

        data = [
            {
                "id": req.id,
                "username": req.user.username,
                "first_name": req.user.first_name,
                "last_name": req.user.last_name,
                "current_role": req.current_role,
                "requested_role": req.requested_role,
                "status": req.status,
                "reviewed_by": (
                    req.reviewed_by.username if req.reviewed_by else None
                ),
                "reviewed_at": req.reviewed_at,
            }
            for req in requests
        ]

        return Response(data)


class HealthCheckView(APIView):

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok"})