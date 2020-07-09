import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor() { 
  }

  subrayar(el: ElementRef){
    el.nativeElement.style.backgroundColor = "yellow";
  }

}
