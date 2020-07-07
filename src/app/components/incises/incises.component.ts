import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { InciseService } from '../../services/incise.service';
import { Incise } from 'src/app/models/incise';
import { ScrwmService } from 'src/app/services/scrwm.service';
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

  @HostListener('window:keydown', ['$event']) spaceEvent(event: any){
    if(event.keyCode === 13){
      this.DirLast = "Up";
      this.editedIncise();
      this.editedIncise();
    }
    if (event.ctrlKey){
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
      } else if(event.keyCode === 27){
        this.exit();
      }  
    }
  }


  constructor(public inciseService: InciseService, 
              public scrwmService: ScrwmService,
              private router: Router,
              ){ }

  ngOnInit(): void {
    this.findInciseInit();
  }

  findInciseInit(){
    this.scrwmService.getScrwms()
    .subscribe(res => {   
      this.scrwmService.scrwms = res as Scrwm[];
      for(var i in this.scrwmService.scrwms){
        if(this.scrwmService.scrwms[i]._id === sessionStorage.getItem('currentScrwmId')){
          this.scrwmService.selectedScrwm = this.scrwmService.scrwms[i];
          this.inciseService.getIncises()
          .subscribe(res => {
            this.inciseService.incises = res as Incise[];
            for(var j in this.inciseService.incises){
              if(this.inciseService.incises[j]._id === this.scrwmService.selectedScrwm.inciseInit){
                this.inciseService.selectedIncise = this.inciseService.incises[j];
                this.toCenter();
              }
            }
          }); 
        }
      }
    });
  }

  Init(){      
      this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.inciseService.selectedIncise = this.inciseService.incises.slice(-1)[0];
        this.toCenter();
      });  
  }

  toCenter(){                 //Muestra en el centro el inciso actual
    const incise = this.inciseService.selectedIncise;
    const C = document.getElementById('E');
    C.textContent = incise.content;
    this.inciseService.getIncises()         // ésto parece que puede no ir...
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      C.focus();
      this.showAround(incise);
      });
  }

  showAround(incise: Incise){                //Muestra los incisos al rededor
    this.Above = [];
    this.Below = [];
    this.Left = [];
    this.Right = [];
    this.DirLast = "";
    this.IdLast = "";
    const D = this.inciseService.incises;
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
  }

  editedIncise(){                                         //El inciso central se guarda
    if (document.getElementById('E').textContent === ""){
      document.getElementById('E').textContent = "...";
    }
    const incise = this.inciseService.selectedIncise;
    this.IdLast = incise._id;
    incise.content = document.getElementById('E').textContent;
    this.inciseService.putIncise(incise)
      .subscribe(res => {
        this.inciseService.selectedIncise = new Incise();
        this.linkMono();
        this.showAround(this.inciseService.selectedIncise);
        document.getElementById('E').textContent = "";
    });
  }

  linkMono(){                                           // el inciso central se linkea con otro
    const incise = this.inciseService.selectedIncise;
    if(this.IdLast){
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
    }
    incise.user = sessionStorage.getItem('currentUserId');
    incise.scrwm = sessionStorage.getItem('currentScrwmId');
    this.inciseService.postIncise(incise)
    .subscribe(res => {
       this.Init();
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

  linkStereo1(incise: Incise){                               // linkea mutuamente el inciso cliqueado con el que estaba
    if (document.getElementById('E').textContent === ""){
      document.getElementById('E').textContent = "...";
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
  }

  linkStereo2(incise: Incise, A: Incise){
    this.inciseService.putIncise(A)
      .subscribe(res => {
      });
    switch (this.DirLast){
      case "Up":
        for(var i in incise.down){
          if(incise.down[i] === A._id){
            this.linkStereo3(A, incise);
            return;
          }
        }
        incise.down.push(A._id);
        break;
      case "Down":
        for(var i in incise.up){
          if(incise.up[i] === A._id){
            this.linkStereo3(A, incise);
            return;
          }
        }
        incise.up.push(A._id);
        break;
      case "Left":
        for(var i in incise.right){
          if(incise.right[i] === A._id){
            this.linkStereo3(A, incise);
            return;
          }
        }
        incise.right.push(A._id);
        break;
      case "Right":
        for(var i in incise.left){
          if(incise.left[i] === A._id){
            this.linkStereo3(A, incise);
            return;
          }
        }
        incise.left.push(A._id);
        break;
    }
    this.linkStereo3(A, incise);
  }

  linkStereo3(A: Incise, incise: Incise){
    this.inciseService.putIncise(incise)
      .subscribe(res => {
      });
    this.inciseService.selectedIncise = incise;
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      });
    this.toCenter();
  }

  exit(){
    this.scrwmService.selectedScrwm.inciseInit = this.inciseService.selectedIncise._id;
    this.scrwmService.putScrwm(this.scrwmService.selectedScrwm)
    .subscribe(res => {
      this.inciseService.selectedIncise = new Incise;
      this.router.navigate(['/tasks']);
    });
  }

}