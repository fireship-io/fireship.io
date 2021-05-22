---
title: Group Chat with Firestore
lastmod: 2018-10-14T18:11:02-07:00
publishdate: 2018-10-14T18:11:02-07:00
author: Jeff Delaney
draft: false
description: Design a Firestore group chat feature and build it from scratch with Angular.
tags: 
    - angular
    - firebase

youtube: LKAXg2drQJQ
github: https://github.com/AngularFirebase/144-firestore-group-chat
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

One of the most compelling reasons to choose Firebase as your backend is to meet the demands of complex realtime features, like group chat. Managing state between multiple clients in realtime is a major undertaking, but with Firebase it becomes almost trivial. The following lesson will teach you how to build a simple group chat app with [Cloud Firestore](https://firebase.google.com/docs/firestore/). 

This lesson is accompanied by a real demo! Give [Firestore Mega Chat](https://firestore-megachat.firebaseapp.com/) a whirl. 

{{< figure src="img/firestore-chat-demo.gif" caption="Firestore chat demo" >}}
 
## Data Modeling Considerations

The ideal data model for a chat application depends on several factors. Here are a few topics to think about...

1. Group chat versus 1-to-1 chat.
1. Privacy and user authorization.
1. Queries and full text search.
1. 1Mb document size and 1-write-per-second limits.

<p class="success">NoSQL databases are flexible. If you're new to this paradigm, I highly recommend reviewing the [Firestore NoSQL data modeling lesson](/lessons/firestore-nosql-data-modeling-by-example/).</p>

### Messages Collection Approach

The most flexible model is multiple collections (or subcollections) for chat sessions and messages. This approach allows you to query messages serverside, but requires a unique read for every message. This data model is one you should consider, but not the approach we are taking for this demo. 


{{< figure src="img/firestore-chat-subcollection.png" caption="Subcollection approach" >}}
 

### Embedded Document Approach

Our app will model embed all messages on a single document, allowing us to grab hundreds of messages with a single read operation. This approach is fast and simple, but the drawback is that Firestore limits you 1MB per document, or conservatively, around 1K chat messages. At the end of the lesson, we'll setup a cloud function to automatically manage the document size by archiving older messages. 


{{< figure src="img/firestore-chat-embedded.png" caption="Embedded approach" >}}

Another benefit of the embedded approach is that Firestore recently added an `arrayUnion` helper that enforces uniqueness and makes adding items to the array [idempotent](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation). 

```js
{
  uid: 'jeff' // Owner of chat
  messages: [
    { createdAt, uid, text }
    { createdAt, uid, text  }
    // ... up to 100 embedded messages, then cloud function will archive
  ]
}
```

Notice how we only save the user's UID on the chat message. Later this lesson, I will provide a `joinUsers` method to combine the user data, like displayName and photoURL, to each message in the UI. 

<p class="tip">Firestore also has a *limit* of 1-write-per-second, but you can burst past it for short periods. This limit is only a concern if you have consistent high volume writes on a single doc. You can learn more in this [github issue](https://github.com/firebase/firebase-js-sdk/issues/495). 


## AngularFire Chat App

Now that we have a data model in place, let's build out the UI with Angular and @angular/fire. 

```
ng new firechat --routing

ng g component chat
ng g service chat
ng g service auth
```

Add a route for the chat component in `app.routing.module`: 

```typescript
const routes: Routes = [
  { path: 'chats/:id', component: ChatComponent }
];
```

Next, follow the install instructions for [Firebase and AngularFire](https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md)

### User Authentication Service

You need to have a user auth system in place that saves a user's profile data in firestore. The auth service below will do the trick and for a full explanation you can watch [Episode 55 - Google OAuth Custom Firestore Profile](https://angularfirebase.com/lessons/google-user-auth-with-firestore-custom-data/). 

```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private async oAuthLogin(provider) {
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData({ uid, email, displayName, photoURL }) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }
}
```


### Chat Service

The chat service gives us a single place to retrieve and write data from Firestore. Here's a breakdown of what each method does.

- *get* retrieves the chat document as an Observable. 
- *create* writes a new chat document
- *sendMessage* uses the Firestore `arrayUnion` method append a new chat message to document. 

```typescript
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {}

  get(chatId) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  async create() {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection('chats').add(data);

    return this.router.navigate(['chats', docRef.id]);
  }

  async sendMessage(chatId, content) {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

}
```

### Joining User Profile Data to Chat Messages

The code below is the the most advanced part of this lesson. It grabs the unique IDs from the chat messages array, then joins the user profile data to each message and keeps the entire payload synced in realtime. I highly recommend also watching the [Advanced Firestore Joins lesson](/lessons/firestore-joins-similar-to-sql/) if you get lost in this section. 

```typescript
  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }
```


### Chat Component

Most of the complex data management code lives in the chat service - now we need to make use of it in a component. 

```typescript
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat$: Observable<any>;
  newMsg: string;

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
    const source = this.cs.get(chatId);
    this.chat$ = this.cs.joinUsers(source);

  }

  submit(chatId) {
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
}
```

In the HTML we can unwrap the Observable with the `async` and bind its data to the template.

```html
<ng-container *ngIf="chat$ | async as chat">

    <div class="top">
      <p>
          https://firestore-megachat.firebaseapp.com/chats/{{ chat.id }}
      </p>
    </div>


    <div class="chat">


      <div class="msg" *ngFor="let msg of chat.messages; trackBy: trackByCreated">

        <div class="user">
          <img [src]="msg.user?.photoURL">
          <div>{{ msg.user?.displayName }}</span></div>
        </div>

        <p>{{ msg.content }}</p>

      </div>

    </div>

    <div class="form">
      <input [(ngModel)]="newMsg" (keydown.enter)="submit(chat.id)">

      <button (click)="submit(chat.id)">Send</button>
    </div>

</ng-container>
```


## Archiving Messages 

The AngularFirebase Slack Channel has generated over 150,000 messages in the last 12 months, so it's safe to assume our Firestore chat documents will need more than 1Mb of space. In addition, we should keep the main chat document relatively small to also minimize data load times. 

1Mb is actually quite large. There are 1 million bytes in a Megabyte and let's assume a worst case of 5 bytes per character in each message. That gives us room for well over 1K messages at 100 characters each.

### Manage Document Size with a Cloud Function

So here's the plan... We will trigger a Cloud Function on every document write. When a chat's messages array exceeds 100 or the JSON stringified value is greater than 10K characters, we will delete the oldest messages. This means we never fill more that 5% of the document's capacity and we should have access to the last 100 or so messages.  

```
firebase init functions
```

```typescript
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

const db = admin.firestore();

export const archiveChat = functions.firestore
  .document("chats/{chatId}")
  .onUpdate(change => {
    const data = change.after.data();

    const maxLen = 100;
    const msgLen = data.messages.length;
    const charLen = JSON.stringify(data).length;

    const batch = db.batch();

    if (charLen >= 10000 || msgLen >= maxLen) {

      // Always delete at least 1 message
      const deleteCount = msgLen - maxLen <= 0 ? 1 : msgLen - maxLen
      data.messages.splice(0, deleteCount);
 
      const ref = db.collection("chats").doc(change.after.id);

      batch.set(ref, data, { merge: true });

      return batch.commit();
    } else {
      return null;
    }
  });
```



## The End

A fully-featured chat app has a ton of moving parts, but Firebase takes care of the most challenging development hurdles, like state management, realtime data syncing, user auth, and scaling. The next step is to think about adding additional features, like user access control, file uploads, push notifications, and more. 


