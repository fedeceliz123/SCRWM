import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { InciseService } from 'src/app/services/incise.service';

import { TasksComponent } from 'src/app/components/tasks/tasks.component';
import { TestingComponent } from 'src/app/components/testing/testing.component';

import { Prof } from 'src/app/models/prof';
import { Image } from 'src/app/models/image';
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

  newProf(userId: string){
    console.log("(newProf)");
    const prof = this.profService.userProf = new Prof;
    prof.userId = userId;
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

  setDiamods(){
    let count = 0
    for(var i in this.taskComponent.taskList){
      if(this.taskComponent.taskList[i].incise.prof === this.profService.userProf.userId){
        if(this.taskComponent.taskList[i].incise.diamond){
          console.log(this.taskComponent.taskList[i].incise.diamond)
          count = count + this.taskComponent.taskList[i].incise.diamond;
        }
      }
    }
    this.diamond = count;
  }

  isFoll: boolean;

  isFollowing(){
    const selProf = this.profComponent.scrwm.prof;
    const F = this.profService.userProf.following;
    for(var i in F){
      if(F[i] === selProf._id){
        this.isFoll = true;
        return this.isFoll;
      }
    }
    this.isFoll = false;
  }

  followness(form: NgForm){
    const selProf = this.profComponent.scrwm.prof;
    const userProf = this.profService.userProf;
    if(form.value.event === true){
      for(var i in userProf.following){
        if(userProf.following[i] === selProf._id){
          return
        }
      }
      selProf.followers ++;
      userProf.following.push(selProf._id);
      this.saveProfs(selProf, userProf);
    }
    if(form.value.event === false){
      for(var i in userProf.following){
        if(userProf.following[i] === selProf._id){
          selProf.followers --;
          const index = userProf.following.indexOf(i)+1;
          userProf.following.splice(index, 1);
          this.saveProfs(selProf, userProf);
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


