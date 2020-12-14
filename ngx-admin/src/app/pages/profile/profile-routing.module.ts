import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from "./profile.component";
import { EditComponent } from "./edit/edit.component";

const routes: Routes = [{
  path: '',
  component: ProfileComponent,
  children: [
    {
      path: 'edit',
      component: EditComponent,
    },
    ,
    {
      path: '',
      redirectTo: 'edit',
      pathMatch: 'full',
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
