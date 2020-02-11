---
title: Secure Firebase Cloud Functions for Authenticated Users
lastmod: 2017-09-27T07:08:09-07:00
publishdate: 2017-09-27T07:08:09-07:00
author: Jeff Delaney
draft: false
description: Run HTTP and Database Cloud Functions when a user is logged-in
tags: 
    - firebase
    - security
    - pro

youtube: By29NQXO9Ek
pro: true

# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Learn more in the [Cloud Functions Master Course](/courses/cloud-functions). 

In this lesson, I will show you how to run [Firebase Cloud Functions](https://firebase.google.com/docs/functions/) ONLY when users are authenticated with a valid user ID. 


[Endpoint security](http://blog.restcase.com/top-5-rest-api-security-guidelines/) is critical  - especially if using a paid 3rd party API like SendGrid or Twilio. There are certain situations where only want a function to run if the user is currently authenticated. For example, you may have a function that sends transactional email to a user via SendGrid. If this function is left insecure, any old troll can send cURL requests to your endpoint and cause you to rack up fees with your email service provider. There are two ways to address this issue and I will cover both: 

1. Method 1 - Secure Database Triggers
2. Method 2 - Secure HTTPS Triggers


## Method 1 - Database Trigger with Backend Rules

Thanks to Firebase, locking down database cloud functions for authenticated users is very simple. In my opinion, this is a superior way to keep cloud functions secure by user, but may not be practical in all cases. 

### database.rules.json

First, we create a database rule that limits the action to an authenticated user's specific user ID. This will ensure that only the Firebase account admin or user with that UID can modify that node. 


```js
  "users": {
     "$uid": {
        ".write": "auth.uid === $uid",
      }
    },
```


### Cloud Function index.js 

Next, we run a cloud function that is triggered on the secured node. Firebase will block any updates to a node that is not owned by that user, so we are guaranteed a secure function invocation based on the underlying Firebase architecture. 



```js
const functions = require('firebase-functions');

exports.secureDatabase = functions.database

    .ref('/users/{userId}/friends')
    .onCreate(event => {
    
        const data = event.after.val();
        const userId  = event.params.userId;
        
        // Hypothetical send transactional email to user
        return sendEmailToUser('You have a new friend!');

})
```


Now if you try to update data on this node without being logged in with a matching UID, you will get the following error in the console and the cloud function will never run. 


{{< figure src="img/firebase-permission-denied.png" caption="Permission denied with firebase database rules" >}}

## Method 2 - HTTP Trigger with CORs and Token Decoding

It is not always feasible to use database triggers, so how do we secure an HTTP Firebase Cloud Function? The answer is to [decode an authentication token header](https://firebase.google.com/docs/auth/admin/verify-id-tokens) in the cloud function environment. 

<img src="/images/secure-https-cloud-function.gif" alt="A secure endpoint on Firebase cloud functions" class="content-image" />

Google has put together an [example](https://github.com/firebase/functions-samples/tree/master/authorized-https-endpoint) of an authorized endpoint in the cloud functions samples repo. I have modified the function to my own preferences and added a way to trigger it with the Angular HTTP module. 


### HTTP Cloud Function that Validates Auth Data

Here's what's going on step-by-step. 

1. Request is received at endpoint
2. Wrap the request in CORS
3. Validate request has Authorization header
4. Decode the auth token in header (this is the current user)
5. See if current user UID === requested resource UID. 



```js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({ origin: true });


exports.secureEndpoint = functions.https.onRequest((req, res) => {

    cors( req, res, () => { 


        let requestedUid = req.body.uid     // resource the user is requsting to modify
        let authToken = validateHeader(req) // current user encrypted
        
        if (!authToken) {
            return res.status(403).send('Unuthorized! Missing auth token!')
        }
            
        return decodeAuthToken(authToken)
                    .then(uid => {
                        if (uid === requestedUid) {
                            // Safe to do something important here
                            res.status(200).send('Looks good!')
                        } else {
                            res.status(403).send('Unauthorized to edit other user data')
                        }
        })
                    .catch(err => console.log(err))

    });
});


// 1. Helper to validate auth header is present
function validateHeader(req) {
    if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ) {
        console.log('auth header found')
        return req.headers.authorization.split('Bearer ')[1]
    }
}

// 2. Helper to decode token to firebase UID (returns promise)
function decodeAuthToken(authToken) {
    return admin.auth()
                .verifyIdToken(authToken)
                .then(decodedToken => {
                    // decode the current user's auth token
                    return decodedToken.uid;
                })
} 
```

### Make the HTTP Call in Angular

Naturally, we are going to make the HTTP call with Angular, but you could also do with with vanilla JS. 

If you send the request with `myUID`, assuming you send your current auth uid, you should get a 200 response back from the cloud function. Sending any other UID will result in a 403 unauthorized error. 

```typescript
import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {


  constructor(private db: AngularFireDatabase, private http: Http) { }

  postRequest() {
    const url = 'https://your-firebase-project.cloudfunctions.net/secureEndpoint';

    firebase.auth().currentUser.getIdToken()
            .then(authToken => {
              const headers = new Headers({'Authorization': 'Bearer ' + authToken });

              const myUID    = { uid: 'current-user-uid' };    // success 200 response
              const notMyUID = { uid: 'some-other-user-uid' }; // error 403 response

              return this.http.post(url, myUID, { headers: headers }).toPromise()
            })
            .then(res => console.log(res))
    }

}
```

Then try the request out via an HTML button: 

```html
<button (click)="postRequest()">
  POST to Secure HTTP Endpoint
</button>
```


That's it for secure Firebase Cloud Function endpoints. 