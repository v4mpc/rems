import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArfComponent } from "./arf.component";
import { CreateComponent } from './create/create.component';
import { ListComponent } from "./list/list.component";

const routes: Routes = [{
  path: '',
  component: ArfComponent,
  children: [
    {
      path: 'list',
      component: ListComponent,
    },
    {
      path: 'create',
      component: CreateComponent,
    }
    ,
    {
      path: 'edit/:id',
      component: CreateComponent,
    }
    ,
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArfRoutingModule { }
