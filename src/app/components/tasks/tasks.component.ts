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

  inciseList: object[] = [{
    "incise" : {},
    "image" : {},
    "prof" : {},
  }];

  getList(){
    this.inciseList = [];
    this.inciseService.getIncises()
    .subscribe(res => {
      const A = this.inciseService.incises = res as Incise[]; 
      this.imageService.getImages()
      .subscribe(res => {
        const I = this.imageService.images = res as Image[];
        this.profService.getProfs()
        .subscribe(res => {
          const P = this.profService.profs = res as Prof[];
          for(var i in A){
            if(A[i].title){
              let image = {};
              for(var j in I){
                if (I[j].userId === A[i].prof){
                  image = I[j];
                }
              }
              for(var k in P){
                if(P[k].userId === A[i].prof){
                  this.inciseList.push({"incise" : A[i], image, prof : P[k]});
                }
              }
            }
          }
        });
      });
    });
  }

  openDialogHeader(){
    const incise = this.inciseService.selectedIncise;
    if(!incise._id){
      M.toast({html: "No incise selected"});
    } else {
      const dialogRef = this.dialog.open(DialogHeader);
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  openDialogNewScrwm(){
    this.inciseService.selectedIncise = new Incise;
    const dialogRef = this.dialog.open(DialogNewScrwm);
    dialogRef.afterClosed().subscribe(result => {
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
    const incise = this.inciseService.selectedIncise;
    incise.title = form.value.title;
    incise.subtitle = form.value.subtitle;
    this.inciseService.putIncise(incise)
    .subscribe(res => {
      this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.taskComponent.getList();
      });
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
    this.inciseService.postIncise(incise)
    .subscribe(res => {
      this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        this.taskComponent.getList();
      });
    });
  }
}
