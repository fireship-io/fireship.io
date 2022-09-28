---
title: Authenticate a Firebase User on the Server
lastmod: 2020-05-22T05:56:37-07:00
publishdate: 2020-05-22T05:56:37-07:00
author: Jeff Delaney
draft: false
description: How to setup express middleware for serverside auth in Firebase
tags: 
    - node
    - security
    - auth

type: lessons
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The following snippet demonstrates how to setup server-side authentication in Firebase on any node server using Express.js. 

Note. If using Firebase Cloud Functions, you can use [Callable](https://firebase.google.com/docs/functions/callable) Functions to automatically handle this type of authentication. 

## Client-side: Include the ID Token

Your client-side code must attach the [ID token](https://firebase.google.com/docs/auth/admin/verify-id-tokens) to the authorization header when making a request to the server. The example below uses the browser's built in `fetch` API. 

{{< file "js" "frontend-app.js" >}}
```javascript
import firebase from 'firebase';
const auth = firebase.auth();
const url = 'https://your-cloud-function-url';


async function fetchFromAPI() {

  const user = auth.currentUser;
  const token = user && (await user.getIdToken());

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
```


## Server-side: Verify ID the Token

On the server-side, find the the ID token in the request headers and decode it with the Firebase Admin SDK. The following middleware simply adds a `currentUser` property to the request. 


{{< file "ts" "express-app.ts" >}}
```typescript
const express = require('express')
const admin = require('firebase-admin')
admin.initializeApp();

const app = express();

// Decodes the Firebase JSON Web Token
app.use(decodeIDToken);

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeIDToken(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}
```

Access the Firebase user data in your routes. 

```typescript
app.get('/hello', (req, res) => {

    const user = req['currentUser'];

    if (!user) { 
        res.status(403).send('You must be logged in!');
    }
})
```

