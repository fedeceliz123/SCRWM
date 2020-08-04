import { Mess } from './mess'

export class Chat {

    _id: string; 
    partner: string;
    messages: Mess[];

    constructor(_id="", partner=""){
        this._id = _id;
        this.partner = partner;
        this.messages = [];
    }
}