import { Component, OnInit } from '@angular/core';
import { InciseService } from 'src/app/services/incise.service';

import { Incise } from 'src/app/models/incise';
import { Scrwm } from 'src/app/models/scrwm';


@Component({
  selector: 'app-show-around',
  templateUrl: './show-around.component.html',
  styleUrls: ['./show-around.component.css']
})
export class ShowAroundComponent implements OnInit {

  Above: any = [];
  Below: any = [];
  Left: any = [];
  Right: any = [];
  DirLast: any = "";
  IdLast: any = "";

  constructor(public inciseService: InciseService, 
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
  }

}
