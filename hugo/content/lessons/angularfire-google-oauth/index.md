---
title: Google OAuth with @angular/fire
lastmod: 2018-12-29T06:51:33-07:00
publishdate: 2018-12-29T06:51:33-07:00
author: Jeff Delaney
draft: false
description: Build a Firebase Google signin user authentication flow with @angular/fire that saves custom user data to the Firestore. 
tags: 
    - firebase
    - angular
    - firestore
    - auth

youtube: e8GA1UOj8mE
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
    "@angular/core": 7.2
    "@angular/fire": 5.2
    "rxjs": 6.2
    "firebase": 5.5
---

A solid user authentication system is the bedrock of most web applications. In fact, when starting a new project I genernally focus on user auth first because so many other features depend the user's auth state. The following lesson will show you how to build an OAuth authentication feature using the Google sign-in method. In addition, we will save custom user data to the Firestore database, making it possible to customize a user's profile and/or query all users.

The end result of this lesson is an Angular/Firebase app that supports the following features: 

- Signup and manage auth state in realtime.
- Custom user profile data in Firestore.
- Protect routes on the frontend with an Angular router.
- Secure data on the backed with Firestore rules.


{{% box icon="scroll" class="box-blue" %}}
This post first appeared as [Episode 55 on AngularFirebase.com](https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/) and has been fully updated with the latest best practices. 
{{% /box %}}

## Step 0: Prerequisites


1. {{< prereq "install-nodejs" >}}
1. {{< prereq "install-angular" >}}
1. {{< prereq "install-angularfire" >}}


## Step 1: Initial Firebase Setup

First, you will need a Firebase project with Firestore enabled in test mode. 

Google Sign-in is the easiest method to configure in Firebase because your app credentials are already built into your Google Cloud. You can extend this tutorial to work with Facebook, Github, and Twitter, but will need to follow the configuration instructions for each. 

{{< figure src="img/firebase-google-signin.png" alt="enable the google signin method via the Firebase authentication tab" >}}

## Step 2: Install @angular/fire and Firebase

At this point, it is assumed you have an existing Angular app `{{< version "@angular/core">}}` using the Angular router. 

Let's install `{{< version "firebase">}}`  and `{{< version "@angular/fire">}}` and refer to the [official documentation](https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md) as needed. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
ng new awesomeApp --routing
cd awesomeApp

npm install @angular/fire firebase --save
{{< /highlight >}}

Next, we need to import the modules we plan on using in our app *Auth* and *Firestore*; 

{{< file "typescript" "app.module.ts" >}}
{{< highlight typescript >}}
// ...omitted
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

const config = {/* your firebase web config */}

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
{{< /highlight >}}

{{% box icon="flask" class="box-green" %}}
For advanced options and pro tips check out the [@angular/fire install guide](/snippets/install-angularfire/). 
{{% /box %}}

## Step 3: Build an Auth Service

Organizing our user authentication as an injectable service provides code reuse and state management for all components. For instance, any component that needs to know if the user is logged in can simply subscribe to our `user$` Observable. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
ng generate service auth
{{< /highlight >}}

### Create a User Interface (Optional)

Let's start by modeling our user data as a TypeScript interface. Why? We are adding custom data to Firebase user and this will force us use a consistent data model across the entire app. Keep in mind, you can opt out of strong typing at any time by using `any`; 

{{< file "typescript" "user.model.ts" >}}
{{< highlight typescript >}}
interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  myCustomData?: string;
}
{{< /highlight >}}

### Inject Dependencies into the Service

{{< file "ngts" "app/auth.service.ts" >}}
{{< highlight typescript >}}
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model.ts'; // optional

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    user$: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) { }

}
{{< /highlight >}}

### Observe the AuthState 

The most important element this feature is being able to react to changes to the user's authentiaction state. When logged-out, will have an Observable of `null`. When logged-in, we want to [switchMap](/snippets/rxjs-switchmap) to an Observable of the user's profile document in Firestore. This is equivilent *joining* custom data and we can set this up in the constructor. 

{{< figure src="img/firestore-custom-user-data.png" alt="custom user data in the Firestore database" caption="Notice how the UID on the document also matches user's assigned UID from firebase auth." >}}



{{< file "ngts" "app/auth.service.ts" >}}
{{< highlight typescript >}}
export class AuthService {

    user$: Observable<User>;

