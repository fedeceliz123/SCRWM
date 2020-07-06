import { Component } from '@angular/core';
import { ScrwmService } from '../../services/scrwm.service';
import { IncisesComponent } from 'src/app/components/incises/incises.component';
import { Scrwm } from 'src/app/models/scrwm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {

  constructor(public scrwmService: ScrwmService,
              public incisesComponent: IncisesComponent,
              private router: Router,
              ) { }

    getInciseInit(scrwm: Scrwm){
      sessionStorage.setItem('currentScrwmId', scrwm._id);
      this.incisesComponent.findInciseInit();
      this.router.navigate(['/incises']);
    }

}
