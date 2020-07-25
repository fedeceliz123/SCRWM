import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { InciseService } from 'src/app/services/incise.service';
import { ImageService } from 'src/app/services/image.service';
import { ProfService } from 'src/app/services/prof.service';

import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';

import { Incise } from 'src/app/models/incise';
import { Image } from 'src/app/models/image';
import { Prof } from 'src/app/models/prof';

import {MatDialog} from '@angular/material/dialog';

declare var M: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})


export class TasksComponent implements OnInit {

  panelOpenState = false;

  constructor(public inciseService: InciseService,
              public imageService: ImageService,
              public profService: ProfService,
              public showAround: ShowAroundComponent,
              public dialog: MatDialog,
              ) { }

  currentUserId = sessionStorage.getItem('currentUserId');

  ngOnInit(): void { 
    this.getList();
  }

  Own: boolean = false;
  Contact: boolean = false;
  Anchor: boolean = false;
  Diamond: boolean = false;
  Header: boolean = false;

  filterByOwns(){
    this.Own = !this.Own;
    if(this.Own){
      if(this.Contact){
        this.Contact = !this.Contact;
        document.getElementById('contactBtn').style.backgroundColor = 'rgb(224, 232, 251)';
      }
      document.getElementById('ownBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('ownBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }

  filterByContacts(){
    this.Contact = !this.Contact;
    if(this.Contact){
      if(this.Own){
        this.Own = !this.Own;
        document.getElementById('ownBtn').style.backgroundColor = 'rgb(224, 232, 251)';
      }
      document.getElementById('contactBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('contactBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }
  
  filterByAnchors(){
    this.Anchor = !this.Anchor;
    if(this.Anchor){
      document.getElementById('anchorBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('anchorBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }

  filterByDiamonds(){
    this.Diamond = !this.Diamond;
    if(this.Diamond){
      document.getElementById('diamondBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('diamondBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }

  filterByHeader(){
    this.Header = !this.Header;
    if(this.Header){
      document.getElementById('headerBtn').style.backgroundColor = '#006064';
    } else {
      document.getElementById('headerBtn').style.backgroundColor = 'rgb(224, 232, 251)';
    }
    this.getList();
  }

  taskList: any[] = [{
    "incise": Object,
    "image": Object,
    "prof": Object,
  }];

  getList(){
    this.taskList = [];
    this.inciseService.getIncises()
    .subscribe(res => {
      const A = this.inciseService.incises = res as Incise[]; 
      this.imageService.getImages()
      .subscribe(res => {
        const I = this.imageService.images = res as Image[];
        this.profService.getProfs()
        .subscribe(res => {
          const P = this.profService.profs = res as Prof[];
          this.getAll(A, I, P);
        });
      });
    });
  }

  getAll(A: Incise[], I: Image[], P: Prof[]){
    let unfilteredList = [];
    for(var i in A){
      for(var j in this.profService.userProf.favIncises){
        for(var k in this.profService.userProf.following){
          if(A[i].publicity === true 
          || A[i].prof === this.currentUserId 
          || A[i]._id === this.profService.userProf.favIncises[j]
          || A[i]._id === this.profService.userProf.following[k]){
            let image = {};
            for(var l in I){
              if (A[i].prof === I[l].userId){
                image = I[l];
              }
            }
            for(var m in P){
              if(A[i].prof === P[m].userId){
                unfilteredList.push({"incise" : A[i], image, prof : P[m]});
              }
            }
          }
        }
      }
    }
    this.filterAnchors(unfilteredList);
  }

  filterAnchors(unfilteredList: any[]){
    let filterOne = [];
    if(this.Anchor){
      filterOne = unfilteredList.filter(unfiltered => {
        for(var i in this.profService.userProf.anchors){
          if(unfiltered.incise._id === this.profService.userProf.anchors[i]){
            return this.profService.userProf.anchors[i];
          }
        }    
      })
    } else {
      filterOne = unfilteredList;
    }
    this.filterDiamonds(filterOne)
  }

  filterDiamonds(filterOne: any[]){
    let filterTwo = [];
    if(this.Diamond){
      this.taskList = filterOne.filter(unfiltered => {
        for(var j in this.profService.userProf.favIncises){
          if(unfiltered.incise._id === this.profService.userProf.favIncises[j]){
            return this.profService.userProf.favIncises[j];
          }
        }    
      });
    } else {
      this.taskList = filterOne;
    }
    //this.filterContacts(filterTwo)
  }

  filterContacts(filterTwo: any){
    
  }

  openDialogHeader(){
    if(this.inciseService.selectedIncise.prof != this.currentUserId){
        M.toast({html: "You can only edit Header of your won incises"})
    } else {
      const incise = this.inciseService.selectedIncise;
      if(!incise._id){
        M.toast({html: "No incise selected"});
      } else {
        const dialogRef = this.dialog.open(DialogHeader);
        dialogRef.afterClosed().subscribe(res => {
          this.inciseService.getIncises()
          .subscribe(res => {
            this.inciseService.incises = res as Incise[];
          });
        });
      }  
    }
  }

  openDialogNewScrwm(){
    this.inciseService.selectedIncise = new Incise;
    const dialogRef = this.dialog.open(DialogNewScrwm);
    dialogRef.afterClosed().subscribe(res => {
      this.getList();
    });
  }

}



@Component({
  selector: 'dialog-header',
  templateUrl: 'dialog-header.html',
})
export class DialogHeader {

  constructor(public inciseService: InciseService,
              public taskComponent: TasksComponent,
  ){}

  setHeader(form: NgForm){
    console.log(form.value.publicity)
    const incise = this.inciseService.selectedIncise;
    incise.title = form.value.title;
    incise.subtitle = form.value.subtitle;
    if(form.value.publicity === true){
      incise.publicity = true;
    } else if(form.value.publicity === false) {
      incise.publicity = false;
    }
    this.inciseService.putIncise(incise)
    .subscribe(res => {
    });
  }
}


@Component({
  selector: 'dialog-new-scrwm',
  templateUrl: 'dialog-new-scrwm.html',
})
export class DialogNewScrwm {

  constructor(public inciseService: InciseService, 
              public showAround: ShowAroundComponent,
              public taskComponent: TasksComponent,
  ){ }

  newIncise(form: NgForm){
    const incise = this.inciseService.selectedIncise = new Incise;
    incise.title = form.value.title;
    incise.subtitle = form.value.subtitle;
    incise.prof = sessionStorage.getItem('currentUserId');
    this.showAround.toCenter(incise);
    if(form.value.publicity === true){
      incise.publicity = true;
    } else if(form.value.publicity === false) {
      incise.publicity = false;
    }
    this.inciseService.postIncise(incise)
    .subscribe(res => {
    });
  }
}
