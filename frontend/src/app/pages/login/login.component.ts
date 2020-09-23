import { Component, OnInit } from '@angular/core';
import { FormControl, Validator, FormArray, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from "../../services/authentication.service";
import { SpinnerService } from "../../services/spinner.service";
import { SnackbarService } from "../../services/snackbar.service";
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })

  constructor(
    public authService: AuthenticationService,
    public snackBar: SnackbarService,
    public spinner: SpinnerService,
    public router: Router
  ) { }

  ngOnInit(): void {
  }



  submit() {
    if (this.loginForm.invalid) {
      return;
    }
    let spinnerRef = this.spinner.start()
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((data: any) => {
      localStorage.setItem('currentUser', JSON.stringify(data))
      this.spinner.stop(spinnerRef)
      console.log(this.authService.getToken())
      // redirect to dashboard
      const redirectUrl = '/arfs';
      this.router.navigate([redirectUrl]);


    }, (error) => {

      this.spinner.stop(spinnerRef)
      this.snackBar.display("Error, Login Failed")
      console.log(error)
    })
  }

}
