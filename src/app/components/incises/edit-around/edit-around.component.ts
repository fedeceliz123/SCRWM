import { Component, OnInit } from '@angular/core';

import { InciseService } from 'src/app/services/incise.service';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'
import { KeyListenerComponent } from 'src/app/components/incises/key-listener/key-listener.component'

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
    public keyListener: KeyListenerComponent,            
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
    this.checkContent(incise);
  }  

  checkContent(incise: Incise){ 
    if (document.getElementById('E').textContent === ""){
      document.getElementById('E').textContent = "(Blank)";
    }
    this.linkStereo1(incise)
  }

  linkStereo1(incise: Incise){
    const A = this.inciseService.selectedIncise;
    console.log(A);
    A.content = document.getElementById('E').textContent;
    switch (this.showAround.DirLast){
      case "Up":
        for(var i in A.up){
          if(A.up[i] === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        A.up.push(incise._id);
        break;
      case "Down":
        for(var i in A.down){
          if(A.down[i] === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        A.down.push(incise._id);
        break;
      case "Left":
        for(var i in A.left){
          if(A.left[i].IdComm === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        const comm = new Comm;
        comm.IdComm = incise._id;
        A.left.push(comm);
        break;
      case "Right":
        for(var i in A.right){
          if(A.right[i] === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        A.right.push(incise._id);
        break;
    }
    this.linkStereo2(incise, A)
  }

  linkStereo2(incise: Incise, A: Incise){
    this.inciseService.putIncise(A)
    .subscribe(res => {
      this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.linkStereo3(incise, A);
      });
    });
  }

  linkStereo3(incise: Incise, A: Incise){
    switch (this.showAround.DirLast){
      case "Up":
        for(var i in incise.down){
          if(incise.down[i] === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        incise.down.push(A._id);
        break;
      case "Down":
        for(var i in incise.up){
          if(incise.up[i] === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        incise.up.push(A._id);
        break;
      case "Left":
        for(var i in incise.right){
          if(incise.right[i] === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        incise.right.push(A._id);
        break;
      case "Right":
        for(var i in incise.left){
          if(incise.left[i].IdComm === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        const comm = new Comm;
          comm.IdComm = A._id;
          incise.left.push(comm);
          break;
    }
    this.linkStereo4(A, incise);
  }

  linkStereo4(A: Incise, incise: Incise){
    this.inciseService.putIncise(incise)
    .subscribe(res => {
      this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.inciseService.selectedIncise = incise;
        this.showAround.toCenter(this.inciseService.selectedIncise);
      });
    });
  }

}
