import { Injectable } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { NbDialogService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class LoaderDialogService {



  dialogRef: any


  constructor(
    private dialogService: NbDialogService,

  ) { }

  show(message = "") {

    this.dialogRef = this.dialogService.open(LoaderComponent, {
      closeOnBackdropClick: false,
      context: {
        data: message
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

}
