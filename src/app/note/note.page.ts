import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {
  
  public note = {
    title: "Titel",
    content: null,
    dateCreated: "1.1.2021",
    uid: 2002
  }

  public permission = {
    read: true,
    write: false,
    execute: true
  }

  constructor() {}

  public updateNote() {
    console.log("called")
    console.log(this.note.content);
  }

  ngOnInit() {
  }

}
