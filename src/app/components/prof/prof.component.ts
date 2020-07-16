import { Component, OnInit } from '@angular/core';

import { ProfService } from 'src/app/services/prof.service'

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

  onPhotoSelected(event: HTMLInputEvent): void {
    if(event.target.files && event.target.files[0]){    // confirma si existe un archivo subido
      this.file = <File>event.target.files[0];          // guarda el archivo en file
      const reader = new FileReader();                   // para que se vea en pantalla
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  uploadPhoto(){
    const prof = this.profService.selectedProf;
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
    this.profService.postProf(prof, this.file)
    .subscribe(res => console.log(res), err => console.log(err));
  }

editName(){
  console.log("Entró...");
  document.getElementById('Name').contentEditable = "true";
  console.log(document.getElementById('Name').contentEditable);
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
}
