export class Prof {

        _id: string; 
        userId: string;
        nickname: string;
        imagePath: string;
        state: string;
        description: string;
    
    constructor(_id="", userId="", nickname="", imagePath="", state="", description=""){
        this._id = _id;
        this.userId = userId;
        this.nickname = nickname;
        this.imagePath = imagePath;
        this.state = state;
        this.description = description;
    }

}
