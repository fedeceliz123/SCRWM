import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { ImageIncService } from 'src/app/services/image-inc.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

import { EditAroundComponent } from 'src/app/components/incises/edit-around/edit-around.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { KeyListenerComponent } from 'src/app/components/incises/key-listener/key-listener.component';
import { TasksComponent } from 'src/app/components/tasks/tasks.component';
import { TestingComponent } from 'src/app/components/testing/testing.component';
import { ProfComponent } from 'src/app/components/prof/prof.component';
import { ChatComponent } from 'src/app/components/chat/chat.component';

import { Comm } from 'src/app/models/comm';
import { ImageInc } from 'src/app/models/image-inc';


import {MatDialog} from '@angular/material/dialog';

declare var M: any; 

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
})

export class IncisesComponent implements OnInit{   

    constructor(public inciseService: InciseService, 
                public profService: ProfService,
                public imageService: ImageService,
                public editAroundComponent: EditAroundComponent,
                public showAround: ShowAroundComponent,
                public keyListener: KeyListenerComponent,
                public taskComponent: TasksComponent,
                public testing: TestingComponent,
                public profComponent: ProfComponent,
                public router: Router,
                private route: ActivatedRoute,
                public dialog: MatDialog,
                public newImageInc: DialogNewImageInc,
                public imageIncService: ImageIncService,
                public authService: AuthService,
                public socketService: SocketService,
                public chatComponent: ChatComponent,
    ){ route.params.subscribe(val => this.ngOnInit()) }

    ngOnInit(): void{
    }
  

  @HostListener("window:keydown", ['$event']) spaceEvent(event: any){


    if(this.authService.loggedIn()){
      if(event.keyCode === 13){   
        if(window.getSelection().toString() != ""){
          this.ToComment(window.getSelection());
        } else {
          this.showAround.DirLast = "Up";
          this.keyListener.editedIncise();  
        }
      } else if(event.shiftKey){
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
  }

  ToComment(event: any){
    if(this.authService.loggedIn()){
      const comm = new Comm;
      comm.commt = event.toString().trim();
      comm.initial = event.getRangeAt(0).startOffset;
      comm.final = event.getRangeAt(0).endOffset;
      comm.IdComm = this.inciseService.selectedIncise._id;
      this.showAround.DirLast = "Left";
      this.keyListener.editedIncise(comm);    
    }
  }

  zoomMin(){
    this.router.navigate(['/tasks']);
    this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
    this.showAround.toCenter(this.inciseService.selectedIncise);
  }

  zoomMax(){
    if(this.authService.loggedIn()){
      this.router.navigate(['/incises']);
      this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
      this.showAround.toCenter(this.inciseService.selectedIncise);  
    }
  }

  
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
      if(HTInput.value){
        this.inciseService.selectedIncise.hashtag.push(HTInput.value);
        this.inciseService.selectedIncise.content = document.getElementById('E').textContent;
        this.showAround.toCenter(this.inciseService.selectedIncise);
      }
      document.getElementById('E').contentEditable = "true";
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
      const I = this.inciseService.selectedIncise;
      if(I._id){
        this.testing.checkProf("incises 132");
        const P = this.profService.userProf;
        let index = 0;
        while(P.favIncises[index]){
          if(P.favIncises[index] === I._id){
            P.favIncises.splice(index, 1);
            I.diamond --;
            document.getElementById('diamond').style.opacity = "0.1";
            this.updateProf();
            return;
          }
          index++;
        }
        P.favIncises.push(I._id);
        I.diamond ++;
        document.getElementById('diamond').style.opacity = "1";
        this.updateProf();
      }  
    }
  }

  anchorSelected(){
    const I = this.inciseService.selectedIncise;
    if(I._id){
      this.testing.checkProf("incises 153");
      const P = this.profService.userProf;
      let index = 0;
      while (P.anchors[index]){
        if(P.anchors[index] === I._id){
          P.anchors.splice(index, 1);
          document.getElementById('anchor').style.opacity = "0.1";
          this.updateProf();
          return;
        }
        index++;
      }
      P.anchors.push(I._id);
      document.getElementById('anchor').style.opacity = "1";
      this.updateProf();
    }  
  }

  updateProf(){
    this.profService.putProf(this.profService.userProf)
    .subscribe (res => {
    });
  }

  openDialogNewImageInc(){
    if(this.inciseService.selectedIncise._id){
      const dialogRef = this.dialog.open(DialogNewImageInc);
      dialogRef.afterClosed().subscribe(res => {
      });  
    } else {
      M.toast({html: "No incise being edited"})

    }
  }

  onenDialogCopyUrl(){
    if(this.inciseService.selectedIncise._id){
      const dialogRef = this.dialog.open(DialogCopyUrl);
      dialogRef.afterClosed().subscribe(res => {
      });  
    } else {
      M.toast({html: "Please select a Scrwm from the lateral right panel"})
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


@Component({
  selector: 'dialog-new-image',
  templateUrl: 'dialog-new-image.html',
})
export class DialogNewImageInc implements OnInit{

  constructor(public inciseService: InciseService,
              public imageIncService: ImageIncService,
              public showAround: ShowAroundComponent,
  ){ }


  ngOnInit(): void {
  }

  imageIncPath: string = this.showAround.ImageIncPath;

  file: File;
  photoSel: string | ArrayBuffer;

  onPhotoSelected(event: HTMLInputEvent): void {
    if(event.target.files && event.target.files[0]){    // confirma si existe un archivo subido
      this.file = <File>event.target.files[0];          // guarda el archivo en file
      const reader = new FileReader();                   // para que se vea en pantalla
      reader.onload = e => this.photoSel = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  insertImageInc(){
    if(this.photoSel){
      this.imageIncService.getImages()
      .subscribe(res => {
        const A = this.imageIncService.imagesInc = res as ImageInc[];
        for(var i in A){
          if(A[i].associatedIncId === this.inciseService.selectedIncise._id){
            this.imageIncService.deleteImage(A[i]._id)
            .subscribe(res=>{
            });
          }
        }
        this.chargeNewImageInc();
      });  
    }
  }

  chargeNewImageInc(){
    const A = this.imageIncService.selectedImageInc = new ImageInc;
    A.associatedIncId = this.inciseService.selectedIncise._id;
    A.userId = sessionStorage.getItem('currentUserId');
    this.imageIncService.postImage(A, this.file)
    .subscribe(res => {
      this.getImage();
    });
  }

  getImage(){
    this.imageIncService.getImages()
    .subscribe(res => {
      const A = this.imageIncService.imagesInc = res as ImageInc[];
      for(var i in A){
        if(A[i].associatedIncId = this.inciseService.selectedIncise._id){
          this.imageIncService.selectedImageInc = A[i];
          this.showAround.toCenter(this.inciseService.selectedIncise);
          return
        }
      }
    });
  }
}



@Component({
  selector: 'dialog-copy-url',
  templateUrl: 'dialog-copy-url.html',
})
export class DialogCopyUrl {

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
