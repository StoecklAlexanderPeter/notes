import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from '../_classes/user';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  public user: User = {
    uid: null,
    email: "",
    firstname: "",
    lastname: "",
  }

  public userForm: FormGroup;
  public message;
  public teamid: string = null;

  public credentials = {
    email: null,
    password: null
  }

  public loading;
  public submitted = false;

  constructor(private authService: AuthService, private userService: UserService, private formBuilder: FormBuilder, private alertController: AlertController, private router: Router) {
    this.userForm = this.formBuilder.group({
      email: [
        this.credentials.email, [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(new RegExp('^[A-Za-z0-9-]*[.]{1}[A-Za-z0-9-]*@cognizant.com$', 'i'))
        ]
      ],
      firstname: [
        this.user.firstname, [
          Validators.required,
          Validators.maxLength(24)
        ]
      ],
      lastname: [
        this.user.lastname, [
          Validators.required,
          Validators.maxLength(24)
        ]
      ],
      password: [
        this.credentials.password, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64)
        ]
      ]
    });
  }

  get uf() { return this.userForm.controls; }

  ngOnInit() {
  }

  signUp() {
    this.loading = true;
    this.submitted = true;

    if (this.userForm.invalid) {
      this.loading = false;
      return;
    }

    this.credentials.email = this.uf.email.value;
    this.credentials.password = this.uf.password.value;

    this.user.email = this.credentials.email;
    this.user.firstname = this.uf.firstname.value;
    this.user.lastname = this.uf.lastname.value;

    this.authService.signUp(this.credentials.email, this.credentials.password)
      .then((userid: string) => {
        this.user.uid = userid;
        this.userService.create(this.user).then(
          async () => {
            const alert = await this.alertController.create({
              header: 'Notes',
              subHeader: 'Account created',
              message: 'Your account was created ',
              buttons: [{
                text: 'Go to Sign in',
                handler: () => {
                  this.router.navigate(['/sign-in']);
                }
              }]
            });
        
            await alert.present();
          }
        ).catch((err) => {
          this.message = err;
        })
      }).catch((err) => {
        this.message = err;
      })
      this.loading = false;
  }
}
