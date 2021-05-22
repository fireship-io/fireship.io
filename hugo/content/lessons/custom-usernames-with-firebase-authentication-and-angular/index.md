---
title: Custom Usernames With Firebase Authentication and Angular
lastmod: 2017-06-24T15:27:32-07:00
publishdate: 2017-06-24T15:27:32-07:00
author: Jeff Delaney
draft: false
description: Give Firebase users custom usernames after and validate them asynchronously
tags: 
    - angular
    - firebase

youtube: NLWHEiH1FZY
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

⚠️ This lesson has been archived! Check out the [Full Angular Course](/courses/angular) for the latest best practices about building a CRUD app and the [custom Firebase Usernames](/lessons/custom-usernames-firebase) tutorial. 

<p>Firebase authentication is super convenient, but you can’t easily assign custom usernames out of the box. In this lesson, we are going to give users custom usernames and asynchronously validate their availability during the signup process. On every keyup, the username will be checked for duplicates, so we can display a helpful message to the user.</p>

<p>When a user signs in via OAuth, the app will see if they have a username set. If they do NOT, it will keep them on the login component and force them to enter a username, which will validate username availability asynchronously.</p>

```shell
 ng g service auth
 ng g component user-login
 ng g component choose-username
```

## Modeling the Username Data

<p>Our database will have a collection of users for general record keeping, but the quickest way to asynchronously check username availability is to save all usernames in their own collection, with the keys being the usernames that are not available to new users.</p>

```text
users
    userId
       username: string

usernames
    ${username}: userId
```

For example...

```text
users
    idxyz123
       username: "CoolUserXYZ"

usernames
    CoolUserXYZ: idxyz123
```


## Auth Service that Verifies Username Availability

First, let's create a `User` class to simplify the auth object. We only care about the `uid` and the `username`. As a constructor, it will take the Firebase AuthState from angularfire2.

<p>We need to subscribe to both the `authState` and the user information in the database at the same time… So how do we handle nested subscriptions with RxJS? In this case, we are going to use <a href="https://www.learnrxjs.io/operators/transformation/switchmap.html">switchMap</a>, which will emit the Firebase auth object first, then get the user values from the database, returning everything as an observable. Using `switchMap` avoids nested RxJS subscriptions (generally considered a bad practice). </p>

### auth.service.ts

```typescript
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/switchMap';

export class User {

  uid: string;
  username: string = "";

  constructor(auth) {
    this.uid = auth.uid
  }

}


@Injectable()
export class AuthService {

  currentUser: User;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase) {

              this.afAuth.authState.switchMap(auth => {
                  if (auth) {
                    this.currentUser = new User(auth)
                    return this.db.object(`/users/${auth.uid}`)
                  } else return [];
                })
                .subscribe(user => {
                    this.currentUser['username'] = user.username
                })

             }

   googleLogin() {
     const provider = new firebase.auth.GoogleAuthProvider()
     return this.afAuth.signInWithPopup(provider)
       .then(() =>  console.log('successful auth'))
       .catch(error => console.log(error));
   }
 }
```

<p>We need to make sure the username is available before it can be selected. First, the username collection is queried with the user’s text input. Querying with this method only targets a single key value pair, rather than an entire list, so it’s much faster. In fact, it’s almost instantaneous in the UI as you will see. We also use a getter to check if the current user has a username. Here's how the remainder of the service is filled out.</p>

```typescript
   get hasUsername() {
      return this.currentUser.username ? true : false
    }

    checkUsername(username: string) {
      username = username.toLowerCase()
      return this.db.object(`usernames/${username}`)
    }

    updateUsername(username: string) {

      let data = {}
      data[username] = this.currentUser.uid

      this.db.object(`/users/${this.currentUser.uid}`).update({"username": username})
      this.db.object(`/usernames`).update(data)
    }
```

## Login Component with Username Validation

{{< figure src="img/username.gif" caption="Async username validation with Firebase demo" >}}

<p>We will run a query to Firebase after each `keydown` event to see if there’s a matching username in the database. If not, the user can go ahead and select it.</p>

### user-login.component.ts

```typescript
import { Component } from '@angular/core';
import { AuthService } from "../../core/auth.service";


@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {

  usernameText: string;
  usernameAvailable: boolean;

  constructor(public auth: AuthService) { }


  checkUsername() {
    this.auth.checkUsername(this.usernameText).subscribe(username => {
      this.usernameAvailable = !username.$value
    })
  }

  updateUsername() {
    console.log
    this.auth.updateUsername(this.usernameText)
  }


  signInWithGoogle() {
    this.auth.googleLogin()
  }
}
```

A new user will start by authenticating with Google. When that is successful, the form input to select a username is displayed.

<p>When there’s a matching username, the `usernameAvailable` variable is set to false. In the template, we use this variable to display a success or error message. It is also used to disable the submit button. </p>

### user-login.component.html

```html
<h1>Login</h1>
<button (click)="signInWithGoogle()" class="button btn-social btn-google"
        *ngIf="!auth.currentUser">
         <i class="fa fa-google-plus fa-lg"></i> Connect Google
</button>

<button  type="button" class="button"
         *ngIf="auth.currentUser"
         (click)="logout()">
          Logout
</button>

<div *ngIf="auth.currentUser && !auth.hasUsername">

  <h3>Choose a Username</h3>

  <input type="text" class="input" placeholder="choose a username"
         [(ngModel)]="usernameText"
         (keyup)="checkUsername()">

  <p class="help is-success" *ngIf="usernameAvailable && usernameText">
    @{{usernameText}} is available
  </p>

  <p class="help is-danger" *ngIf="!usernameAvailable && usernameText">
    @{{usernameText}} has already been taken
  </p>

  <button class="button is-primary"
          [disabled]="!usernameAvailable || !usernameText"
          (click)="updateUsername()">

          Select Username

  </button>

</div>
```

## Validating a Unique Username via Firebase Database Rules

<p>The current username validation is great as a frontend UX feature, but it is still vulnerable to accidental duplication. Let’s add an extra layer security by creating a firebase database rule that ensures a username cannot be accidentally duplicated on the backend. </p>

### database.rules.json

```js
    "users": {
      ".write": "auth != null",
      "username": {
          ".validate": "!root.child('usernames').child(newData.val()).exists()"
      }
    },

    "usernames": {
       ".write": "auth != null"
    }
```