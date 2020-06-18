import { Component, OnInit } from '@angular/core';
import { InciseService } from '../../services/incise.service';
import { NgForm } from '@angular/forms';
import { Incise } from 'src/app/models/incise';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
  providers: [InciseService]
})
export class IncisesComponent implements OnInit {

  constructor(public inciseService: InciseService ) { }
  
  // Cuando la aplicación inicia
  ngOnInit(): void { 
    this.getIncises();
  }

  getIncises(){
    this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
      });
  }

  newIncise(event: any, Incise: Incise){
    if (event.key == 'Enter') {
      Incise.content = document.getElementById('E').textContent;
      this.inciseService.postIncise(Incise)
      .subscribe(res => {
      this.getIncises();
      document.getElementById('E').textContent = "";
      });
    }
  }

  editIncise(incise: Incise){
    const ID = incise._id;
    this.inciseService.selectedIncise = incise;
    const C = document.getElementById('E')
    C.textContent = incise.content;
    C.focus();
    this.inciseService.deleteIncise(incise._id)
      .subscribe(res => {
      this.getIncises();       
      });
  }

}
