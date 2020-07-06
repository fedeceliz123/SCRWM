import { Component, OnInit } from '@angular/core';
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
  
  constructor(public inciseService: InciseService, 
              public scrwmService: ScrwmService,
              private router: Router,
              ){ }

  ngOnInit(): void {
    this.findInciseInit();
  }

  findInciseInit(){
    console.log("1");
    this.scrwmService.getScrwms()
    .subscribe(res => {   
      this.scrwmService.scrwms = res as Scrwm[];
      for(var i in this.scrwmService.scrwms){
        if(this.scrwmService.scrwms[i]._id === sessionStorage.getItem('currentScrwmId')){
          console.log("2");
          this.scrwmService.selectedScrwm = this.scrwmService.scrwms[i];
          this.inciseService.getIncises()
          .subscribe(res => {
            console.log("3");
            this.inciseService.incises = res as Incise[];
            for(var j in this.inciseService.incises){
              console.log("4");
              if(this.inciseService.incises[j]._id === this.scrwmService.selectedScrwm.inciseInit){
                this.inciseService.selectedIncise = this.inciseService.incises[j];
                console.log("5");
                this.toCenter();
              }
            }
          }); 
        }
      }
    });
  }


  Init(){      
      console.log("Init");
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
    for (var i = 0; i < D.length; i++){
      switch(D[i]._id){
        case incise.down:
          this.Below.push(D[i]);
          break;
        case incise.left:
          this.Left.push(D[i]);
          break;
        case incise.right:
          this.Right.push(D[i]);
          break;
        case incise.up:
          this.Above.push(D[i]);
          break;
      }
    }
  }

  onKeypress(event: any){           //Cuando se presiona Enter
    this.DirLast = "Up";
    this.editedIncise();
  } 

  inciseComment(iCommented: Incise){        //genera comentario lateral
    this.DirLast = "Left";
    this.editedIncise();
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
    this.linkStereo(incise);
  }  

  linkStereo(incise: Incise){                               // linkea mutuamente el inciso cliqueado con el que estaba
    if (document.getElementById('E').textContent === ""){
      document.getElementById('E').textContent = "...";
    };
    const A = this.inciseService.selectedIncise;
    A.content = document.getElementById('E').textContent;
    switch (this.DirLast){
      case "Up":
        A.up = incise._id;
        break;
      case "Down":
        A.down = incise._id;
        break;
          case "Left":
        A.left = incise._id;
        break;
        case "Right":
          A.right = incise._id;
          break;
    }
    this.inciseService.putIncise(A)
      .subscribe(res => {
      });
    switch (this.DirLast){
      case "Up":
        incise.down = A._id;
        break;
      case "Down":
        incise.up = A._id;
        break;
      case "Left":
        incise.right = A._id;
        break;
      case "Right":
        incise.left = A._id;
        break;
    }
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