import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasksComponent } from './components/tasks/tasks.component';
import { IncisesComponent } from './components/incises/incises.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

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
  {
    path: 'incises/:_id',            
    component: IncisesComponent,
  },
  {
    path: '**',            
    component: NotFoundComponent,
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
