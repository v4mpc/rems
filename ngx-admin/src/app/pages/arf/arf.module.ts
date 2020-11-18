import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

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
import { ArfRoutingModule } from './arf-routing.module';
import { ArfComponent } from './arf.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';


@NgModule({
  declarations: [ArfComponent, ListComponent, CreateComponent, LoaderComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    ArfRoutingModule,
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

    NgxMaskModule.forRoot(),
    NbToggleModule,



  ]
})
export class ArfModule { }
