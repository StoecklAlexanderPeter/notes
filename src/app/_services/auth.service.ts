import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser = this.auth.currentUser;

  constructor(private auth: AngularFireAuth) {}

  public signIn(email: string, password: string) {
    return new Promise((res, rej) => {
      this.auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
          res(user.user.email + " sucessfully logged in")
          /*if (user.user.emailVerified) {
            res(user.user.email + " sucessfully logged in")
          } else {
            this.signOut()
              .then(() => {
                rej("please verify your e-mail first")
              }).catch((err) => {
                console.error(err);
                rej(err.message)
              })
          }*/
        }).catch((err) => {
          rej(err.message);
        })
    })
  }

  public signUp(email: string, password: string) {
    return new Promise((res, rej) => {
      this.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          user.user.sendEmailVerification();
          res(user.user.uid);
        }).catch((err) => {
          rej(err);
        })
    })
  }

  public resetPassword(email: string) {
    return new Promise((res, rej) => {
      this.auth.sendPasswordResetEmail(email)
        .then(() => {
          res("Password Reset E-Mail sent to " + email);
        }).catch((err) => {
          console.error(err);
          rej(err.message);
        })
    })
  }

  public signOut() {
    return new Promise((res, rej) => {
      this.auth.signOut()
        .then(() => {
          res("Successfully logged out");
        }).catch((err) => {
          console.error(err);
          rej(err);
        })
    }) 
  }
}
