import { Comm } from './comm'

export class Incise {

        _id: string;
        prof: string;
        content: string;
        title: string;
        subtitle: string;

        up: string[];
        down: string[];
        left: Comm[];
        right: string[];
        before: string[];
        after: string[];
        media: string;

        hashtag: string[];
        diamond: number;
        date: string;
        modified: string;
        publicity: boolean;

        
    constructor(_id="", prof="", content="", title="", subtitle="", date="", modified="", media=""){
        
        this._id = _id;
        this.prof = prof;
        this.content = content;
        this.title = title;
        this.subtitle = subtitle;

        this.up = [];
        this.down = [];
        this.left = [];
        this.right = [];
        this.before = [];
        this.after = [];
        this.media = media

        this.hashtag = [];
        this.diamond = 0;
        this.date = date;
        this.modified = modified;
        this.publicity = false;
    }
}
