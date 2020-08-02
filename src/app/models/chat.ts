import { Mess } from './mess'

export class Chat {

    _id: string; 
    userA: string;
    userB: string;
    messages: Mess[];

    constructor(_id="", userA="", userB=""){
        this._id = _id;
        this.userA = userA;
        this.userB = userB;
        this.messages = [];
    }
}
  