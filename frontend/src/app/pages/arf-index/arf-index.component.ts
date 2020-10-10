import { Component, OnInit, ViewChild } from '@angular/core';



import { ArfService } from "../../services/arf.service";
import { SnackbarService } from "../../services/snackbar.service";
import { DeleteDialogService } from "../../services/delete-dialog.service";
import { SpinnerService } from "../../services/spinner.service";
import { MatTable } from '@angular/material/table';





@Component({
  selector: 'app-arf-index',
  templateUrl: './arf-index.component.html',
  styleUrls: ['./arf-index.component.scss']
})

export class ArfIndexComponent implements OnInit {
  arfs: any[] = []
  constructor(
    private arfService: ArfService,
    public deleteDialog: DeleteDialogService,
    private spinnerService: SpinnerService,
    public snackbar: SnackbarService,

  ) { }

  ngOnInit(): void {
    this.getAll()
  }

  @ViewChild(MatTable) table: MatTable<any>;

  getAll() {
    this.arfService.getAll().subscribe((arfs: any[]) => {
      this.arfs = arfs
    })
  }

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


  openDeleteDialog(index, pk) {
    this.deleteDialog.openDialog().afterClosed().subscribe(result => {
      // console.log(result)
      if (result) {
        let spinnerRef = this.spinnerService.start();
        this.arfService.deleteOne(pk).subscribe(result => {
          if (index > -1) {
            this.arfs.splice(index, 1);
          }
          // this.table.renderRows()
          this.spinnerService.stop(spinnerRef);
          this.snackbar.display("Success,Advance Request deleted")
        }, (error) => {
          this.spinnerService.stop(spinnerRef);
          this.snackbar.display("Error,Contact System Admin")
          console.log(error)
        })
      }
    })

  }

}
