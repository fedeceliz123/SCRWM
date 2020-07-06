export class Incise {

        _id: string;                // se agrega el "_id" porque los datos vienen de Mongodb
        scrwm: string;
        user: string;
        content: string;
        up: string;
        down: string;
        left: string;
        right: string[];
        date: string;
        modified: string;
        record: string;
        
    constructor(_id="", scrwm="", user="", content="", up="", down="", left="", date="", modified="",record=""){
        this._id = _id;
        this.scrwm = scrwm;
        this.user = user;
        this.content = content;
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = [];
        this.date = date;
        this.modified = modified;
        this.record = record;
    }
}
