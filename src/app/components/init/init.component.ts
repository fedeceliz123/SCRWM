import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

import { User } from 'src/app/models/user';

import {MatDialog} from '@angular/material/dialog';
import {SignupComponent} from 'src/app/components/signup/signup.component';
import {SigninComponent} from 'src/app/components/signin/signin.component';
import {NewscrwmComponent} from 'src/app/components/newscrwm/newscrwm.component';
import { ProfComponent } from '../prof/prof.component';


@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  constructor(
              public authService: AuthService,
              public dialog: MatDialog,
              public signupComponent: SignupComponent,
              public signinComponent: SigninComponent,
              public newScrwmComponent: NewscrwmComponent,
              public profComponent: ProfComponent,
              ){}

  ngOnInit(): void {
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
    this.newScrwmComponent.deleteScrwms();
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

  newScrwm() {
    const dialogRef = this.dialog.open(NewscrwmComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editUser() {
    const dialogRef = this.dialog.open(ProfComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
