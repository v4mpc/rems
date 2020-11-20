import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b><a href="#" target="_blank">Yona Mahundi</a></b> {{currentYear}}
    </span>
    <div class="socials">
      <a href="https://github.com/v4mpc" target="_blank" class="ion ion-social-github"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a>
      <a href="https://www.linkedin.com/in/yona-mahundi-15a475a0/" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear()
}
