from rest_framework import serializers

from .models import Project
from kpis.models import KPI
from kpis.serializers import KPISerializer


class ProjectSerializer(serializers.ModelSerializer):

    kpis = KPISerializer(many=True)

    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Project

        fields = [
            'id',
            'name',
            'owner',
            'owner_name',
            'description',
            'created_at',
            'updated_at',
            'kpis'
        ]

        read_only_fields = [
            'owner',
            'owner_name'
        ]

    def get_owner_name(self, obj):

        first_name = obj.owner.first_name or ""
        last_name = obj.owner.last_name or ""

        return " ".join(
            part for part in [first_name, last_name]
            if part
        )

    def create(self, validated_data):

        kpis_data = validated_data.pop(
            'kpis',
            []
        )

        request = self.context.get('request')

        project = Project.objects.create(
            owner=request.user,
            **validated_data
        )

        for kpi_data in kpis_data:

            KPI.objects.create(
                project=project,
                owner=request.user,
                **kpi_data
            )

        return project

    def update(self, instance, validated_data):

        kpis_data = validated_data.pop(
            'kpis',
            []
        )

        instance.name = validated_data.get(
            'name',
            instance.name
        )

        instance.description = validated_data.get(
            'description',
            instance.description
        )

        instance.save()

        incoming_ids = [
            kpi['id'] for kpi in kpis_data if 'id' in kpi
        ]

        instance.kpis.exclude(id__in=incoming_ids).delete()

        for kpi_data in kpis_data:
            kpi_id = kpi_data.pop('id', None)

            if kpi_id:
                KPI.objects.filter(
                    id=kpi_id,
                    project=instance
                ).update(**kpi_data)
            else:
                request = self.context.get('request')
                KPI.objects.create(
                    project=instance,
                    owner=request.user,
                    **kpi_data
                )

        return instance