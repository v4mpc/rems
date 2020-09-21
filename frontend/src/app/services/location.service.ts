import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  url = "http://127.0.0.1:8000/locations/"

  constructor(
    private http: HttpClient,

  ) { }


  getAll() {
    return this.http.get(this.url);
  }

  save(location) {
    return this.http.post(this.url, location)
  }
}
