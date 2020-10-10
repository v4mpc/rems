import { Component, OnInit } from '@angular/core';
import { FormControl, Validator, FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Me } from "../../interfaces/me";
import { Location } from "../../interfaces/location";
import { Lodging } from "../../interfaces/lodging";
import { OtherCost } from "../../interfaces/other-cost";
import { ArfService } from "../../services/arf.service";
import { LocationService } from "../../services/location.service";
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { SpinnerService } from "../../services/spinner.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';





@Component({
  selector: 'app-arf-create',
  templateUrl: './arf-create.component.html',
  styleUrls: ['./arf-create.component.scss']
})

export class ArfCreateComponent implements OnInit {
  meLimit = 10
  lodgingLimit = 9
  otherCostLimit = 6
  selectedId: number
  locations: Location[]
  editMode = false
  selectedLocation: any
  minDate: Date;
  maxDate: Date;

  arfForm = new FormGroup({
    purpose: new FormControl('', [Validators.required, Validators.max(2)]),
    region: new FormControl('', Validators.required),
    startTravelDate: new FormControl('', Validators.required),
    endTravelDate: new FormControl('', Validators.required),
    mes: new FormArray([]),
    lodgings: new FormArray([]),
    otherCosts: new FormArray([]),
    sign: new FormControl(true)
  })

  mes = this.arfForm.get('mes') as FormArray
  otherCosts = this.arfForm.get('otherCosts') as FormArray
  lodgings = this.arfForm.get('lodgings') as FormArray


  constructor(
    private _snackBar: MatSnackBar,
    private arfServive: ArfService,
    private locationService: LocationService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.addMe({ destination: '', days: null, rate: null, pRate: null })
    this.addLodging({ destination: '', nights: null, rate: null, pRate: null })
    this.addOtherCost({ purpose: '', amount: null })



  }

  ngOnInit(): void {
    this.locationService.getAll().subscribe((locations: Location[]) => {
      this.locations = locations

    })


    this.route.params.subscribe((params: Params) => {
      this.selectedId = +params['id']
      this.editMode = params['id'] != null

      if (this.editMode) {
        this.arfServive.getOne(this.selectedId).subscribe((arf: any) => {
          this.selectedLocation = this.getSelectedLocation(arf.location)[0]
          console.log(this.selectedLocation)
          this.arfForm.patchValue({
            purpose: arf.purpose,
            startTravelDate: new Date(arf.start_date),
            endTravelDate: new Date(arf.end_date),
            region: this.selectedLocation,
          })
          let lodgingList = arf.lodgings.map(this.transformLodging)
          let meList = arf.mes.map(this.transformMe)
          let otherCostList = arf.other_costs.map(this.transformOtherCost)
          this.lodgings.clear()
          lodgingList.forEach(lodging => {
            this.addLodging(lodging)
          })
          this.mes.clear()
          meList.forEach(me => {
            this.addMe(me)
          })
          if (otherCostList.length > 0) {

            this.otherCosts.clear()
            otherCostList.forEach(otherCost => {
              this.addOtherCost(otherCost)
            })
          }

        })
      }
    })





  }




  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.pk === c2.pk : c1 === c2;
  }


  transformMe(me) {
    console.log(me)
    return {
      destination: me.destination,
      days: me.no_of_nights,
      rate: me.daily_rate,
      pRate: me.percentage_of_daily_rate,
    }

  }

  transformLodging(lodging) {
    return {
      destination: lodging.destination,
      nights: lodging.no_of_nights,
      rate: lodging.daily_rate,
      pRate: lodging.percentage_of_daily_rate
    }
  }


  transformOtherCost(oc) {
    return oc
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

  getSelectedLocation(serverLocationPk) {

    return this.locations.filter(location => {
      return location.pk == serverLocationPk
    })
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
      // this.displaySnackBar("Lodging can only have " + this.lodgingLimit + " row(s)")

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
      days: this.diffDays(this.arfForm.value.startTravelDate, this.arfForm.value.endTravelDate) - 1,
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

    let spinnerRef = this.spinnerService.start();

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


    if (this.editMode) {

      this.arfServive.update(this.selectedId, arf).subscribe(arf => {
        this.router.navigate(['/arfs']);
        this.spinnerService.stop(spinnerRef);
        this.displaySnackBar("Success, Advance Request Updated")
      }, (error) => {
        this.displaySnackBar("Error, Contact System Admin")
        this.spinnerService.stop(spinnerRef);
      })

    } else {
      this.arfServive.save(arf).subscribe(arf => {
        this.router.navigate(['/arfs']);
        this.spinnerService.stop(spinnerRef);
        this.displaySnackBar("Success, Advance Request Created")
      }, (error) => {
        this.displaySnackBar("Error, Contact System Admin")
        this.spinnerService.stop(spinnerRef);
      })

    }


  }


}
