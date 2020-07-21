import { Component, OnInit } from '@angular/core';

import { InciseService } from 'src/app/services/incise.service';

import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'

import { Incise } from 'src/app/models/incise';
import { Comm } from 'src/app/models/comm';


@Component({
  selector: 'app-key-listener',
  templateUrl: './key-listener.component.html',
  styleUrls: ['./key-listener.component.css']
})
export class KeyListenerComponent implements OnInit {

  constructor(public inciseService: InciseService, 
    public showAround: ShowAroundComponent,
    ){ }

  ngOnInit(): void {
  }
  
  editedIncise(comm?: Comm){
    const C = document.getElementById('E');
    const incise = this.inciseService.selectedIncise;
      this.showAround.IdLast = incise._id;
      incise.content = C.textContent;
      C.textContent = "";
      this.inciseService.putIncise(incise)
      .subscribe(res => {
          this.linkMono(comm);
      });
      
  }

  linkMono(comm?: Comm){  
    const incise = this.inciseService.selectedIncise = new Incise();
    switch(this.showAround.DirLast){
      case "Up":
          incise.up.push(this.showAround.IdLast);
        break;
      case "Down":
          incise.down.push(this.showAround.IdLast);
        break;
      case "Left":
        incise.left.push(comm);
        break;
      case "Right":
          incise.right.push(this.showAround.IdLast);
        break;
      }  
    incise.prof = sessionStorage.getItem('currentUserId');
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

}
