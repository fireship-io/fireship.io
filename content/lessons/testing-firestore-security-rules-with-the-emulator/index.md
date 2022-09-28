---
title: "Testing Firestore Security Rules With the Emulator"
lastmod: 2018-10-31T18:20:34-07:00
publishdate: 2018-10-31T18:20:34-07:00
author: Jeff Delaney
draft: false
description: Use the Firestore emulator to unit test security rules. 
tags: 
    - firestore
    - testing
    - jest
    - security

youtube: Rx4pVS1vPGY
github: https://github.com/AngularFirebase/147-firestore-emulator-rules-testing
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

🔥 Deep dive with the [Firestore Security Rules Master Course](/courses/firebase-security).

The most exciting announcement (in my opinion) at Firebase Summit 2018 was the [local emulator](https://firebase.google.com/docs/firestore/security/test-rules-emulator) for Firestore and RTDB, making it possible to test security rules locally or on a CI server. If you're brand new to Firebase security, make sure to watch the [Firestore Security Rules Guide](/lessons/firestore-security-rules-guide/). 
 
## Project Setup

The following lesson creates an isolated testing environment solely for testing rules logic. It does not need to be directly coupled your frontend code, which is a useful if your database spans across multiple frontend clients (ie Web, iOS, and Android). 

<p class="success">To keep our code as simple as possible, this lesson uses Jest with vanilla JS.</p>

```shell
mkdir rules && cd rules
npm init -y

npm i -D jest @firebase-testing
```

Now that we have a testing environment in place, let's link our project and opt-in to the emulator. 

```shell
firebase init firestore

firebase --open-sesame emulators
firebase setup:emulators:firestore

firebase serve --only firestore
```

<p class="tip">You must have Java installed on your local machine to work with the emulator</p>

## Testing Helpers

Like most test suites, it's useful to start with a few helpers to keep the code succinct and readable. Below are several helpers I have developed for working with the emulator in [Jest](https://jestjs.io/). 

### Setup the Database with Auth and Mock Data

The setup method is the most important helper. It initializes the database with a unique projectId, then optionally seeds it with a mock user and mock data. 



```js
const firebase = require('@firebase/testing');
const fs = require('fs');

module.exports.setup = async (auth, data) => {
  const projectId = `rules-spec-${Date.now()}`;
  const app = await firebase.initializeTestApp({
    projectId,
    auth
  });

  const db = app.firestore();

  // Write mock documents before rules
  if (data) {
    for (const key in data) {
      const ref = db.doc(key);
      await ref.set(data[key]);
    }
  }



  // Apply rules
  await firebase.loadFirestoreRules({
    projectId,
    rules: fs.readFileSync('firestore.rules', 'utf8')
  });

  return db;
};
```

Usage of the setup method looks like this: 

```js
const mockUser = { 
  uid: 'jeffd23'
}

const mockData = {
  'users/jeffd23': {
    foo: 'bar'
  },
  'tasks/testTask': {
    hello: 'world'
  }
};

//...

const db = await setup(mockUser, mockData)
```

### Teardown

It's a good practice to delete your app instances after the test run, otherwise Jest might complain about hanging async operations. 

```js
module.exports.teardown = async () => {
  Promise.all(firebase.apps().map(app => app.delete()));
};
```

### Custom Async Jest Matchers

As a final touch, we will also implement custom matchers improve readability. Every Firestore rule test will be verifying that an operation was either (1) allowed or (2) denied. The matchers below make it possible to write tests that look like `expect(read).toAllow()`. This part is optional, but will make life easier if you have a large test suite. 

```js
expect.extend({
  async toAllow(x) {
    let pass = false;
    try {
      await firebase.assertSucceeds(x);
      pass = true;
    } catch (err) {}

    return {
      pass,
      message: () => 'Expected Firebase operation to be allowed, but it was denied'
    };
  }
});

expect.extend({
  async toDeny(x) {
    let pass = false;
    try {
      await firebase.assertFails(x);
      pass = true;
    } catch (err) {}
    return {
      pass,
      message: () =>
        'Expected Firebase operation to be denied, but it was allowed'
    };
  }
});
```

## Testing Firestore Rules

Let's now take a look at several practical testing scenarios. 

### Ensure Rules are Secure by Default

First, let validate that database rules are secure by default - meaning a read to any random collection should be denied.

```
service cloud.firestore {
  match /databases/{database}/documents {

    match /{document=**} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

Below I offer several different ways to write your rules, both with the built-in Firebase testing helpers and our custom Jest matchers. 

```js
const { setup, teardown } = require('./helpers');
const { assertFails, assertSucceeds } = require('@firebase/testing');

describe('Database rules', () => {
  let db;
  let ref;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup();

    // All paths are secure by default
    ref = db.collection('some-nonexistent-collection');
  });

  afterAll(async () => {
    await teardown();
  });

  test('fail when reading/writing an unauthorized collection', async () => {
    const failedRead = await assertFails(ref.get());
    expect(failedRead);

    // One-line await
    expect(await assertFails(ref.add({})));

    // Custom Matchers
    await expect(ref.get()).toDeny();
    await expect(ref.get()).toAllow(); // should fail
  });
});
```

### Seeding the Database with Mock Data

Many rules require checks on related documents, for example, checking if a user has a specific access role before they can read/write to a collection. Rules like this require mock data to be present in the database before the rules are evaluated. Let's write a test that requires an authenticated user and that seeds Firestore with mock data . 

Let's imagine we have a project management app that allows read/write for *admin* users OR users contained in an *members* [access control list](https://en.wikipedia.org/wiki/Access_control_list). 

```
// Role-based authorization
function getUserData() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data
}

match /projects/{docId} {
  allow read, write: if getUserData().roles['admin'] == true 
  || resource.data.members.hasAny([request.auth.uid])
}
```

Notice how each test in this suite initializes a fresh database instance with a different authenticated user, but maintains the same mock data state. 

```js
const { setup, teardown } = require('./helpers');

const mockData = {
  'users/jeffd23': {
    roles: {
      admin: true
    }
  },
  'projects/testId': {
    members: ['bob']
  }
};

describe('Project rules', () => {
  let db;
  let projectsRef;

  afterAll(async () => {
    await teardown();
  });

  test('deny a user that does NOT have the admin role', async () => {
    const db = await setup({ uid: null }, mockData);

    // Allow rules in place for this collection
    projRef = db.doc('projects/testId');
    await expect(projRef.get()).toDeny();
  });

  test('allow a user with the admin role', async () => {
    const db = await setup({ uid: 'jeffd23' }, mockData);

    projRef = db.doc('projects/testId');
    await expect(projRef.get()).toAllow();
  });

  test('deny a user if they are NOT in the Access Control List', async () => {
    const db = await setup({ uid: 'frank' }, mockData);

    projRef = db.doc('projects/testId');
    await expect(projRef.get()).toDeny();
  });

  test('allow a user if they are in the Access Control List', async () => {
    const db = await setup({ uid: 'bob' }, mockData);

    projRef = db.doc('projects/testId');
    await expect(projRef.get()).toAllow();
  });
});
```

## The End

The Firestore emulator will deliver a huge boost of confidence to your backend security logic and prevent regressions that lead to catastrophic data breaches. Although the emulator is still in beta, it has already become an important tool in my workflow and I'm looking forward to experimenting with other use-cases.  