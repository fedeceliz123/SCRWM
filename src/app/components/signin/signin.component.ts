import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { IncisesComponent } from '../incises/incises.component'
import { User } from '../../models/user';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [AuthService, IncisesComponent],
})

export class SigninComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private incisesComponent: IncisesComponent,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signIn(form: NgForm){
    this.authService.signIn(form.value)
    .subscribe(
      res => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/tasks']);
      },
      err => console.log(err)
    )
    this.authService.findCurrentUser(form.value.username, form.value.password);
  }
 
}
