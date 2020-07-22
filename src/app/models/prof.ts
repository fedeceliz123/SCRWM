export class Prof {

        _id: string; 
        userId: string;
        nickname: string;
        state: string;
        description: string;
        favIncises: string[];
        anchors: string[];
        followers: string[];
    
    constructor(_id="", userId="", nickname="", state="", description=""){
        this._id = _id;
        this.userId = userId;
        this.nickname = nickname;
        this.state = state;
        this.description = description;
        this.favIncises = [];
        this.anchors = [];
        this.followers = [];
    }

}

