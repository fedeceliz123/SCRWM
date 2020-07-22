import { Component, OnInit } from '@angular/core';

import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';

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
  
  constructor(public inciseService: InciseService,
              public profService: ProfService,
              public imageService: ImageService,
  ){ }

  ngOnInit(): void {
  }

  toCenter(incise: Incise){ 
    this.inciseService.selectedIncise = incise;
    this.resetConstants();
    this.showAround(incise);
    this.isEditable(incise);
    this.setDiamond(incise);
    this.setImage(incise);
    this.showHashtag(incise);
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
      var q = 0;
      let color = "";
      document.getElementById('E').textContent = incise.content;
      for (var i in D){
        for(var j in incise.right){
          if(incise.right[j] === D[i]._id){
            if(D[i].left[0]){
              let C = document.getElementById('E').innerHTML; 
              //let A = C.substring(D[i].left[0].initial, D[i].left[0].final);
              let rep = C.replace(D[i].left[0].commt, (x) => {
                if(q === 0){
                  color = x.bold()
                } else if(q === 1){
                  color = x.fontcolor("bluish")
                } else if (q === 2){
                  color = x.fontcolor("black")
                } else if (q === 3){
                  color = x.fontcolor("gray")
                } else { x.fontcolor("yellow")};
                q ++;
                return color});              
              document.getElementById('E').innerHTML = rep;
            }
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

  setImage(incise: Incise){
    const I = this.imageService.images;
    for(var i in I){
      if(I[i].userId === this.inciseService.selectedIncise.prof){
        this.imageService.selectedImage = I[i];
      }
    }
  }
  
  showHashtag(incise: Incise){
    for(var i in incise.hashtag){
      this.Hashtags.push(incise.hashtag[i]);
    }
  }
}
