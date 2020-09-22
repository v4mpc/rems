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

    return this.http.get(this.url);

  }

  save(arf) {
    return this.http.post(this.url, arf);
  }

  deleteOne(pk) {
    let end_point = `${pk}/`
    return this.http.delete(this.url + end_point);
  }

  getOne() {
    // return this.http.get();
  }

  transformToApi() {

  }
}
