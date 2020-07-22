import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProfService } from 'src/app/services/prof.service';

import { User } from 'src/app/models/user';
import { Prof } from 'src/app/models/prof';

import { SignupComponent } from 'src/app/components/signup/signup.component';
import { SigninComponent } from 'src/app/components/signin/signin.component';
import { ProfComponent } from '../prof/prof.component';
import { TasksComponent } from 'src/app/components/tasks/tasks.component';

import {MatDialog} from '@angular/material/dialog';

declare var M: any;

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elems);
});

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})

export class InitComponent implements OnInit {

  constructor(public imageService: ImageService,
              public authService: AuthService,
              public profService: ProfService,
              public dialog: MatDialog,
              public signupComponent: SignupComponent,
              public signinComponent: SigninComponent,
              public profComponent: ProfComponent,
              public taskComponent: TasksComponent,
              ){}

  ngOnInit(): void {
    this.setUserImage();
  }

  imagePath: string;
  userId: string = sessionStorage.getItem('currentUserId');

  setUserImage(){
    for(var i in this.imageService.images){
      if(this.imageService.images[i].userId === this.userId){
        this.imagePath = this.imageService.images[i].imagePath;
      } 
    }
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
    this.profComponent.deleteProfs();
    sessionStorage.setItem("currentUserId", "*");
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

  editProf() {
    const dialogRef = this.dialog.open(ProfComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
    return; 
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left'
  });
});

