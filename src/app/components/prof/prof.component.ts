import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { ImageIncService } from 'src/app/services/image-inc.service';
import { InciseService } from 'src/app/services/incise.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

import { TasksComponent } from 'src/app/components/tasks/tasks.component';
import { TestingComponent } from 'src/app/components/testing/testing.component';

import { Prof } from 'src/app/models/prof';
import { Image } from 'src/app/models/image';
import { Incise } from 'src/app/models/incise';

import {MatDialog} from '@angular/material/dialog';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

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
              public socketService: SocketService,
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
      this.taskComponent.list.getList();
      this.testing.checkProf("prof 137");
      window.location.reload();
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
        if(A[i].userId === this.userId){
          this.imageService.selectedImage = A[i];
          return
        }
      }
    });
  }


  findProf(userId: string){
    this.profService.getProfs()
    .subscribe(res => {
      const P = this.profService.profs = res as Prof[];
      for(var i in P){
        if(P[i].userId === userId){
          this.profService.userProf = P[i];
          this.socketService.emit('new user', this.userId);
          window.location.reload();
          return
        }
      }
      this.newProf(userId);
    });
  }

  username: string;

  newProf(userId: string){
    const prof = this.profService.userProf = new Prof;
    prof.userId = userId;
    prof.nickname = this.username;
    this.profService.postProf(prof)
    .subscribe(res => {
      this.profService.userProf = res as Prof;
      this.testing.checkProf("prof 66");
      this.findProf(userId);
      this.firstIncise(userId);
    });
  }

  firstIncise(userId: string){
    const I = this.inciseService.selectedIncise = new Incise;
    I.prof = userId;
    I.title = "My first Scrwm";
    I.subtitle = "Click on Set Header in the navBar above to modify us"
    this.inciseService.postIncise(I)
    .subscribe(res => {
      this.inciseService.getIncises().subscribe(res=>{
        const A = this.inciseService.incises = res as Incise[];
        this.taskComponent.list.getList();
      });
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
      this.deleteImages();
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

  editProf() {
    const dialogRef = this.dialog.open(ProfComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
    return; 
  }

}
