import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  public credentials = {
    email: null,
    password: null
  }
  public credentialsForm: FormGroup;
  public loading = false;
  public submitted = false;
  public errorMessage = null;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { 
    this.credentialsForm = this.formBuilder.group({
      email: [
        this.credentials.email, [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(new RegExp('^[A-Za-z0-9-]*[.]{1}[A-Za-z0-9-]*@cognizant.com$', 'i'))
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

  ngOnInit() {
  }

  get cf() { return this.credentialsForm.controls; }

  signIn() {
    this.submitted = true;
    this.loading = true;

    if(this.credentialsForm.invalid) {
      this.loading = false;
      return;
    }

    this.credentials.email = this.cf.email.value;
    this.credentials.password = this.cf.password.value;

    this.authService.signIn(this.credentials.email, this.credentials.password)
      .then( () => {
        this.router.navigate(["home"]);
      }).catch((err) => { 
        this.errorMessage = err
      });

      this.loading = false;
  }

}
