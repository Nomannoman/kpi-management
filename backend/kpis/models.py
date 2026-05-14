from django.db import models
from projects.models import Project
from django.contrib.auth.models import User

AT_RISK = 0
OFF_TRACK = 1
ON_TRACK = 2


KPI_STATUS_CHOICES = (
    (AT_RISK, 'At Risk'),
    (OFF_TRACK, 'Off Track'),
    (ON_TRACK, 'On Track')
)

class KPI(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='kpis'
    )    
    name = models.CharField(max_length=255)
    description = models.TextField()
    owner = models.ForeignKey(
            User,
            on_delete=models.SET_NULL,
            null=True,
            blank=True,
            related_name="kpis"
        )    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    target_value = models.IntegerField()
    current_value = models.IntegerField()
    status = models.IntegerField(choices=KPI_STATUS_CHOICES, default=ON_TRACK)

    class Meta:
        db_table = 'kpis'
    
    def __str__(self):
        return self.name