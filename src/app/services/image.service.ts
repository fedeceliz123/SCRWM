import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Image } from '../models/image'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  selectedImage: Image;
  images: Image[];

  private URL_API = environment.apiUrl + 'api/scrwm/images';
 
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