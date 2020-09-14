from rest_framework import serializers
from rems_api.models import Location, Arf, Me
from rems_api.excel import WorkBook
from django.contrib.auth.models import User


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['pk', 'name', 'lodging', 'me']


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Me
        fields = ['destination', 'no_of_nights', 'lodging',
                  'daily_rate', 'percentage_of_daily_rate', 'pk']


class ArfSerializer(serializers.ModelSerializer):
    mes = MeSerializer(many=True)

    class Meta:
        model = Arf
        fields = ['pk', 'user', 'location', 'address', 'purpose',
                  'start_date', 'end_date', 'date_of_request', 'status', 'mes']

    def create(self, validated_data):
        # first lets create the excel
        # region = Location.objects.get(pk=validated_data['location'])
        arf_sheet = WorkBook("Advance Request")
        arf_sheet.init(validated_data)
        if arf_sheet.exists():
            raise serializers.ValidationError('File exists')
        arf_sheet.write_and_save()
        mes_data = validated_data.pop('mes')
        arf = Arf.objects.create(**validated_data)
        for me_data in mes_data:
            Me.objects.create(arf=arf, **me_data)
        return arf

    def update(self, instance, validated_data):
        instance.location = validated_data.get('location', instance.location)
        instance.address = validated_data.get('address', instance.address)
        instance.purpose = validated_data.get('purpose', instance.purpose)
        instance.start_date = validated_data.get(
            'start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.date_of_request = validated_data.get(
            'date_of_request', instance.date_of_request)
        instance.status = validated_data.get(
            'date_of_request', instance.status)
        # instance.mes.set(
        #     mes for mes in validated_data.get('mes', instance.mes))
        instance.save()
        return instance
