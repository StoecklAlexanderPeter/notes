import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Note } from '../_classes/note';
import { AuthService } from '../_services/auth.service';
import { NoteService } from '../_services/note.service';
import { PermissionService } from '../_services/permission.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private currentUserUid;

  public myNotes;
  public mySharedNotes;

  constructor(public alertController: AlertController, private noteService: NoteService, private permissionService: PermissionService, private authService: AuthService) {
    this.authService.currentUser.then((user) => {
      if (user) {
        console.log(user);
        this.currentUserUid = user.uid;
        this.noteService.getNotesFromUser(user.uid).subscribe(notes => {
          this.myNotes = notes;
        })

        this.mySharedNotes = [];
        this.permissionService.getPermissionsFromUser(user.uid).subscribe(ps => {
          ps.forEach(p => {
            this.noteService.get(p.noteid).pipe(take(1)).subscribe(n => {
              n.key = p.noteid;
              this.mySharedNotes.push(n);
            })
          })
        })
      }
    })
  }

  private create(title) {
    let date = new Date().toISOString();
    let note: Note = {
      uid: this.currentUserUid, 
      title: title,
      content: "",
      created: date,
      modified: date
    }
    this.noteService.create(note)
      .then((message) => {
        this.alert(message, message);
      }).catch((err) => {
        this.alert("ERROR", err.message)
      })
  }

  public async createAlert() {
    const alert = await this.alertController.create({
      header: "Create note",
      subHeader: 'Notes',
      message: "",
      inputs: [{name: "title", type: "text"}],
      buttons: [
        {
            text: 'OK',
            handler: data => {
                console.log(JSON.stringify(data)); //to see the object
                this.create(data.title);
            }
        }
      ]
    });

    await alert.present();
  }

  async alert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: 'Notes',
      message: message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  public async deleteAlert(note: Note) {
    const alert = await this.alertController.create({
      header: "Confirm Deletion",
      subHeader: 'Notes',
      message: "Confirm your deletion of Note: " + note.title,
      buttons: [
        {text: "Cancel"}, 
        {text: "Delete", handler: () => {
          this.noteService.delete(note.key)
            .then(message => {
              this.alert(message, message);
            }).catch((err) => {
              this.alert("ERROR", err.message);
            })
        } 
      }]
    });

    await alert.present();
  }

  public formatDate(dateString) {
    let date = new Date(dateString);
    return date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getSeconds();
  }
}
