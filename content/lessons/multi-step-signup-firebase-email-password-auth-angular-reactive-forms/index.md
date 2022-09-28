---
title: Multi-step Reactive Form for Email-Password Signup
lastmod: 2017-11-12T12:05:03-07:00
publishdate: 2017-11-12T12:05:03-07:00
author: Jeff Delaney
draft: false
description: Build a multi-step reactive form for email-password auth with Firebase
tags: 
    - angular
    - firebase
    - auth

youtube: r-n5lpG1hxY
pro: true
github: https://github.com/AngularFirebase/68-multistep-firebase-signup
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Firebase password auth](https://firebase.google.com/docs/auth/web/password-auth) can be configured with a few lines of code, but what happens if you need additional custom user data before authorizing activity in your app? In this lesson, my goal is to show you several important concepts.

- Email/Password Auth
- Reactive Forms in Angular
- Security with custom Firebase user data

## What are we Building? 

<p class="tip">This lesson is based off of the [Firstarter PWA starter app](https://firestarter-96e46.firebaseapp.com/), which is organized into NgModules. It is not needed to follow this lesson, but it does have a notification service for showing errors to the end user.</p>

We are going to build a custom user authentication flow backed by Firebase email-password auth. When users first sign-up, they must fill out a custom form with a *catchphrase* before they are fully authorized to use the app. The catchphrase can be anything, for example "I love Angular!" - it's just a placeholder for any type of custom data you can imagine.


{{< figure src="img/multistep-signup.gif" caption="Multi-step email-password form demo" >}}


### Initial Setup 

<p class="success">Full source code for [multi-step signup](https://github.com/AngularFirebase/68-multistep-firebase-signup).</p> 

I'm only going to provide the relevant pieces of code here. If you want to duplicate the styling and structure of this demo, clone the demo project above. 

To use reactive forms in Angular, make sure to import the `ReactiveFormsModule` in the NgModule that contains the signup form. 


```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
  /// ...omitted
}
```

## Auth Service

Don't forget have **email password auth enabled** in the Firebase console.  

I covered much this code in the past with the [Firestore OAuth Lesson](https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/), but we need to add an extra methods to it for email-password auth. 

To signup a user, we need to send Firebase an email address and password string. Firebase will determine if this data is valid and return a promise with the newly created user. Once we have that user, we create a custom document in Firestore with an ID that matches the user's UID. 


```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

// custom user interface
interface User {
  uid: string;
  email: string;
  photoURL: string;
  catchPhrase?: string;
}


@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private notify: NotifyService) {

      // Define the user observable
      this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            // logged in, get custom user from Firestore
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            // logged out, null
            return Observable.of(null)
          }
        })

  }

  //// Email/Password Auth ////
  
  emailSignUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.setUserDoc(user) // create initial user document
      })
      .catch(error => this.handleError(error) );
  }

  // Update properties on the user document
  updateUser(user: User, data: any) { 
    return this.afs.doc(`users/${user.uid}`).update(data)
  }



  // If error, console log and notify user
  private handleError(error) {
    console.error(error)
    this.notify.update(error.message, 'error')
  }

  // Sets user data to firestore after successful login
  private setUserDoc(user) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      photoURL: 'https://goo.gl/Fz9nrQ'
    }

    return userRef.set(data)

  }
}
```

## Login Form Component

Now we're ready to jump into Angular's reactive forms module. The first step is to include the reactive forms module in the corresponding NgModule. 

I am going to write all of the logic in a single component, but you might break this down into multiple components if the form is large and complex. Here's an overview of what's happening. 

1. Validate the user has a valid email/password.
2. Once authenticated, the user is shown a secondary form. Unlike the initial form, it will update custom information on the user's document in Firestore. 

A great way to keep your reactive forms concise is to use typescript getters. For example, adding the code `get email() { return this.signupForm.get('email') }` eliminates the need to call the parent form repetitively when accessing its validation state or value. 

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  signupForm: FormGroup;
  detailForm: FormGroup;

  constructor(public fb: FormBuilder, public auth: AuthService) { }

  ngOnInit() {

    // First Step
    this.signupForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
        ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
        ]
      ],
      'region': ['', [
        ]
      ],
    });

    // Second Step
    this.detailForm = this.fb.group({
      'catchPhrase': ['', [ Validators.required ] ]
    });
    
  }

  // Using getters will make your code look pretty
  get email() { return this.signupForm.get('email') }
  get password() { return this.signupForm.get('password') }

  get catchPhrase() { return this.detailForm.get('catchPhrase') }


  // Step 1
  signup() {
    return this.auth.emailSignUp(this.email.value, this.password.value)
  }

  // Step 2
  setCatchPhrase(user) {
    return this.auth.updateUser(user, { catchPhrase:  this.catchPhrase.value })
  }
}
```


### Multi-Step Login Form HTML

What the hell is this `(auth.user | async) || {} as user` line of code? In plain English, it's like saying *if we don't have a user, give me an empty object, then set that as a template variable called user*. The idea is to set a template variable, while preventing ngIf from hiding the html when the user is null. 

For each form input, we can connect it to the [reactive form](https://angular.io/guide/reactive-forms) with `formControlName` attribute. This will tell the form to validate the input, which you can use to conditionally display error templates or CSS classes. 


```html
<ng-container *ngIf="(auth.user | async) || {} as user">

  <form [formGroup]="signupForm" *ngIf="!user.uid" (ngSubmit)="signup()">
      
    <h3>New User Signup</h3>
  
    <label for="email">Email</label>
    <input type="email" formControlName="email">
    

    <div *ngIf="email.invalid && email.dirty">
        Your email doesn't look quite right...
    </div>
  
    <label for="password">Password</label>
    <input type="password" formControlName="password" required>
  
    <div *ngIf="password.invalid && password.touched" >
      Password must be between 6 and 24 chars and have at least one number 
    </div>
  
    <div *ngIf="signupForm.valid" >Form looks good! Let's do this.</div>
  
    <button type="submit" [disabled]="!signupForm.valid">Submit</button>
  
  
  </form>
      
      
      
  <form [formGroup]="detailForm" *ngIf="user.uid && !user.catchPhrase" (ngSubmit)="setCatchPhrase(user)">
    
    <h3>Set your Catch Phrase</h3>

    <label for="catchPhrase">CatchPhrase</label>
    <input type="test" formControlName="catchPhrase">
    
  
    <button type="submit" [disabled]="!detailForm.valid">Submit</button>
    
    
  </form>

  <p *ngIf="user.catchPhrase">
      You have completed the form!
  </p>
    
