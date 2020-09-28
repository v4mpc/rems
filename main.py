from openpyxl import load_workbook
import logging
import datetime
from openpyxl.drawing.image import Image


class WorkBook:
    def __init__(self):
        self.sample_arf_path = "arf.xlsx"  # erf.xlsx
        self.wb = load_workbook(filename=self.sample_arf_path)
        self.sheet_name = "Advance Request"  # Tanzania Expense Report
        self.sheet = self.wb[self.sheet_name]
        self.region = 'morogoro'
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

    def write_cell(self, cell_address, cell_value):
        self.sheet[cell_address] = cell_value

    def get_number_of_nights(self, start_date, end_date):
        # date dd-mm-yyy
        start_date = datetime.datetime.strptime(start_date, "%d-%m-%Y")
        end_date = datetime.datetime.strptime(end_date, "%d-%m-%Y")
        delta_date = end_date-start_date
        return delta_date.days

    def save(self, filename_with_extension):
        self.wb.save(filename_with_extension)

    def read_cell(self, cell_address):
        return self.sheet[cell_address].value

    def generate_file_name(self):
        name_address = self.fields['name']
        region = self.region
        date_address = self.fields['date_of_request']
        name = "_".join(self.read_cell(name_address).split(' '))
        date_travel = self.read_cell(date_address).date()
        return f"{name}_{self.sheet_name}_{self.region}_{date_travel}.xlsx"

    def write_field_data(self, field, data):
        field_data = self.fields[field]
        if isinstance(field_data, list):

            # we have a list, data should be a list
            x = 0
            while len(data) > x:
                cell_address = self.fields[field][x]
                cell_value = data[x]
                self.write_cell(cell_address, cell_value)
                x += 1

        else:
            # we have a string, data is a string
            cell_address = self.fields[field]
            cell_value = data
            self.write_cell(cell_address, cell_value)


if __name__ == "__main__":
    arf = WorkBook()
    # logo = Image("logo.png")
    # logo.height = 54
    # logo.width = 96

    # arf.sheet.add_image(logo, "C64")
    # arf.save('test.xlsx')

    # arf.write_cell('C27', 1)
    data = 'Yona'
    field_type = 'purpose'
    arf.write_field_data(field_type, data)
    file_name = arf.generate_file_name()
    arf.save(file_name)
    print(arf.get_number_of_nights('21-09-2020', '27-09-2020'))
