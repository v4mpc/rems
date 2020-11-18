import { Component, OnInit } from '@angular/core';
import { ArfService } from "../../../services/arf.service";
import { LoaderDialogService } from "../../../services/loader-dialog.service";



@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  arfs: any[] = []



  constructor(
    private arfService: ArfService,
    private loader: LoaderDialogService

  ) { }
  ngOnInit(): void {
    this.getAll()




  }

  getAll() {
    this.arfService.getAll().subscribe((arfs: any[]) => {
      this.arfs = arfs
    })
  }



  // addMenuItem() {
  //   this.menuService.addItems([{
  //     title: '@nebular/theme',
  //     target: '_blank',
  //     icon: 'plus-outline',
  //     url: 'https://github.com/akveo/ngx-admin',
  //   }], 'list-menu');
  // }

  calculateTotalAmount(reportType) {

    let singleArf = reportType


    let mesSum = 0
    singleArf.mes.forEach(me => {
      mesSum += ((me.daily_rate * me.no_of_nights * me.percentage_of_daily_rate) / 100)
    });



    let lodgingSum = 0
    singleArf.lodgings.forEach(lodging => {

      lodgingSum += ((lodging.daily_rate * lodging.no_of_nights * lodging.percentage_of_daily_rate) / 100)
    });


    let otherCostsSum = 0
    if (singleArf.other_costs) {
      singleArf.other_costs.forEach(otherCost => {
        otherCostsSum += otherCost.amount
      });
    }




    return mesSum + lodgingSum + otherCostsSum



  }

  downloadArf(file_name) {
    this.arfService.download(file_name)
  }


}
