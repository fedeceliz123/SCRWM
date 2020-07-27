export class ImageInc {

    _id: string;
    imagePath: string;
    userId: string;
    associatedIncId: string;

    constructor(_id="", imagePath="", userId="", associatedIncId=""){
        this._id = _id;
        this.imagePath = imagePath;
        this.userId = userId;
        this.associatedIncId = associatedIncId;
    }

}
