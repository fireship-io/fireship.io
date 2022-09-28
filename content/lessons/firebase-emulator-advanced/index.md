---
title: Firebase Emulator Advanced Usage Guide
lastmod: 2020-05-31T19:11:38-07:00
publishdate: 2020-05-31T19:11:38-07:00
author: Jeff Delaney
draft: false
description: Advanced techniques for generating mock data and testing with the Firebase emulator suite
tags: 
    - firebase
    - productivity
    - testing
    - pro

pro: true
vimeo: 424882834
# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The [Firebase emulator suite](https://firebase.google.com/docs/emulator-suite) allows developers to run a mock Firebase environment locally. Last week, Firebase released a new feature called the [Emulator UI](https://firebase.googleblog.com/2020/05/local-firebase-emulator-ui.html) to visualize and manage Firestore (and Realtime DB) from the browser. The following lesson contains a variety of advanced techniques for setting up a Firebase development environment.

<div class="flex-center">
    {{< tweet 1267220417896255488 >}}
</div>


## Initial Setup

First, install/update the Firebase CLI, then initialize the emulators in your project.

{{< file "terminal" "command line" >}}
```text
npm i -g firebase-tools

firebase init

firebase emulators:start
```

### Frontend Integration

How do you use emulated Cloud Functions and Firestore in a frontend app? When developing on localhost, you can tell Firestore and Callable Functions to use the emulator with a simple conditional check on the URL.

{{< file "js" "client-side.js" >}}
```javascript
  firebase.initializeApp(yourFirebaseConfig);
  

  if (location.hostname === "localhost") {

    firebase.firestore().settings({
      host: "localhost:8080",
      ssl: false
    });

    firebase.functions().useFunctionsEmulator("http://localhost:5001");
  }
```

### Backend Firebase Admin

If using Firebase Admin with Node.js, you can set an environment variable when not in production. 

{{< file "js" "server-side.js" >}}
```javascript
admin.initializeApp();


if (process.env.NODE_ENV !== 'production') {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
}
```


### What cannot be Emulated?

Auth, Storage, and FCM are not currently supported. If you need to create a large number of mock records for these services, consider creating a second "sandbox" Firebase project. 


## Mock Data

The emulator makes the Firebase Admin SDK available on the browser `window`. This means you can just call `firestore.doc(...).set(...)` from a client-side script or the browser console. 

### Generate Fake Firestore Data Quickly

We can quickly generate mock data by injecting [Faker.js](https://github.com/marak/Faker.js/) into a browser script. The script appends a button to the UI, then tells Firestore to create 100 user documents with fake data. Run it by simply pasting this code into the browser console. 

{{< file "js" "browser console" >}}
```javascript
(function () {
  const script = document.createElement('script');
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
  document.body.appendChild(script);

  setTimeout(() => {
    faker.seed(23);

    const container = document.querySelector('.Firestore-actions');

    const btn = document.createElement('button');
    btn.innerHTML = 'Add 100 Users';
    btn.className = 'mdc-button mdc-button--unelevated';
    btn.onclick = async () => {
      Array(100)
        .fill(0)
        .forEach((_) => {
          firestore.collection('users').add(faker.helpers.createCard());
        });
    };

    container.appendChild(btn);

  }, 2000);
})();

```

### Run the Script Automatically

You can run this script each time you visit the `localhost:4000/firestore/*` URL with a browser plugin called [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo). 

{{< figure src="img/emulator-fake-data.png" caption="Use TamperMonkey to run the script automatically" >}}


## PubSub

[Pub/Sub](https://cloud.google.com/pubsub/) is a secure way to send messages between Google Cloud services. To create messages, install the Node.js client. 

{{< file "terminal" "command line" >}}
```text
npm i @google-cloud/pubsub
```

### Create and Send Messages

Below we have an HTTP function used to publish test messages. First, it checks if a topic exists, and if not, creates it. Next, it sends the JSON payload to its subscribers. I would recommend calling this function from an HTTP client like Postman or Insomnia (see video). 

```javascript
const { PubSub } = require('@google-cloud/pubsub');
const pubsubClient = new PubSub();


exports.sendTestMessage = functions.https.onRequest(async (req, res) => {

    const { topic, data } = req.body;


    const [exists] = await pubsubClient.topic(topic).exists();
    
    if (!exists) {
        await pubsubClient.createTopic(topic);
    }


    const id = await pubsubClient.topic(topic).publishJSON(data);

    res.send(id)
});
```

### Receive Messages

Handle messages to a topic with a Pub/Sub Cloud Function. 

```javascript
exports.handleMessage = functions.pubsub.topic('test').onPublish( async (message, context) => {

    const data = message.json;

    // do something here

    return null;

});

```

### Run Scheduled Jobs

The emulator does not currently run cron jobs for your scheduled functions. However, you can test the logic in your function by triggering the associated Pub/Sub topic, such as `firebase-schedule-YOUR_FUNCTION_NAME`. 

```javascript
exports.someBackgroundJob = functions.pubsub.schedule('* * * * *').onRun( ctx => { ... });
```

For example, this function can be triggered by sending a message to `firebase-schedule-someBackgroundJob`. If you really want to test a schedule, consider creating a script with [node-cron](https://www.npmjs.com/package/node-cron). 

## Testing

### End-to-End with Cypress

You can easily add end-to-end (E2E) testing to any frontend project with Cypress. 

{{< file "terminal" "command line" >}}
```text
cd frontend-app
npm install cypress -D
```

Create a file for your spec. 

{{< file "js" "cypress/integration/example-spec.js" >}}
```javascript
/// <reference types="cypress" />

const baseUrl = 'http://localhost:5000';

```

Add some specs that interact and test your app while the emulator is running

{{< file "js" "cypress/integration/example-spec.js" >}}
```javascript
describe('my app', () => {
  before(() => {
    // runs once before all tests in the block
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  });

  it('loads', () => {
    cy.visit(baseUrl);
    cy.contains('💪🔥 Mode Activated');

  });

  it('signs the user in', () => {
    const signIn = cy.contains('Sign In Anonymously');

    signIn.click();

    cy.contains('Sign Out').should('be.visible');
  });

  it('creates firestore data', () => {
    const createDoc = cy.contains('Create Document');

    createDoc.click();

    cy.contains('📜 I like Svelte').should('be.visible');

  });

  it('aggregates data with a firestore cloud function', () => {

    cy.get('#totalPosts').should('contain.text', '1');


    cy.contains('Create Document').click();
    cy.get('#totalPosts').should('contain.text', '2');

    cy.contains('Create Document').click();
    cy.get('#totalPosts').should('contain.text', '3');

    cy.contains('Create Document').click();
    cy.get('#totalPosts').should('contain.text', '4');


  });
});
```

### Cloud Functions Unit Tests

E2E testing is not suitable for all scenarios. In some cases, you may to [unit test Cloud Functions](https://fireship.io/lessons/testing-cloud-functions-in-firebase/) individually.

### Firestore Rules Unit Tests

It can also be beneficial to [test Firestore security rules](https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/). 
