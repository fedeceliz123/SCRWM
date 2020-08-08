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
import { CopyUrlComponent } from 'src/app/components/incises/copy-url/copy-url.component';
import { NewImageComponent } from 'src/app/components/incises/new-image/new-image.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';

import { ImageInc } from 'src/app/models/image-inc';
import { Incise } from 'src/app/models/incise';

import {MatDialog} from '@angular/material/dialog';

declare var M: any; 

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
})

export class IncisesComponent implements OnInit{   

  constructor(
    public inciseService: InciseService, 
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
    public imageIncService: ImageIncService,
    public authService: AuthService,
    public socketService: SocketService,
    public chatComponent: ChatComponent,
    public profileComponent: ProfileComponent,
  ){ route.params.subscribe(val => this.ngOnInit()) }

  ngOnInit(): void{
  }  
  
  @HostListener("window:keydown", ['$event']) spaceEvent(event: any){
    this.keyListener.readKey(event);
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
      this.deleteIncises(); 
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


  deleteIncises(){
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      for(var i in this.inciseService.incises){
        this.inciseService.deleteIncise(this.inciseService.incises[i]._id)
        .subscribe(res => {
          this.deleteImagesInc();
        });
      }
    });
  }

  deleteImagesInc(){
    this.imageIncService.getImages()
    .subscribe(res => {
      this.imageIncService.imagesInc = res as ImageInc[];
      for(var i in this.imageIncService.imagesInc){
        this.imageIncService.deleteImage(this.imageIncService.imagesInc[i]._id)
        .subscribe(res => {
        });
      }
    });
  }

  openDialogDelHashtag(hashtag: string){
    if(document.getElementById('E').isContentEditable){
      localStorage.setItem("HTag", hashtag);
      const dialogRef = this.dialog.open(DialogContent);
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  openDialogNewImageInc(){
    if(this.inciseService.selectedIncise._id){
      const dialogRef = this.dialog.open(NewImageComponent);
      dialogRef.afterClosed().subscribe(res => {
      });  
    } else {
      M.toast({html: "No incise being edited"})

    }
  }

  onenDialogCopyUrl(){
    if(this.inciseService.selectedIncise._id){
      const dialogRef = this.dialog.open(CopyUrlComponent);
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
