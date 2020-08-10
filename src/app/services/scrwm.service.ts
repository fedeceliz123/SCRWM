import { Injectable } from '@angular/core';
import { Scrwm } from 'src/app/models/scrwm'


@Injectable({
  providedIn: 'root'
})
export class ScrwmService {

taskList: Scrwm[];
searchList: Scrwm[];
selectedScrwm: Scrwm;

  constructor() { 
  }

}
