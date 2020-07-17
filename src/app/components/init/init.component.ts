import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { ScrwmService } from 'src/app/services/scrwm.service';
import { ProfService } from 'src/app/services/prof.service'

import { Scrwm } from 'src/app/models/scrwm';
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
              public scrwmService: ScrwmService,
              public profService: ProfService,
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
    this.newScrwmComponent.deleteScrwms();
    this.profComponent.deleteProfs();
    sessionStorage.setItem("currentUserId", "*");
    sessionStorage.setItem("currentScrwmId", "*");
  }

  Register() {
    const dialogRef = this.dialog.open(SignupComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  Login() {
    const dialogRef = this.dialog.open(SigninComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  newScrwm(){
    this.scrwmService.selectedScrwm = new Scrwm;
    this.customScrwm();
  }
 
  editScrwm(scrwm: Scrwm){
    this.scrwmService.selectedScrwm = scrwm;
    this.customScrwm();
  }

  customScrwm() {
    const dialogRef = this.dialog.open(NewscrwmComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editUser() {
    const dialogRef = this.dialog.open(ProfComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
