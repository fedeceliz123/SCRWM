import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ScrwmService } from '../../services/scrwm.service';
import { InciseService  } from 'src/app/services/incise.service';

import { Scrwm } from 'src/app/models/scrwm';
import { Incise } from 'src/app/models/incise';

@Component({
  selector: 'app-newscrwm',
  templateUrl: './newscrwm.component.html',
  styleUrls: ['./newscrwm.component.css']
})
export class NewscrwmComponent implements OnInit {

  constructor(public scrwmService: ScrwmService,
              public inciseService: InciseService,
              private router: Router,
              ) { }

  ngOnInit(): void {
  } 

  hide: true;

  customScrwm(form: NgForm){
    if(this.scrwmService.selectedScrwm._id){
      this.editScrwm(form);
    } else {
      this.newScrwm(form);
    }
  }

  editScrwm(form: NgForm){
    const A = this.scrwmService.selectedScrwm;
    A.title = form.value.title;
    A.subtitle = form.value.subtitle;
    form.reset();
    this.scrwmService.putScrwm(A)
    .subscribe(res => {
      this.scrwmService.getScrwms()
      .subscribe(res => {
        const D = this.scrwmService.scrwms = res as Scrwm[];
      });
    });
  }

  newScrwm(form: NgForm){
    const A = this.scrwmService.selectedScrwm = new Scrwm;
    const userId = sessionStorage.getItem('currentUserId');
    A.creator = userId;
    A.title = form.value.title;
    A.subtitle = form.value.subtitle;
    form.reset();
    this.scrwmService.postScrwm(A)
    .subscribe(res => {
      this.getScrwm(userId);
    });
  }

  getScrwm(userId: any){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      const D = this.scrwmService.scrwms = res as Scrwm[];
      for(var i in D){
        if(D[i].creator === userId){
          if(!D[i].inciseInit){
            sessionStorage.setItem('currentScrwmId', D[i]._id);
            this.newIncise(userId, D[i]);
          }
        }
      }
    });
  }

  newIncise(userId: any, scrwm: Scrwm){
    const E = this.inciseService.selectedIncise = new Incise;
    E.user = userId;
    E.scrwm = scrwm._id;
    E.content = "Type here...";
    this.inciseService.postIncise(E)
    .subscribe(res => {
      this.getIncise(userId, scrwm);
    });
  }

  getIncise(userId: any, scrwm: Scrwm){
    this.inciseService.getIncises()
    .subscribe(res => {
      const F = this.inciseService.incises = res as Incise[];
      for(var i in F){
        if(F[i].user === userId){
          if(F[i].scrwm === scrwm._id){
            scrwm.inciseInit = F[i]._id;
            this.scrwmService.putScrwm(scrwm)
            .subscribe(res => {
            });
          }
        }
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
        });
      }
    });
    this.deleteIncises();
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
