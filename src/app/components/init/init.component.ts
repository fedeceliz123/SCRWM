import { Component, OnInit } from '@angular/core';

import { ScrwmService } from 'src/app/services/scrwm.service';
import { AuthService } from 'src/app/services/auth.service';
import { InciseService } from 'src/app/services/incise.service';

import { Scrwm } from 'src/app/models/scrwm';
import { User } from 'src/app/models/user';

import {MatDialog} from '@angular/material/dialog';
import {SignupComponent} from 'src/app/components/signup/signup.component';
import {SigninComponent} from 'src/app/components/signin/signin.component';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  constructor(
              public scrwmService: ScrwmService, 
              public authService: AuthService,
              public inciseService: InciseService,
              public dialog: MatDialog,
              public signupComponent: SignupComponent,
              public signinComponent: SigninComponent,
              ){}

  ngOnInit(): void {
    this.getScrwms();
    this.getUsers();
  }

  getScrwms(){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      this.scrwmService.scrwms = res as Scrwm[];
    });
  }

  getUsers(){
    this.authService.getUsers()
    .subscribe(res => {
      this.authService.users = res as User[];
    });
  }

  deleteUsers(){
    this.authService.getUsers()
    .subscribe(res => {
      this.authService.users = res as User[];
      for(var i in this.authService.users){
        this.authService.deleteUser(this.authService.users[i]._id)
        .subscribe(res => {
        });
      }
    });
  }

  Register() {
    const dialogRef = this.dialog.open(SignupComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  Login() {
    const dialogRef = this.dialog.open(SigninComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
