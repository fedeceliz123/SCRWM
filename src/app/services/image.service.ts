import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Image } from '../models/image'

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  selectedImage: Image;
  images: Image[];

  readonly URL_API = 'http://localhost:3000/api/scrwm/images';
 
  constructor(private http: HttpClient) {
    this.selectedImage = new Image();
   }


  getImages() {
    return this.http.get(this.URL_API);
  }

  getImage(_id: string) {
    return this.http.get(this.URL_API + `/${_id}`);
  }

  postImage(image: Image, photo: File) {
    const fd = new FormData();
    fd.append("userId", image.userId);
    fd.append("image", photo);
    return this.http.post(this.URL_API, fd);
  }

  deleteImage(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

}