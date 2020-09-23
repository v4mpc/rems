import { Component } from '@angular/core';
// import { LayoutComponent } from "./layout/layout.component";
import { AuthenticationService } from "./services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public authService: AuthenticationService) { }
  title = 'Rems';
}
