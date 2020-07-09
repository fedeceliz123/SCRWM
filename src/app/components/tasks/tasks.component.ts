import { Component} from '@angular/core';
import { ScrwmService } from '../../services/scrwm.service';
import { AuthService } from 'src/app/services/auth.service';
import { InciseService } from 'src/app/services/incise.service';
import { IncisesComponent } from 'src/app/components/incises/incises.component';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {

  constructor(public scrwmService: ScrwmService,
              public incisesComponent: IncisesComponent,
              public authService: AuthService,
              public inciseService: InciseService,
              public showAround: ShowAroundComponent,
              ) { }

  selectedUser = sessionStorage.getItem('currentUserId');

}
