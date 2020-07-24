export class Prof {

        _id: string; 
        userId: string;
        nickname: string;
        state: string;
        miniBio: string;
        favIncises: string[];
        anchors: string[];
        following: string[];
        followers: number;
    
    constructor(_id="", userId="", nickname="", state="", miniBio=""){
        this._id = _id;
        this.userId = userId;
        this.nickname = nickname;
        this.state = state;
        this.miniBio = miniBio;
        this.favIncises = [];
        this.anchors = [];
        this.following = [];
        this.followers = 0;
    }

}

