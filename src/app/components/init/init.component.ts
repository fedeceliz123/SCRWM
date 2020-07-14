import { Component, OnInit } from '@angular/core';

import { ScrwmService } from 'src/app/services/scrwm.service';
import { AuthService } from 'src/app/services/auth.service';
import { InciseService } from 'src/app/services/incise.service';

import { Scrwm } from 'src/app/models/scrwm';
import { User } from 'src/app/models/user';

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

}