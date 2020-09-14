from rest_framework import serializers
from rems_api.models import Location, Arf, Me, Lodging, OtherCost
from rems_api.excel import WorkBook
from django.contrib.auth.models import User


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['pk', 'name', 'lodging', 'me']


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Me
        fields = ['destination', 'no_of_nights',
                  'daily_rate', 'percentage_of_daily_rate', 'pk']


class LodgingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lodging
        fields = ['destination', 'no_of_nights',
                  'daily_rate', 'percentage_of_daily_rate', 'pk']


class OtherCostSerializer(serializers.ModelSerializer):

    class Meta:
        model = OtherCost
        fields = ['purpose', 'amount', 'pk']


class ArfSerializer(serializers.ModelSerializer):
    mes = MeSerializer(many=True)
    lodgings = LodgingSerializer(many=True)
    other_costs = OtherCostSerializer(many=True)

    class Meta:
        model = Arf
        fields = ['pk', 'user', 'location', 'address', 'purpose',
                  'start_date', 'end_date', 'date_of_request', 'status', 'mes', 'lodgings', 'other_costs', 'excel_sheet']

    def create(self, validated_data):
        arf_sheet = WorkBook("Advance Request")
        arf_sheet.init(validated_data)
        if arf_sheet.exists():
            raise serializers.ValidationError('File exists')
        arf_sheet.write_and_save()
        file_name = arf_sheet.get_file_name()
        validated_data['excel_sheet'] = file_name
        mes_data = validated_data.pop('mes')
        lodgings_data = validated_data.pop('lodgings')
        other_costs_data = validated_data.pop('other_costs')
        arf = Arf.objects.create(**validated_data)
        for me_data in mes_data:
            Me.objects.create(arf=arf, **me_data)

        for other_cost_data in other_costs_data:
            OtherCost.objects.create(arf=arf, **other_cost_data)

        for lodging_data in lodgings_data:
            Lodging.objects.create(arf=arf, **lodging_data)
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
