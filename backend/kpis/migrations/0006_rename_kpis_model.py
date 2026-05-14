from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kpis', '0005_alter_kpis_owner'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='KPIs',
            new_name='KPI',
        ),
    ]
