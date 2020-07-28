import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ShowAroundComponent} from 'src/app/components/incises/show-around/show-around.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent{

  constructor(public showAround: ShowAroundComponent,
              private router: Router){}
  
  changeOfRoutes(){
    this.showAround.deepLink(this.router.url);
  }



}