import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { ScrwmService } from 'src/app/services/scrwm.service';
import { InciseService } from '../../services/incise.service';

import { Incise } from 'src/app/models/incise';
import { Scrwm } from 'src/app/models/scrwm';

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
})
export class IncisesComponent implements OnInit {

  Above: any = [];
  Below: any = [];
  Left: any = [];
  Right: any = [];
  DirLast: any = "";
  IdLast: any = "";

  constructor(public inciseService: InciseService, 
              public scrwmService: ScrwmService,
              public router: Router,
              ){ }

  ngOnInit(): void {
  }

  getByScrwm(scrwm: Scrwm){
    document.getElementById('E').contentEditable = "true";
    sessionStorage.setItem('currentScrwmId', scrwm._id);
    this.inciseService.getIncises()
    .subscribe(res =>{
      const I = this.inciseService.incises = res as Incise[];
      for(var i in I){
        if(I[i]._id === scrwm.inciseInit){
          this.inciseService.selectedIncise = I[i];
          this.toCenter(this.inciseService.selectedIncise);
        }
      }
    });

  }

  toCenter(incise: Incise){  
    document.getElementById('E').textContent = incise.content;
    document.getElementById('E').focus();
    this.Above = [];
    this.Below = [];
    this.Left = [];
    this.Right = [];
    this.DirLast = "";
    this.IdLast = "";
    this.showAround(incise);
  }

  showAround(incise: Incise){
    this.inciseService.getIncises()
    .subscribe(res =>{
      const D = this.inciseService.incises = res as Incise[];
      for (var i in D){
        for(var j in incise.right){
          if(incise.right[j] === D[i]._id){
            this.Right.push(D[i]);
          }
        }
        for(var k in incise.down){
          if(incise.down[k] === D[i]._id){
            this.Below.push(D[i]);
          }
        }
        for(var l in incise.left){
          if(incise.left[l] === D[i]._id){
            this.Left.push(D[i]);
          }
        }
        for(var m in incise.up){
          if(incise.up[m] === D[i]._id){
            this.Above.push(D[i]);
          }
        }
      }
    });
    console.log(this.Above);
  }
  
  @HostListener('window:keydown', ['$event']) spaceEvent(event: any){
    if(event.keyCode === 13){
      this.DirLast = "Up";
      this.editedIncise();
    } else if(event.ctrlKey){
             if(event.keyCode === 37){
        this.DirLast = "Right";
        this.editedIncise();
      } else if(event.keyCode === 38){
        this.DirLast = "Down";
        this.editedIncise();
      } else if(event.keyCode === 39){
        this.DirLast = "Left";
        this.editedIncise();
      } else if(event.keyCode === 40){
        this.DirLast = "Up";
        this.editedIncise();
      }  
    }
  }

  editedIncise(){  
    if (document.getElementById('E').textContent === ""){
      document.getElementById('E').textContent = "...1... ";
    }
    const incise = this.inciseService.selectedIncise;
    this.IdLast = incise._id;
    incise.content = document.getElementById('E').textContent;
    this.getCurrentScrwm(incise);
    this.inciseService.putIncise(incise)
    .subscribe(res => {
        this.inciseService.selectedIncise = new Incise();
        document.getElementById('E').textContent = "";
        this.linkMono(this.inciseService.selectedIncise);
    });
  }

  linkMono(incise: Incise){  
      switch(this.DirLast){
      case "Up":
          incise.up = this.IdLast;
        break;
      case "Down":
          incise.down = this.IdLast;
        break;
      case "Left":
          incise.left = this.IdLast;
        break;
      case "Right":
          incise.right = this.IdLast;
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
      this.toCenter(this.inciseService.selectedIncise);
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

  editAround(incise: Incise, direction: any){
    switch(direction){
      case "Up":
        this.DirLast = "Up";
        break;
      case "Down":
        this.DirLast = "Down";
        break;        
      case "Left":
        this.DirLast = "Left";
        break;
      case "Right":
        this.DirLast = "Right";
        break;  
    }
    this.linkStereo1(incise);
  }  

  linkStereo1(incise: Incise){ 
    if (document.getElementById('E').textContent === ""){
      document.getElementById('E').textContent = "...2...";
    };
    const A = this.inciseService.selectedIncise;
    A.content = document.getElementById('E').textContent;
    switch (this.DirLast){
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
          if(A.left[i] === incise._id){
            this.linkStereo2(incise, A);
            return;
          }
        }
        A.left.push(incise._id);
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
    switch (this.DirLast){
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
          if(incise.left[i] === A._id){
            this.linkStereo4(A, incise);
            return;
          }
        }
        incise.left.push(A._id);
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
        this.getCurrentScrwm(incise);
        this.inciseService.selectedIncise = incise;
        this.toCenter(this.inciseService.selectedIncise);
      });
    });
  }

  Expand = "< <  > >"
  Contract = "> >  < <"

  zoomMin(){
    this.router.navigate(['/tasks']);
    this.actualizeScrwm();
  }

  zoomMax(){
    this.router.navigate(['/incises']);
    this.actualizeScrwm();
  }

  actualizeScrwm(){
    this.scrwmService.getScrwms()
    .subscribe(res =>{
      const A = this.scrwmService.scrwms = res as Scrwm [];
      for(var i in A){
        if(A[i]._id === sessionStorage.getItem('currentScrwmId')){
          this.getByScrwm(A[i]);
        }
      }
    });

  }

}