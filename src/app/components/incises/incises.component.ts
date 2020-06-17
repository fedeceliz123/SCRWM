import { Component, OnInit } from '@angular/core';
import { InciseService } from '../../services/incise.service';
import { NgForm } from '@angular/forms';
import { Incise } from 'src/app/models/incise';

declare var M: any;

@Component({
  selector: 'app-incises',
  templateUrl: './incises.component.html',
  styleUrls: ['./incises.component.css'],
  providers: [InciseService]
})
export class IncisesComponent implements OnInit {

  constructor(public inciseService: InciseService ) { }
  
  // Cuando la aplicación inicia
  ngOnInit(): void { 
    this.getIncises();
  }

  addIncise(form: NgForm){
    if(form.value._id){
      this.inciseService.putIncise(form.value)
        .subscribe(res => {
          console.log(res);
          this.resetForm(form);
          M.toast({html: 'Updated Successfuly'});
          this.getIncises();
        });
    } else { 
      this.inciseService.postIncise(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({html: 'Saved Successfuly'});
          this.getIncises();
        });
    }    
  }

  getIncises(){
    this.inciseService.getIncises()
      .subscribe(res => {
        this.inciseService.incises = res as Incise[];
        console.log(res);
      });
  }

  editIncise(incise: Incise){
    this.inciseService.selectedIncise = incise;
  }

  deleteIncise(_id: string){
    if(confirm('Are you sure?')){
      this.inciseService.deleteIncise(_id)
      .subscribe(res => {
        this.getIncises();    
        M.toast({html: 'Deleted'});        
      });
    }
  }

  resetForm(form?: NgForm){
    if (form){
      form.reset();
      this.inciseService.selectedIncise = new Incise();
    }
  }


}
