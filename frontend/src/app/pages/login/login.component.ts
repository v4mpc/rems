import { Component, OnInit } from '@angular/core';
import { FormControl, Validator, FormArray, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from "../../services/authentication.service";
import { SpinnerService } from "../../services/spinner.service";
import { SnackbarService } from "../../services/snackbar.service";
import { SpinnerComponent } from '../spinner/spinner.component';


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
      // redirect to dashboard


    }, (error) => {

      this.spinner.stop(spinnerRef)
      this.snackBar.display("Error, Login Failed")
      console.log(error)
    })
  }

}
