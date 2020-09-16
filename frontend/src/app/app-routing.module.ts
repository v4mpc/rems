import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArfIndexComponent } from "./pages/arf-index/arf-index.component";
import { ArfCreateComponent } from "./pages/arf-create/arf-create.component";

const routes: Routes = [
  {
    path: 'arfs', component: ArfIndexComponent,
  },

  {
    path: 'arfs-create', component: ArfCreateComponent,

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
