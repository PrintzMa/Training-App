import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {
  progress: number = 0;
  timer: any;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.progress = this.progress + 5;
      if (this.progress >= 100) clearInterval(this.timer);
    }, 1000)
  }

  onStop() {
    clearImmediate(this.timer);
    this.dialog.open();
  }




}
