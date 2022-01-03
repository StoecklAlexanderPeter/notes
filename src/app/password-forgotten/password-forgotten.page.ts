import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.page.html',
  styleUrls: ['./password-forgotten.page.scss'],
})
export class PasswordForgottenPage implements OnInit {

  public emailForm: FormGroup;
  public submitted = false; 
  public errorMessage;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private alertController: AlertController, private router: Router) {
    this.emailForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(new RegExp('^[A-Za-z0-9-]*[.]{1}[A-Za-z0-9-]*@cognizant.com$', 'i'))
      ]]
    })
  }

  public submit() {
    this.submitted = true; 

    if(this.emailForm.invalid) {
      return;
    }

    this.authService.resetPassword(this.emailForm.controls.email.value)
      .then(async (message: string) => {
          const alert = await this.alertController.create({
            header: 'Notes',
            message: message,
            buttons: [{
              text: 'Go to Sign in',
              handler: () => {
                this.router.navigate(['/sign-in']);
              }
            }]
          });
      
          await alert.present();
        }).then((err) => {
          this.errorMessage = err;
        })
  }

  ngOnInit() {
  }

}
