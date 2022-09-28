---
title: Google SignIn
description: Create a directive that extends Google SignIn to any button or element
weight: 31
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 358918735
emoji: 👤
video_length: 4:37
---

## Steps

### Step 1 - Generate the Google Signin Directive


{{< file "terminal" "command line" >}}
```text
ng g directive user/google-signin
```

The directive listens to the click event on the host element to trigger the signin process in Firebase. 

[Event Types](https://developer.mozilla.org/en-US/docs/Web/Events)


{{< file "ngts" "google-signin.directive.ts" >}}
```typescript
import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app;

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {
  constructor(private afAuth: AngularFireAuth) {}

  @HostListener('click')
  onclick() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}

```

The directive can be attached to any button or clickable element.

### Step 2 - Attach the Directive to a Button

Update the Login Page to use the directive on a material button and listen to the AngularFire user.  

{{< file "ngts" "login-page.component.ts" >}}
```typescript
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  constructor(public afAuth: AngularFireAuth) { }

}
```

{{< file "html" "login-page.component.html" >}}
```html
  <div *ngIf="!(afAuth.authState | async)">
    <h1>Login</h1>

    <button mat-raised-button appGoogleSignin>
      <img src="/assets/google-logo.svg" /> Login with Google
    </button>
  </div>

  <div *ngIf="afAuth.authState | async as user" class="logout">
    <p>
      Logged in as <strong>{{ user.email }}</strong>
    </p>

    <button mat-stroked-button (click)="afAuth.signOut()">Logout</button>
  </div>
```
