import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:3000/api/scrwm/'

  selectedUser: User;
  users: User[];
  UserId: String = "";

  constructor(private http: HttpClient, private router: Router) {
    this.selectedUser = new User();
  }                                                                  // la clase HttpClient se instancia en este objeto

  signUp(user: User){
    return this.http.post<any>(this.URL + '/signup', user);
  }

  signIn(user: User){
    return this.http.post<any>(this.URL + '/signin', user);
  }

  getUsers(){
    return this.http.get<any>(this.URL + '/auth');
  }

  deleteUser(_id: string){
    return this.http.delete<any>(this.URL + `/auth/${_id}`)
  }

  loggedIn(){
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/init'])
  }

}