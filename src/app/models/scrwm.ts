import { Incise } from 'src/app/models/incise'
import { Prof } from 'src/app/models/prof'
import { Image } from 'src/app/models/image'

export class Scrwm {

    incise: Incise;
    prof: Prof;
    image: Image;

    constructor(incise: Incise, prof: Prof, image: Image){
        this.incise = incise;
        this.prof = prof;
        this.image = image
    }
}
