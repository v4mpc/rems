import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  constructor(protected ref: NbDialogRef<DeleteDialogComponent>) { }

  ngOnInit(): void {
  }

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    this.ref.close(true);
  }

}
