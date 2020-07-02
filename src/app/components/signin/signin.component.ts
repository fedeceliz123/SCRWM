import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { User } from '../../models/user'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [AuthService]
})

export class SigninComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signIn(form: NgForm){
    this.authService.signIn(form.value)
    .subscribe(
      res => {
        console.log(res)
        localStorage.setItem('token', res.token);
        this.router.navigate(['/incises']);
      },
      err => console.log(err)
    )
  }
 
  getUsers(){
    this.authService.getUsers()
    .subscribe(res => {
      this.authService.users = res as User[];
      console.log(this.authService.users);
    });
  }

  deleteUser(){
    for(var i in this.authService.users){
      this.authService.deleteUser(this.authService.users[i]._id)
      .subscribe(res => {
      });
    }
  }

}
