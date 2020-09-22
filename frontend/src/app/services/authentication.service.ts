import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = 'login/'
  private API_URL = environment.API_URL

  constructor() { }


  login(username: string, passowrd: string) {

  }




}
