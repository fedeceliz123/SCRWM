export class Mess {
    emisor: string;
    receptor: string;
    message: string;
    date: string;
    
    constructor(emisor="", receptor="", message="", date=""){
        this.emisor = emisor;
        this.receptor = receptor;
        this.message = message;
        this.date = date;
    }
} 