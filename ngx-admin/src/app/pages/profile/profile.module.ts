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

import { ProfileRoutingModule } from './profile-routing.module';
import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile.component';


@NgModule({
  declarations: [EditComponent, ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CommonModule,
    NbToggleModule,

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

  ]
})
export class ProfileModule { }
