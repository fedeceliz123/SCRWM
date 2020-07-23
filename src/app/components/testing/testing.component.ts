import { Component, OnInit } from '@angular/core';

import { ProfService} from 'src/app/services/prof.service'

import { Prof } from 'src/app/models/prof'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  constructor(public profService: ProfService,
  ) { }

  ngOnInit(): void {
  }

  checkProf(ubicación: string){
    if(!this.profService.selectedProf._id){
      alert("SelectedProf se perdió en " + ubicación);
      this.findProf();
    }
  }

  findProf(){
    this.profService.getProfs()
    .subscribe(res => {
      const A = this.profService.profs = res as Prof[];
      for (var i in A){
        if(A[i].userId === sessionStorage.getItem('currentUserId')){
          this.profService.selectedProf = A[i];
        }
      }
    })
  }

}
