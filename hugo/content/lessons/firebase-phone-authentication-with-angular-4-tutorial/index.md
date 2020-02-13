---
title: Firebase Phone Authentication
lastmod: 2017-07-19T04:34:42-07:00
publishdate: 2017-07-19T04:34:42-07:00
author: Jeff Delaney
draft: false
description: Use the Firebase to implement Phone authentication on the web. 
tags: 
    - angular
    - firebase
    - auth

youtube: XIq_VU1Njw0
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

<p>Signing up users with a phone number adds certain degree of trust or confidence to an app. In this lesson, we are going to use the new <a href="https://firebase.google.com/docs/auth/web/phone-auth">phone authentication paradigm from Firebase</a> in our Angular 4 app. At this time, phone auth is not supported in AngularFire, so we will use the firebase JavaScript SDK directly. Phone auth can also be used to link accounts, providing an effective solution for two-factor authentication. </p>

## Configuring the reCAPTCHA Widget in Angular

<p>Firebase requires users to use reCAPTCHA to prevent abusive use of the API. You can also implement an invisible reCAPTCHA, but we will be using the visible version in this example. </p>


{{< figure src="img/phonecaptcha.gif" caption="visible recaptcha for firebase phone login angular" >}}

### Injecting the Window Object

<p>You will need to make a reference to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window">Window object</a>, which represents the DOM. It is considered a bad practice to modify `window` directly inside a component - the same goes for all global browser objects. Angular apps can also run on mobile and desktop platforms (which don't have a window), so a better alternative is to <a href="https://juristr.com/blog/2016/09/ng2-get-window-ref/">inject the window</a> as a service. </p>

<p>Generate the service with `ng g service window`</p>

```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {

  get windowRef() {
    return window
  }

}

```

## Phone Login Component

{{< figure src="img/image1-576x1024.png" caption="phone auth sms text confirmation " >}}

```shell
ng g component phone-login
```

<p>Now we need to collect the user’s phone number. The number must be submitted in <a href="https://en.wikipedia.org/wiki/E.164">E.164 format</a>, which looks like `+19495555555` for U.S. numbers. </p>

<p>In order keep values free of validation errors, I am breaking the from into four separate parts and creating a `PhoneNumber` class. Then I use a getter to combine the form values into a single string in E164 format. </p>

### PhoneNumber class

```typescript
export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;

  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.area + this.prefix + this.line
    return `+${num}`
  }

}
```

<p>After the the confirmation text is sent, we display another form field for the user to enter the confirmation. Here’s a breakdown of the process step-by-step</p>

- User verifies reCAPTCHA
- User submits their phone number.
- Firebase sends SMS text and returns a confirmation object.
- User verifies SMS code and the auth state is updated.


{{< figure src="img/phonesuccess.gif" caption="result of successful Firebase phone auth" >}}


### phone-login.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { WindowService } from '../window.service';
import * as firebase from 'firebase';


@Component({
  selector: 'phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent implements OnInit {

  windowRef: any;

  phoneNumber = new PhoneNumber()

  verificationCode: string;

  user: any;

  constructor(private win: WindowService) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')

    this.windowRef.recaptchaVerifier.render()
  }


  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = this.phoneNumber.e164;

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;

            })
            .catch( error => console.log(error) );

  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
                  .confirm(this.verificationCode)
                  .then( result => {

                    this.user = result.user;

    })
    .catch( error => console.log(error, "Incorrect code entered?"));
  }


}
```

### phone-login.component.html

In the HTML template, we trigger the various stages of the auth login with button clicks. The phone number object and the verification code are tracked with `ngModel`.


```html
<div [hidden]="user">
  <h1>Sign In with Your Phone Number</h1>

  <label for="phone">Phone Number</label><br>
  <input type="text" [(ngModel)]="phoneNumber.country"  class="input" placeholder="1"    maxlength="2">
  <input type="text" [(ngModel)]="phoneNumber.area"     class="input" placeholder="949"  maxlength="3">
  <input type="text" [(ngModel)]="phoneNumber.prefix"   class="input" placeholder="555"  maxlength="3">
  <input type="text" [(ngModel)]="phoneNumber.line"     class="input" placeholder="5555" maxlength="4">

  <div id="recaptcha-container"></div>

  <button (click)="sendLoginCode()">SMS Text Login Code</button>

  <div *ngIf="windowRef.confirmationResult">
    <hr>
    <label for="code">Enter your Verification Code Here</label><br>
    <input type="text" name="code" [(ngModel)]="verificationCode">

    <button (click)="verifyLoginCode()">Verify</button>
  </div>

</div>

<div *ngIf="user">
  You have successfully logged in with your phone number!

  UserId: {{ user?.uid }}

</div>
```