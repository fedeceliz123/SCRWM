import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';

import { IncisesComponent, DialogContent } from './components/incises/incises.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { TasksComponent, DialogHeader, DialogNewScrwm } from './components/tasks/tasks.component';
import { InitComponent } from './components/init/init.component';
import { ShowAroundComponent } from './components/incises/show-around/show-around.component';
import { EditAroundComponent } from './components/incises/edit-around/edit-around.component';

import { KeyListenerComponent } from './components/incises/key-listener/key-listener.component';
import { ProfComponent } from './components/prof/prof.component'

import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    IncisesComponent,
    DialogContent,
    SignupComponent,
    SigninComponent,
    TasksComponent,
    DialogHeader,
    DialogNewScrwm,
    InitComponent,
    ShowAroundComponent,
    KeyListenerComponent,
    ProfComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    AuthGuard,
    TasksComponent,
    DialogHeader,
    DialogNewScrwm,
    IncisesComponent,
    SigninComponent,
    ShowAroundComponent,
    EditAroundComponent,
    KeyListenerComponent,
    SignupComponent,
    SigninComponent,
    ProfComponent,
    InitComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
