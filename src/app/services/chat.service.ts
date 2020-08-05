import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';       // para comunicar el frontend al servidor (en lugar de Postman)
import { Chat } from '../models/chat'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  selectedChat: Chat;
  chats: Chat[];
  env = environment.apiUrl;

  private URL_API = environment.apiUrl + 'api/scrwm/chats';
  front = environment.front + 'chats/';
  
  constructor(private http: HttpClient) {
    this.selectedChat = new Chat();
  }

  getChats() {
    return this.http.get(this.URL_API);
  }

  postChat(Chat: Chat) {
    return this.http.post(this.URL_API, Chat);
  }

  putChat(chat: Chat) {
    return this.http.put(this.URL_API + `/${chat._id}`, chat);
  }

  deleteChat(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

}