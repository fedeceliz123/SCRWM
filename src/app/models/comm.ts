import { CommonModule } from '@angular/common';

export class Comm {
    IdComm: string;
    initial: string;
    final: string;

    
    constructor(IdComm="", initial="", final=""){
        this.IdComm = IdComm;
        this.initial = initial;
        this.final = final;
    }

}