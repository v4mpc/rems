from rest_framework import serializers
from rems_api.models import Location, Arf, Me


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['pk', 'name', 'lodging', 'me']


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Me
        fields = ['destination', 'no_of_nights',
                  'daily_rate', 'percentage_of_daily_rate']


class ArfSerializer(serializers.ModelSerializer):
    mes = MeSerializer(many=True)

    class Meta:
        model = Arf
        fields = ['pk', 'user', 'location', 'address', 'purpose',
                  'start_date', 'end_date', 'date_of_request', 'status', 'mes']

    def create(self, validated_data):
        mes_data = validated_data.pop('mes')
        arf = Arf.objects.create(**validated_data)
        for me_data in mes_data:
            Me.objects.create(arf=arf, **me_data)
        return arf
