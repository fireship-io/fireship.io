---
title: Install @angular/fire
publishdate: 2018-12-11T09:35:09-07:00
lastmod: 2018-12-11T09:35:09-07:00
draft: false
author: Jeff Delaney
description: How to install @angular/fire, aka AngularFire2
tags: 
    - angular
    - firebase
---


## Quick Installation Steps


### 1. Grab your Firebase Web Config


From your Firebase project click on *settings >> Add Firebase to your web app*. You only need to copy the `config` object from this page. 

{{< figure src="/img/snippets/firebase-web-config.png" alt="firebase web config location" >}}

{{% box icon="shield" class="box-blue" %}}
It is perfectly OK to expose these credentials in your client-side code. Yes, somebody could use these credentials to write to your database, but Firebase apps are secured by writing [rules](/snippets/firestore-rules-recipes/).
{{% /box %}}


### 2. Install @angular/fire via NPM

Install `@angular/fire` and `firebase` as dependencies in your Angular Project. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
npm install firebase @angular/fire
{{< /highlight >}}

### 3. Add @angular/fire to the App Module

At this point, we can import the Firebase modules we need into Angular. The only required module is `AngularFireModule`. All other modules can be removed or added based on your needs. You

{{< file "ngts" "src/app/app.module.ts" >}}
{{< highlight typescript >}}
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// 1. Import the libs you need
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

// 2. Add your credentials from step 1
const config = {
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>'
};

@NgModule({
  imports: [
    BrowserModule,
    // 3. Initialize
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
{{< /highlight >}}

## 4. Usage in a Component

Done! Now you can use any of these modules in your components or services. For example, let's listen to a Firestore database collection in realtime. 

{{< file "ngts" "src/app/app.module.ts" >}}
{{< highlight typescript >}}
import { AngularFirestore } from '@angular/fire/firestore';

@Component(...)
export class SomeComponent {

  constructor(private db: AngularFirestore) {
      const things = db.collection('things').valueChanges();
      things.subscribe(console.log);
  }
}
{{< /highlight >}}

## Pro Tip: Dev and Prod Firebase Projects

It can be beneficial to setup two Firebase projects - one for development and another for your live production app. In Angular, we can manage these projects easily with the built-in environment config.

{{< file "ngts" "environment.ts" >}}
{{< highlight typescript >}}
export const environment = {
  production: false,
  firebase: {
      // your web config from step 1
  }
};

// In other files, import the environment like so:
import { environment } from '../environments/environment';
{{< /highlight >}}

