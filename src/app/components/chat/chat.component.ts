import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ChatService } from 'src/app/services/chat.service';

import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { NgForm } from '@angular/forms';

import { Chat } from 'src/app/models/chat'
import { Mess } from 'src/app/models/mess'

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
      if(this.partner === data.toUser){
        this.addMessage(data);
        return;
      }
      for(var i in this.Online){
        if(this.Online[i].prof === data.toUser){
          this.partner = data.toUser;
          this.setNick(data);
          this.findChat(data);

          let audio = new Audio();
          audio.src = "assets/audio/chime_bell_ding.wav";
          audio.load();
          audio.play();

          return;
        }
      }
    });
  }

  setNick(data: any){
    for(var i in this.Online){
      if(this.Online[i].prof === data.toUser){
        this.nick = this.Online[i].nick;
        return;
      }
    }
  }

  findChat(data: any){
    this.chatService.getChats().subscribe(res=>{
      const C = this.chatService.chats = res as Chat[];
      for(var i in C){
        if(C[i].partner === data.toUser && C[i].userId === this.userId){
          this.chatService.selectedChat = C[i];
          this.addMessage(data);
          return;
        }
      }
      this.chatService.selectedChat = new Chat;
      this.chatService.selectedChat.partner = data.toUser;
      this.chatService.selectedChat.userId = this.userId;
      this.addMessage(data);
    });
  }

  addMessage(data: any){
    const mess = new Mess;
    mess.received = true;
    mess.message = data.message;
    mess.date = Date();
    this.chatService.selectedChat.messages.push(mess);
    this.displayChatBox();
  }

  displayChatBox(){
    if(document.getElementById('container').innerHTML){
      document.getElementById('container').innerHTML = "";
   }
    const M = this.chatService.selectedChat.messages;
    for(var i in M){
      if(M[i].received){
        this.newLinePartner(M[i].message);
      } else {
        this.newLineUser(M[i].message);
      }
    }
    this.saveChat();
  }

  newLinePartner(message: string){
    const line = document.createElement('p');
    line.textContent = message;
    line.style.minWidth = "400px";
    line.style.color = "yellow";
    document.getElementById('container').appendChild(line);
  }

  newLineUser(message: string){
    const line = document.createElement('p');
    line.textContent = message;
    line.style.minWidth = "400px";
    line.style.color = "white";
    line.align = "end";
    document.getElementById('container').appendChild(line);
  }

  saveChat(){
    const C = this.chatService.selectedChat;
    if(this.chatService.selectedChat._id){
      this.chatService.putChat(C).subscribe(res=>{});
    } else {
      this.chatService.postChat(C).subscribe(res=>{});
    }
  }

  sendMessenge(form: NgForm){
    let mess = { "message": form.value.message, "toUser": this.partner };
    this.socketService.emit("send message", mess);
    const A = this.fillMess(form);
    this.chatService.selectedChat = A;
    this.displayChatBox();
    form.reset();
  }

  fillMess(form: NgForm){
    const mess = new Mess;
    mess.received = false;
    mess.message = form.value.message;
    mess.date = Date();
    this.chatService.selectedChat.messages.push(mess);
    return this.chatService.selectedChat;
  }

  startChat(user: any){
    this.partner = user.prof;
    this.nick = user.nick;
    this.chatService.getChats().subscribe(res=>{
      const C = this.chatService.chats = res as Chat[];
      for(var i in C){
        if(C[i].partner === user.prof && C[i].userId === this.userId){
          this.chatService.selectedChat = C[i];
          this.displayChatBox();
          return
        }
      }
      this.chatService.selectedChat = new Chat;
      this.chatService.selectedChat.userId = this.userId;
      this.chatService.selectedChat.partner = user.prof;
    })
  }

  hideChat(){
    this.partner = '';
    //this.deleteAllChats();
    let audio = new Audio();
    audio.src = "assets/audio/digi_plink.wav";
    audio.load();
    audio.play();
  }

  deleteAllChats(){
    this.chatService.getChats().subscribe(res=>{
      const C = this.chatService.chats = res as Chat[];
      for(var i in C){
        this.chatService.deleteChat(C[i]._id).subscribe(res=>{});
      }
    });
  }

}
