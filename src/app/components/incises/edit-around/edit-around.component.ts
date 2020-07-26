import { Component, OnInit } from '@angular/core';

import { InciseService } from 'src/app/services/incise.service';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'

import { Incise } from 'src/app/models/incise';
import { Comm } from 'src/app/models/comm';

declare var M: any; 

@Component({
  selector: 'app-edit-around',
  templateUrl: './edit-around.component.html',
  styleUrls: ['./edit-around.component.css']
})


export class EditAroundComponent implements OnInit {

  constructor(public inciseService: InciseService, 
    public showAround: ShowAroundComponent,
    ){ }

  ngOnInit(): void {
  }

  editAround(incise: Incise, direction: any){
    switch(direction){
      case "Up":
        this.showAround.DirLast = "Up";
        break;
      case "Down":
        this.showAround.DirLast = "Down";
        break;        
      case "Left":
        this.showAround.DirLast = "Left";
        break;
      case "Right":
        this.showAround.DirLast = "Right";
        break;  
    }
    this.newInc = incise
    this.checkContent();
    this.linkStereo1();
  }

  newInc: Incise;

  checkContent(){ 
    if (document.getElementById('E').textContent === ""){
      document.getElementById('E').textContent = "(Blank)";
    }
  }

  linkStereo1(){
    const oldInc = this.inciseService.selectedIncise
    oldInc.content = document.getElementById('E').textContent;
    switch (this.showAround.DirLast){
      case "Up":
        for(var i in oldInc.up){
          if(oldInc.up[i] === this.newInc._id){
            this.linkStereo2(oldInc);
            return;
          }
        }
        oldInc.up.push(this.newInc._id);
        break;
      case "Down":
        for(var i in oldInc.down){
          if(oldInc.down[i] === this.newInc._id){
            this.linkStereo2(oldInc);
            return;
          }
        }
        oldInc.down.push(this.newInc._id);
        break;
      case "Left":
        for(var i in oldInc.left){
          if(oldInc.left[i].IdComm === this.newInc._id){
            this.linkStereo2(oldInc);
            return;
          }
        }
        const comm = new Comm;
        comm.IdComm = this.newInc._id;
        oldInc.left.push(comm);
        break;
      case "Right":
        for(var i in oldInc.right){
          if(oldInc.right[i] === this.newInc._id){
            this.linkStereo2(oldInc);
            return;
          }
        }
        oldInc.right.push(this.newInc._id);
        break;
    }
    this.linkStereo2(oldInc)
  }

  linkStereo2(oldInc: Incise){
    this.inciseService.putIncise(oldInc)
    .subscribe(res => {
      this.linkStereo3(oldInc);
      });
  }

  linkStereo3(oldInc: Incise){
    switch (this.showAround.DirLast){
      case "Up":
        for(var i in this.newInc.down){
          if(this.newInc.down[i] === oldInc._id){
            this.linkStereo4();
            return;
          }
        }
        this.newInc.down.push(oldInc._id);
        break;
      case "Down":
        for(var i in this.newInc.up){
          if(this.newInc.up[i] === oldInc._id){
            this.linkStereo4();
            return;
          }
        }
        this.newInc.up.push(oldInc._id);
        break;
      case "Left":
        for(var i in this.newInc.right){
          if(this.newInc.right[i] === oldInc._id){
            this.linkStereo4();
            return;
          }
        }
        this.newInc.right.push(oldInc._id);
        break;
      case "Right":
        for(var i in this.newInc.left){
          if(this.newInc.left[i].IdComm === oldInc._id){
            this.linkStereo4();
            return;
          }
        }
        const comm = new Comm;
          comm.IdComm = oldInc._id;
          this.newInc.left.push(comm);
          break;
    }
    this.linkStereo4();
  }

  linkStereo4(){
    this.inciseService.putIncise(this.newInc)
    .subscribe(res => {
        this.inciseService.selectedIncise = this.newInc;
        this.showAround.toCenter(this.inciseService.selectedIncise);
      });
  }

}