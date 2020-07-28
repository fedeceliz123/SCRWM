import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasksComponent } from './components/tasks/tasks.component';
import { IncisesComponent } from './components/incises/incises.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'detail/:key', loadChildren: './detail/detail.module#DetailPageModule' 
    },
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
    path: 'incises',            
    component: IncisesComponent,
    //canActivate: [AuthGuard]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
