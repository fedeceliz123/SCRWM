import { Component, OnInit } from '@angular/core';

import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';

import { Prof } from 'src/app/models/prof';
import { Image } from 'src/app/models/image';


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
  ) { }

  ngOnInit(): void {
    this.getProf();
    this.getImage();
  }

  getProf(){
    this.profService.getProfs()
    .subscribe(res => {
      const P = this.profService.profs = res as Prof[];
      for(var i in P){
        if(P[i].userId === sessionStorage.getItem('currentUserId')){
          this.profService.selectedProf = P[i];
          return
        }
      }
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


  newProf(userId: string){
    const prof = this.profService.selectedProf;
    prof.userId = userId;
    prof.nickname = "(Name)";
    prof.state = "(State)";
    prof.description = "(Description)";
    this.profService.postProf(prof)
    .subscribe(res => {
      this.getProf();
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

  getProf2(){
    this.profService.getProfs()
    .subscribe(res => {
      const P = this.profService.profs = res as Prof[];
      for(var i in P){
        if(P[i].userId === sessionStorage.getItem('currentUserId')){
          this.updateProf(P[i]);
          if(this.photoSelected){
            this.imageService.selectedImage.userId = sessionStorage.getItem('currentUserId');
            this.imageService.postImage(this.imageService.selectedImage, this.file)
            .subscribe(res => {
              this.imageService.selectedImage = res as Image;
              this.getImage();
            });
          }
        }
      }
    });
  }

  updateProf(prof: Prof){
    if(document.getElementById("Name").contentEditable){
      prof.nickname = document.getElementById("Name").textContent;
    }
    document.getElementById("Name").contentEditable = "false";
    if(document.getElementById("State").textContent){
      prof.state = document.getElementById("State").textContent;
    }
    document.getElementById("State").contentEditable = "false";
    if(document.getElementById("Description").textContent){
      prof.description = document.getElementById("Description").textContent;
    }
    document.getElementById("Description").contentEditable = "false";
    this.profService.putProf(prof)
    .subscribe(res => {
      this.profService.selectedProf = res as Prof;
      this.getProf();
    });
  }

  editName(){
    document.getElementById('Name').contentEditable = "true";
    document.getElementById("Name").focus();
    document.getElementById("State").contentEditable = "false";
    document.getElementById("Description").contentEditable = "false";
  }
  
  editState(){
    document.getElementById("State").contentEditable = "true";
    document.getElementById("State").focus();
    document.getElementById("Name").contentEditable = "false";
    document.getElementById("Description").contentEditable = "false";
  }
  
  editDescription(){
    document.getElementById("Description").contentEditable = "true";
    document.getElementById("Description").focus();
    document.getElementById("State").contentEditable = "false";
    document.getElementById("Name").contentEditable = "false";
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
    });
  }

}
