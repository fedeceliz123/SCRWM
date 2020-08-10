import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { InciseService } from 'src/app/services/incise.service';
import { SocketService } from 'src/app/services/socket.service';

import { ListComponent } from 'src/app/components/list/list.component';
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

  imagePath: string;
  userId: string = sessionStorage.getItem('currentUserId');
  username: string;
  file: File;
  photoSel: string | ArrayBuffer;

  constructor(
    public profService: ProfService,
    public imageService: ImageService,
    public inciseService: InciseService,
    public socketService: SocketService,
    public list: ListComponent,
    public test: TestingComponent,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.setUserImage();
  }
 
  setUserImage(){
    this.imageService.getImages().subscribe(res => {
      let I = this.imageService.images = res as Image[];
      for(var i in I){
        if(I[i].userId === this.userId){
          this.imagePath = I[i].imagePath;
          console.log(this.profService.env + this.imagePath)
        }
      }
    })
  }

  onPhotoSelected(event: HTMLInputEvent): void {
    if(event.target.files && event.target.files[0]){    // confirma si existe un archivo subido
      this.file = <File>event.target.files[0];          // guarda el archivo en file
      const reader = new FileReader();                   // para que se vea en pantalla
      reader.onload = e => this.photoSel = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  updateProf(form: NgForm){
    this.test.checkProf("ProfComponent 71")
    let P = this.profService.userProf;
    P.nickname = form.value.nickname;
    P.state = form.value.state;
    P.miniBio = form.value.miniBio;
    if(this.photoSel){
      this.deleteOldImages();
    }
    this.profService.putProf(P).subscribe(res => {
      this.profService.getProfs().subscribe(res => {
        //this.list.getList();
        window.location.reload();  
      })
    });
  }

  deleteOldImages(){
    this.imageService.getImages().subscribe(res => {
      let A = this.imageService.images = res as Image[];
      for(var i in A){
        if(A[i].userId === this.userId){
          this.imageService.deleteImage(A[i]._id).subscribe();
        }
      }
      this.chargeNewImage();
    });
  }

  chargeNewImage(){
    let I = this.imageService.selectedImage = new Image;
    I.userId = this.userId;
    this.imageService.postImage(I, this.file).subscribe();
    this.getImage();
  }

  getImage(){
    this.imageService.getImages().subscribe(res => {
      let I = this.imageService.images = res as Image[];
      for(var i in I){
        if(I[i].userId === this.userId){
          this.imageService.selectedImage = I[i];
          return
        }
      }
    });
  }

  findProf(userId: string){
    this.profService.getProfs().subscribe(res => {
      let P = this.profService.profs = res as Prof[];
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

  newProf(userId: string){
    let P = this.profService.userProf = new Prof;
    P.userId = userId;
    P.nickname = this.username;
    this.profService.postProf(P).subscribe(res => {
      this.profService.userProf = res as Prof;
      this.findProf(userId);
      this.firstIncise(userId);
    });
  }

  firstIncise(userId: string){
    let C = this.inciseService.selectedIncise = new Incise;
    C.prof = userId;
    C.title = "My first Scrwm";
    C.subtitle = "Click on Set Header in the navBar above to modify this header"
    this.inciseService.postIncise(C).subscribe();
  }

  deleteProfs(){
    this.profService.getProfs().subscribe(res => {
      let P = this.profService.profs = res as Prof[];
      for(var i in P){
        this.profService.deleteProf(P[i]._id).subscribe();
      }
      this.deleteImages();
    });
  }

  deleteImages(){
    this.imageService.getImages().subscribe(res => {
      let I = this.imageService.images = res as Image[];
      for(var i in I){
        this.imageService.deleteImage(I[i]._id).subscribe();
      }
    });
  }

  editProf() {
    const dialogRef = this.dialog.open(ProfComponent);
    dialogRef.afterClosed().subscribe();
    return; 
  }

}
