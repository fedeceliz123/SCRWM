import { Component, OnInit } from '@angular/core';
import { InciseService } from '../../services/incise.service'
import { Incise } from 'src/app/models/incise';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user'

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
  providers: [InciseService]
})
export class IncisesComponent implements OnInit {

  Above: any = [];
  Below: any = [];
  Left: any = [];
  Right: any = [];
  DirLast: any = "";
  IdLast: any = "";
  
  constructor(public inciseService: InciseService, public authService: AuthService) { }

  ngOnInit(): void {
    this.Init();
  }

  Init(){                                //Cuando se actualiza la página. Crea un Inciso si no lo hay
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

  toCenter(incise: Incise){                 //Muestra en el centro el inciso actual
    const C = document.getElementById('E');
    C.textContent = incise.content;
    this.inciseService.getIncises()
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
    this.inciseService.postIncise(incise)
    .subscribe(res => {
      this.Init();
    });
  }

  editUp(incise: Incise){                //cuando cliqueo arriba un inciso guardado
    this.DirLast = "Up";
    this.linkStereo(incise);
  }  
  
  editDown(incise: Incise){               //cuando cliquea un inciso de abajo
    this.DirLast = "Down";
    this.linkStereo(incise);
  }

  editLeft(incise: Incise){               //cuando cliquea un inciso de abajo
    this.DirLast = "Left";
    this.linkStereo(incise);
  }

  editRight(incise: Incise){             //cuando cliquea un inciso de abajo
    this.DirLast = "Right";
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
    this.toCenter(incise);
  }
  
}