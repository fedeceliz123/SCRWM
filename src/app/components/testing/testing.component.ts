import { Component, OnInit } from '@angular/core';
import { ProfService} from 'src/app/services/prof.service'
import { Prof } from 'src/app/models/prof'
import { AuthService } from 'src/app/services/auth.service'

declare var M: any; 

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  constructor(public profService: ProfService,
              public authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  checkProf(ubicación: string){
    if(!this.profService.userProf._id && !!localStorage.getItem('token')){
      M.toast({html: "userProf se perdió en " + ubicación}); 
      this.findProf();
    }
  }

  findProf(){
    if(this.authService.loggedIn()){
      this.profService.getProfs()
      .subscribe(res => {
        const A = this.profService.profs = res as Prof[];
        for (var i in A){
          if(A[i].userId === sessionStorage.getItem('currentUserId')){
            this.profService.userProf = A[i];
          }
        }
      })  
    }
  }

}
