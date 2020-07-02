import { Component, OnInit } from '@angular/core';

import { ScrwmService } from '../../services/scrwm.service'
import { AuthService } from '../../services/auth.service';
import { InciseService } from '../../services/incise.service';

import { Scrwm } from 'src/app/models/scrwm';
import { User } from '../../models/user'
import { Incise } from 'src/app/models/incise';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [ScrwmService, AuthService, InciseService]
})
export class TasksComponent implements OnInit {

  constructor(public scrwmService: ScrwmService, 
              public authService: AuthService,
              public inciseService: InciseService,
              ) { }

  ngOnInit(): void {
    this.getUsers();
    this.getScrwms();
    this.getIncises();
  }

  getUsers(){
    this.authService.getUsers()
    .subscribe(res => {
      this.authService.users = res as User[];
    });
  }

  getScrwms(){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      this.scrwmService.scrwms = res as Scrwm[];
      if(this.scrwmService.scrwms.slice(-1)[0]){
        this.scrwmService.selectedScrwm = this.scrwmService.scrwms.slice(-1)[0];
      } else {
        this.scrwmService.postScrwm(this.scrwmService.selectedScrwm)
        .subscribe(res => {
        });
      }
    });
  }

  getIncises(){
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
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

    deleteScrwms(){
      this.scrwmService.getScrwms()
      .subscribe(res => {
        this.scrwmService.scrwms = res as Scrwm[];
        for(var i in this.scrwmService.scrwms){
          this.scrwmService.deleteScrwm(this.scrwmService.scrwms[i]._id)
          .subscribe(res => {
            this.scrwmService.selectedScrwm = new Scrwm();
          });
        }
      });
  }


  deleteIncises(){
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      for(var i in this.inciseService.incises){
        this.inciseService.deleteIncise(this.inciseService.incises[i]._id)
        .subscribe(res => {
        });
      }
    });
}

}
