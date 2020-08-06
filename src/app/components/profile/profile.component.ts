import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InciseService } from 'src/app/services/incise.service';
import { TasksComponent } from 'src/app/components/tasks/tasks.component';
import { ProfComponent } from 'src/app/components/prof/prof.component';
import { ProfService } from 'src/app/services/prof.service';
import { Incise } from 'src/app/models/incise';
import { Prof } from 'src/app/models/prof';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public inciseService: InciseService,
    public taskComponent: TasksComponent,
    public profComponent: ProfComponent,
    public profService: ProfService,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.setDiamods();
  }

  scrwm: any;
  selProf: any;
  DIAMONDS: number;
  isFoll: boolean;
  userProf = this.profService.userProf;

  seeProf() {
    for(var i in this.taskComponent.list.taskList){
      if(this.taskComponent.list.taskList[i].incise === this.inciseService.selectedIncise){
        this.scrwm = this.taskComponent.list.taskList[i];
        this.selProf = this.scrwm.prof;
        this.openDialog();
      }
    }
  }

  openDialog(){
    const dialogRef = this.dialog.open(ProfileComponent);
    dialogRef.afterClosed().subscribe(result => {
      });
      return; 
    }
  
  setDiamods(){
    let count = 0
    this.inciseService.getIncises()
    .subscribe(res=>{
      const A = this.inciseService.incises = res as Incise[];
      for(var i in A){
        if(A[i].prof === this.selProf.userId){
          if(A[i].diamond){
            count = count + A[i].diamond;
          }
        }
      }
      this.DIAMONDS = count;   
     })
  }

  isFollowing(){
    const F = this.profService.userProf.following;
    for(var i in F){
      if(F[i] === this.selProf._id){
        this.isFoll = true;
        return this.isFoll;
      }
    }
    this.isFoll = false;
  }

  followness(form: NgForm){
    const F = this.userProf.following;
    if(form.value.event === true){
      for(var i in F){
        if(F[i] === this.selProf._id){
          return
        }
      }
      this.selProf.followers ++;
      F.push(this.selProf._id);
      this.saveProfs(this.selProf, this.userProf);
    }
    if(form.value.event === false){
      for(var i in F){
        if(F[i] === this.selProf._id){
          this.selProf.followers --;
          const index = F.indexOf(i)+1;
          F.splice(index, 1);
          this.saveProfs(this.selProf, this.userProf);
        }
      }
    }
  }

  saveProfs(selProf: Prof, userProf: Prof){
    this.profService.putProf(selProf)
    .subscribe(res=>{})
    this.profService.putProf(userProf)
    .subscribe(res=>{})
  }
 
}


