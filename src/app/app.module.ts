import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';

import { IncisesComponent } from './components/incises/incises.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { NewscrwmComponent } from './components/newscrwm/newscrwm.component';
import { InitComponent } from './components/init/init.component';
import { ShowAroundComponent } from './components/incises/show-around/show-around.component';
import { KeyListenerComponent } from './components/incises/key-listener/key-listener.component';
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    IncisesComponent,
    SignupComponent,
    SigninComponent,
    TasksComponent,
    NewscrwmComponent,
    InitComponent,
    ShowAroundComponent,
    KeyListenerComponent,
    HighlightDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    TasksComponent,
    NewscrwmComponent,
    IncisesComponent,
    SigninComponent,
    ShowAroundComponent,
    KeyListenerComponent,
    HighlightDirective,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
