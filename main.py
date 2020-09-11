from openpyxl import load_workbook
import logging
import datetime


class Arf:
    def __init__(self):
        self.sample_arf_path = "arf.xlsx"  # erf.xlsx
        self.wb = load_workbook(filename=self.sample_arf_path)
        self.sheet_name = "Advance Request"  # Tanzania Expense Report
        self.sheet = self.wb[self.sheet_name]
        self.field_mapping = {
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
    arf.write_cell('C27', 1)

    name_address = arf.field_mapping['name']
    region = 'morogo'
    date_address = arf.field_mapping['date_of_request']
    name = "_".join(arf.read_cell(name_address).split(' '))
    date_travel = arf.read_cell(date_address).date()
    file_name = arf.generate_file_name(name, region, date_travel)
    arf.save(file_name)
