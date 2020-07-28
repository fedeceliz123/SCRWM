import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { ProfComponent } from 'src/app/components/prof/prof.component'
import { MatDialog } from '@angular/material/dialog';

declare var M: any; 

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {

  hide = true;

  constructor(public authService: AuthService,
              public profComponent: ProfComponent,
              public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  
  signIn(form: NgForm){
    this.authService.signIn(form.value)
    .subscribe(res => {
      localStorage.setItem('token', res.token);
    },
    err => console.log(err));
    this.authService.getUsers()
    .subscribe(res => {
      const A = this.authService.users = res as User[];
      for(var i in A){
        if(A[i].username === form.value.username){
          this.checkPassword(form, A[i]);
          return;
        }
      }
      M.toast({html: "Username not found"}); 
    });
  }
  
  checkPassword(form: NgForm, A: User){
    console.log(form.value)
    if(A.password === form.value.password){
      this.proccessForm(form, A);
      return;
    } else {
      M.toast({html: "Wrong password"}); 
    }
  }

  proccessForm(form: NgForm, A: User){
    console.log()
    this.dialog.closeAll();
    this.profComponent.username = A.username;
    sessionStorage.setItem('currentUserId', A._id);
    form.reset();
    this.profComponent.findProf(A._id);
  }

}
