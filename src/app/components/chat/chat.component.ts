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
  nick: string;
  Online: any[];


  constructor(private socketService: SocketService,
              private imageService: ImageService,
              public profService: ProfService,
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

  sendChat(form: NgForm){
    let mess = { "message": form.value.message, "toUser": this.partner };
    this.socketService.emit("send message", mess);
    const line = document.createElement('p');
    line.textContent = form.value.message;
    line.style.minWidth = "400px";
    line.style.color = "white";
    line.align = "end";
    document.getElementById('container').appendChild(line);
    form.reset(); 
  }

  startChat(user: any){
    console.log(this.Online)
    const P = this.profService.profs
    this.partner = user.prof;
    this.nick = user.nick;
  }

  hideChat(){
    this.partner = '';
  }

}

