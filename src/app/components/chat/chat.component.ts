import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ChatService } from 'src/app/services/chat.service';

import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { NgForm } from '@angular/forms';

import { Chat } from 'src/app/models/chat'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userId: string = sessionStorage.getItem('currentUserId');
  mess: string;
  partner: string;  
  nick: string;
  Online: any[];
  Active: any[] = [{
    "prof": "",
    "image": "",
    "nick": ""
  }]

  constructor(private socketService: SocketService,
              private imageService: ImageService,
              public profService: ProfService,
              public chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.listenUsers();
    this.listenMessage();
    this.partner = '';
  }

  listenUsers(){
    this.socketService.listen('user ids').subscribe((data) =>{
      console.log(data)
      this.setConnected(data);
    })
  }

  setConnected(data: any){
    this.Online = [];
    const I = this.imageService.images;
    const P = this.profService.profs;
    for(var i in data){
      if(data[i] != this.userId){
        let img = "";
        for(var j in I){
          if(I[j].userId === data[i]){
            img = I[j].imagePath;
          }
        }
        for(var k in P){
          if(P[k].userId === data[i]){
            this.Online.push({"prof": data[i],"image": img, "nick": P[k].nickname});
          }
        }
      }
    }
  }

  listenMessage(){
    const I = this.imageService.images;
    this.socketService.listen('whisper').subscribe((data: any) =>{
      if(data.toUser === this.partner){
        this.newLinePartner(data);
        return;
      }
      for(var i in this.Online){
        if(this.Online[i].prof === data.toUser){
          console.log(this.Online[i]);
          this.Active.push(this.Online[i]);
          console.log(this.Active)
          this.Online.splice(this.Online.indexOf(this.Online[i]) ,1);
        }
      }
    });
  }

  newLinePartner(data: any){
    const line = document.createElement('p');
    line.textContent = data.message;
    line.style.minWidth = "400px";
    line.style.color = "yellow";
    document.getElementById('container').appendChild(line);
  }

  sendChat(form: NgForm){
    let mess = { "message": form.value.message, "toUser": this.partner };
    this.socketService.emit("send message", mess);
    this.newLineUser(form);
  }

  newLineUser(form: NgForm){
    const line = document.createElement('p');
    line.textContent = form.value.message;
    line.style.minWidth = "400px";
    line.style.color = "white";
    line.align = "end";
    document.getElementById('container').appendChild(line);
    form.reset(); 
  }

  startChat(user: any){
    this.partner = user.prof;
    this.nick = user.nick;
    this.chatService.getChats().subscribe(res=>{
      const C = this.chatService.chats = res as Chat[];
      for(var i in C){
        if(C[i].userId === user.prof){
          this.chatService.selectedChat = C[i];
          this.getHistory(C[i]);
          return
        }
      }
      this.chatService.selectedChat = new Chat;
    })
  }

  getHistory(chat: Chat){

  }

  hideChat(){
    this.partner = '';
  }

}
