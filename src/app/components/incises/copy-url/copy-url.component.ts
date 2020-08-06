import { Component, OnInit } from '@angular/core';
import { InciseService } from 'src/app/services/incise.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-copy-url',
  templateUrl: './copy-url.component.html',
  styleUrls: ['./copy-url.component.css']
})
export class CopyUrlComponent implements OnInit {

  constructor(
    public inciseService: InciseService,
    public dialog: MatDialog,
    ){ }

  ngOnInit(): void {
  }

}




