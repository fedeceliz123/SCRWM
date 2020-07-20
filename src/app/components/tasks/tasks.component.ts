import { Component, OnInit } from '@angular/core';

import { ScrwmService } from '../../services/scrwm.service';
import { AuthService } from 'src/app/services/auth.service';
import { InciseService } from 'src/app/services/incise.service';
import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';

import { IncisesComponent } from 'src/app/components/incises/incises.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component';
import { InitComponent } from 'src/app/components/init/init.component'

import { Scrwm } from 'src/app/models/scrwm';
import { Incise } from 'src/app/models/incise';
import { Prof } from 'src/app/models/prof';
import { Image } from 'src/app/models/image';

import {MatDialog} from '@angular/material/dialog';


declare var M: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})


export class TasksComponent implements OnInit {

  panelOpenState = false;

  constructor(public scrwmService: ScrwmService,
              public incisesComponent: IncisesComponent,
              public authService: AuthService,
              public inciseService: InciseService,
              public profService: ProfService,
              public imageService: ImageService,
              public showAround: ShowAroundComponent,
              public initComponent: InitComponent,
              public dialog: MatDialog,
              ) { }

  currentUserId = sessionStorage.getItem('currentUserId');

  ngOnInit(): void {
    this.getProfs();
    this.getImages();
  }

  getProfs(){
    this.profService.getProfs()
    .subscribe(res => {
      const P = this.profService.profs = res as Prof[];
      for(var i in P){
        if(P[i].userId === sessionStorage.getItem('currentUserId')){
          this.profService.selectedProf = (P[i]);
        }
      }      
      this.getScrwms();
    });
  }

  getImages(){
    this.imageService.getImages()
    .subscribe(res => {
      const A = this.imageService.images = res as Image[];
      for(var i in A){
        if(A[i].userId === sessionStorage.getItem('currentUserId')){
          this.imageService.selectedImage = (A[i]);
        }
      }      
      this.getScrwms();
    });
  }

  getList(){
    for(var i in this.profService.profs){
      if(this.profService.profs[i].userId === this.currentUserId){
        for(var j in this.scrwmService.scrwms){
          if(this.scrwmService.scrwms[j].creator === this.profService.profs[i].userId){
            for(var k in this.imageService.images){
              if(this.imageService.images[k].userId === this.profService.profs[i].userId){

              }
            }
          }
        }
      }
    }
  }


  deleteScrwm(scrwm: Scrwm){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      const A = this.scrwmService.scrwms = res as Scrwm[];
      for(var i in A){
        if(A[i]._id === scrwm._id){
          if(this.inciseService.selectedIncise.scrwm === scrwm._id){
            M.toast({html: "The scrwm is being edited"});
          } else {
            localStorage.setItem("delScrwmId", A[i]._id);
            this.deleteStill();
          }  
        }
      }
    });  
  }

  deleteIncises(scrwmId: string){
    this.inciseService.getIncises()
    .subscribe(res => {
      const B = this.inciseService.incises = res as Incise[];
      for(var i in B){
        if(B[i].scrwm === scrwmId){
          this.inciseService.deleteIncise(B[i]._id)
          .subscribe(res => {
            this.getScrwms();
          });     
        }
      }
    });
  }

  getScrwms(){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      this.scrwmService.scrwms = res as Scrwm[];
    });
  }

  deleteStill() {
    const dialogRef = this.dialog.open(AlertDelScrwm);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'alert-del-scrwm',
  templateUrl: 'alert-del-scrwm.html',
})
export class AlertDelScrwm {

  constructor(public scrwmService: ScrwmService,
              public inciseService: InciseService,
              private tasksComponent: TasksComponent,
  ) { }

  deleteScrwm(){
    const scrwmId = localStorage.getItem("delScrwmId");
    this.tasksComponent.deleteIncises(scrwmId);
    console.log("1");
    this.scrwmService.deleteScrwm(scrwmId)
    .subscribe(res => {
      this.scrwmService.getScrwms()
      .subscribe(res => {
        console.log("2");
        this.scrwmService.scrwms = res as Scrwm[];
      });
    });  
  }

}
