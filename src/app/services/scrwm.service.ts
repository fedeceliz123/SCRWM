import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scrwm } from '../models/scrwm'

@Injectable({
  providedIn: 'root'
})
export class ScrwmService {

  selectedScrwm: Scrwm;
  scrwms: Scrwm[];

  readonly URL_API = 'http://localhost:3000/api/scrwm/scrwms';

  constructor(private http: HttpClient) { 
    this.selectedScrwm = new Scrwm();
  }

  getScrwms() {
    return this.http.get(this.URL_API);
  }

  postScrwm(scrwm: Scrwm) {
    return this.http.post(this.URL_API, scrwm);
  }

  putScrwm(scrwm: Scrwm) {
    return this.http.put(this.URL_API + `/${scrwm._id}`, scrwm);
  }

  deleteScrwm(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

}