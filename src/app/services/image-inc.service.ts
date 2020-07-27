import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageInc } from '../models/image-inc';

@Injectable({
  providedIn: 'root'
})
export class ImageIncService {

  selectedImageInc: ImageInc;
  imagesInc: ImageInc[];

  readonly URL_API = 'http://localhost:3000/api/scrwm/imagesinc';


  constructor(private http: HttpClient) {
    this.selectedImageInc = new ImageInc();
   }

  getImages() {
    return this.http.get(this.URL_API);
  }

  getImage(_id: string) {
    return this.http.get(this.URL_API + `/${_id}`);
  }

  postImage(imageInc: ImageInc, photo: File) {
    const fd = new FormData();
    fd.append("userId", imageInc.userId);
    fd.append("imageInc", photo);
    fd.append("associatedIncId", imageInc.associatedIncId)
    return this.http.post(this.URL_API, fd);
  }

  deleteImage(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

}
