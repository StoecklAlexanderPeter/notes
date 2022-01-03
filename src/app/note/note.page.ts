import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Note } from '../_classes/note';
import { AuthService } from '../_services/auth.service';
import { NoteService } from '../_services/note.service';
import { PermissionService } from '../_services/permission.service';
import { InvitePage } from './invite/invite.page';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {
  
  public note: Note = {
    uid: "",
    content: "",
    title: "",
    modified: "",
    created: ""
  }

  public permission = {
    read: true,
    write: false,
    execute: true
  }

  private uid;

  public allowRead = false; 
  public allowWrite = false; 
  public allowExecute = false; 

  constructor(private noteService: NoteService, private permissionService: PermissionService, private authService: AuthService, private route: ActivatedRoute, public modalController: ModalController, private alertController: AlertController, private router: Router) {
    this.noteService.get(this.route.snapshot.paramMap.get("id")).subscribe(note => {
      this.note = note;
      //var length = quill.getLength();

      this.authService.currentUser
        .then(user => {
          if (user) {
            this.uid = user.uid; 
            if (this.note.uid == this.uid) {
              this.allowRead = true;
              this.allowWrite = true; 
              this.allowExecute = true; 
            } else {
              this.permissionService
                .getPermissionsFromUser(this.uid)
                .pipe(take(1))
                .subscribe((permissions) => {
                  permissions.forEach(p => {
                    if (p.noteid == this.note.key) {
                      if (p.read) {
                        this.allowRead = true;
                      }
                      if (p.write) {
                        this.allowWrite = true;
                      }
                      if (p.execute) {
                        this.allowExecute = true;
                      }
                    }
                  })
                })
            }
          }
        })
      this.note.key = this.route.snapshot.paramMap.get("id");
    })
  }

  public updateNote() {
    let date = new Date().toISOString();
    this.note.modified = date;
    console.log(this.note.content)
    this.noteService.update(this.note);
  }

  ngOnInit() {
  }

  public formatDate(dateString) {
    let date = new Date(dateString);
    return date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getSeconds();
  }

  public async invite() {
    const modal = await this.modalController.create({
      component: InvitePage,
      componentProps: {
        'noteid': this.note.key,
      }
    });
    return await modal.present();
  }

  public async delete() {
    const alert = await this.alertController.create({
      header: "Confirm Deletion",
      subHeader: 'Notes',
      message: "Confirm your deletion of Note: " + this.note.title,
      buttons: [
        {text: "Cancel"}, 
        {text: "Delete", handler: () => {
          this.noteService.delete(this.note.key)
            .then(message => {
              this.alert(message, message);
              this.router.navigate(["/home"]);
            }).catch((err) => {
              this.alert("ERROR", err.message);
            })
        } 
      }]
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
}
