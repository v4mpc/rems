import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validator, FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Me } from "../../../interfaces/me";
import { OtherCost } from "../../../interfaces/other-cost";
import { Lodging } from "../../../interfaces/lodging";
import { NotifyService } from "../../../services/notify.service";
import { LocationIn } from "../../../interfaces/location";
import { LocationService } from "../../../services/location.service";
import { Router, ActivatedRoute, ParamMap, Params, NavigationExtras } from '@angular/router';
import { LoaderDialogService } from "../../../services/loader-dialog.service";
import { formatDate, Location } from '@angular/common';
import { NbCalendarRange } from "@nebular/theme";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErfService } from "../../../services/erf.service";



@Component({
  selector: 'create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ErfCreateComponent implements OnInit {

  @ViewChild('rangepicker') rangepicker: ElementRef;

  meLimit = 10
  lodgingLimit = 9
  otherCostLimit = 6
  selectedId: number
  locations: LocationIn[]
  editMode = false
  viewMode = false
  selectedLocation: any
  minDate: Date;
  maxDate: Date;

  datePickerRange: string;
  selectedRange: NbCalendarRange<Date>
  meSelectedDateRangeList: NbCalendarRange<Date>[] = [];
  meDatePickerRangeList: Array<string> = [];

  datePickerList: Array<string> = []
  selectedDateList: Array<any> = [];


  lodgingSelectedDateRangeList: NbCalendarRange<Date>[] = [];
  lodgingDatePickerRangeList: Array<string> = [];
  file_name = null;

  erfForm = new FormGroup({
    purpose: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.max(2)]),
    region: new FormControl({ value: null, disabled: true }, Validators.required),
    startTravelDate: new FormControl('', Validators.required),
    endTravelDate: new FormControl('', Validators.required),
    signatureDate: new FormControl({ value: null, disabled: true }),
    approvalDate: new FormControl({ value: null, disabled: true }),
    approve: new FormControl(''),
    mes: new FormArray([]),
    lodgings: new FormArray([]),
    otherCosts: new FormArray([]),
    sign: new FormControl(false),
  })

  mes = this.erfForm.get('mes') as FormArray
  otherCosts = this.erfForm.get('otherCosts') as FormArray
  lodgings = this.erfForm.get('lodgings') as FormArray



  constructor(
    private toastrService: NotifyService,
    private locationService: LocationService,
    private loader: LoaderDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private erfService: ErfService,

  ) { }

  ngOnInit(): void {
    this.locationService.getAll().subscribe((locations: LocationIn[]) => {
      this.locations = locations
    })






    this.route.params.subscribe((params: Params) => {
      if (this.router.url.split('/')[3] == 'erf') {
        this.viewMode = this.router.url.split('/')[4] == 'view' ? true : false
      } else {
        this.viewMode = this.router.url.split('/')[3] == 'view' ? true : false
      }

      this.selectedId = +params['id']
      this.editMode = params['id'] != null

      if (this.editMode) {
        this.erfService.getOne(this.selectedId).subscribe((erf: any) => {
          this.file_name = erf.excel_sheet
          this.selectedLocation = this.getSelectedLocation(erf.location)[0]
          this.erfForm.patchValue({
            purpose: erf.purpose,
            startTravelDate: new Date(erf.start_date),
            endTravelDate: new Date(erf.end_date),
            region: this.selectedLocation,
          })



          this.datePickerRange = `${formatDate(erf.start_date, 'MMM dd, yyyy', 'en-US')} - ${formatDate(erf.end_date, 'MMM dd, yyyy', 'en-US')}`
          this.selectedRange = {
            start: new Date(erf.start_date),
            end: new Date(erf.end_date)
          }

          let lodgingList = erf.lodgings.map(this.transformLodging)
          let meList = erf.mes.map(this.transformMe)
          let otherCostList = erf.other_costs.map(this.transformOtherCost)
          this.lodgings.clear()
          lodgingList.forEach(lodging => {

            if (lodging.end_date) {
              this.lodgingDatePickerRangeList.push(`${formatDate(lodging.start_date, 'MMM dd, yyyy', 'en-US')} - ${formatDate(lodging.end_date, 'MMM dd, yyyy', 'en-US')}`)

            } else {
              this.lodgingDatePickerRangeList.push(`${formatDate(lodging.start_date, 'MMM dd, yyyy', 'en-US')}`)

            }
            this.lodgingSelectedDateRangeList.push({
              start: new Date(lodging.start_date),
              end: new Date(lodging.end_date)
            })
            this.addLodging(lodging)

          })
          this.mes.clear()
          meList.forEach(me => {

            if (me.end_date != null) {
              this.meDatePickerRangeList.push(`${formatDate(me.start_date, 'MMM dd, yyyy', 'en-US')} - ${formatDate(me.end_date, 'MMM dd, yyyy', 'en-US')}`)

            } else {
              this.meDatePickerRangeList.push(`${formatDate(me.start_date, 'MMM dd, yyyy', 'en-US')}`)

            }

            this.meSelectedDateRangeList.push({
              start: new Date(me.start_date),
              end: new Date(me.end_date)
            })

            this.addMe(me)
          })
          if (otherCostList.length > 0) {

            this.otherCosts.clear()
            otherCostList.forEach(otherCost => {
              if (otherCost.date != null) {
                // console.log(otherCost.date)
                this.datePickerList.push(`${formatDate(otherCost.date, 'MMM dd, yyyy', 'en-US')}`)
              } else {
                this.datePickerList.push('')
              }

              // this.selectedDateList.push({
              //   start: new Date(me.start_date),
              //   end: new Date(me.end_date)
              // })


              this.addOtherCost(otherCost)
            })
          } else {
            this.addOtherCost({ date: '', purpose: '', amount: null })

          }

        })
      }
    })

  }

  removeOtherCost(index: number) {
    this.otherCosts.removeAt(index)
  }



  removeLodging(index: number) {
    this.lodgings.removeAt(index)
  }


  removeMe(index: number) {
    this.mes.removeAt(index)
  }




  signChanged() {
    if (this.erfForm.value.sign) {
      this.erfForm.patchValue({ signatureDate: formatDate(new Date(), 'MMM dd, yyyy', 'en-US') })
    } else {
      this.erfForm.patchValue({ signatureDate: '' })
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.pk === c2.pk : c1 === c2;
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
        date: new FormControl(otherCost.date, [this.editMode && otherCost.purpose ? Validators.required : null]),

      })
      this.otherCosts.push(group)
    } else {
      this.toastrService.errMessage(`Other Cost can only have ${this.otherCostLimit} row(s)`);

    }
  }


  addLodging(lodging: Lodging) {
    if (this.lodgings.length <= this.lodgingLimit - 1) {
      const group = new FormGroup({
        start_date: new FormControl(new Date(lodging.start_date), [Validators.required]),
        end_date: new FormControl(new Date(lodging.end_date)),
        destination: new FormControl(lodging.destination, [Validators.required]),
        nights: new FormControl(lodging.nights, [Validators.required]),
        rate: new FormControl(lodging.rate, [Validators.required]),
        actualCost: new FormControl(lodging.actualCost, [Validators.required]),
        pRate: new FormControl(lodging.pRate, [Validators.required]),

      })

      this.lodgings.push(group)

    } else {
      this.toastrService.errMessage(`Lodging can only have ${this.lodgingLimit} row(s)`);

    }

  }


  addMe(me: Me) {
    if (this.mes.length <= this.meLimit - 1) {
      const group = new FormGroup({
        start_date: new FormControl(me.start_date, [Validators.required]),
        end_date: new FormControl(me.end_date),
        destination: new FormControl(me.destination, [Validators.required]),
        days: new FormControl(me.days, [Validators.required]),
        rate: new FormControl(me.rate, [Validators.required]),
        pRate: new FormControl(me.pRate, [Validators.required]),

      })

      this.mes.push(group)

    } else {
      this.toastrService.errMessage(`M&IE can only have ${this.meLimit} row(s)`);

    }

  }


  transformMe(me) {
    return {
      start_date: new Date(me.start_date),
      end_date: me.end_date ? new Date(me.end_date) : null,
      destination: me.destination,
      days: me.percentage_of_daily_rate * me.no_of_nights / 100,
      rate: me.daily_rate,
      pRate: me.percentage_of_daily_rate,
    }

  }

  transformLodging(lodging) {
    return {
      start_date: new Date(lodging.start_date),
      end_date: lodging.end_date ? new Date(lodging.end_date) : null,
      destination: lodging.destination,
      nights: lodging.no_of_nights * lodging.percentage_of_daily_rate / 100,
      rate: lodging.daily_rate,
      pRate: lodging.percentage_of_daily_rate,
      actualCost: lodging.daily_rate
    }
  }


  transformOtherCost(oc) {
    return {
      purpose: oc.purpose,
      date: oc.date ? new Date(oc.date) : null,
      amount: oc.amount
    }
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
      sum += ((lodging.nights * lodging.actualCost))
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

  save() {

    if (this.erfForm.valid) {
      this.loader.show()
      let erf = {
        user: 1,
        location: this.erfForm.getRawValue().region.pk,
        address: "JSI TZ",
        purpose: this.erfForm.getRawValue().purpose,
        start_date: formatDate(this.erfForm.getRawValue().startTravelDate, 'yyyy-MM-dd', 'en-US'),
        end_date: formatDate(this.erfForm.getRawValue().endTravelDate, 'yyyy-MM-dd', 'en-US'),
        date_of_request: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
        status: "Pending",
        mes: null,
        lodgings: null,
        other_costs: null,
      }
      let apiMes = []
      this.erfForm.value.mes.forEach(me => {
        apiMes.push({
          start_date: formatDate(me.start_date, 'yyyy-MM-dd', 'en-US'),
          end_date: me.end_date ? formatDate(me.start_date, 'yyyy-MM-dd', 'en-US') : null,
          destination: me.destination,
          no_of_nights: me.days,
          daily_rate: me.rate,
          percentage_of_daily_rate: me.pRate,
        })
      });
      erf.mes = apiMes
      let apiLodgings = []
      this.erfForm.value.lodgings.forEach(lodging => {
        apiLodgings.push({
          start_date: formatDate(lodging.start_date, 'yyyy-MM-dd', 'en-US'),
          end_date: lodging.end_date ? formatDate(lodging.start_date, 'yyyy-MM-dd', 'en-US') : null,
          destination: lodging.destination,
          no_of_nights: lodging.nights,
          actual_cost: lodging.actualCost,
          daily_rate: lodging.rate,
          percentage_of_daily_rate: lodging.pRate,
        })
      });
      erf.lodgings = apiLodgings


      let apiOtherCosts = []
      this.erfForm.value.otherCosts.forEach(otherCost => {
        if (otherCost.amount != null) {
          apiOtherCosts.push({
            date: formatDate(otherCost.date, 'yyyy-MM-dd', 'en-US'),
            purpose: otherCost.purpose,
            amount: otherCost.amount
          })
        }

      });
      erf.other_costs = apiOtherCosts
      if (this.editMode) {
        this.erfService.update(this.selectedId, erf).subscribe(erf => {
          this.location.back()
          this.loader.close();
          this.toastrService.succMessage('Expense Report Updated');
        }, (error) => {
          console.log(error)
          this.toastrService.errMessage('Contact System Admin');
          this.loader.close();
        })
      } else {
        this.erfService.save(erf).subscribe(erf => {
          this.toastrService.succMessage('Expense Report Created');
          this.location.back()
          this.loader.close();
        }, (error) => {
          console.log(error)
          this.loader.close();
          this.toastrService.errMessage('Contact System Admin');




        })

      }



    } else {
      this.toastrService.errMessage(`The Form has Erros!`);
      this.erfForm.markAllAsTouched()
    }
  }


  downloadErf() {
    this.erfService.download(this.file_name)
  }


  approveChanged() {
    if (this.erfForm.value.approve == "1") {

      this.erfForm.patchValue({ approvalDate: formatDate(new Date(), 'MMM dd, yyyy', 'en-US') })

    } else {
      this.erfForm.patchValue({ approvalDate: '' })
    }
  }

  meRangeCanged(event, me: FormGroup) {
    if ('start' in event) {
      me.patchValue({ start_date: event.start })
    }

    if ('end' in event) {
      me.patchValue({ end_date: event.end })
    }


  }


  dateChanged(event, otherCost: FormGroup) {

    if (event) {
      otherCost.patchValue({ date: event })
    }

    console.log
  }


  lodgingRangeCanged(event, me: FormGroup) {
    if ('start' in event) {
      me.patchValue({ start_date: event.start })
    }

    if ('end' in event) {
      me.patchValue({ end_date: event.end })
    }


  }

}
