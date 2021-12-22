import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../_classes/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  public create(user: User) {
    return new Promise((res, rej) => {
      this.db.list("/users/").set(user.uid, user)
        .then(() => {
          res("Successfully created user " + user.firstname + " " + user.lastname)
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    })
  }

  public get(uid) {
    return this.db.object<User>("/users/" + uid).valueChanges();
  }

  public getWithEmail(email) {
    return this.db.list<User>("/users/", ref => { return ref.orderByChild("email").equalTo(email)}).snapshotChanges().pipe(
      map(users => 
        users.map(user => (
          {
            uid: user.key,
            ...user.payload.val() 
          }
        ))
      )
    );
  }

  public update(user: User) {
    return new Promise((res, rej) => {
      this.db.list("/users/").set(user.uid, user)
        .then(() => {
          res("Successfully updated user " + user.firstname + " " + user.lastname)
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    })
  }
}
