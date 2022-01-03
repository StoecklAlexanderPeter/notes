import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Permission } from 'src/app/_classes/permission';
import { AuthService } from 'src/app/_services/auth.service';
import { PermissionService } from 'src/app/_services/permission.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  private uid; 
  @Input() noteid; 
  private selectedUserID;
  public emailForm: FormGroup; 
  public permissionForm: FormGroup; 

  public userSelected = false; 
  public permissionsSelected = false;

  public emailSubmitted = false; 

  constructor(private authService: AuthService, private userService: UserService, private permissionService: PermissionService, private formBuilder: FormBuilder, private route: ActivatedRoute, public alertController: AlertController) {
    this.authService.currentUser
      .then((user) => {
        if (user) {
          this.uid = user.uid;
        }
      })

      this.noteid = this.route.snapshot.paramMap.get("id");

      this.emailForm = this.formBuilder.group({
        email: [
          null, [
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(new RegExp('^[A-Za-z0-9-]*[.]{1}[A-Za-z0-9-]*@cognizant.com$', 'i'))
          ]
        ],
      });

      this.permissionForm = this.formBuilder.group({
        read: [ null, [] ],
        write: [ null, [] ],
        execute: [ null, [] ],
      });
  }

  ngOnInit() {}

  getUserWithEmail() {
    this.emailSubmitted = true;
    if (this.emailForm.invalid) {
      return; 
    }

    this.userService.getWithEmail(this.emailForm.controls.email.value)
      .pipe(take(1))
      .subscribe((user) => {
        if (user.length == 0) {
          this.alert("No User Found", "No User Found with email: " + this.emailForm.controls.email.value);
        } else {
          this.selectedUserID = user[0].uid!;
          this.userSelected = true;
        }
      })
  }

  create() {
    let permission: Permission = {
      uid: this.selectedUserID,
      creatoruid: this.uid,
      noteid: this.noteid,
      write: this.permissionForm.controls.write.value,
      read: this.permissionForm.controls.read.value,
      execute: this.permissionForm.controls.execute.value
    }

    this.permissionService.create(permission)
      .then((message) => {
        this.alert(message, message);
      }).catch(err => {
        this.alert("ERROR", err.message);
      })
  }

  async alert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: 'Notes',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


}
