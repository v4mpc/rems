import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ArfService {

  url = 'http://127.0.0.1:8000/arfs/'

  constructor(
    private http: HttpClient,
  ) { }

  getAll() {

    // return this.http.get();

  }

  save(arf) {
    return this.http.post(this.url, arf);
  }

  deleteOne() {
    // return this.http.delete();
  }

  getOne() {
    // return this.http.get();
  }
}
