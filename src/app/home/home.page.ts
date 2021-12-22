import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Note } from '../_classes/note';
import { AuthService } from '../_services/auth.service';
import { NoteService } from '../_services/note.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private currentUserUid;

  public myNotes;

  constructor(public alertController: AlertController, private noteService: NoteService, private authService: AuthService) {
    this.authService.currentUser.then((user) => {
      if (user) {
        this.currentUserUid = user.uid;
        this.noteService.getNotesFromUser(user.uid).subscribe(notes => {
          this.myNotes = notes;
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
      buttons: ["Submit"]
    });

    await alert.present();
    const { data } = await alert.onDidDismiss();

    if(data.title) {
      this.create(data.title);
    }

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
      message: "Confirm your deletion of Note" + note.title,
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
    const { data } = await alert.onDidDismiss();

    if(data.title) {
      this.create(data.title);
    }

  }
}
