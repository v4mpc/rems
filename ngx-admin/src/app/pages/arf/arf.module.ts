import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import {
  NbActionsModule,
  NbButtonModule,
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


} from '@nebular/theme';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { ArfRoutingModule } from './arf-routing.module';
import { ArfComponent } from './arf.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';


@NgModule({
  declarations: [ArfComponent, ListComponent, CreateComponent],
  imports: [
    CommonModule,
    ArfRoutingModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
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
    NbBadgeModule,
    NgxMaskModule.forRoot(),
    NbToggleModule,



  ]
})
export class ArfModule { }
