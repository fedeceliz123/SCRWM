import { CommonModule } from '@angular/common';

export class Comm {
    IdComm: string;
    initial: number;
    final: number;
    substring: string;
    
    constructor(IdComm="", substring=""){
        this.IdComm = IdComm;
        this.initial = 0;
        this.final = 0;
        this.substring = substring;
    }

}