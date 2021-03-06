# Generated by Django 3.1.1 on 2020-09-13 11:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rems_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='erf',
            name='arf',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='rems_api.arf'),
        ),
        migrations.AlterField(
            model_name='erf',
            name='location',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='rems_api.location'),
        ),
        migrations.AlterField(
            model_name='me',
            name='arf',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rems_api.arf'),
        ),
        migrations.AlterField(
            model_name='me',
            name='erf',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='rems_api.erf'),
        ),
        migrations.AlterField(
            model_name='othercost',
            name='arf',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='rems_api.arf'),
        ),
        migrations.AlterField(
            model_name='othercost',
            name='erf',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='rems_api.erf'),
        ),
    ]
