import { Component, OnInit } from '@angular/core';

import { ProfService } from 'src/app/services/prof.service';
import { Prof } from 'src/app/models/prof'

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-prof',
  templateUrl: './prof.component.html',
  styleUrls: ['./prof.component.css']
})
export class ProfComponent implements OnInit {

  file: File;
  photoSelected: string | ArrayBuffer;

  constructor(private profService: ProfService) { }

  ngOnInit(): void {
  }

  newProf(userId: string){
    const prof = this.profService.selectedProf;
    console.log(prof);
    prof.userId = userId;
    prof.nickname = "(Your current name)";
    prof.state = "(Your actual state)";
    prof.description = "(About yourself)";
    console.log(prof);
    this.profService.postProf(prof)
    .subscribe(res => {
    });
  }

  onPhotoSelected(event: HTMLInputEvent): void {
    if(event.target.files && event.target.files[0]){    // confirma si existe un archivo subido
      this.file = <File>event.target.files[0];          // guarda el archivo en file
      const reader = new FileReader();                   // para que se vea en pantalla
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  getProf(){
    console.log("getProfs");
    console.log(sessionStorage.getItem('currentUserId'));
    this.profService.getProfs()
    .subscribe(res => {
      const P = this.profService.profs = res as Prof[];
      for(var i in P){
        if(P[i].userId === sessionStorage.getItem('currentUserId')){
          console.log("encontró su usuario")
          this.uploadPhoto(P[i])
        }
      }
    });

  }

  uploadPhoto(prof: Prof){
    console.log("uploadPhoto")
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
    prof.userId = sessionStorage.getItem('currentUserId');
    console.log(prof._id);
    this.profService.putProf(prof, this.file)
    .subscribe(res => console.log(res), err => console.log(err));
  }

  editName(){
    this.newProf(sessionStorage.getItem("currentUserId"));
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
