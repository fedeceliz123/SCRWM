export class Scrwm {

    _id: string; 
    title: string;
    subtitle: string;
    creator: string;
    inciseInit: string;
    followers: string[];

    constructor(_id="", title="", subtitle="", creator="", inciseInit=""){
        this._id = _id;
        this.title = title;
        this.subtitle = subtitle;
        this.creator = creator;
        this.inciseInit = inciseInit;
        this.followers = [];
    }
}