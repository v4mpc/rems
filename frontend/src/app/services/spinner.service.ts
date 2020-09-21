import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerComponent } from "../pages/spinner/spinner.component";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private dialog: MatDialog) {

  }

  start(message?): MatDialogRef<SpinnerComponent> {

    const dialogRef = this.dialog.open(SpinnerComponent, {
      disableClose: true,
      data: message == '' || message == undefined ? "Loading..." : message
    });
    return dialogRef;
  };

  stop(ref: MatDialogRef<SpinnerComponent>) {
    ref.close();
  }
}
