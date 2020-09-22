import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteDialogComponent } from "../pages/delete-dialog/delete-dialog.component";


@Injectable({
  providedIn: 'root'
})
export class DeleteDialogService {

  constructor(public dialog: MatDialog) { }


  openDialog(): MatDialogRef<DeleteDialogComponent> {
    const dialogRef = this.dialog.open(DeleteDialogComponent);


    return dialogRef


  }

  closeDialog(ref: MatDialogRef<DeleteDialogComponent>) {
    ref.close()
  }


}