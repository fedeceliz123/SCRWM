import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ProfService } from 'src/app/services/prof.service';
import { ImageService } from 'src/app/services/image.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mess: string;
  userId: string = sessionStorage.getItem('currentUserId');
  partner: string = '';
  nick: any;
  Online: any[];


  constructor(private socketService: SocketService,
              private imageService: ImageService,
              private profService: ProfService,
  ) { }

  ngOnInit(): void {
    this.listenMessage();
    this.listenUsers();
  }

  listenMessage(){
    this.socketService.listen('whisper').subscribe((data: any) =>{
      const line = document.createElement('p');
      line.textContent = data.message;
      line.style.minWidth = "400px";
      line.style.color = "yellow";
      document.getElementById('container').appendChild(line);
    })
  }

  listenUsers(){
    this.socketService.listen('user ids').subscribe((data) =>{
      this.setConnected(data);
    })
  }

  setConnected(data: any){
    this.Online = [];
    for(var i in data){
      if(data[i] != this.userId){
        let img = "";
        for(var j in this.imageService.images){
          if(this.imageService.images[j].userId === data[i]){
            img = this.imageService.images[j].imagePath;
          }
        }
        this.Online.push({"prof": data[i],"image": img});
      }
    }
  }

  sendChat(form: NgForm){
    let mess = { "message": form.value.message, "toUser": this.nick.userId };
    this.socketService.emit("send message", mess);
    const line = document.createElement('p');
    line.textContent = form.value.message;
    line.style.minWidth = "400px";
    document.getElementById('container').appendChild(line);
    form.reset(); 
  }

  startChat(user: any){
    const P = this.profService.profs
    this.partner = user.prof;
    for(var i in P){
      if(P[i].userId === this.partner){
        this.nick = P[i];
      }
    }
  }

  hideChat(){
    this.partner = '';
  }

}

