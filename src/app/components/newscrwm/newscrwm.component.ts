import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ScrwmService } from '../../services/scrwm.service';
import { Scrwm } from 'src/app/models/scrwm';

import { SigninComponent } from 'src/app/components/signin/signin.component';

@Component({
  selector: 'app-newscrwm',
  templateUrl: './newscrwm.component.html',
  styleUrls: ['./newscrwm.component.css']
})
export class NewscrwmComponent implements OnInit {

  constructor(public scrwmService: ScrwmService,
              public signinComponent: SigninComponent) { }

  ngOnInit(): void {
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
      this.signinComponent.getScrwm(userId);
    });
  }

}