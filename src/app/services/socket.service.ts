import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;
  readonly uri: string = environment.apiUrl;

  constructor() {
  this.socket = io(this.uri);
   } 

  listen(eventName: string){
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: string) => {
        subscriber.next(data);
      })
    })
  } 

  emit(eventName: string, data: any){
    this.socket.emit(eventName, data);
  }

}
