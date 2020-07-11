export class Incise {

        _id: string;                // se agrega el "_id" porque los datos vienen de Mongodb
        scrwm: string;
        user: string;
        content: string;
        up: string[];
        down: string[];
        left: string[];
        right: string[];
        date: string;
        modified: string;
        record: string[] ;
        hashtag: string[];
        
    constructor(_id="", scrwm="", user="", content="", date="", modified=""){
        this._id = _id;
        this.scrwm = scrwm;
        this.user = user;
        this.content = content;
        this.up = [];
        this.down = [];
        this.left = [];
        this.right = [];
        this.date = date;
        this.modified = modified;
        this.record = [];
        this.hashtag = [];

    }
}
