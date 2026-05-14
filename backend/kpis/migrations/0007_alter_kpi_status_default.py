from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kpis', '0006_rename_kpis_model'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kpi',
            name='status',
            field=models.IntegerField(
                choices=[(0, 'At Risk'), (1, 'Off Track'), (2, 'On Track')],
                default=2,
            ),
        ),
    ]
