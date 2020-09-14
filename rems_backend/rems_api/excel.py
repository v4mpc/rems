from openpyxl import load_workbook
import logging
import datetime
from django.conf import settings
import os
from pathlib import Path


class WorkBook:
    def __init__(self, sheet_name):
        self.module_dir = os.path.dirname(__file__)
        self.sample_arf_path = os.path.join(
            self.module_dir, 'static/rems_api/arf.xlsx')  # "arf.xlsx"  # erf.xlsx
        self.wb = load_workbook(filename=self.sample_arf_path)
        self.sheet_name = sheet_name  # "Advance Request"  # Tanzania Expense Report
        self.sheet = self.wb[self.sheet_name]

    def write_cell(self, cell_address, cell_value):
        self.sheet[cell_address] = cell_value

    def get_number_of_nights(self, start_date, end_date):
        # date dd-mm-yyy
        start_date = datetime.datetime.strptime(start_date, "%d-%m-%Y")
        end_date = datetime.datetime.strptime(end_date, "%d-%m-%Y")
        delta_date = end_date-start_date
        return delta_date.days

    def save(self):
        # print(self.generate_file_name())
        self.wb.save(self.generate_file_name())

    def read_cell(self, cell_address):
        return self.sheet[cell_address].value

    def exists(self):
        return Path(self.generate_file_name()).is_file()

    def delete(self):
        pass

    def init(self, validated_data):
        print(validated_data['purpose'])
        self.region = validated_data['location'].name
        self.date_of_request = validated_data['date_of_request']
        self.user = validated_data['user']
        self.name = self.user.profile.name
        self.address = validated_data['address']
        self.purpose = validated_data['purpose']
        self.period_of_travel_from = validated_data['start_date']
        self.period_of_travel_to = validated_data['end_date']
        self.signature = ''
        self.mes = validated_data['mes']
        self.signature_date = self.date_of_request
        self.fields = {
            'date_of_request': 'G4',
            'name': 'B8',
            'address': 'B9',
            'purpose': 'B13',
            'period_of_travel_from': 'B16',
            'period_of_travel_to': 'E16',
            'me_destination': ['B27', 'B28', 'B29', 'B30', 'B31', 'B21'],
            'me_no_of_days': ['C27', 'C28', 'C29', 'C30', 'C31', 'C21'],
            'me_amount': ['D27', 'D28', 'D29', 'D30', 'D31', 'D21'],
            'me_rate': ['E27', 'E28', 'E29', 'E30', 'E31', 'E21'],
            'lodge_destination': ['B41', 'B42', 'B43', 'B44', 'B45', 'B46'],
            'lodge_no_of_nights': ['C41', 'C42', 'C43', 'C44', 'C45', 'C46'],
            'lodge_amount': ['D41', 'D42', 'D43', 'D44', 'D45', 'D46'],
            'lodge_rate': ['E41', 'E42', 'E43', 'E44', 'E45', 'E46'],
            'other_purpose': ['B55', 'B56', 'B57', 'B58', 'B59'],
            'other_amount': ['D55', 'D56', 'D57', 'D58', 'D59'],
            'signature': 'B65',
            'signature_date': 'G65',
            'approved_by': 'B68',
            'approve_date': 'G68'
        }

    def generate_file_name(self):
        # region = self.region
        region = "_".join(self.region.split(' '))
        sheet_name = "_".join(self.sheet_name.split(' '))
        name = "_".join(self.name.split(' '))
        date_travel = self.date_of_request
        file_name = f"{name}_{sheet_name}_{region}_{date_travel}.xlsx"
        return os.path.join(
            self.module_dir, f'static/rems_api/{file_name}')

    def write_field_data(self, field, data):
        field_data = self.fields[field]
        if isinstance(field_data, list):

            # we have a list, data should be a list
            x = 0
            while len(data) > x:
                cell_address = self.fields[field][x]
                cell_value = data[x]
                if field is 'lodge_rate' or field is 'me_rate':
                    self.write_cell(cell_address, f'{cell_value}%')
                else:
                    self.write_cell(cell_address, cell_value)

                x += 1

        else:
            # we have a string, data is a string
            cell_address = self.fields[field]
            cell_value = data
            self.write_cell(cell_address, cell_value)

    def write_and_save(self):
        self.write_field_data('date_of_request', self.date_of_request)
        self.write_field_data('name', self.name)
        # self.write_field_data('address', self.address)
        self.write_field_data('purpose', self.purpose)
        self.write_field_data(
            'period_of_travel_from', self.period_of_travel_from)
        self.write_field_data('period_of_travel_to',
                              self.period_of_travel_to)
        # me
        me = self.transform_for_write(self.mes, False)
        self.write_field_data('me_destination', me['destination'])
        self.write_field_data('me_no_of_days', me['no_of_nights'])
        self.write_field_data('me_amount', me['daily_rate'])
        self.write_field_data('me_rate', me['percentage_of_daily_rate'])

        # lodging
        lodging = self.transform_for_write(self.mes, True)
        self.write_field_data('lodge_destination', lodging['destination'])
        self.write_field_data('lodge_no_of_nights', lodging['no_of_nights'])
        self.write_field_data('lodge_amount', lodging['daily_rate'])
        self.write_field_data(
            'lodge_rate', lodging['percentage_of_daily_rate'])

        # other costs

        self.write_field_data('signature_date', self.signature_date)
        self.save()

    def transform_for_write(self, list_of_costs, lodging):
        # if not lodging:
        #     # remove lodging from lists of dicts
        dict_of_costs = {}
        for dict_of_cost in list_of_costs:
            for key, value in dict_of_cost.items():
                if not lodging and key is not 'lodging' and not value:
                    continue
                try:
                    dict_of_costs[key].append(value)
                except KeyError:
                    dict_of_costs[key] = []
                    dict_of_costs[key].append(value)

        return dict_of_costs


if __name__ == "__main__":
    arf = WorkBook()
    # # arf.write_cell('C27', 1)
    # data = 'Yona'
    # field_type = 'purpose'
    # arf.write_field_data(field_type, data)
    # file_name = arf.generate_file_name()
    # arf.save(file_name)
    print(arf.get_number_of_nights('21-09-2020', '27-09-2020'))
