from rest_framework import serializers
from rems_api.models import Location, Arf, Me, Lodging, OtherCost, Erf
from rems_api.excel import WorkBook
from django.contrib.auth.models import User


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['pk', 'name', 'lodging', 'me']


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Me
        fields = ['date', 'destination', 'no_of_nights',
                  'daily_rate', 'percentage_of_daily_rate', 'pk']


class LodgingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lodging
        fields = ['date', 'destination', 'no_of_nights',
                  'daily_rate', 'percentage_of_daily_rate', 'pk']


class OtherCostSerializer(serializers.ModelSerializer):

    class Meta:
        model = OtherCost
        fields = ['date', 'purpose', 'amount', 'pk']


class ErfSerializer(serializers.ModelSerializer):
    mes = MeSerializer(many=True)
    lodgings = LodgingSerializer(many=True)
    other_costs = OtherCostSerializer(many=True, required=False)
    location_name = serializers.StringRelatedField(source="location.name")

    class Meta:
        model = Erf
        fields = ['pk', 'user', 'location', 'location_name', 'address', 'purpose',
                  'start_date', 'end_date', 'date_of_request', 'status', 'mes', 'lodgings', 'other_costs', 'excel_sheet']

    def create(self, validated_data):
        erf_sheet = WorkBook("Tanzania Expense Report")
        erf_sheet.init(validated_data)
        if erf_sheet.exists():
            raise serializers.ValidationError('File exists')
        erf_sheet.write_and_save()
        file_name = erf_sheet.get_file_name()
        validated_data['excel_sheet'] = file_name
        mes_data = validated_data.pop('mes')
        lodgings_data = validated_data.pop('lodgings')
        other_costs_data = validated_data.pop('other_costs')
        erf = Erf.objects.create(**validated_data)

        for me_data in mes_data:
            Me.objects.create(erf=erf, **me_data)

        for other_cost_data in other_costs_data:
            OtherCost.objects.create(erf=erf, **other_cost_data)

        for lodging_data in lodgings_data:
            Lodging.objects.create(erf=erf, **lodging_data)
        return erf


class ArfSerializer(serializers.ModelSerializer):
    mes = MeSerializer(many=True)
    lodgings = LodgingSerializer(many=True)
    other_costs = OtherCostSerializer(many=True, required=False)
    location_name = serializers.StringRelatedField(source="location.name")
    erf = ErfSerializer(required=False)

    class Meta:
        model = Arf
        # depth = 1
        fields = ['pk', 'user', 'location', 'location_name', 'address', 'purpose',
                  'start_date', 'end_date', 'date_of_request', 'status', 'mes', 'lodgings', 'other_costs', 'excel_sheet', 'erf']

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

        # TODO Fill expense report excel sheet
        # lets create erf here
        # remove excel_sheet, we will use arf one
        validated_data.pop('excel_sheet')
        erf = Erf.objects.create(arf=arf, **validated_data)
        for me_data in mes_data:
            Me.objects.create(arf=arf, **me_data)
            Me.objects.create(erf=erf, **me_data)

        for other_cost_data in other_costs_data:
            OtherCost.objects.create(arf=arf, **other_cost_data)
            OtherCost.objects.create(erf=erf, **other_cost_data)

        for lodging_data in lodgings_data:
            Lodging.objects.create(arf=arf, **lodging_data)
            Lodging.objects.create(erf=erf, **lodging_data)
        return arf

    def update(self, instance, validated_data):

        arf_sheet = WorkBook("Advance Request")
        arf_sheet.init(validated_data)
        arf_sheet.delete(instance.excel_sheet)
        arf_sheet.write_and_save()
        file_name = arf_sheet.get_file_name()
        validated_data['excel_sheet'] = file_name

        instance.location = validated_data.get('location', instance.location)
        instance.address = validated_data.get('address', instance.address)
        instance.purpose = validated_data.get('purpose', instance.purpose)
        instance.start_date = validated_data.get(
            'start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.date_of_request = validated_data.get(
            'date_of_request', instance.date_of_request)
        instance.status = validated_data.get(
            'status', instance.status)
        instance.excel_sheet = validated_data.get(
            'excel_sheet', instance.excel_sheet)
        instance.save()

        # delete all mes
        instance.mes.all().delete()
        # delete all lodgings
        instance.lodgings.all().delete()
        # delete all other
        instance.other_costs.all().delete()

        # save new ones
        mes_data = validated_data.pop('mes')
        lodgings_data = validated_data.pop('lodgings')
        other_costs_data = validated_data.pop('other_costs')
        for me_data in mes_data:
            Me.objects.create(arf=instance, **me_data)

        for other_cost_data in other_costs_data:
            OtherCost.objects.create(arf=instance, **other_cost_data)

        for lodging_data in lodgings_data:
            Lodging.objects.create(arf=instance, **lodging_data)

        # TODO: Update expense database and excel sheet
        return instance
