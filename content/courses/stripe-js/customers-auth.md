---
title: API Authentication
description: How to decode the Firebase JSON web token with Express
weight: 42
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416873293
icon: node
video_length: 3:35
---

## SignIn and SignOut in React

{{< file "react" "App.js" >}}
```jsx
import firebase from 'firebase/app';
import { auth, db } from './firebase';

export function SignIn() {
  const signIn = async () => {
    const credential = await auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
    const { uid, email } = credential.user;
    db.collection('users').doc(uid).set({ email }, { merge: true });
  };

  return (
    <button onClick={signIn}>
      Sign In with Google
    </button>
  );
}

export function SignOut(props) {
  return props.user && (

      <button onClick={() => auth.signOut()}>
        Sign Out User {props.user.uid}
      </button>
  );
}
```

## Authenticated Fetch Helper

{{< file "js" "helpers.js" >}}
```javascript
import { auth } from './firebase';
const API = 'http://localhost:3333';

/**
 * A helper function to fetch data from your API.
 * It sets the Firebase auth token on the request.
 */
export async function fetchFromAPI(endpointURL, opts) {
  const { method, body } = { method: 'POST', body: null, ...opts };

  const user = auth.currentUser;
  const token = user && (await user.getIdToken());

  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
```

## Express Middleware

{{< file "ts" "index.ts" >}}
```typescript
// Decodes the Firebase JSON Web Token
app.use(decodeJWT);

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}


/**
 * Throws an error if the currentUser does not exist on the request
 */
function validateUser(req: Request) {
  const user = req['currentUser'];
  if (!user) {
    throw new Error(
      'You must be logged in to make this request. i.e Authroization: Bearer <token>'
    );
  }

  return user;
}
```
