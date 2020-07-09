import { Component, OnInit } from '@angular/core';

import { ScrwmService } from 'src/app/services/scrwm.service';
import { InciseService } from 'src/app/services/incise.service';

import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'

import { Incise } from 'src/app/models/incise';
import { Scrwm } from 'src/app/models/scrwm';

@Component({
  selector: 'app-key-listener',
  templateUrl: './key-listener.component.html',
  styleUrls: ['./key-listener.component.css']
})
export class KeyListenerComponent implements OnInit {

  constructor(public inciseService: InciseService, 
    public scrwmService: ScrwmService,
    public showAround: ShowAroundComponent,
    ){ }

  ngOnInit(): void {
  }
  
  editedIncise(){
    const C = document.getElementById('E');
    if (C.textContent === ""){
      C.textContent = "...1... ";
    }
    C.contentEditable = "true";
    const incise = this.inciseService.selectedIncise;
    this.showAround.IdLast = incise._id;
    incise.content = C.textContent;
    this.getCurrentScrwm(incise);
    this.inciseService.putIncise(incise)
    .subscribe(res => {
        this.inciseService.selectedIncise = new Incise();
        C.textContent = "";
        this.linkMono(this.inciseService.selectedIncise);
    });
  }

  linkMono(incise: Incise){  
      switch(this.showAround.DirLast){
      case "Up":
          incise.up = this.showAround.IdLast;
        break;
      case "Down":
          incise.down = this.showAround.IdLast;
        break;
      case "Left":
          incise.left = this.showAround.IdLast;
        break;
      case "Right":
          incise.right = this.showAround.IdLast;
        break;
      }
    incise.user = sessionStorage.getItem('currentUserId');
    incise.scrwm = sessionStorage.getItem('currentScrwmId');
      this.saveIncise(incise);
  }

  saveIncise(incise: Incise){
    this.inciseService.postIncise(incise)
    .subscribe(res => {
      incise = res as Incise;
      this.inciseService.selectedIncise = incise;
      this.showAround.toCenter(this.inciseService.selectedIncise);
    });
  }

  getCurrentScrwm(incise: Incise){
    this.scrwmService.getScrwms()
    .subscribe(res =>{
      const A = this.scrwmService.scrwms = res as Scrwm [];
      for(var i in A){
        if(A[i]._id === sessionStorage.getItem('currentScrwmId')){
          A[i].inciseInit = incise._id;
          this.saveScrwm(A[i]);
        }
      }
    });
  }

  saveScrwm(scrwm: Scrwm){
    this.scrwmService.putScrwm(scrwm)
    .subscribe(res =>{
      scrwm = res as Scrwm;
    });
  }

}
