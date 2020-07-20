import { Comm } from './comm'

export class Incise {

        _id: string;
        scrwm: string;
        user: string;
        content: string;

        up: string[];
        down: string[];
        left: Comm[];
        right: string[];

        hashtag: string[];
        diamond: number;
        date: string;
        modified: string;
        record: string[] ;

        
    constructor(_id="", scrwm="", user="", content="", date="", modified=""){
        this._id = _id;
        this.scrwm = scrwm;
        this.user = user;
        this.content = content;

        this.up = [];
        this.down = [];
        this.left = [];
        this.right = [];

        this.hashtag = [];
        this.diamond = 0;
        this.date = date;
        this.modified = modified;
        this.record = [];

    }
}
