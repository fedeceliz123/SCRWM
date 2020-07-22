import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';

import { EditAroundComponent } from 'src/app/components/incises/edit-around/edit-around.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { KeyListenerComponent } from 'src/app/components/incises/key-listener/key-listener.component';
import { TasksComponent } from 'src/app/components/tasks/tasks.component';

import { Comm } from 'src/app/models/comm';
import { Incise } from 'src/app/models/incise';

import {MatDialog} from '@angular/material/dialog';

declare var M: any; 

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
})

export class IncisesComponent {   

    constructor(public inciseService: InciseService, 
                public profService: ProfService,
                public imageService: ImageService,
                public editAroundComponent: EditAroundComponent,
                public showAround: ShowAroundComponent,
                public keyListener: KeyListenerComponent,
                public taskComponent: TasksComponent,
                public router: Router,
                public dialog: MatDialog,
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
        M.toast({html: "Please select what you want to comment after pressing Ctrl key"})
      } else if(event.keyCode === 40){
        this.showAround.DirLast = "Up";
        this.keyListener.editedIncise();
      }
    }
  }

  ToLeft(event: any){
    if(event.ctrlKey){
      const comm = new Comm;
      comm.substring = window.getSelection().toString().trim();
      comm.final = window.getSelection().getRangeAt(0).startOffset;
      comm.final = window.getSelection().getRangeAt(0).endOffset;
      comm.IdComm = this.inciseService.selectedIncise._id;
      this.showAround.DirLast = "Left";
      this.keyListener.editedIncise(comm);
    }
  }

  zoomMin(){
    this.router.navigate(['/tasks']);
    this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
    this.showAround.toCenter(this.inciseService.selectedIncise);
    this.taskComponent.getList();
  }

  zoomMax(incise: Incise){
    incise.content = document.getElementById('E').textContent;
    this.showAround.toCenter(incise);
    this.router.navigate(['/incises']);

  }

  /*
  getByScrwm(scrwm: Scrwm){
    sessionStorage.setItem('currentScrwmId', scrwm._id);
    this.inciseService.getIncises()
    .subscribe(res =>{
      const I = this.inciseService.incises = res as Incise[];
      for(var i in I){
        if(I[i]._id === scrwm.inciseInit){
          this.inciseService.putIncise(this.inciseService.selectedIncise)
          .subscribe(res =>{
          });
          this.inciseService.selectedIncise = I[i];
          this.toCenter(this.inciseService.selectedIncise); 
        }
      }
    });*/





  addHashtag:boolean = false;

  HT(){
    if(document.getElementById('E').isContentEditable){
      document.getElementById('E').contentEditable = "false";
      this.addHashtag = true;
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

  diamondSelected(){
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

  anchorSelected(){
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
