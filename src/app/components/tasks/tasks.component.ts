import { Component, OnInit } from '@angular/core';

import { ScrwmService } from '../../services/scrwm.service';
import { AuthService } from 'src/app/services/auth.service';
import { InciseService } from 'src/app/services/incise.service';

import { IncisesComponent } from 'src/app/components/incises/incises.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'

import { Scrwm } from 'src/app/models/scrwm';
import { Incise } from 'src/app/models/incise';
import { User } from 'src/app/models/user';

import {MatDialog} from '@angular/material/dialog';


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
              public showAround: ShowAroundComponent,
              public dialog: MatDialog,
              ) { }

  selectedUser = sessionStorage.getItem('currentUserId');

  ngOnInit(): void {
    this.getScrwms();
    this.getUsers();
  }

  getScrwms(){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      this.scrwmService.scrwms = res as Scrwm[];
    });
  }

  getUsers(){
    this.authService.getUsers()
    .subscribe(res => {
      this.authService.users = res as User[];
    });
  }


  deleteScrwm(scrwm: Scrwm){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      const A = this.scrwmService.scrwms = res as Scrwm[];
      for(var i in A){
        if(A[i]._id === scrwm._id){
          if(this.inciseService.selectedIncise.scrwm === scrwm._id){
            alert("The scrwm is being edited");
          } else {
            this.deleteIncises(A[i])
            this.scrwmService.deleteScrwm(A[i]._id)
            .subscribe(res => {
              console.log("Scrwm Deleted: " + A[i]._id);
              this.scrwmService.selectedScrwm = new Scrwm();
            });
          }  
        }
      }
    });  
  }

  deleteIncises(scrwm: Scrwm){
    this.inciseService.getIncises()
    .subscribe(res => {
      const B = this.inciseService.incises = res as Incise[];
      for(var i in B){
        if(B[i].scrwm === scrwm._id)
          this.inciseService.deleteIncise(B[i]._id)
          .subscribe(res => {
            this.getScrwms();
          });     
        }
      });
    }
    editScrwm(scrwm: Scrwm){
    }

    editUser() {
      const dialogRef = this.dialog.open(IncisesComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

}
