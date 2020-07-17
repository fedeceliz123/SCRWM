import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { ScrwmService } from '../../services/scrwm.service';

import { User } from '../../models/user';
import { Scrwm } from 'src/app/models/scrwm';

import { NewscrwmComponent } from 'src/app/components/newscrwm/newscrwm.component';
import { ProfComponent } from 'src/app/components/prof/prof.component'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {

  hide = true;

  constructor(
    public authService: AuthService,
    public scrwmService: ScrwmService,
    public newScrwmComponent: NewscrwmComponent,
    public profComponent: ProfComponent,
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
            form.reset();
            sessionStorage.setItem('currentUserId', A[i]._id);
            this.findScrwm(A[i]._id);
          }
        }
      }
    });   
  }

  findScrwm(userId: string){
    this.scrwmService.getScrwms()
    .subscribe(res => {
      const B = this.scrwmService.scrwms = res as Scrwm[];
      for(var i in B){
        if(B[i].creator === userId){
          return;
        }
      }
      this.firstScrwm(userId);
      this.profComponent.newProf(userId);
    });
  }

  firstScrwm(userId: string){
    const C = this.scrwmService.selectedScrwm = new Scrwm;
    C.creator = userId;
    C.title = "Title...";
    C.subtitle = "Additional info...";
    this.scrwmService.postScrwm(C)
    .subscribe(res => {
      this.newScrwmComponent.getScrwm(userId);
    });
  }

}