from openpyxl import load_workbook
import logging
import datetime


class Arf:
    def __init__(self):
        self.sample_arf_path = "arf.xlsx"
        self.wb = load_workbook(filename=self.sample_arf_path)
        self.sheet_name = "Advance Request"
        self.sheet = self.wb[self.sheet_name]
        self.field_mapping = {
            'date_of_request': 'G4',
            'name': 'B8',
            'address': 'B9',
            'purpose': 'B13',
            'period_of_travel_from': 'B16',
            'period_of_travel_to': 'E16',
            'me_destination_1': 'B27',
            'me_no_of_days_1': 'C27',
            'me_amount_1': 'D27',
            'me_rate_1': 'E27',
            'me_destination_2': 'B28',
            'me_no_of_days_2': 'C28',
            'me_amount_2': 'D28',
            'me_rate_2': 'E28',
            'me_destination_3': 'B29',
            'me_no_of_days_3': 'C29',
            'me_amount_3': 'D29',
            'me_rate_3': 'E29',
            'me_destination_4': 'B30',
            'me_no_of_days_4': 'C30',
            'me_amount_4': 'D30',
            'me_rate_4': 'E30',
            'me_destination_5': 'B31',
            'me_no_of_days_5': 'C31',
            'me_amount_5': 'D31',
            'me_rate_5': 'E31',
            'me_destination_6': 'B32',
            'me_no_of_days_6': 'C32',
            'me_amount_6': 'D32',
            'me_rate_6': 'E32',
            'lodge_destination_1': 'B41',
            'lodge_no_of_nights_1': 'C41',
            'lodge_amount_1': 'D41',
            'lodge_rate_1': 'E41',
            'lodge_destination_2': 'B42',
            'lodge_no_of_nights_2': 'C42',
            'lodge_amount_2': 'D42',
            'lodge_rate_2': 'E42',
            'other_purpose_1': 'B55',
            'other_amount_1': 'D55',
            'other_purpose_2': 'B56',
            'other_amount_2': 'D56',
            'other_purpose_3': 'B57',
            'other_amount_3': 'D57',
            'signature': 'B65',
            'signature_date': 'G65',
            'approved_by': 'B68',
            'approve_date': 'G68'

        }

    def write_cell(self, cell_address, cell_value):
        # logging.info("Writing Data")
        self.sheet[cell_address] = cell_value

    def save(self, filename_with_extension):
        self.wb.save(filename_with_extension)

    def read_cell(self, cell_address):
        return self.sheet[cell_address].value

    def make_field_mapping(self, field_list, start_cell, number_of_fields):
        fields = {}
        column = {}
        for x in range(number_of_fields+1):
            for field in field_list:
                fields[f"{field}_x"]

    def generate_file_name(self, name, region, date):
        # name =
        return f"{name}_{self.sheet_name}_{region}_{date}.xlsx"


if __name__ == "__main__":
    arf = Arf()
    arf.write_cell('C27', 2)

    name_address = arf.field_mapping['name']
    region = 'morogo'
    date_address = arf.field_mapping['date_of_request']
    name = "_".join(arf.read_cell(name_address).split(' '))
    date_travel = arf.read_cell(date_address).date()
    file_name = arf.generate_file_name(name, region, date_travel)
    arf.save(file_name)
