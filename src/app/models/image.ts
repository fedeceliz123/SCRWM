export class Image {

    _id: string;
    imagePath: string;
    userId: string;

    constructor(_id="", imagePath="", userId=""){
        this._id = _id;
        this.imagePath = imagePath;
        this.userId = userId;
    }

}
