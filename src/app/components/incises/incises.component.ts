import { Component, OnInit } from '@angular/core';
import { InciseService } from '../../services/incise.service'
import { Incise } from 'src/app/models/incise';
import { BrowserStack } from 'protractor/built/driverProviders';

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

  deleteAll(){                          // Tiene bugs
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

  Init(){                          //Cuando se actualiza la página. Crea un Inciso si no lo hay
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

  toCenter(incise: Incise){                          //Muestra en el centro el inciso actual
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

  showAround(incise: Incise){                           //Muestra los incisos al rededor
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




  onKeypress(event: any){                           //Cuando se aprieta Enter
    console.log("(onKeypress)");
    this.DirLast = "Up";
    if (document.getElementById('E').textContent != ""){
      this.editedIncise();
    }
  }

  editedIncise(){                           //El inciso central se graba
    console.log("(editedIncise)");
    const incise = this.inciseService.selectedIncise;
    this.IdLast = incise._id;
    incise.content = document.getElementById('E').textContent;
    this.inciseService.putIncise(incise)
      .subscribe(res => {
        this.inciseService.selectedIncise = new Incise();
        this.linkAll();
        this.showAll();
    });
  }

  linkAll(){                           // el inciso central se linkea con otro
    console.log("(linkAll)");
    const incise = this.inciseService.selectedIncise;
    switch(this.DirLast){
      case "Up":
        if(this.IdLast){
          incise.up = this.IdLast;
        }
        break;
      case "Down":
        if(this.IdLast){
          incise.down = this.IdLast;
        }
        break;
      case "Left":
        if(this.IdLast){
          incise.left = this.IdLast;
        }
        break;
      case "Right":
        if(this.IdLast){
          incise.right = this.IdLast;
        }
        break;
    }
    this.inciseService.postIncise(incise)
    .subscribe(res => {
      this.Init();
    });
  }

  showAll(){                           //TODO: fusionar con showaround
    console.log("(showAll)");
    this.Above = [];
    this.Below = [];
    this.Left = [];
    this.Right = [];
    for (var i in this.inciseService.incises) {
      if (this.inciseService.incises[i]._id === this.IdLast){
        switch(this.DirLast){
          case "Up":
            this.Above.push(this.inciseService.incises[i]);
            break;
          case "Down":
            this.Below.push(this.inciseService.incises[i]);
            break;
          case "Left":
            this.Left.push(this.inciseService.incises[i]);
            break;
          case "Right":
            this.Right.push(this.inciseService.incises[i]);
            break; 
        }
      }
    }
    document.getElementById('E').textContent = "";
  }




  editUp(incise: Incise){                           //cuando cliqueo arriba un inciso guardado
    console.log("(editUp)")
    this.linkCruzado(incise);
    this.toCenter(incise);
  }  

  linkCruzado(incise: Incise){                           // linkea el inciso cliqueado con el que estaba
    console.log("(linkCruzado)");
    const C = document.getElementById('E');
    console.log(C.textContent);
    if (C.textContent === ""){
      C.textContent = "...";
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




  editDown(incise: Incise){                           //cuando cliquea un inciso de abajo
    this.linkDown(incise);
    this.toCenter(incise);
  }

  editLeft(incise: Incise){                           //cuando cliquea un inciso de abajo
    this.linkLeft(incise);
    this.toCenter(incise);
  }

  editRight(incise: Incise){                           //cuando cliquea un inciso de abajo
    this.linkRight(incise);
    this.toCenter(incise);
  }


  linkDown(incise: Incise){                           // TODO: fusionar con Link cruzado
    console.log("(linkCruzado)");
    const C = document.getElementById('E');
    console.log(C.textContent);
    if (C.textContent === ""){
      C.textContent = "...";
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

  linkLeft(incise: Incise){                           // TODO: fusionar con Link cruzado
    console.log("(linkCruzado)");
    const C = document.getElementById('E');
    console.log(C.textContent);
    if (C.textContent === ""){
      C.textContent = "...";
    };
    this.inciseService.selectedIncise.content = C.textContent;
    this.inciseService.selectedIncise.left = incise._id;
    this.inciseService.putIncise(this.inciseService.selectedIncise)
      .subscribe(res => {
      });
    incise.right = this.inciseService.selectedIncise._id;
    this.inciseService.putIncise(incise)
      .subscribe(res => {
      });
    this.inciseService.selectedIncise = incise;
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      });
  }

  linkRight(incise: Incise){                           // TODO: fusionar con Link cruzado
    console.log("(linkCruzado)");
    const C = document.getElementById('E');
    console.log(C.textContent);
    if (C.textContent === ""){
      C.textContent = "...";
    };
    this.inciseService.selectedIncise.content = C.textContent;
    this.inciseService.selectedIncise.right = incise._id;
    this.inciseService.putIncise(this.inciseService.selectedIncise)
      .subscribe(res => {
      });
    incise.left = this.inciseService.selectedIncise._id;
    this.inciseService.putIncise(incise)
      .subscribe(res => {
      });
    this.inciseService.selectedIncise = incise;
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      });
  }


  inciseComment(iCommented: Incise){                           //genera comentario nuevo
    console.log("(inciseComment)");
    this.DirLast = "Left";
    this.editedIncise();
    }
  
  
  editIncise(incise: Incise){
  }

}
