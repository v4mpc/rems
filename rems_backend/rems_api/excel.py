from openpyxl import load_workbook
import logging
import datetime


class WorkBook:
    def __init__(self, sheet_name, region):
        self.sample_arf_path = "arf.xlsx"  # erf.xlsx
        self.wb = load_workbook(filename=self.sample_arf_path)
        self.sheet_name = sheet_name  # "Advance Request"  # Tanzania Expense Report
        self.sheet = self.wb[self.sheet_name]
        self.region = region

    def write_cell(self, cell_address, cell_value):
        self.sheet[cell_address] = cell_value

    def get_number_of_nights(self, start_date, end_date):
        # date dd-mm-yyy
        start_date = datetime.datetime.strptime(start_date, "%d-%m-%Y")
        end_date = datetime.datetime.strptime(end_date, "%d-%m-%Y")
        delta_date = end_date-start_date
        return delta_date.days

    def save(self):
        self.wb.save(self.generate_file_name())

    def read_cell(self, cell_address):
        return self.sheet[cell_address].value

    def excel_exists(self):
        pass

    def delete(self):
        pass

    def init(self, validated_data):
        self.date_of_request = validated_data['date_of_request']
        self.user = validated_data.pop('owner')
        self.name = user.profile.name
        self.address = validated_data['address']
        self.purpose = validated_data['purpose']
        self.period_of_travel_from = validated_data['start_date']
        self.period_of_travel_to = validated_data['end_date']
        self.signature = ''
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
        region = self.region
        name = "_".join(self.name.split(' '))
        date_travel = self.date_of_request
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

        def write_and_save(self):
            self.write_field_data('date_of_request', self.date_of_request)
            self.write_field_data('name', self.name)
            self.write_field_data('address', self.address)
            self.write_field_data('purpose', self.purpose)
            self.write_field_data(
                'period_of_travel_from', self.period_of_travel_from)
            self.write_field_data('period_of_travel_to',
                                  self.period_of_travel_to)
            self.write_field_data('date_of_request', self.date_of_request)
            self.write_field_data('signature_date', self.signature_date)
            self.save()


if __name__ == "__main__":
    arf = WorkBook()
    # # arf.write_cell('C27', 1)
    # data = 'Yona'
    # field_type = 'purpose'
    # arf.write_field_data(field_type, data)
    # file_name = arf.generate_file_name()
    # arf.save(file_name)
    print(arf.get_number_of_nights('21-09-2020', '27-09-2020'))
