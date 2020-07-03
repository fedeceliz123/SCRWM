import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

import { AuthService } from '../../services/auth.service';
import { ScrwmService } from '../../services/scrwm.service';
import { InciseService  } from 'src/app/services/incise.service'

import { IncisesComponent } from '../incises/incises.component'
import { NewscrwmComponent } from '../newscrwm/newscrwm.component'

import { User } from '../../models/user';
import { Scrwm } from 'src/app/models/scrwm';
import { Incise } from 'src/app/models/incise';
import { Subscriber } from 'rxjs';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [AuthService, IncisesComponent, NewscrwmComponent],
})

export class SigninComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public inciseService: InciseService,
    public scrwmService: ScrwmService,
    private incisesComponent: IncisesComponent,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signIn(form: NgForm){                          // ata el usuario a selectedUser
    this.authService.signIn(form.value)
    .subscribe(
      res => {
        localStorage.setItem('token', res.token);
        this.findUser(form.value.username, form.value.password);
      },
      err => console.log(err)
    )
  }
 
  findUser(username: string, password: string){
    this.authService.getUsers()
    .subscribe(res => {
      this.authService.users = res as User[];
      const A = this.authService.users;
      for(var i in A){
        if (A[i].username === username){
          if (A[i].password === password){
            this.findScrwm(A[i]);
          }
        }
      }
    });
  }

  findScrwm(user: User){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      this.scrwmService.scrwms = res as Scrwm[];
      for(var i in this.scrwmService.scrwms){
        if(this.scrwmService.scrwms[i].creator === user._id){
          this.router.navigate(['/tasks']);
          console.log("AAA");
          return;
        }
      }
      if(this.scrwmService.scrwms.slice(-1)[0]){
        this.scrwmService.selectedScrwm = this.scrwmService.scrwms.slice(-1)[0];
      }
      this.firstScrwm(user);
    }); 
  }

  firstScrwm(user: User){
    const A = this.scrwmService.selectedScrwm;
    A.creator = user._id;
    A.title = "First Scrwm";
    A.subtitle = "subtitle...";
    this.scrwmService.postScrwm(A)
    .subscribe(res => {
      this.getScrwm(user);
    });
  }

  getScrwm(user: User){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      this.scrwmService.scrwms = res as Scrwm[];
      for(var i in this.scrwmService.scrwms){
        if(this.scrwmService.scrwms[i].creator === user._id){
          this.newIncise(user, this.scrwmService.scrwms[i]);
        }
      }
    });
  }

  newIncise(user: User, scrwm: Scrwm){
    const A = this.inciseService.selectedIncise;
    A.user = user._id;
    A.scrwm = scrwm._id;
    this.inciseService.postIncise(A)
    .subscribe(res => {
      this.getIncise(user, scrwm);
    });
  }

  getIncise(user: User, scrwm: any){
    this.inciseService.getIncises()
    .subscribe(res => {
      this.inciseService.incises = res as Incise[];
      for(var i in this.inciseService.incises){
        if(this.inciseService.incises[i].user === user._id){
          if(this.inciseService.incises[i].scrwm === scrwm._id){
            scrwm.inciseInit = this.inciseService.incises[i];
            this.scrwmService.putScrwm(scrwm)
            .subscribe(res => {
            });
            this.inciseService.putIncise(this.inciseService.incises[i])
            .subscribe(res => {
            });
            this.cleanScrwm();
            this.router.navigate(['/tasks']);
          }
        }
      }
    });
  }

  cleanScrwm(){
    console.log("1");
    for(var i in this.scrwmService.scrwms){
      if(!this.scrwmService.scrwms[i].creator){
        console.log("2");
        this.scrwmService.deleteScrwm(this.scrwmService.scrwms[i]._id)
        .subscribe(res => {
          console.log("3");
        });
      }
    }
  }
 
}