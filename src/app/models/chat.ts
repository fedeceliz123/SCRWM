import { Mess } from './mess'

export class Chat {

    _id: string; 
    userId: string;
    partner: string;
    messages: Mess[];
    date: string;
    modified: string;

    constructor(_id="", userId="", partner="", date="", modified=""){
        this._id = _id;
        this.userId = userId;
        this.partner = partner;
        this.messages = [];
        this.date = date;
        this.modified = modified;
    }
}
