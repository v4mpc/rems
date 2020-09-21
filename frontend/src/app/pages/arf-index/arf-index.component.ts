import { Component, OnInit } from '@angular/core';

import { ArfService } from "../../services/arf.service";


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Component({
  selector: 'app-arf-index',
  templateUrl: './arf-index.component.html',
  styleUrls: ['./arf-index.component.scss']
})

export class ArfIndexComponent implements OnInit {
  displayedColumns: string[] = ['pk', 'date_of_request', 'location', 'purpose', 'amount', 'status', 'actions'];
  // dataSource = ELEMENT_DATA;
  arfs = []
  constructor(
    private arfService: ArfService,
  ) { }

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    this.arfService.getAll().subscribe(arfs => {
      this.arfs = arfs
      // console.log(arfs)
    })
  }

  calculateTotalAmount(index) {

    if (this.arfs.length == 0) {
      return 0
    }
    let singleArf = this.arfs[index]


    let mesSum = 0
    singleArf.mes.forEach(me => {
      mesSum += ((me.daily_rate * me.no_of_nights * me.percentage_of_daily_rate) / 100)
    });



    let lodgingSum = 0
    singleArf.lodgings.forEach(lodging => {

      lodgingSum += ((lodging.daily_rate * lodging.no_of_nights * lodging.percentage_of_daily_rate) / 100)
    });


    let otherCostsSum = 0
    singleArf.other_costs.forEach(otherCost => {
      otherCostsSum += otherCost.amount
    });



    return mesSum + lodgingSum + otherCostsSum



  }

}
