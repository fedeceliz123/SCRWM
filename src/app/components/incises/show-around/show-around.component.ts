import { Component, OnInit } from '@angular/core';

import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';

import { Incise } from 'src/app/models/incise';

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
  Hashtags: any = [];
  DirLast: any = "";
  IdLast: any = "";
  
  constructor( public inciseService: InciseService,
               public profService: ProfService
  ){ }

  ngOnInit(): void {
  }

  toCenter(incise: Incise){ 
    this.inciseService.selectedIncise = incise;
    document.getElementById('E').textContent = incise.content;
    this.resetConstants();
    this.showHashtag(incise);
    this.showAround(incise);
    this.isEditable(incise);
    this.setDiamond(incise);
  }

  resetConstants(){
    this.Above = [];
    this.Below = [];
    this.Left = [];
    this.Right = [];
    this.Hashtags = [];
    this.DirLast = "";
    this.IdLast = "";
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
          if(incise.left[l].IdComm === D[i]._id){
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

  isEditable(incise: Incise){
    if(incise.prof === sessionStorage.getItem('currentUserId')){
      document.getElementById('E').contentEditable = "true";
      document.getElementById('E').focus();
    } else {
      document.getElementById('E').contentEditable = "false";
    }
  }

  showHashtag(incise: Incise){
    for(var i in incise.hashtag){
      this.Hashtags.push(incise.hashtag[i]);
    }
  }

  setDiamond(incise: Incise){
    const F = this.profService.selectedProf.favIncises;
    for(var i in F){
      if(F[i] === incise._id){
        document.getElementById('diamond').style.opacity = "1";
        return
      }
    }
    document.getElementById('diamond').style.opacity = "0.1";  
  }  


}
