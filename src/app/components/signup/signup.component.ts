import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user'

declare var M: any; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  hide = true;
  username: string;
  password: string;

  signUp(form: NgForm){
    if(form.value.username.length < 8){
      M.toast({html: "Username must have at least 8 characers"})
      return
    }
    if(form.value.password.length < 8){
      M.toast({html: "Password must have at least 8 characers"})
      return;
    }
    this.username = form.value.username;
    this.authService.getUsers().subscribe(res => {
      const A = this.authService.users = res as User[];
      for(var i in A){
        if(A[i].username === this.username){
          M.toast({html: "This username already exist"});
          return;
        }
      }
      this.signUp1(form)
    });
  }

  signUp1(form: NgForm){
    this.authService.signUp(form.value).subscribe(
      res => {
        form.reset();
        this.dialog.closeAll();
        M.toast({html: "User successfully created"});
      },
      err => console.log(err)
    );
  }

}
