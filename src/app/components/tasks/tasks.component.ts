import { Component } from '@angular/core';
import { ScrwmService } from '../../services/scrwm.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {

  constructor(public scrwmService: ScrwmService) { }

}