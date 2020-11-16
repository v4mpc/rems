import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';


@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private toastrService: NbToastrService) { }

  errMessage(message) {
    this.toastrService.show(message, `Error`, { status: 'danger', preventDuplicates: true });

  }
}
