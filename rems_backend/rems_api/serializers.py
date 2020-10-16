from rest_framework import serializers
from rems_api.models import Location, Arf, Me, Lodging, OtherCost, Erf
from rems_api.excel import WorkBook, Erf as ErfExcel
from django.contrib.auth.models import User
from datetime import timedelta
from collections import OrderedDict


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['pk', 'name', 'lodging', 'me']


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Me
        fields = ['start_date', 'end_date', 'destination', 'no_of_nights',
                  'daily_rate', 'percentage_of_daily_rate', 'pk']


class LodgingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lodging
        fields = ['start_date', 'end_date', 'destination', 'no_of_nights',
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
        mes_data, lodgings_data = self.mutate(validated_data)
        other_costs_data = validated_data.pop('other_costs')
        arf = Arf.objects.create(**validated_data)

        erf_sheet = ErfExcel(validated_data['excel_sheet'])
        erf_sheet.init(validated_data, mes_data,
                       lodgings_data, other_costs_data)
        erf_sheet.write_and_save()
        # validated_data.pop('excel_sheet')
        # TODO: Days in expense report should be in terms of 0.75 and >=1
        erf = Erf.objects.create(arf=arf, **validated_data)
        for me_data in mes_data:
            me_data.pop('date')
            Me.objects.create(arf=arf, **me_data)
            Me.objects.create(erf=erf, **me_data)

        for other_cost_data in other_costs_data:
            OtherCost.objects.create(arf=arf, **other_cost_data)
            OtherCost.objects.create(erf=erf, **other_cost_data)

        for lodging_data in lodgings_data:
            lodging_data.pop('date')
            Lodging.objects.create(arf=arf, **lodging_data)
            Lodging.objects.create(erf=erf, **lodging_data)
        return arf

    def mutate(self, validated_data):
        location_name = validated_data['location'].name
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        mes_data = validated_data.pop('mes')
        lodgings_data = validated_data.pop('lodgings')
        new_mes_data = []
        new_lodgings_data = []
        for dict_of_lodging in lodgings_data:
            new_dict_of_lodging = OrderedDict()
            for key, value in dict_of_lodging.items():
                new_dict_of_lodging[key] = value
                if key == 'destination':
                    value = value.lower().strip()
                    compare_value = location_name.lower().strip()
                    if value == compare_value:
                        new_dict_of_lodging['start_date'] = start_date
                        new_dict_of_lodging['end_date'] = end_date
                        new_dict_of_lodging[
                            'date'] = f"{start_date.strftime('%b-%d-%Y')} - {end_date.strftime('%b-%d-%Y')}"
            new_lodgings_data.append(new_dict_of_lodging)
        for dict_of_me in mes_data:
            new_dict_of_me = OrderedDict()
            for key, value in dict_of_me.items():
                new_dict_of_me[key] = value
                if key == 'destination':
                    value = value.lower().strip().split()

                    compare_value = 'dar es salaam - '+location_name
                    compare_value = compare_value.lower().split()
                    if value == compare_value:
                        new_dict_of_me['start_date'] = start_date
                        new_dict_of_me['date'] = start_date

                    if value == location_name.lower().split():
                        new_dict_of_me['start_date'] = start_date + \
                            timedelta(days=1)
                        new_dict_of_me['end_date'] = end_date-timedelta(days=1)
                        new_dict_of_me[
                            'date'] = f"{new_dict_of_me['start_date'].strftime('%b-%d-%Y')} - {new_dict_of_me['end_date'].strftime('%b-%d-%Y')}"

                    compare_value = location_name+' - dar es salaam'
                    compare_value = compare_value.lower().split()
                    if value == compare_value:
                        new_dict_of_me['end_date'] = end_date
                        new_dict_of_me['date'] = end_date

            new_mes_data.append(new_dict_of_me)

        return new_mes_data, new_lodgings_data

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

        instance.mes.all().delete()
        instance.lodgings.all().delete()
        instance.other_costs.all().delete()

        instance.erf.delete()

        # save new ones
        mes_data, lodgings_data = self.mutate(validated_data)
        other_costs_data = validated_data.pop('other_costs')

        erf_sheet = ErfExcel(validated_data['excel_sheet'])
        erf_sheet.init(validated_data, mes_data,
                       lodgings_data, other_costs_data)
        erf_sheet.write_and_save()
        # validated_data.pop('excel_sheet')
        erf = Erf.objects.create(arf=instance, **validated_data)
        for me_data in mes_data:
            me_data.pop('date')
            Me.objects.create(arf=instance, **me_data)
            Me.objects.create(erf=erf, **me_data)

        for other_cost_data in other_costs_data:
            OtherCost.objects.create(arf=instance, **other_cost_data)
            OtherCost.objects.create(erf=erf, **other_cost_data)

        for lodging_data in lodgings_data:
            lodging_data.pop('date')
            Lodging.objects.create(arf=instance, **lodging_data)
            Lodging.objects.create(erf=erf, **lodging_data)

        return instance
