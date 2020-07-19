export class Prof {

        _id: string; 
        userId: string;
        nickname: string;
        state: string;
        description: string;
        favIncises: string[];
        favScrwms: string[];
        followers: string[];
    
    constructor(_id="", userId="", nickname="", imagePath="", state="", description=""){
        this._id = _id;
        this.userId = userId;
        this.nickname = nickname;
        this.state = state;
        this.description = description;
        this.favIncises = [];
        this.favScrwms = [];
        this.followers = [];
    }

}

