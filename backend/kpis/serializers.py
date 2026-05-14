from rest_framework import serializers
from .models import KPI

class KPISerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=False)

    owner_name = serializers.CharField(
        source="owner.get_full_name",
        read_only=True
    )

    owner_id = serializers.IntegerField(
        source="owner.id",
        read_only=True
    )

    class Meta:
        model = KPI

        fields = [
            "id",
            "name",
            "description",
            "current_value",
            "target_value",
            "status",
            "project",
            "owner",
            "owner_id",
            "owner_name",
        ]

        # 🔥 IMPORTANT FIX
        read_only_fields = [
            "project",
            "owner",
            "owner_id",
            "owner_name",
        ]