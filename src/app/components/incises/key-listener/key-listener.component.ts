import { Component, OnInit } from '@angular/core';

import { InciseService } from 'src/app/services/incise.service';

import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'
import { EditAroundComponent } from 'src/app/components/incises/edit-around/edit-around.component';

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
    public editAround: EditAroundComponent,
    ){ }

  ngOnInit(): void {
  }
  
  editedIncise(comm?: Comm){
    const C = document.getElementById('E');
    if(C.textContent){
      const incise = this.inciseService.selectedIncise;
      this.editAround.newInc = incise;
      incise.content = C.textContent;
      incise.media = this.showAround.ImageIncPath;
      C.textContent = "";
      this.inciseService.putIncise(incise)
      .subscribe(res => {
          this.linkMono(comm);
      });
    }
  }

  linkMono(comm?: Comm){  
    const incise = this.inciseService.selectedIncise = new Incise();
    switch(this.showAround.DirLast){
      case "Up":
          incise.up.push(this.editAround.newInc._id);
        break;
      case "Down":
          incise.down.push(this.editAround.newInc._id);
        break;
      case "Left":
        incise.left.push(comm);
        break;
      case "Right":
          incise.right.push(this.editAround.newInc._id);
        break;
      }
    incise.prof = sessionStorage.getItem('currentUserId');
    this.savingIncise(incise);
  }

  savingIncise(incise: Incise){
    this.inciseService.postIncise(incise)
    .subscribe(res => {
      this.inciseService.selectedIncise = incise = res as Incise;
      //this.editAround.linkStereo3(incise, this.inciseService.selectedIncise);
      this.showAround.toCenter(this.inciseService.selectedIncise);
    });
  }
}
