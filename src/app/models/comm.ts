export class Comm {
    IdComm: string;
    initial: number;
    final: number;
    commt: string;
    
    constructor(IdComm="", commt=""){
        this.IdComm = IdComm;
        this.initial = 0;
        this.final = 0;
        this.commt = commt;
    }
} 