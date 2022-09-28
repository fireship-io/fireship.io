---
title: Email Password Auth
description: SignUp, SignIn, and reset a password with Reactive Forms
weight: 32
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 358928542
emoji: 📧
video_length: 11:32
---

- Official [Reactive Forms Docs](https://angular.io/api/forms/ReactiveFormsModule)



## Steps

### Step 1 - Initial Setup

{{< file "terminal" "command line" >}}
```text
ng g component user/email-login
```

Your user module should look similer to this:

{{< file "ngts" "user.module.ts" >}}
```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { EmailLoginComponent } from './email-login/email-login.component';

@NgModule({
  declarations: [LoginPageComponent, GoogleSigninDirective, EmailLoginComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
```

Make sure to declare the form in the login page for unauthenticated users.

{{< file "html" "login-page.component.html" >}}
```html
<div *ngIf="!(afAuth.authState | async)">
  <!-- omitted -->

  <app-email-login></app-email-login>
</div>
```

### Step 2 - Typescript Logic

{{< file "ngts" "email-login.component.ts" >}}
```typescript
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent implements OnInit {
  form: FormGroup;

  type: 'login' | 'signup' | 'reset' = 'signup';
  loading = false;

  serverMessage: string;

  constructor(private afAuth: AngularFireAuth, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.minLength(6), Validators.required]
      ],
      passwordConfirm: ['', []]
    });
  }

  changeType(val) {
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit() {
    this.loading = true;

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        await this.afAuth.signInWithEmailAndPassword(email, password);
      }
      if (this.isSignup) {
        await this.afAuth.createUserWithEmailAndPassword(email, password);
      }
      if (this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = 'Check your email';
      }
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }
}

```

### Step 3 - Form Template

{{< file "html" "email-login.component.html" >}}
```html
<mat-card>
  <div *ngIf="isSignup">
    <h3>Create Account</h3>

    <button mat-stroked-button (click)="changeType('login')">
      Returning user?
    </button>
  </div>

  <div *ngIf="isLogin">
    <h3>Sign In</h3>
    <button size="small" mat-stroked-button (click)="changeType('signup')">
      New user?
    </button>
  </div>

  <div *ngIf="isPasswordReset">
    <h3>Reset Password</h3>
    <button size="small" mat-button (click)="changeType('login')">Back</button>
  </div>

  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <mat-form-field [color]="email.valid && 'accent'">
      <input
        matInput
        formControlName="email"
        type="email"
        placeholder="Email"
        autocomplete="off"
      />

      <mat-error *ngIf="email.invalid && email.dirty">
        You must enter a valid email address
      </mat-error>
    </mat-form-field>

    <mat-form-field [color]="email.valid && 'accent'" *ngIf="!isPasswordReset">
      <input
        matInput
        formControlName="password"
        type="password"
        placeholder="Password"
        autocomplete="off"
      />

      <mat-error *ngIf="password.invalid && password.dirty">
        Password must be at least 6 characters long
      </mat-error>
    </mat-form-field>

    <mat-form-field
      [color]="passwordDoesMatch ? 'accent' : 'warn'"
      *ngIf="isSignup"
    >
      <input
        matInput
        formControlName="passwordConfirm"
        type="password"
        placeholder="Confirm password"
        autocomplete="off"
      />

      <mat-error *ngIf="passwordConfirm.dirty && !passwordDoesMatch">
        Password does not match
      </mat-error>
    </mat-form-field>

    <mat-error class="server-error">{{ serverMessage }}</mat-error>

    <button
      *ngIf="isPasswordReset"
      mat-stroked-button
      type="submit"
      [disabled]="loading"
    >
      Send Reset Email
    </button>

    <button
      *ngIf="!isPasswordReset"
      mat-raised-button
      color="accent"
      type="submit"
      [disabled]="form.invalid || !passwordDoesMatch || loading"
    >
      Submit
    </button>
  </form>

  <button
    mat-button
    *ngIf="isLogin && !isPasswordReset"
    (click)="changeType('reset')"
  >
    Forgot password?
  </button>
</mat-card>
```


## Bonus Video


<div class="vid-center">
{{< youtube JeeUY6WaXiA >}}
</div>