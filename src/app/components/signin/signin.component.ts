import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { ScrwmService } from '../../services/scrwm.service';
import { InciseService  } from 'src/app/services/incise.service';

import { User } from '../../models/user';
import { Scrwm } from 'src/app/models/scrwm';
import { Incise } from 'src/app/models/incise';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public inciseService: InciseService,
    public scrwmService: ScrwmService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signIn(form: NgForm){
    this.authService.signIn(form.value)
    .subscribe(res => {
        localStorage.setItem('token', res.token);
        this.findUser(form);
      },
      err => console.log(err)
    )
  }
 
  findUser(form: NgForm){
    this.authService.getUsers()
    .subscribe(res => {
      const A = this.authService.users = res as User[];
      for(var i in A){
        if (A[i].username === form.value.username){
          if (A[i].password === form.value.password){
            sessionStorage.setItem('currentUserId', A[i]._id);
            this.findScrwm(A[i]._id);
          }
        }
      }
    });
  }

  findScrwm(userId: any){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      const B = this.scrwmService.scrwms = res as Scrwm[];
      for(var i in B){
        if(B[i].creator === userId){
          this.router.navigate(['/tasks']);
          return;
        }
      }
      this.firstScrwm(userId);
    }); 
  }

  firstScrwm(userId: any){
    const C = this.scrwmService.selectedScrwm = new Scrwm;
    C.creator = userId;
    C.title = "First Scrwm";
    C.subtitle = "subtitle...";
    this.scrwmService.postScrwm(C)
    .subscribe(res => {
      this.getScrwm(userId);
    });
  }

  getScrwm(userId: any){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      const D = this.scrwmService.scrwms = res as Scrwm[];
      for(var i in D){
        if(D[i].creator === userId){
          if(!D[i].inciseInit){
            sessionStorage.setItem('currentScrwmId', D[i]._id);
            this.newIncise(userId, D[i]);
          }
        }
      }
    });
  }

  newIncise(userId: any, scrwm: Scrwm){
    const E = this.inciseService.selectedIncise = new Incise;
    E.user = userId;
    E.scrwm = scrwm._id;
    this.inciseService.postIncise(E)
    .subscribe(res => {
      this.getIncise(userId, scrwm);
    });
  }

  getIncise(userId: any, scrwm: Scrwm){
    this.inciseService.getIncises()
    .subscribe(res => {
      const F = this.inciseService.incises = res as Incise[];
      for(var i in F){
        if(F[i].user === userId){
          if(F[i].scrwm === scrwm._id){
            scrwm.inciseInit = F[i]._id;
            this.scrwmService.putScrwm(scrwm)
            .subscribe(res => {
            });
            this.cleanScrwms();
            this.router.navigate(['/tasks']);
          }
        }
      }
    });
  }

  cleanScrwms(){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      for(var i in this.scrwmService.scrwms){
        if(!this.scrwmService.scrwms[i].creator){
          this.scrwmService.deleteScrwm(this.scrwmService.scrwms[i]._id)
          .subscribe(res => {
          });
        }
      }
    });
  }

}