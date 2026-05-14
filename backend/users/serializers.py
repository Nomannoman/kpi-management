from django.contrib.auth.models import User
from rest_framework import serializers
from users.models import UserProfile, VIEWER
from .models import RoleChangeRequest


class SignupSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'password'
        ]

    def create(self, validated_data):
    
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )

        UserProfile.objects.create(
            user=user,
            role=VIEWER
        )

        return user
    


class RoleChangeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleChangeRequest
        fields = "__all__"