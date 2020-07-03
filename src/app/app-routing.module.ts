import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//components
import { TasksComponent } from './components/tasks/tasks.component'
import { IncisesComponent } from './components/incises/incises.component'
import { SigninComponent } from './components/signin/signin.component'
import { SignupComponent } from './components/signup/signup.component'

import { AuthGuard } from './auth.guard';
import { NewscrwmComponent } from './components/newscrwm/newscrwm.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  }, 
  {
    path: 'tasks',
    component: TasksComponent,
  },
  {
    path: 'incises',                   // ésta sería la ruta privada
    component: IncisesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'newscrwm',
    component: NewscrwmComponent,
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