</ng-container>   
```

## Router Guard

At this point, the user could skip the secondary step and navigate directly to data they're not supposed to see. I am going to provide a router guard to prevent unauthorized navigation. The important line here is `!!(user && user.catchPhrase)`, which converts the user's `catchPhrase` property to a boolean. In other words, if their Firestore user document does not have a catchPhrase, we block access the route. 

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService} from './auth.service';
import { NotifyService } from './notify.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private notify: NotifyService) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

      return this.auth.user
           .take(1)
           .map(user => !!(user && user.catchPhrase) )
           .do(loggedIn => {
             if (!loggedIn) {
               this.notify.update('You must be logged in and have a catch phrase!', 'error')
               this.router.navigate(['/login']);
             }
         })

  }
}

```

## Backend Firestore Rules

To fully secure the app, we should also set backend rules in Firestore to prevent an unauthorized user from seeing private data. There are thousands of potential [rule configurations](https://firebase.google.com/docs/firestore/reference/security/), so check out the docs if you need a more specialized configuration. The code below checks if the user's document exists or it can check a custom property on the user document equals a specific value. 

```
match /some-document {
  allow read, write: if exists(/users/$(request.auth.uid))
}

// You could also check a specific value on the user document. 

match /some-document {
  allow read, write: if get(/users/$(request.auth.uid)).data.catchPhrase == 'Howdy';
}
```

## The End

That's it for multi-step signup with Angular and Firebase password auth. Hopefully this gives you a good starting point to build large complex forms in your app. 