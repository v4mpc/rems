import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErfService {
  url = 'erfs/'
  private API_URL = environment.API_URL
  constructor(
    private http: HttpClient,

  ) { }


  getAll() {

    return this.http.get(this.API_URL + this.url);

  }

  save(erf) {
    return this.http.post(this.API_URL + this.url, erf);
  }

  deleteOne(pk) {
    let end_point = `${pk}/`
    return this.http.delete(this.API_URL + this.url + end_point);
  }

  getOne(pk) {
    let end_point = `${pk}/`
    return this.http.get(this.API_URL + this.url + end_point);

  }

  download(file_name) {
    window.open(`${this.API_URL}download-erf/${file_name}/`, "_blank")
  }


  update(pk, erf) {
    let end_point = `${pk}/`
    return this.http.put(this.API_URL + this.url + end_point, erf);


  }
}
