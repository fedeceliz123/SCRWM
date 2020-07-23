import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { InciseService } from 'src/app/services/incise.service';

import { TasksComponent } from 'src/app/components/tasks/tasks.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';

import { Prof } from 'src/app/models/prof';
import { Image } from 'src/app/models/image';
import { Incise } from 'src/app/models/incise';

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
              public showAround: ShowAroundComponent,
  ) { }

  ngOnInit(): void {
  }

  userId: string = sessionStorage.getItem('currentUserId');

  findProf(userId: string){
    console.log("(findProf)");
    this.profService.getProfs()
    .subscribe(res => {
      const P = this.profService.profs = res as Prof[];
      for(var i in P){
        if(P[i].userId === userId){
          this.profService.selectedProf = P[i];
          return
        }
      }
      this.newProf(userId);
    });
  }

  newProf(userId: string){
    console.log("(newProf)");
    const prof = this.profService.selectedProf = new Prof;
    prof.userId = userId;
    this.profService.postProf(prof)
    .subscribe(res => {
      this.profService.selectedProf = res as Prof;
      this.findProf(userId);
      this.firstIncise();
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

  firstIncise(){
    console.log("(firstIncise)");
    const I = this.inciseService.selectedIncise = new Incise;
    I.prof = sessionStorage.getItem('currentUserId');
    I.title = "My first Scrwm";
    this.inciseService.postIncise(I)
    .subscribe(res => {
      this.inciseService.selectedIncise = res as Incise;
    });
  }


  file: File;
  photoSelected: string | ArrayBuffer;

  onPhotoSelected(event: HTMLInputEvent): void {
    if(event.target.files && event.target.files[0]){    // confirma si existe un archivo subido
      this.file = <File>event.target.files[0];          // guarda el archivo en file
      const reader = new FileReader();                   // para que se vea en pantalla
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  updateProf(form: NgForm){
    const prof = this.profService.selectedProf;
    prof.nickname = form.value.nickname;
    prof.state = form.value.state;
    prof.description = form.value.description;
    if(this.photoSelected){
      this.updateImage(prof);
    }
    this.profService.putProf(prof)
    .subscribe(res => {
      this.profService.selectedProf = res as Prof;
    });     
  }

  updateImage(prof: Prof){
    this.imageService.getImages()
    .subscribe(res => {
      const A = this.imageService.images = res as Image[];
      for(var i in A){
        if(A[i].userId === prof.userId){
          this.imageService.deleteImage(A[i]._id);
        }
      }
      this.chargeNewImage(prof);
    });
  }  

  chargeNewImage(prof: Prof){
    const A = this.imageService.selectedImage = new Image;
    A.userId = prof.userId;
    this.imageService.postImage(A, this.file)
    .subscribe(res => {
      this.getImage();
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

}
