from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class Arf(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    location = models.ForeignKey('Location', models.SET_NULL, null=True)
    address = models.TextField()
    purpose = models.TextField()
    start_date = models.DateField(auto_now=False, auto_now_add=False)
    end_date = models.DateField(auto_now=False, auto_now_add=False)
    date_of_request = models.DateField(auto_now=False, auto_now_add=False)
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    status = models.CharField(max_length=50)
    excel_path = models.FileField(upload_to='uploads/', max_length=100)


class Location(models.Model):
    name = models.CharField(max_length=50)
    lodging = models.IntegerField()
    me = models.IntegerField()
    created_on = models.DateField(auto_now=True, auto_now_add=False)


class Me(models.Model):
    arf = models.ForeignKey('Arf', on_delete=models.CASCADE, null=True)
    destination = models.TextField()
    no_of_nights = models.SmallIntegerField()
    daily_rate = models.IntegerField()
    percentage_of_daily_rate = models.SmallIntegerField()
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    erf = models.ForeignKey('Erf', models.SET_NULL, null=True)


class OtherCost(models.Model):
    arf = models.ForeignKey('Arf', models.SET_NULL, null=True)
    purpose = models.TextField()
    amount = models.IntegerField()
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    erf = models.ForeignKey('Erf', models.SET_NULL, null=True)


class Erf(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    arf = models.OneToOneField('Arf', models.SET_NULL, null=True)
    location = models.ForeignKey('Location', models.SET_NULL, null=True)
    address = models.TextField()
    purpose = models.TextField()
    start_date = models.DateField(auto_now=False, auto_now_add=False)
    end_date = models.DateField(auto_now=False, auto_now_add=False)
    date_of_request = models.DateField(auto_now=False, auto_now_add=False)
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    status = models.CharField(max_length=50)
    excel_path = models.FileField(upload_to='uploads/', max_length=100)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
