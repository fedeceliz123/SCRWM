import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';       // para comunicar el frontend al servidor (en lugar de Postman)
import { Incise } from '../models/incise'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InciseService {

  selectedIncise: Incise;
  incises: Incise[];

  private URL_API = environment.apiUrl + 'api/scrwm/incises';
  
  constructor(private http: HttpClient) {
    this.selectedIncise = new Incise();
  }

  getIncises() {
    return this.http.get(this.URL_API);
  }

  postIncise(Incise: Incise) {
    return this.http.post(this.URL_API, Incise);
  }

  putIncise(incise: Incise) {
    return this.http.put(this.URL_API + `/${incise._id}`, incise);
  }

  deleteIncise(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

}

