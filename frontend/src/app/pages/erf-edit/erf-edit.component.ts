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
  selector: 'app-erf-edit',
  templateUrl: './erf-edit.component.html',
  styleUrls: ['./erf-edit.component.scss']
})
export class ErfEditComponent implements OnInit {
  meLimit = 10
  lodgingLimit = 9
  otherCostLimit = 6
  selectedId: number
  locations: Location[]
  editMode = false
  selectedLocation: any
  minDate: Date;
  maxDate: Date;


  erfForm = new FormGroup({
    purpose: new FormControl('', [Validators.required, Validators.max(2)]),
    region: new FormControl('', Validators.required),
    startTravelDate: new FormControl('', Validators.required),
    endTravelDate: new FormControl('', Validators.required),
    mes: new FormArray([]),
    lodgings: new FormArray([]),
    otherCosts: new FormArray([]),
    sign: new FormControl(true)
  })

  mes = this.erfForm.get('mes') as FormArray
  otherCosts = this.erfForm.get('otherCosts') as FormArray
  lodgings = this.erfForm.get('lodgings') as FormArray



  constructor(
    private _snackBar: MatSnackBar,
    private arfServive: ArfService,
    private locationService: LocationService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

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
          this.erfForm.patchValue({
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


  getSelectedLocation(serverLocationPk) {

    return this.locations.filter(location => {
      return location.pk == serverLocationPk
    })
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

  displaySnackBar(message) {
    this._snackBar.open(message, 'Close', {
      duration: 3000
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



}
