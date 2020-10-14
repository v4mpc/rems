from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User


class Location(models.Model):
    name = models.CharField(max_length=50)
    lodging = models.IntegerField()
    me = models.IntegerField()
    created_on = models.DateField(auto_now=True, auto_now_add=False)


class Arf(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    location = models.ForeignKey(
        'Location', models.SET_NULL, null=True)
    address = models.TextField()
    purpose = models.TextField()
    start_date = models.DateField(auto_now=False, auto_now_add=False)
    end_date = models.DateField(auto_now=False, auto_now_add=False)
    date_of_request = models.DateField(auto_now=False, auto_now_add=False)
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    status = models.CharField(max_length=50)
    excel_sheet = models.CharField(blank=True, null=True, max_length=100)


class Me(models.Model):
    arf = models.ForeignKey(
        'Arf', on_delete=models.CASCADE, blank=True, null=True, related_name='mes')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    destination = models.TextField()
    no_of_nights = models.SmallIntegerField()
    daily_rate = models.IntegerField()
    percentage_of_daily_rate = models.SmallIntegerField()
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    erf = models.ForeignKey('Erf', models.SET_NULL,
                            blank=True, null=True, related_name='mes')


class Lodging(models.Model):
    arf = models.ForeignKey(
        'Arf', on_delete=models.CASCADE, blank=True, null=True, related_name='lodgings')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    destination = models.TextField()
    no_of_nights = models.SmallIntegerField()
    daily_rate = models.IntegerField()
    percentage_of_daily_rate = models.SmallIntegerField()
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    erf = models.ForeignKey('Erf', models.SET_NULL,
                            blank=True, null=True, related_name='lodgings')


class OtherCost(models.Model):
    arf = models.ForeignKey('Arf', models.SET_NULL,
                            blank=True, null=True, related_name='other_costs')
    date = models.DateField(blank=True, null=True)
    purpose = models.TextField()
    amount = models.IntegerField()
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    erf = models.ForeignKey('Erf', models.SET_NULL, blank=True, null=True)


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=100)
    image = models.FileField(upload_to='uploads/',
                             max_length=100, blank=True, null=True)
    signature = models.FileField(
        upload_to='uploads/', max_length=100, blank=True, null=True)


class Erf(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    arf = models.OneToOneField('Arf', models.SET_NULL, blank=True, null=True)
    location = models.ForeignKey(
        'Location', models.SET_NULL, blank=True, null=True)
    address = models.TextField()
    purpose = models.TextField()
    start_date = models.DateField(auto_now=False, auto_now_add=False)
    end_date = models.DateField(auto_now=False, auto_now_add=False)
    date_of_request = models.DateField(auto_now=False, auto_now_add=False)
    created_on = models.DateField(auto_now=True, auto_now_add=False)
    status = models.CharField(max_length=50)
    excel_sheet = models.CharField(blank=True, null=True, max_length=100)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
