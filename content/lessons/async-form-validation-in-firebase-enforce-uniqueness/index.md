---
title: Angular Reactive Forms Async Validation
lastmod: 2019-07-12T15:40:26-07:00
publishdate: 2018-02-10T15:40:26-07:00
author: Jeff Delaney
draft: false
description: Build a custom validator for Angular Reactive Forms that checks a username asynchronously in Firestore
tags: 
    - pro
    - angular
    - firebase
    - rxjs

youtube: _X5FbiW0L_8
github: https://github.com/AngularFirebase/87-reactive-forms-async-validation-firestore
pro: true
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Reactive form validation can be a complex and difficult feature to implement, especially if you need to validate fields asynchronously. Angular ships with a few built-in validators, but they can only take you so far...

Today, we are building a **custom async validator** that can verify username uniqueness in Firebase Firestore. My goal is to show you async validator for your reactive forms that you can apply to virtually any backend data source.


{{< figure src="img/custom-validator-firestore.gif" caption="Async username validation" >}}

## Initial Setup

This tutorial assumes you have...

- An Angular project
- Installed [AngularFire2](https://github.com/angular/angularfire2)
- You have a collection of users with usernames (so we have something to validate uniqueness against)


<img src="/images/firebase-username-data.png" alt="username data as it appears in Firestore" class="content-image" />  

Your `app.module.ts` should have the following imports: 

```typescript
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

<p class="success">If you're new to Firebase auth, I recommend also checking out [Episode 55 Custom Firebase User Data](https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/)</p>

## Building the Reactive Form

Now let's put together a basic [reactive form](https://angular.io/guide/reactive-forms) with some of Angular's built-in validators.  

```typescript
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.sass']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private afs: AngularFirestore, private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email:  ['', [
        Validators.required, 
        Validators.email
      ]],
      username:  ['', 
        Validators.required,
        CustomValidator.username(this.afs) 
      ],
    });

  }

  // Use getters for cleaner HTML code

  get email() {
    return this.loginForm.get('email')
  }

  get username() {
    return this.loginForm.get('username')
  }

}
```

Our Reactive form's HTML looks like this:

```html
<form [formGroup]="loginForm" novalidate>

  <label for="email">Email</label><br>
  <input type="email" formControlName="email">

  <label for="username">Username</label><br>
  <input type="username" formControlName="username">

</form>
```

## Async Username Validator

First, take a close look at this interface - it gives us the signature that a custom validator must follow. It's a function that takes a form control as it's argument, then returns a error object if INVALID or null if VALID. 


```typescript
interface Validator<T extends FormControl> {
  (control: T): {[error: string]:any};
}
```

<p class="tip">You don't need this interface in your code, I just want you to be aware of it. </p>

### Providing a Service in a Custom Validator

There are several ways we might inject a service into a custom validator, but I want to show you the way that is most flexible, especially if you plan on reusing the validator in multiple forms. 

Basically, we wrap our validator function with an outer function that takes a service as an argument. This gives our inner validator access the outer arguments, which is `AngularFirestore` in this case, but it could be any service. The pattern is similar to [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) in vanilla JS. 

The function is defined as a static method in a class named `CustomValidators`. You can extract this logic to a new file, or define it directly in the component. 

```typescript
import { map, take, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

export class CustomValidator {
  static username(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      
      // return an observable here....

    }
  }
}
```

### Fetching Data and Mapping the Validation Error

Inside the validation function, we first get access to the user's input with `control.value`, then use it to make a query to a Firestore collection with the matching value. 

If firestore returns an empty array, we know the username is available. But if that array is *not* empty, the username is already taken.  

By default, Firestore gives us a realtime stream of data, but what we actually want is an Obsevable that completes, which we can force with `take(1)`. To prevent inefficient queries, I also added a `debounceTime(500)` to wait 500ms after the user stops typing before making the query. 

```typescript
  return (control: AbstractControl) => {
    
    const username = control.value.toLowerCase();
    
    return afs.collection('users', ref => ref.where('username', '==', username) )
              
      .valueChanges().pipe(
        debounceTime(500),
        take(1),
        map(arr => arr.length ? { usernameAvailable: false } : null ),
      )
  }
```

### Using the Custom Validator in the Form

The last step is easy. We just drop our custom validator into the reactive form and the rest is magic. 

```typescript
this.loginForm = this.fb.group({
  //... omitted

  username:  ['', 
    Validators.required,
    CustomValidator.username(this.afs) 
  ],
});

```


### Show an Async Validation Messages

At this point our validator will work, but we should also show the user some useful feedback. In the HTML below, we show three different messages based on the possible states of VALID, INVALID, and PENDING. 

```html
<div *ngIf="username.invalid && username.dirty" class="notification is-danger">
  {{ username.value }} is already taken
</div>

<div *ngIf="username.valid" class="notification is-success">
  {{ username.value }} is available
</div>

<div *ngIf="username.pending" class="notification is-info">
  Hold tight... Checking availability of {{ username.value }}
</div>
```

And there you have it - async uniqueness validation in Angular with Firestore as our data source. Let me know if you have any questions on Slack or in the comments below. 