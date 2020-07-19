import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { ScrwmService } from 'src/app/services/scrwm.service';
import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';


import { EditAroundComponent } from 'src/app/components/incises/edit-around/edit-around.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { KeyListenerComponent } from 'src/app/components/incises/key-listener/key-listener.component';


import { Scrwm } from 'src/app/models/scrwm';

import {MatDialog} from '@angular/material/dialog';


declare var M: any; 

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
})

export class IncisesComponent {   

    constructor(public inciseService: InciseService, 
                public scrwmService: ScrwmService,
                public profService: ProfService,
                public editAroundComponent: EditAroundComponent,
                public showAround: ShowAroundComponent,
                public keyListener: KeyListenerComponent,
                public router: Router,
                public dialog: MatDialog              
    ){ }

  @HostListener("window:keydown", ['$event']) spaceEvent(event: any){
    if(event.keyCode === 13){
      this.showAround.DirLast = "Up";
      this.keyListener.editedIncise();
    } else if(event.ctrlKey){
      if(event.keyCode === 37){
        this.showAround.DirLast = "Right";
        this.keyListener.editedIncise();
      } else if(event.keyCode === 38){
        this.showAround.DirLast = "Down";
        this.keyListener.editedIncise();
      } else if(event.keyCode === 39){
        this.showAround.DirLast = "Left";
        this.keyListener.editedIncise();  
        //M.toast({html: "Please select what you want to comment after pressing Ctrl key"})
      } else if(event.keyCode === 40){
        this.showAround.DirLast = "Up";
        this.keyListener.editedIncise();
      }  
    }
  }

  onSelected(event: any){
    if(event.keyCode === 39){
      document.execCommand("forecolor", true, "green");
        //this.showAround.DirLast = "Left";
        //this.keyListener.editedIncise();  
      const selectedText = window.getSelection().toString().trim();
    }
  }

  zoomMin(){
    this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
    this.router.navigate(['/tasks']);
    this.showAround.toCenter(this.inciseService.selectedIncise);
    this.actualizeScrwm();
  }

  zoomMax(){
    this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
    this.showAround.toCenter(this.inciseService.selectedIncise);
    this.router.navigate(['/incises']);
    this.actualizeScrwm();
  }

  actualizeScrwm(){
    this.scrwmService.getScrwms()
    .subscribe(res =>{
      const A = this.scrwmService.scrwms = res as Scrwm [];
      for(var i in A){
        if(A[i]._id === sessionStorage.getItem('currentScrwmId')){
          this.showAround.getByScrwm(A[i]);
        }
      }
    });
  }

  addHashtag:boolean = false;

  HT(){
    if(document.getElementById('E').isContentEditable){
      document.getElementById('E').contentEditable = "false";
      this.addHashtag = true;
    } else {
      M.toast({html: "Not allowed to add a hashtag in this incise"});

    }
  }

  HT2(event: any, HTInput: any){
    if(event.keyCode === 32){
      this.addHashtag = false;
      document.getElementById('E').contentEditable = "true";
      if(HTInput.value){
        this.inciseService.selectedIncise.hashtag.push(HTInput.value);
        this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
        this.showAround.toCenter(this.inciseService.selectedIncise);
      }
    }
  }

  openDialogDelHashtag(hashtag: string){
    if(document.getElementById('E').isContentEditable){
      localStorage.setItem("HTag", hashtag);
      const dialogRef = this.dialog.open(DialogContent);
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  diamondSelected(event: any){
    if(!document.getElementById('E').isContentEditable){
      const I = this.inciseService.selectedIncise
      if(I._id){
        const F = this.profService.selectedProf.favIncises;
        for(var i in F){
          if(F[i] === I._id){
            const index = F.indexOf(i)+1;
            F.splice(index, 1);
            I.diamond --;
            document.getElementById('diamond').style.opacity = "0.1";
            return;
          }
        }
        F.push(I._id);
        I.diamond ++;
        document.getElementById('diamond').style.opacity = "1";
      }
    }
  }


}



@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})
export class DialogContent {

  constructor(public inciseService: InciseService, 
              public showAround: ShowAroundComponent,
  ){ }

  deleteHashtag(){
    const hashtag = localStorage.getItem("HTag");
    const A = this.inciseService.selectedIncise;
    for(var i in A.hashtag){
      if(A.hashtag[i] === hashtag){
        const index = A.hashtag.indexOf(i)+1;
        A.hashtag.splice(index, 1);
        A.content = document.getElementById('E').textContent;
        this.showAround.toCenter(A);
      }
    }
  }

}
