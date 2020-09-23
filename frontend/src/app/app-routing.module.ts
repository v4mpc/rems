import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArfIndexComponent } from "./pages/arf-index/arf-index.component";
import { ArfCreateComponent } from "./pages/arf-create/arf-create.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/log-in', pathMatch: 'full' },
  { path: 'log-in', component: LoginComponent },
  { path: 'arfs', component: ArfIndexComponent, canActivate: [AuthGuard] },
  { path: 'arfs-create', component: ArfCreateComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
