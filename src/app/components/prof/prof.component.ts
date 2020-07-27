import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { ImageIncService } from 'src/app/services/image-inc.service';
import { InciseService } from 'src/app/services/incise.service';
import { AuthService } from 'src/app/services/auth.service';

import { TasksComponent } from 'src/app/components/tasks/tasks.component';
import { TestingComponent } from 'src/app/components/testing/testing.component';

import { Prof } from 'src/app/models/prof';
import { Image } from 'src/app/models/image';
import { ImageInc } from 'src/app/models/image-inc';
import { Incise } from 'src/app/models/incise';

import {MatDialog} from '@angular/material/dialog';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var M: any;

@Component({
  selector: 'app-prof',
  templateUrl: './prof.component.html',
  styleUrls: ['./prof.component.css']
})

export class ProfComponent implements OnInit {

  constructor(public profService: ProfService,
              public imageService: ImageService,
              public imageIncService: ImageIncService,
              public authService: AuthService,
              public inciseService: InciseService,
              public taskComponent: TasksComponent,
              public testing: TestingComponent,
              public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.setUserImage();
  }

  imagePath: string;
  userId: string = sessionStorage.getItem('currentUserId');

  setUserImage(){
    this.imageService.getImages()
    .subscribe(res=>{
      const I = this.imageService.images = res as Image[]
      for(var i in I){
        if(I[i].userId === this.userId){
          this.imagePath = I[i].imagePath;
        }
      }
    })
  }

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

  updateProf(form: NgForm){
    this.testing.checkProf("prof 125");
    const prof = this.profService.userProf;
    prof.nickname = form.value.nickname;
    prof.state = form.value.state;
    prof.miniBio = form.value.miniBio;
    if(this.photoSel){
      this.deleteOldImages();
    }
    this.profService.putProf(prof)
    .subscribe(res => {
      this.taskComponent.getList();
      this.testing.checkProf("prof 137");
    });
  }

  deleteOldImages(){
    this.imageService.getImages()
    .subscribe(res => {
      const A = this.imageService.images = res as Image[];
      for(var i in A){
        if(A[i].userId === this.userId){
          this.imageService.deleteImage(A[i]._id)
          .subscribe(res=>{
          });
        }
      }
      this.chargeNewImage();
    });
  }

  chargeNewImage(){
    const A = this.imageService.selectedImage = new Image;
    A.userId = this.userId;
    this.imageService.postImage(A, this.file)
    .subscribe(res => {
      this.getImage();
    });
  }

  getImage(){
    this.imageService.getImages()
    .subscribe(res => {
      const A = this.imageService.images = res as Image[];
      for(var i in A){
        if(A[i].userId === sessionStorage.getItem('currentUserId')){
          this.imageService.selectedImage = A[i];
          return
        }
      }
    });
  }

  findProf(userId: string){
    console.log("(findProf)");
    this.profService.getProfs()
    .subscribe(res => {
      const P = this.profService.profs = res as Prof[];
      for(var i in P){
        if(P[i].userId === userId){
          this.profService.userProf = P[i];
          this.testing.checkProf("prof 51");
          return
        }
      }
      this.newProf(userId);
    });
  }

  username: string;

  newProf(userId: string){
    console.log("(newProf)");
    const prof = this.profService.userProf = new Prof;
    prof.userId = userId;
    prof.nickname = this.username;
    this.profService.postProf(prof)
    .subscribe(res => {
      this.profService.userProf = res as Prof;
      this.testing.checkProf("prof 66");
      this.findProf(userId);
      this.firstIncise();
    });
  }

  firstIncise(){
    console.log("(firstIncise)");
    const I = this.inciseService.selectedIncise = new Incise;
    I.prof = sessionStorage.getItem('currentUserId');
    I.title = "My first Scrwm";
    I.subtitle = "Click on Set Header in the navBar above to modify us"
    this.inciseService.postIncise(I)
    .subscribe(res => {
      this.inciseService.selectedIncise = res as Incise;
      this.taskComponent.getList();
    });
  }

  deleteProfs(){
    this.profService.getProfs()
    .subscribe(res => {
      this.profService.profs = res as Prof[];
      for(var i in this.profService.profs){
        this.profService.deleteProf(this.profService.profs[i]._id)
        .subscribe(res => {
        });
      }
      this.deleteIncises();
      this.deleteImages();
      this.deleteImagesInc();

    });
  }

  deleteIncises(){
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      for(var i in this.inciseService.incises){
        this.inciseService.deleteIncise(this.inciseService.incises[i]._id)
        .subscribe(res => {
        });
      }
    });
  }

  deleteImages(){
    this.imageService.getImages()
    .subscribe(res => {
      this.imageService.images = res as Image[];
      for(var i in this.imageService.images){
        this.imageService.deleteImage(this.imageService.images[i]._id)
        .subscribe(res => {
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

  scrwm: any;
  
  seeProf() {
    for(var i in this.taskComponent.taskList){
      if(this.taskComponent.taskList[i].incise === this.inciseService.selectedIncise){
        this.scrwm = this.taskComponent.taskList[i];
        this.openDialog();
      }
    }
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogPublicProf);
    dialogRef.afterClosed().subscribe(result => {
      });
      return; 
    } 

  editProf() {
    const dialogRef = this.dialog.open(ProfComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
    return; 
  }  

}


@Component({
  selector: 'dialog-public-prof',
  templateUrl: 'dialog-public-prof.html',
  styleUrls: ['./dialog-public-prof.css']
})
export class DialogPublicProf implements OnInit{

  constructor(public inciseService: InciseService,
              public taskComponent: TasksComponent,
              public profComponent: ProfComponent,
              public profService: ProfService,
  ){}

  ngOnInit(): void {
    this.setDiamods();
  }

  diamond: number;
  isFoll: boolean;
  selProf = this.profComponent.scrwm.prof;
  userProf = this.profService.userProf;

  setDiamods(){
    let count = 0
    this.inciseService.getIncises()
    .subscribe(res=>{
      const A = this.inciseService.incises = res as Incise[];
      for(var i in A){
        if(A[i].prof === this.selProf.userId){
          if(A[i].diamond){
            count = count + A[i].diamond;
          }
        }
      }
      this.diamond = count;   
     })
  }

  isFollowing(){
    const F = this.profService.userProf.following;
    for(var i in F){
      if(F[i] === this.selProf._id){
        this.isFoll = true;
        return this.isFoll;
      }
    }
    this.isFoll = false;
  }

  followness(form: NgForm){
    const F = this.userProf.following;
    if(form.value.event === true){
      for(var i in F){
        if(F[i] === this.selProf._id){
          return
        }
      }
      this.selProf.followers ++;
      F.push(this.selProf._id);
      this.saveProfs(this.selProf, this.userProf);
    }
    if(form.value.event === false){
      for(var i in F){
        if(F[i] === this.selProf._id){
          this.selProf.followers --;
          const index = F.indexOf(i)+1;
          F.splice(index, 1);
          this.saveProfs(this.selProf, this.userProf);
        }
      }
    }
  }

  saveProfs(selProf: Prof, userProf: Prof){
    console.log(selProf, userProf)
    this.profService.putProf(selProf)
    .subscribe(res=>{})
    this.profService.putProf(userProf)
    .subscribe(res=>{})
  }

}


