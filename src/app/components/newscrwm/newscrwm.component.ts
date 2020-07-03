import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ScrwmService } from '../../services/scrwm.service';
import { InciseService  } from 'src/app/services/incise.service'

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
              private router: Router) { }

  ngOnInit(): void {
  }

  idScrwm: string = "";

  newScrwm(form: NgForm){
    this.scrwmService.postScrwm(form.value)
    .subscribe(res => {
      this.getScrwm(form.value.title, form.value.subtitle);
    });
  }

  getScrwm(title: string, subtitle: string){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      this.scrwmService.scrwms = res as Scrwm[];
      if(this.scrwmService.scrwms.slice(-1)[0]){
        this.scrwmService.selectedScrwm = this.scrwmService.scrwms.slice(-1)[0];
      }
      this.scrwmService.selectedScrwm.title = title;
      this.scrwmService.selectedScrwm.subtitle = subtitle;
      this.newIncise(this.scrwmService.selectedScrwm._id);
    });
  }

  newIncise(scrwmId: string){
    this.inciseService.postIncise(this.inciseService.selectedIncise)
    .subscribe(res => {
      this.getIncise(scrwmId);
    });
  }

  getIncise(scrwmId: string){
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      if(this.inciseService.incises.slice(-1)[0]){
        this.inciseService.selectedIncise = this.inciseService.incises.slice(-1)[0];
        this.inciseService.selectedIncise.user = scrwmId;
        this.inciseService.putIncise(this.inciseService.selectedIncise)
        .subscribe(res => {
        });
        this.scrwmService.selectedScrwm.inciseInit = this.inciseService.selectedIncise._id;
        this.scrwmService.putScrwm(this.scrwmService.selectedScrwm)
        .subscribe(res => {
        });
      }
    });
    this.router.navigate(['/incises']);
  }

}