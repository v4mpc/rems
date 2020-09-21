import { Component, OnInit } from '@angular/core';
import { FormControl, Validator, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Me } from "../../interfaces/me";
import { Location } from "../../interfaces/location";
import { Lodging } from "../../interfaces/lodging";
import { OtherCost } from "../../interfaces/other-cost";
import { ArfService } from "../../services/arf.service";
import { LocationService } from "../../services/location.service";
import { formatDate } from '@angular/common';
// import { Location } from '@angular/common';


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
  lodgingLimit = 9
  otherCostLimit = 6
  locations: Location[]

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
  lodgings = this.arfForm.get('lodgings') as FormArray

  constructor(
    private _snackBar: MatSnackBar,
    private arfServive: ArfService,
    private locationService: LocationService,
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.addMe({ destination: '', days: null, rate: null, pRate: null })
    this.addLodging({ destination: '', nights: null, rate: null, pRate: null })
    this.addOtherCost({ purpose: '', amount: null })


  }

  ngOnInit(): void {
    // get all the locations
    this.locationService.getAll().subscribe((locations: Location[]) => {
      this.locations = locations

    })

  }

  addMe(me: Me) {
    if (this.mes.length <= this.meLimit - 1) {
      const group = new FormGroup({
        destination: new FormControl(me.destination, [Validators.required]),
        days: new FormControl(me.days, [Validators.required]),
        rate: new FormControl(me.rate, [Validators.required]),
        pRate: new FormControl(me.pRate, [Validators.required]),

      })

      this.mes.push(group)

    } else {

      this.displaySnackBar("M&IE can only have " + this.meLimit + " row(s)")
    }

  }

  removeMe(index: number) {
    this.mes.removeAt(index)
  }
  removeLodging(index: number) {
    this.lodgings.removeAt(index)
  }


  addOtherCost(otherCost: OtherCost) {
    if (this.otherCosts.length <= this.otherCostLimit - 1) {
      const group = new FormGroup({
        purpose: new FormControl(otherCost.purpose),
        amount: new FormControl(otherCost.amount),
      })
      this.otherCosts.push(group)
    } else {
      this.displaySnackBar("Other Costs can only have " + this.otherCostLimit + " row(s)")

    }
  }





  removeOtherCost(index: number) {
    this.otherCosts.removeAt(index)
  }



  addLodging(lodging: Lodging) {
    if (this.lodgings.length <= this.lodgingLimit - 1) {
      const group = new FormGroup({
        destination: new FormControl(lodging.destination, [Validators.required]),
        nights: new FormControl(lodging.nights, [Validators.required]),
        rate: new FormControl(lodging.rate, [Validators.required]),
        pRate: new FormControl(lodging.pRate, [Validators.required]),

      })

      this.lodgings.push(group)

    } else {
      this.displaySnackBar("Lodging can only have " + this.lodgingLimit + " row(s)")

    }

  }



  fillMes() {

    if (!this.validInputs()) {
      return;
    }
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


  fillLodgings() {
    if (!this.validInputs()) {
      return;
    }
    this.lodgings.clear()
    const lodging = {
      destination: this.arfForm.value.region.name,
      nights: this.diffDays(this.arfForm.value.startTravelDate, this.arfForm.value.endTravelDate),
      rate: this.arfForm.value.region.lodging,
      pRate: 100
    }
    this.addLodging(lodging)
  }


  regionChanged() {

    this.fillMes()
    this.fillLodgings()
  }

  startDateChanged() {
    this.fillMes()
    this.fillLodgings()


  }

  endDateChanged() {
    this.fillMes()
    this.fillLodgings()


  }

  validInputs() {
    return this.arfForm.get('region').valid && this.arfForm.get('startTravelDate').valid && this.arfForm.get('endTravelDate').valid
  }


  diffDays(startDate, endDate) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  }


  mesSum() {

    let sum = 0
    this.mes.value.forEach(me => {
      sum += ((me.rate * me.days * me.pRate) / 100)
    });

    return sum



  }

  lodgingsSum() {

    let sum = 0
    this.lodgings.value.forEach(lodging => {
      sum += ((lodging.rate * lodging.nights * lodging.pRate) / 100)
    });

    return sum



  }


  otherCostsSum() {

    let sum = 0
    this.otherCosts.value.forEach(otherCost => {
      sum += otherCost.amount
    });

    return sum



  }

  displaySnackBar(message) {
    this._snackBar.open(message, 'Close', {
      duration: 3000
    })
  }


  save() {

    if (!this.arfForm.valid) {
      return
    }

    let arf = {
      user: 1,
      location: this.arfForm.value.region.pk,
      address: "JSI TZ",
      purpose: this.arfForm.value.purpose,
      start_date: formatDate(this.arfForm.value.startTravelDate, 'yyyy-MM-dd', 'en-US'),
      end_date: formatDate(this.arfForm.value.endTravelDate, 'yyyy-MM-dd', 'en-US'),
      date_of_request: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      status: "Pending",
      mes: null,
      lodgings: null,
      other_costs: null,
    }
    let apiMes = []
    this.arfForm.value.mes.forEach(me => {
      apiMes.push({
        destination: me.destination,
        no_of_nights: me.days,
        daily_rate: me.rate,
        percentage_of_daily_rate: me.pRate,
      })
    });
    arf.mes = apiMes
    let apiLodgings = []
    this.arfForm.value.lodgings.forEach(lodging => {
      apiLodgings.push({
        destination: lodging.destination,
        no_of_nights: lodging.nights,
        daily_rate: lodging.rate,
        percentage_of_daily_rate: lodging.pRate,
      })
    });
    arf.lodgings = apiLodgings


    let apiOtherCosts = []
    this.arfForm.value.otherCosts.forEach(otherCost => {
      if (otherCost.amount != null) {
        apiOtherCosts.push({
          purpose: otherCost.purpose,
          amount: otherCost.amount
        })
      }

    });
    arf.other_costs = apiOtherCosts

    this.arfServive.save(arf).subscribe(arf => {
      console.log(arf)
    }, (error) => {
      this.displaySnackBar("Error,Try Again Later")
    })
  }


}
