# Generated by Django 3.1.1 on 2020-09-21 20:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rems_api', '0008_auto_20200921_2045'),
    ]

    operations = [
        migrations.AlterField(
            model_name='arf',
            name='location',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='rems_api.location'),
        ),
    ]
