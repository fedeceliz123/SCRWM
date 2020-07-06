import { Component } from '@angular/core';
import { ScrwmService } from '../../services/scrwm.service';
import { IncisesComponent } from 'src/app/components/incises/incises.component';
import { AuthService } from 'src/app/services/auth.service';
import { Scrwm } from 'src/app/models/scrwm';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {

  constructor(public scrwmService: ScrwmService,
              public incisesComponent: IncisesComponent,
              public authService: AuthService,
              private router: Router,
              ) { }

    getInciseInit(scrwm: Scrwm){
      sessionStorage.setItem('currentScrwmId', scrwm._id);
      this.incisesComponent.findInciseInit();
      this.router.navigate(['/incises']);
    }

    UserName = "Nulo";

    getCurrentUser(scrwm: Scrwm){
      this.authService.getUsers()
      .subscribe(res => {
        const A = this.authService.users = res as User[];
        for(var i in A){ 
          if(scrwm.creator === A[i]._id){
            this.UserName = A[i].username;
          }
        } 

      });
    }

}
