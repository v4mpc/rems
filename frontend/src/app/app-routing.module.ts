import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArfIndexComponent } from "./pages/arf-index/arf-index.component";

const routes: Routes = [
  { path: 'arfs', component: ArfIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
