import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Note } from '../_classes/note';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(public db: AngularFireDatabase) {}

  public create(note: Note) {
    return new Promise((res, rej) => {
      this.db.list("/notes/").push(note)
        .then(() => {
          res("Successfully created note " + note.title)
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    })
  }

  public get(key) {
    return this.db.object<Note>("/notes/" + key).valueChanges();
  }

  public getNotesFromUser(uid) {
    return this.db.list<Note>("/notes/", ref => { return ref.orderByChild("uid").equalTo(uid)}).snapshotChanges().pipe(
      map(notes => 
        notes.map(note => (
          {
            key: note.key,
            ...note.payload.val() 
          }
        ))
      )
    );
  }

  public update(note: Note) {
    return new Promise((res, rej) => {
      this.db.list("/notes/").set(note.key, note)
        .then(() => {
          res("Successfully updated note " + note.title)
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    })
  }

  public delete(key: string) {
    return new Promise((res, rej) => {
      this.db.list("/notes/").remove(key)
        .then(() => {
          res("Successfully deleted note")
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    })
  }
}
