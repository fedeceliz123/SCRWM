import { Component, OnInit } from '@angular/core';

import { ScrwmService } from '../../services/scrwm.service';
import { AuthService } from 'src/app/services/auth.service';
import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';

import { IncisesComponent } from 'src/app/components/incises/incises.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { InitComponent } from 'src/app/components/init/init.component'


import { Scrwm } from 'src/app/models/scrwm';
import { Incise } from 'src/app/models/incise';
import { Prof } from 'src/app/models/prof';

declare var M: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})


export class TasksComponent implements OnInit {

  panelOpenState = false;

  constructor(public scrwmService: ScrwmService,
              public incisesComponent: IncisesComponent,
              public authService: AuthService,
              public inciseService: InciseService,
              public profService: ProfService,
              public showAround: ShowAroundComponent,
              public initComponent: InitComponent,
              ) { }

  currentUserId = sessionStorage.getItem('currentUserId');

  ngOnInit(): void {
    this.profService.getProfs()
    .subscribe(res => {
      const P = this.profService.profs = res as Prof[];
      for(var i in P){
        if(P[i].userId === sessionStorage.getItem('currentUserId')){
          this.profService.selectedProf = (P[i]);
        }
      }      this.scrwmService.getScrwms()
      .subscribe(res => {
      });
    });
  }

  deleteScrwm(scrwm: Scrwm){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      const A = this.scrwmService.scrwms = res as Scrwm[];
      for(var i in A){
        if(A[i]._id === scrwm._id){
          if(this.inciseService.selectedIncise.scrwm === scrwm._id){
            M.toast({html: "The scrwm is being edited"});
          } else {
            this.deleteIncises(A[i])
            this.scrwmService.deleteScrwm(A[i]._id)
            .subscribe(res => {
              this.scrwmService.getScrwms()
              .subscribe(res => {
                this.scrwmService.scrwms = res as Scrwm[];
              });
            });
          }  
        }
      }
    });  
  }

  deleteIncises(scrwm: Scrwm){
    this.inciseService.getIncises()
    .subscribe(res => {
      const B = this.inciseService.incises = res as Incise[];
      for(var i in B){
        if(B[i].scrwm === scrwm._id){
          this.inciseService.deleteIncise(B[i]._id)
          .subscribe(res => {
            this.getScrwms();
          });     
        }
      }
    });
  }

  getScrwms(){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      this.scrwmService.scrwms = res as Scrwm[];
    });
  }

}
