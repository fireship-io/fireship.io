---
title: SendGrid Angular
lastmod: 2019-07-05T10:43:06-07:00
publishdate: 2019-07-05T10:43:06-07:00
author: Jeff Delaney
draft: false
description: Send transactional email with SendGrid from Angular
type: lessons
# pro: true
tags: 
    - angular
    - sendgrid

vimeo: 346868823
github: https://github.com/fireship-io/196-sendgrid-email-cloud-functions
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3

# chapters:

---

{{< box emoji="👀" >}}
This tutorial is an extension of the [SendGrid Transactional Email Guide](/lessons/sendgrid-transactional-email-guide/). You must have the Cloud Functions deployed to start sending email from your frontend app. 
{{< /box >}}


## Initial Setup

Make sure you have [AngularFire installed](/snippets/install-angularfire/) in your project. Then include functions and auth in the main app module. 

{{< file "ngts" "app.module.ts" >}}
{{< highlight typescript >}}
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireFunctionsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

{{< /highlight >}}


## Transactional Email Component

{{< file "ngts" "app.component.ts" >}}
{{< highlight typescript >}}
import { Component } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public afAuth: AngularFireAuth, private fun: AngularFireFunctions) {}



  loginWithGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  sendEmail() {
    const callable = this.fun.httpsCallable('genericEmail');
    callable({ text: 'Sending email with Angular and SendGrid is fun!', subject: 'Email from Angular'}).subscribe();
  }
}
{{< /highlight >}}


The HTML provides simple conditional logic to display separate templates for logged-in and logged-out users. 

{{< file "html" "app.component.html" >}}
{{< highlight html >}}
<h2>SendGrid Transactional Email with Angular</h2>


<div *ngIf="(afAuth.authState | async) as user; else login;">

    {{ user | json }}

    <hr>

    <button (click)="sendEmail()">Send Email with Callable Function</button>
    <button (click)="afAuth.auth.signOut()">SignOut</button>

  
</div>

<ng-template #login>
  <button (click)="loginWithGoogle()">SignIn with Google</button>
</ng-template>
{{< /highlight >}}
