import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import { User } from '../../models/user';

import { ProfComponent } from 'src/app/components/prof/prof.component'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {

  hide = true;

  constructor(public authService: AuthService,
              public profComponent: ProfComponent,
  ) { }

  ngOnInit(): void {
  }
  
  signIn(form: NgForm){
    this.authService.signIn(form.value)
    .subscribe(res => {
        localStorage.setItem('token', res.token);
        this.findUser(form);
      },
      err => console.log(err)
    )
  }
 
  findUser(form: NgForm){
    this.authService.getUsers()
    .subscribe(res => {
      const A = this.authService.users = res as User[];
      for(var i in A){
        if (A[i].username === form.value.username){
          if (A[i].password === form.value.password){
            sessionStorage.setItem('currentUserId', A[i]._id);
            form.reset();
            this.profComponent.findProf(A[i]._id);
          }
        }
      }
    });   
  }

}