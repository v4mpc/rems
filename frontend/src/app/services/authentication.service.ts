import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = 'login/'
  private API_URL = environment.API_URL

  constructor(public http: HttpClient) { }


  login(username: string, password: string) {
    return this.http.post(this.API_URL + this.url, { username, password })
  }

  logout() {
    localStorage.removeItem('currentUser');
  }


  loggedIn() {
    return localStorage.getItem('currentUser') == null
  }

  getToken() {
    return JSON.parse(localStorage.getItem('currentUser')).token
  }




}
