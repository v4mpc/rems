import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ArfService {

  url = 'arfs/'
  private API_URL = environment.API_URL


  constructor(
    private http: HttpClient,
  ) { }

  getAll() {

    return this.http.get(this.API_URL + this.url);

  }

  save(arf) {
    return this.http.post(this.API_URL + this.url, arf);
  }

  deleteOne(pk) {
    let end_point = `${pk}/`
    return this.http.delete(this.API_URL + this.url + end_point);
  }

  getOne(pk) {
    let end_point = `${pk}/`
    return this.http.get(this.API_URL + this.url + end_point);

  }

  download(pk) {
    window.open(`${this.API_URL}download-arf/${pk}/`, "_blank")
  }


  update(pk, arf) {
    let end_point = `${pk}/`
    return this.http.put(this.API_URL + this.url + end_point, arf);


  }
}
