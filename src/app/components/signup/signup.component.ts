import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  constructor(public authService: AuthService,
              private router: Router
              ) { }

  ngOnInit(): void {
  }

  hide = true;

  signUp(form: NgForm){
    this.authService.signUp(form.value)
    .subscribe(
      res => {
        console.log(res)
        //localStorage.setItem('token', res.token);
        form.reset();
        this.router.navigate(['/init']);
      },
      err => console.log(err)
    );
  }

}
