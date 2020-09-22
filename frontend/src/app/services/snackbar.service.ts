import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    public snackBar: MatSnackBar,
  ) { }


  display(message) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    })
  }
}
