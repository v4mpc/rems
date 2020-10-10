import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArfIndexComponent } from "./pages/arf-index/arf-index.component";
import { ArfCreateComponent } from "./pages/arf-create/arf-create.component";
import { LoginComponent } from "./pages/login/login.component";
import { LayoutComponent } from "./pages/layout/layout.component";
import { AuthGuard } from "./guards/auth.guard";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { ErfEditComponent } from "./pages/erf-edit/erf-edit.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'arfs', component: ArfIndexComponent, canActivate: [AuthGuard], },
  { path: 'arfs-create', component: ArfCreateComponent, canActivate: [AuthGuard], },
  { path: 'arfs-edit/:id', component: ArfCreateComponent, canActivate: [AuthGuard], },
  { path: 'erfs-edit/:id', component: ErfEditComponent, canActivate: [AuthGuard], },
  { path: '**', component: PageNotFoundComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
