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
 
  // Cuando la aplicación inicia
  ngOnInit(): void { 
    this.getIncises();
  }

  deleteAll(){
    for (var i in this.inciseService.incises) {
      this.inciseService.deleteIncise(this.inciseService.incises[i]._id)
      .subscribe(res => {
        this.getIncises();
        const C = document.getElementById('E');
        C.textContent = "";
        C.focus();
        this.resetCenter();      
      });
    }
  }

  editIncise(incise: Incise){
    this.inciseService.selectedIncise = incise;
    this.linkIncisesDown(incise);
    const C = document.getElementById('E');
    C.textContent = incise.content;
    C.focus();
    this.showAbove(incise);
    this.showBelow(incise);
  }

  editedIncise(incise: Incise){
    if(this.Below[0]){
      incise.content = document.getElementById('E').textContent;
      this.inciseService.putIncise(incise)
      .subscribe(res => {
        this.getIncises();
        this.editIncise(this.Below[0]);
      });
    } else {
      incise.content = document.getElementById('E').textContent;
      this.inciseService.putIncise(incise)
      .subscribe(res => {
        this.getIncises();
        document.getElementById('E').textContent = "";
        this.resetCenter();      
      });
    }
  }

  followingIncise(incise: Incise){
    this.linkIncisesUp(incise);
    incise.content = document.getElementById('E').textContent;
    this.inciseService.postIncise(incise)
      .subscribe(res => {
        document.getElementById('E').textContent = "";
        this.getIncises();
      });
  }

  getIncises(){
    this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        if(this.inciseService.selectedIncise._id){
          return;
        } else {
          this.Above = [];
          this.Below = [];
          var Linkable = [];
          for (var i in this.inciseService.incises) {
            Linkable.push([i, this.inciseService.incises[i]]);
          }
          const linkable = Linkable.slice(-1)[0];
          if(linkable){
            this.Above.push(linkable[1]);
          }
        }
    });
  }

  linkIncisesDown(incise: Incise){
    const Linkable = this.inciseService.incises;
    for (var i in Linkable) {
      if (incise.up === Linkable[i]._id){
        Linkable[i].down = incise._id;
        this.inciseService.putIncise(Linkable[i])
        .subscribe(res => {
          this.getIncises();
          });
      };
    } 
  }

  linkIncisesUp(incise: Incise){
    var Linkable = [];
    for (var i in this.inciseService.incises) {
      Linkable.push([i, this.inciseService.incises[i]]);
    }
    const linkable = Linkable.slice(-1)[0];
    if(linkable){
      incise.up = linkable[1]._id;
    }
  }

  onKeypress(event: any, incise: Incise){
    if(incise._id){
      if (document.getElementById('E').textContent == ""){
        return;
      } else {
        this.editedIncise(incise);
      }
    } else {
      this.followingIncise(incise);
    }
  }

  Above: any = [];
  showAbove(incise: Incise){ 
    this.Above = [];
    const D = this.inciseService.incises;
    for (var i = 0; i < D.length; i++) {
      if(D[i]._id === incise.up){
        this.Above.push(D[i]);
      }
    }
  }

  Below: any = [];
  showBelow(incise: Incise){ 
    this.Below = [];
    const D = this.inciseService.incises;
    for (var i = 0; i < D.length; i++) {
      if(D[i]._id === incise.down){
        this.Below.push(D[i]);
      }
    }
  }

  resetCenter(){
    this.inciseService.selectedIncise = new Incise();
  }

}
