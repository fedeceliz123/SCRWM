import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { InciseService } from 'src/app/services/incise.service';
import { AuthService } from 'src/app/services/auth.service';

import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { ListComponent } from 'src/app/components/list/list.component';

import { Incise } from 'src/app/models/incise';
import { Scrwm } from 'src/app/models/scrwm';

import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment'; 

declare var M: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {

  panelOpenState = false;
  taskList: Scrwm[];
  UserId = sessionStorage.getItem('currentUserId');

  constructor(
    public inciseService: InciseService,
    public authService: AuthService,
    public showAround: ShowAroundComponent,
    private list: ListComponent,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void { 
    this.showAround.setByDefectInc();
  }

  procesaPropagar(event: any){
    this.taskList = event
  }
  
  lastEdited(updatedAt: string){
    return moment(updatedAt).startOf('hour').fromNow();
  }

  created(createdAt: string){
    return moment(createdAt).format('MMMM Do YYYY, h:mm:ss a');
  }

  openDialogHeader(){
    let C = this.inciseService.selectedIncise;
    if(C.prof !== sessionStorage.getItem('currentUserId')){
        M.toast({html: "You can only edit headers of your own incises"});
    } else {
      if(!C._id){
        M.toast({html: "No incise selected"});
      } else {
        const dialogRef = this.dialog.open(DialogHeader);
        dialogRef.afterClosed().subscribe(res => {
          this.inciseService.getIncises().subscribe(res => {
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
      this.list.getList();
    });
  }

}


@Component({
  selector: 'dialog-header',
  templateUrl: 'dialog-header.html',
})
export class DialogHeader{

  constructor(
    public inciseService: InciseService,
    public taskComponent: TasksComponent,
  ){}

  setHeader(form: NgForm){
    let C = this.inciseService.selectedIncise;
    C.title = form.value.title;
    C.subtitle = form.value.subtitle;
    if(form.value.publicity === true){
      C.publicity = true;
    } else if(form.value.publicity === false) {
      C.publicity = false;
    }
    this.inciseService.putIncise(C)
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
              public list: ListComponent,
              public taskComponent: TasksComponent,
  ){ }

  newIncise(form: NgForm){
    const incise = new Incise;
    incise.title = form.value.title;
    incise.subtitle = form.value.subtitle;
    incise.prof = sessionStorage.getItem('currentUserId');
    if(form.value.publicity === true){
      incise.publicity = true;
    } else if(form.value.publicity === false) {
      incise.publicity = false;
    }
    this.inciseService.postIncise(incise).subscribe(res => {
      this.list.getList();
      window.location.reload();
    });
  }

}
