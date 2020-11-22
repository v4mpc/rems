import { Component, OnInit } from '@angular/core';
import { ArfService } from "../../../services/arf.service";
import { LoaderDialogService } from "../../../services/loader-dialog.service";
import { NotifyService } from "../../../services/notify.service";



@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  arfs: any[] = []



  constructor(
    private arfService: ArfService,
    private loader: LoaderDialogService,
    private toastrService: NotifyService,


  ) { }
  ngOnInit(): void {
    this.getAll()




  }

  getAll() {
    this.arfService.getAll().subscribe((arfs: any[]) => {
      this.arfs = arfs
    })
  }

  calculateTotalAmount(reportType) {

    let singleArf = reportType


    let mesSum = 0
    singleArf.mes.forEach(me => {
      mesSum += (me.daily_rate * me.days)
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


  openDeleteDialog(index, pk) {
    this.loader.showDialog().onClose.subscribe(result => {
      // console.log(result)
      if (result) {
        this.loader.show();
        this.arfService.deleteOne(pk).subscribe(result => {
          if (index > -1) {
            this.arfs.splice(index, 1);
          }
          this.loader.close();

          this.toastrService.succMessage("Success,Advance Request deleted")
        }, (error) => {
          this.loader.close();
          this.toastrService.errMessage("Error,Contact System Admin")
          console.log(error)
        })
      }
    })

  }


}
