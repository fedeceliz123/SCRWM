import { Component, OnInit } from '@angular/core';
import { InciseService } from 'src/app/services/incise.service';
import { ShowAroundComponent } from 'src/app/components/incises/show-around/show-around.component'
import { Incise } from 'src/app/models/incise';
import { Comm } from 'src/app/models/comm';

declare var M: any; 

@Component({
  selector: 'app-edit-around',
  templateUrl: './edit-around.component.html',
  styleUrls: ['./edit-around.component.css']
})
export class EditAroundComponent implements OnInit {

  newInc: Incise;

  constructor(
    public inciseService: InciseService, 
    public showAround: ShowAroundComponent,
    ){ }

  ngOnInit(): void {
  }

  editAround(incise: Incise, direction: string, comm?: Comm){
    this.newInc = incise;
    this.checkContent();
    this.playAudio();
    this.setOldInc(direction, comm);
  }

  checkContent(){ 
    if(document.getElementById('E').textContent === ""){
      document.getElementById('E').textContent = "(Blank)";
    }
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/pop_drip.wav";
    audio.load();
    audio.play();
  }

  setOldInc(direction: string, comm?: Comm){
    let oldInc = this.inciseService.selectedIncise
    oldInc.media = this.showAround.ImageIncPath;
    oldInc.content = document.getElementById('E').textContent;
    if(direction === '*'){
      this.inciseService.putIncise(oldInc).subscribe();
      this.showAround.toCenter(this.newInc);
    } else {
      this.linkStereo1(direction, oldInc, comm);
    }
  }

  linkStereo1(direction: string, oldInc: Incise, comm?: Comm){
    switch (direction){
      case "Up":
        for(var i in oldInc.up){
          if(oldInc.up[i] === this.newInc._id){
            this.linkStereo2(direction, oldInc);
            return;
          }
        }
        oldInc.up.push(this.newInc._id);
        break;
      case "Down":
        for(var i in oldInc.down){
          if(oldInc.down[i] === this.newInc._id){
            this.linkStereo2(direction, oldInc);
            return;
          }
        }
        oldInc.down.push(this.newInc._id);
        break;
      case "Left":
        for(var i in oldInc.left){
          if(oldInc.left[i].IdComm === this.newInc._id){
            this.linkStereo2(direction, oldInc);
            return;
          }
        }
        const commt = new Comm;
        commt.IdComm = this.newInc._id;
        oldInc.left.push(commt);
        break;
      case "Right":
        for(var i in oldInc.right){
          if(oldInc.right[i] === this.newInc._id){
            this.linkStereo2(direction, oldInc, comm);
            return;
          }
        }
        oldInc.right.push(this.newInc._id);
        break;
    }
    this.linkStereo2(direction, oldInc, comm)
  }

  linkStereo2(direction: string, oldInc: Incise, comm?: Comm){
    this.inciseService.putIncise(oldInc).subscribe();
    switch (direction){
      case "Up":
        for(var i in this.newInc.down){
          if(this.newInc.down[i] === oldInc._id){
            this.linkStereo4();
            return;
          }
        }
        this.newInc.down.push(oldInc._id);
        break;
      case "Down":
        for(var i in this.newInc.up){
          if(this.newInc.up[i] === oldInc._id){
            this.linkStereo4();
            return;
          }
        }
        this.newInc.up.push(oldInc._id);
        break;
      case "Left":
        for(var i in this.newInc.right){
          if(this.newInc.right[i] === oldInc._id){
            this.linkStereo4();
            return;
          }
        }
        this.newInc.right.push(oldInc._id);
        break;
      case "Right":
        if(comm){
          this.newInc.left.push(comm)
          this.linkStereo4();
          return
        }
        for(var i in this.newInc.left){
          if(this.newInc.left[i].IdComm === oldInc._id){
            this.linkStereo4();
            return;
          }
        }
        const commt = new Comm;
          commt.IdComm = oldInc._id;
          this.newInc.left.push(commt);
          break;
    }
    this.linkStereo4();
  }

  linkStereo4(){
    this.inciseService.putIncise(this.newInc).subscribe()
    this.showAround.toCenter(this.newInc);
  }

}