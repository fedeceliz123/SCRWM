import { Component, OnInit } from '@angular/core';
import * as BallonEditor from '@ckeditor/ckeditor5-build-balloon';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';


@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  public Editor = BallonEditor;

  print(data: any){
  }

}
