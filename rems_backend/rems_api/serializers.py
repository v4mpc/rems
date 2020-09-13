from rest_framework import serializers
from rems_api.models import Location


class ArfSerializer(serializers.ModelSerializer):
    pass


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['pk', 'name', 'lodging', 'me']
