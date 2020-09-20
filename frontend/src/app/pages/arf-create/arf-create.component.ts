import { Component, OnInit } from '@angular/core';
import { FormControl, Validator, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Me } from "../../interfaces/me";
import { Location } from "../../interfaces/location";


interface Food {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-arf-create',
  templateUrl: './arf-create.component.html',
  styleUrls: ['./arf-create.component.scss']
})

export class ArfCreateComponent implements OnInit {
  meLimit = 10
  arfForm = new FormGroup({
    purpose: new FormControl('', [Validators.required, Validators.max(2)]),
    region: new FormControl('', Validators.required),
    startTravelDate: new FormControl('', Validators.required),
    endTravelDate: new FormControl('', Validators.required),
    mes: new FormArray([]),
    lodgings: new FormArray([]),
    otherCosts: new FormArray([])


  })
  minDate: Date;
  maxDate: Date;

  mes = this.arfForm.get('mes') as FormArray
  otherCosts = this.arfForm.get('otherCosts') as FormArray
  lodgings = this.arfForm.get('logdings') as FormArray

  constructor(
    private _snackBar: MatSnackBar
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit(): void {
    this.addMe({ destination: '', days: null, rate: null, pRate: null })
  }

  locations: Location[] = [
    { pk: 1, name: 'Dar Es Salaam', lodging: 150000, me: 60000 },
    { pk: 2, name: 'Bagamoyo', lodging: 120000, me: 50000 },
    { pk: 3, name: 'Morogoro', lodging: 100000, me: 40000 },
  ];

  addMe(me: Me) {
    if (this.mes.length <= 9) {
      const group = new FormGroup({
        destination: new FormControl(me.destination, [Validators.required]),
        days: new FormControl(me.days, [Validators.required]),
        rate: new FormControl(me.rate, [Validators.required]),
        pRate: new FormControl(me.pRate, [Validators.required]),

      })

      this.mes.push(group)

    } else {
      this._snackBar.open("10 is the limit")
    }

  }

  removeMe(index: number) {
    this.mes.removeAt(index)
  }


  addOtherCost() {
    const group = new FormGroup({
      purpose: new FormControl(''),
      amount: new FormControl(''),
    })

    this.otherCosts.push(group)
  }

  removeOtherCost(index: number) {
    this.otherCosts.removeAt(index)
  }

  isComplete(rangePicker) {
    console.log(rangePicker.isComplete())
  }


  fillMes() {
    // clear the mes array
    this.mes.clear()
    // first row
    const me = {
      destination: `Dar Es Salaam - ${this.arfForm.value.region.name}`,
      days: 1,
      rate: this.arfForm.value.region.me,
      pRate: 75
    }
    this.addMe(me)
    // second row
    const me2 = {
      destination: this.arfForm.value.region.name,
      days: this.diffDays(this.arfForm.value.startTravelDate, this.arfForm.value.endTravelDate) - 2,
      rate: this.arfForm.value.region.me,
      pRate: 100
    }
    this.addMe(me2)
    // third row
    const me3 = {
      destination: `${this.arfForm.value.region.name} - Dar Es Salaam `,
      days: 1,
      rate: this.arfForm.value.region.me,
      pRate: 75
    }
    this.addMe(me3)

  }


  regionChanged() {
    console.log(this.mes)
    this.fillMes()
  }

  startDateChanged() {

  }

  endDateChanged() {

  }


  diffDays(startDate, endDate) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    console.log(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  }


  mesSum() {


  }


}
