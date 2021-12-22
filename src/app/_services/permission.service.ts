import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Permission } from '../_classes/permission';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private db: AngularFireDatabase) { }

  public create(permission: Permission) {
    return new Promise((res, rej) => {
      this.db.list("/permissions/").push(permission)
        .then(() => {
          res("Successfully created permission")
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    })
  }

  public get(key) {
    return this.db.object<Permission>("/permissions/" + key).valueChanges();
  }

  public getPermissionsFromUser(uid) {
    return this.db.list<Permission>("/permissions/", ref => { return ref.orderByChild("uid").equalTo(uid)}).snapshotChanges().pipe(
      map(permissions => 
        permissions.map(permission => (
          {
            uid: permission.key,
            ...permission.payload.val() 
          }
        ))
      )
    );
  }

  public update(permission: Permission) {
    return new Promise((res, rej) => {
      this.db.list("/permissions/").set(permission.uid, permission)
        .then(() => {
          res("Successfully updated permission")
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    })
  }

  public delete(key: string) {
    return new Promise((res, rej) => {
      this.db.list("/permissions/").remove(key)
        .then(() => {
          res("Successfully deleted permission")
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    })
  }
}
