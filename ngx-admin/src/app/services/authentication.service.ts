import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = 'login/'
  private API_URL = environment.API_URL
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(public http: HttpClient, public router: Router
    ,
  ) { }


  login(username: string, password: string) {
    return this.http.post(this.API_URL + this.url, { username, password })
  }

  logout() {
    localStorage.removeItem('currentUser');
    // this.router.navigate(['login']);
  }


  loggedIn() {
    return localStorage.getItem('currentUser') !== null
  }

  getToken() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser == null) {
      return null
    }
    return currentUser.token
  }




}
