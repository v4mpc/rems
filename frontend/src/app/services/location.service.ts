import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LocationService {
  url = "locations/"
  private API_URL = environment.API_URL

  constructor(
    private http: HttpClient,


  ) { }


  getAll() {
    return this.http.get(this.API_URL + this.url);
  }

  save(location) {
    return this.http.post(this.API_URL + this.url, location)
  }
}
