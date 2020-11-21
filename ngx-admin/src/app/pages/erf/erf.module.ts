import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import {
  NbActionsModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbTooltipModule,
  NbFormFieldModule,
  NbToggleModule,
  NbBadgeModule,
  NbContextMenuModule,
  NbButtonModule,



} from '@nebular/theme';
import { NgxMaskModule } from 'ngx-mask'
import { LoaderComponent } from '../../components/loader/loader.component';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { ErfRoutingModule } from './erf-routing.module';
import { ErfCreateComponent } from './create/create.component';


@NgModule({
  declarations: [ErfCreateComponent],
  imports: [
    CommonModule,
    ErfRoutingModule,
    CommonModule,
    NbInputModule,
    NbCardModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbIconModule,
    NbTooltipModule,
    NbFormFieldModule,
    ReactiveFormsModule,
    NbContextMenuModule,
    NbBadgeModule,
    NbButtonModule,
    FormsModule,

    NgxMaskModule.forRoot(),
    NbToggleModule,


  ]
})
export class ErfModule { }
