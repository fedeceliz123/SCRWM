export class Incise {

        _id: string;
        scrwm: string;
        user: string;
        content: string;
        subcontent: string[];
        up: string[];
        down: string[];
        left: string[];
        right: string[];
        date: string;
        modified: string;
        record: string[] ;
        hashtag: string[];
        diamond: number;
        
    constructor(_id="", scrwm="", user="", content="", subcontent="", date="", modified="", diamond=""){
        this._id = _id;
        this.scrwm = scrwm;
        this.user = user;
        this.content = content;
        this.subcontent = [];
        this.up = [];
        this.down = [];
        this.left = [];
        this.right = [];
        this.date = date;
        this.modified = modified;
        this.record = [];
        this.hashtag = [];
        this.diamond = 0;
    }
}
