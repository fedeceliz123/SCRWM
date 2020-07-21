import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';

import { User } from 'src/app/models/user';

import { SignupComponent } from 'src/app/components/signup/signup.component';
import { SigninComponent } from 'src/app/components/signin/signin.component';
import { TasksComponent} from 'src/app/components/tasks/tasks.component'
import { ProfComponent } from '../prof/prof.component';

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

  constructor(
              public authService: AuthService,
              public dialog: MatDialog,
              public signupComponent: SignupComponent,
              public signinComponent: SigninComponent,
              public profComponent: ProfComponent,
              public profService: ProfService,
              public imageService: ImageService,
              public taskComponent: TasksComponent
              ){}

  ngOnInit(): void {
    this.profComponent.getImage();
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
      console.log(`Dialog result: ${result}`);
    });
  }

}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left'
  });
});

