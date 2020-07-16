import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prof } from '../models/prof'

@Injectable({
  providedIn: 'root'
})
export class ProfService {

selectedProf: Prof;
profs: Prof[];

  readonly URL_API = 'http://localhost:3000/api/scrwm/profs';

  constructor(private http: HttpClient) { 
    this.selectedProf = new Prof(); 
  }

  getProfs() {
    return this.http.get(this.URL_API);
  }

  postProf(prof: Prof, photo: File) {
    const fd = new FormData();
    fd.append("nickname", prof.nickname);
    fd.append("state", prof.state);
    fd.append("description", prof.description);
    fd.append("userId", prof.userId);
    fd.append("image", photo);
    return this.http.post(this.URL_API, fd);
  }

  putProf(prof: Prof) {
    return this.http.put(this.URL_API + `/${prof._id}`, prof);
  }

  deleteProf(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

}