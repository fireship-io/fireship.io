---
title: Test Firebase Cloud Functions with Jest
lastmod: 2018-05-23T14:25:19-07:00
publishdate: 2018-05-23T14:25:19-07:00
author: Jeff Delaney
draft: false
description: Apply test-driven development to your Firebase Cloud Functions with Jest
tags: 
    - pro
    - typescript
    - jest
    - cloud-functions

youtube: tp7Jt5N6keU
pro: true
github: https://github.com/AngularFirebase/111-cloud-functions-testing-jest 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Firebase Cloud Functions makes building a serverless backend easy and fun, but the proper way to write unit tests in this environment is not exactly clear. In this episode, I will show you how to setup a testing environment for your functions and use [Jest](https://facebook.github.io/jest/) to implement unit tests. 

Jest is my preferred testing framework for Cloud Functions, but the official docs use [Mocha, Sinon, and Chai](https://firebase.google.com/docs/functions/unit-testing). Either approach works.


## Test Environment Setup

There are two ways to test functions - offline and online. With *offline* testing, you will create mocks and stubs to simulate a Cloud Function's arguments. With *online* testing you will make real requests to Firebase using a dedicated development project, so your tests will read/write live data. 

<p class="tip">**Should I write offline or online tests?** It's a matter of personal preference, but I do most of my testing online with a dedicated Firebase project for development. Offline tests require a ton of stubs, which can be cumbersome to setup and are more susceptible to human error.</p>

Let's initialize functions and create a couple test files. 

```shell
firebase init functions # select TypeScript
cd functions

mkdir test
touch test/offline.test.ts
touch test/online.test.ts
```

### Install Jest Typescript

Jest requires some setup, but by comparison to other test frameworks it is very minimal. Ideally, Jest is the only package you need to install to handle all Cloud Function testing. 

Install [Jest TypeScript](https://github.com/kulshekhar/ts-jest) (and Jest globally)

```shell
npm install --global jest 
npm install --save-dev jest ts-jest @types/jest
```

Then update the *package.json* 

```js
{
  "jest": {
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ]
  }
}
```

Now you're ready to start testing. Use the `watchAll` flag to run tests in the background. Optionally add `coverage` to show code coverage. 


```shell
jest --watchAll --coverage
```

### Offline Testing Setup

Offline tests...

- run faster
- require more code to setup [mocks/stubs](https://en.wikipedia.org/wiki/Test_stub)
- do not make any real changes to your data

```js
// functions/test/offline.test.ts

import 'jest';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions-test';
const testEnv = functions();
```

### Online Testing Setup

Online tests...

- run slower
- are easier to write (fewer stubs needed)
- should use a project isolated from your production app  

To setup online tests, you need to download your service account from the Firebase console and save the credentials to a file named */functions/service-account.json*

<p class="warn">Do not expose the service account publicly - it allows full write access to your Firebase project.</p>

```js
// functions/test/online.test.ts

import 'jest';

import * as functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

// Online Testing
const testEnv = functions({
    databaseURL: 'https://xyz.firebaseio.com',
    storageBucket: 'xyz.appspot.com',
    projectId: 'xyz',
  }, './service-account.json');
```


## Firestore Function Tests (Online)

### Cloud Function

Our first cloud function runs when a Firestore document is created and simply converts a property on the document to lowercase. 


```js
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Firestore Function
export const lowercaseBio = functions.firestore
  .document('animals/{animalId}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const bio = data.bio.toLowerCase();

    return admin.firestore().doc(`animals/${snap.id}`).update({ bio });
  });
```

### Spec

Let's test our function with live data to ensure that data gets updated in the database properly. Notice how we need to use `testEnv.wrap(lowercaseBio)` to make the function callable in our tests. This gives us a function that returns a Promise, therefore we can await the results in the spec. When the promise resolves, the database should be updated with the lowercase value. 

```typescript
import { lowercaseBio } from '../src';

describe('downcaseBio', () => {
  let wrapped;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(lowercaseBio);
  });

  test('it converts the bio to lowercase', async () => {
    const path = 'animals/meerkat'; 
    const data = { bio: 'SUPER COOL' };

    // Create a Firestore snapshot
    const snap = testEnv.firestore.makeDocumentSnapshot(data, path);

    // Execute the function
    await wrapped(snap);

    const after = await admin.firestore().doc(path).get();

    expect(after.data().bio).toBe('super cool');

  });
});
```

## Auth Function Tests (Online)

### Cloud Function

The auth function runs after a new user signup and will create a Firestore document under the UID to give them an initial *ranking* of *noob*.

```typescript
export const createUserRecord = functions.auth
  .user()
  .onCreate((user, context) => {
    return admin
      .firestore()
      .doc(`users/${user.uid}`)
      .set({ ranking: 'noob' });
  });
```

### Spec

The auth function is tested in the same manner as Firestore. In fact, all background functions (Firestore, RTDB, Auth, Storage, PubSub) follow similar testing patterns. Notice how we use `testEnv.auth.makeUserRecord(...)`. This allows us to generate a fake user record specifically for this test with the values we specify.

```typescript
describe('createUserRecord', () => {
  let wrapped;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(createUserRecord);
  });

  afterAll( () => {
    admin.firestore().doc(`users/dummyUser`).delete();
    testEnv.cleanup();
  });

  test('it creates a user record in Firestore', async () => {
    const user = testEnv.auth.makeUserRecord({ uid: 'dummyUser' })
    await wrapped(user);

    const doc = await admin.firestore().doc(`users/${user.uid}`).get();

    expect(doc.data().ranking).toBe('noob');
  });
});
```

## HTTP Function Tests (Offline)

### Cloud Function

The HTTP function simulates how a credit card payment request might work. If the request is missing a credit card in the body then we send back an error. 

```typescript
export const makePayment = functions.https.onRequest((req, res) => {
  if (!req.body.card) {
    res.send('Missing card!');
  } else {
    res.send('Payment processed!');
  }
});
```

### Spec

Let's make sure this behavior works property in offline mode. The key takeaway on this snippet is the stubbed request/response. Notice how we put the expectation inside the `send` method of the response, then call `makePayment` with our stubs.



```typescript
import { makePayment } from '../src';

/// HTTP
describe('makePayment', () => {

  
  test('it returns a successful response with a valid card', () => {
    const req = { body: { card: '4242424242424242' } };
    const res = {
      send: (payload) => {
        expect(payload).toBe('Payment processed!');
      }, 
    };

    makePayment(req as any, res as any);
  }); 

});
```

## The End

There are many different possibilities when it comes to testing Cloud Functions. Ultimately, the right strategy depends on the critical business needs of the app, but live testing with Jest is a reliable approach for many situations. Let me know if you want to see any other testing strategies in the comments.  
