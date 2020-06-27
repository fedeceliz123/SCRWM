import { Component, OnInit } from '@angular/core';
import { InciseService } from '../../services/incise.service'
import { Incise } from 'src/app/models/incise';

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
  providers: [InciseService]
})
export class IncisesComponent implements OnInit {

  constructor(public inciseService: InciseService) { }
 
  //Constants
  Above: any = [];
  Below: any = [];
  Left: any = [];
  Right: any = [];
  DirLast: any = "";
  IdLast: any = "";

  ngOnInit(): void {
    this.Init();
  }

  deleteAll(){
    console.log("(deleteAll)");
    for (var i in this.inciseService.incises) {
      this.inciseService.deleteIncise(this.inciseService.incises[i]._id)
      .subscribe(res => {
        document.getElementById('E').textContent = "";
      });
    }
    this.Above = [];
    this.Below = [];
    this.Left = [];
    this.Right = [];
    this.DirLast = "";
    this.IdLast = "";
    this.Init();
  }

  Init(){
    console.log("(Init)");
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      if(this.inciseService.incises.slice(-1)[0]){
        this.inciseService.selectedIncise = this.inciseService.incises.slice(-1)[0];
      } else {
        this.inciseService.postIncise(this.inciseService.selectedIncise)
        .subscribe(res => {
        });
    }
    this.toCenter(this.inciseService.selectedIncise);
    });
  }

  toCenter(incise: Incise){
    console.log("(toCenter)");
    const C = document.getElementById('E');
    C.textContent = incise.content;
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      C.focus();
      this.showAround(incise);
      });
  }

  showAround(incise: Incise){ 
    this.Above = [];
    this.Below = [];
    this.Left = [];
    this.Right = [];
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




  onKeypress(event: any){
    console.log("(onKeypress)");
    if (document.getElementById('E').textContent != ""){
      this.editedIncise();
    }
  }

  editedIncise(){
    console.log("(editedIncise)");
    const incise = this.inciseService.selectedIncise;
    this.IdLast = incise._id;
    incise.content = document.getElementById('E').textContent;
    this.inciseService.putIncise(incise)
      .subscribe(res => {
        this.inciseService.selectedIncise = new Incise();
        this.linkUp();
        this.showUp();
    });
  }

  linkUp(){
    console.log("(linkUp)");
    const incise = this.inciseService.selectedIncise;
    if(this.IdLast){
      incise.up = this.IdLast;
    }
    this.inciseService.postIncise(incise)
    .subscribe(res => {
      this.Init();
    });
  }

  showUp(){
    console.log("(showUp)");
    this.Above = [];
    for (var i in this.inciseService.incises) {
      if(this.inciseService.incises[i]._id === this.IdLast){
        this.Above.push(this.inciseService.incises[i]); 
      }
    }
    document.getElementById('E').textContent = "";
  }




  editUp(incise: Incise){
    console.log("(editUp)")
    this.linkCruzado(incise);
    this.toCenter(incise);
  }  

  linkCruzado(incise: Incise){
    console.log("(linkCruzado)");
    const C = document.getElementById('E');
    console.log(C.textContent);
    if (C.textContent === ""){
      C.textContent = "Keep editing...";
    };
    this.inciseService.selectedIncise.content = C.textContent;
    this.inciseService.selectedIncise.up = incise._id;
    this.inciseService.putIncise(this.inciseService.selectedIncise)
      .subscribe(res => {
      });
    incise.down = this.inciseService.selectedIncise._id;
    this.inciseService.putIncise(incise)
      .subscribe(res => {
      });
    this.inciseService.selectedIncise = incise;
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      });
  }




editDown(incise: Incise){
  console.log("(editDown)")
  this.linkDown(incise);
  this.toCenter(incise);
}


linkDown(incise: Incise){
  console.log("(linkCruzado)");
  const C = document.getElementById('E');
  console.log(C.textContent);
  if (C.textContent === ""){
    C.textContent = "Keep editing...";
  };
  this.inciseService.selectedIncise.content = C.textContent;
  this.inciseService.selectedIncise.down = incise._id;
  this.inciseService.putIncise(this.inciseService.selectedIncise)
    .subscribe(res => {
    });
  incise.up = this.inciseService.selectedIncise._id;
  this.inciseService.putIncise(incise)
    .subscribe(res => {
    });
  this.inciseService.selectedIncise = incise;
  this.inciseService.getIncises()
  .subscribe(res => {
    this.inciseService.incises = res as Incise[];
    });
}





  inciseComment(iCommented: Incise){
    if(iCommented._id){
      const C = document.getElementById('E');
      iCommented.content = C.textContent;
      this.inciseService.putIncise(iCommented)
      .subscribe(res => {
        C.textContent = "";
        C.focus();
        this.inciseService.selectedIncise = new Incise();
        const incise = this.inciseService.selectedIncise;
  /*      this.linkIncisesLeft(iCommented, incise);
        this.showAbove(incise);
        this.showBelow(incise);
        this.showLeft(incise);
        this.showRight(incise);*/
      });
    } else {
    }
  }
  
  editIncise(incise: Incise){
  }

}
