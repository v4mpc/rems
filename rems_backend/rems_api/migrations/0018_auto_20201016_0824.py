# Generated by Django 3.1.1 on 2020-10-16 08:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rems_api', '0017_auto_20201016_0816'),
    ]

    operations = [
        migrations.AlterField(
            model_name='othercost',
            name='erf',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='other_costs', to='rems_api.erf'),
        ),
    ]