    constructor(...) { 
      // Get the auth state, then fetch the Firestore user document or return null
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      )
    }
}
{{< /highlight >}}


### Login and Logout

- `googleSignin()`: Triggers the Google Signin popup window and authenticates the user. It returns a Promise that resolves with the auth credential. 
- `updateUserData()`: This is how we initialize custom data in Firestore. The `{ merge: true }` option is required to make this a non-destructive set for returning users.
- `signOut()`: Does what it says, plus navigates the user to a safe route. 

{{< file "ngts" "app/auth.service.ts" >}}
{{< highlight typescript >}}
export class AuthService {

  // ...omitted

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const { uid, email, displayName, photoURL } = user;

    return userRef.set(user, { merge: true })

  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

}
{{< /highlight >}}

## Step 4: Create a User Profile Component

Now it's time to put our auth service to use inside of a component that will allow the user to login, logout, and view their profile info. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
ng generate component user-profile
{{< /highlight >}}

### Inject the Auth Service

Inject the auth service in the component's constructor - easy.

{{< file "ngts" "user-profile/user-profile.component.ts" >}}
{{< highlight typescript >}}
import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component(...)
export class UserProfileComponent {
  constructor(public auth: AuthService) { }
}

{{< /highlight >}}

In the component HTML, we define two templates based on the `user$` Observable. If the value is `null`, we show the guest template, but if it is defined we show the authenticated template and corresponding user data. The `async` will automatically subscribe to the Observable and unsubscribe when the component is destroyed. 

{{< file "html" "user-profile/user-profile.component.html" >}}
{{< highlight html >}}
<div *ngIf="auth.user$ | async; then authenticated else guest">
        <!-- template will replace this div -->
</div>

<!-- User NOT logged in -->
<ng-template #guest>
    <h3>Howdy, GUEST</h3>
    <p>Login to get started...</p>
    
    <button (click)="auth.googleSignin()">
        <i class="fa fa-google"></i> Connect Google
    </button>

</ng-template>


<!-- User logged in -->
<ng-template #authenticated>
    <div *ngIf="auth.user$ | async as user">
        <h3>Howdy, {{ user.displayName }}</h3>
        <img  [src]="user.photoURL">
        <p>UID: {{ user.uid }}</p>
        <button (click)="auth.signOut()">Logout</button>
    </div>
</ng-template>
{{< /highlight >}}


## Step 5: Protect Routes with Angular Guards

A useful UX feature is to protect routes based on the user's auth state. Now that we have an Observable `user$` from the previous step, we can implement `canActivate` guard. 

When the user navigates, alls routes using this guard will subscribe to the `user$`. If it emits true, the route can be accessed. If false, the user is redirected to the login page.

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
ng generate guard auth
{{< /highlight >}}

### Map the User to a Boolean

The guard interface requires our observable to emit a boolean. We can 

{{< file "ngts" "app/auth.guard.ts" >}}
{{< highlight typescript >}}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService} from './auth.service'
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

      return this.auth.user$.pipe(
           take(1),
           map(user => !!user), // <-- map to boolean
           tap(loggedIn => {
             if (!loggedIn) {
               console.log('access denied')
               this.router.navigate(['/login']);
             }
         })
    )
  }
}
{{< /highlight >}}

You can then apply this guard to individual routes like so: 

{{< file "ngts" "app/routing.module.ts" >}}
{{< highlight typescript >}}
const routes: Routes = [
  //...
  { path: 'notes', component: NotesListComponent,  canActivate: [AuthGuard] },
];
{{< /highlight >}}

{{% box icon="flask" class="box-green" %}}
PRO Tip - You may find it useful to simplify this guard code by defining a method in your auth service that can [retrive the Firebase UID as a Promise](/snippets/get-angularfire-userid-as-promise).
{{% /box %}}




## Step 6: Backend Security Rules

It is essential that only the *owner* of a user document can modify its data. We cannot just rely our frontend code to provide this security, so let's setup Firestore rules. I prefer to create a reusable function to determine document ownership because you are likely to need this logic in multiple rules.


{{< file "firebase" "firestore rules" >}}
{{< highlight js >}}
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
        allow write: if isOwner(userId);
    }

    // Reusable function to determine document ownership
    function isOwner(userId) {
        return request.auth.uid == userId
    }
  }
}
{{< /highlight >}}

## The End

That's it! You now have all the basic pieces in place for a reliable and flexible Angular/Firebase authentication system.  