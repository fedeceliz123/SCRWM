import { Component, OnInit, Input } from '@angular/core';
import { InciseService } from '../../services/incise.service';
import { NgForm, NgModel } from '@angular/forms';
import { Incise } from 'src/app/models/incise';
import { AttrAst } from '@angular/compiler';

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

  getIncises(){
    this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.sortById(Incise);
      });
  }

  sortById(Incise){
  console.log(Incise.sort(function(a,b){
        if (a._id < b._id){ return 1 }
        if (a._id > b._id){ return -1}
        return 0; 
      }));
    }

  editIncise(incise: Incise){
    this.inciseService.selectedIncise = incise;
    const C = document.getElementById('E')
    C.textContent = incise.content;
    C.focus();
  }

  onKeypress(event: any, Incise: Incise){
      if(Incise._id){
        if (document.getElementById('E').textContent == ""){
          this.deleteIncise(Incise._id);
        } else {
          this.editedIncise(Incise);
        }
      } else {
        this.followingIncise(Incise);
      }
  }

  followingIncise(Incise: Incise){
    Incise.content = document.getElementById('E').textContent;
    this.inciseService.postIncise(Incise)
      .subscribe(res => {
        document.getElementById('E').textContent = "";
        this.getIncises();
      });
  }

  editedIncise(Incise: Incise){
    Incise.content = document.getElementById('E').textContent;
    this.inciseService.putIncise(Incise)
    .subscribe(res => {
      this.getIncises();
      document.getElementById('E').textContent = "";
      this.resetCenter();
      });
    }

  deleteIncise(_id: string){
//  if(confirm('Are you sure?')){
    this.inciseService.deleteIncise(_id)
      .subscribe(res => {
      this.resetCenter();
      this.getIncises();    
    });
//  }
  }

  resetCenter(){
    this.inciseService.selectedIncise = new Incise();
  }

}
