export class Mess {
    received: boolean;
    message: string;
    date: string;
    
    constructor(message="", date=""){
        this.received = false;
        this.message = message;
        this.date = date;
    }
} 