---
title: Setup & Teardown
description: Setup & Teardown mock Firestore data for testing
weight: 41
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486557717
emoji: 🧪
video_length: 4:00
---

Create a file to manage setup and teardown for tests.

{{< file "js" "helpers.js" >}}
```javascript
const { loadFirestoreRules, initializeTestApp, clearFirestoreData, initializeAdminApp } = require('@firebase/rules-unit-testing');
const { readFileSync } = require('fs');

module.exports.setup = async (auth, data) => {
  const projectId = `fireship-dev-17429`;
  const app = initializeTestApp({
    projectId,
    auth
  });

  // console.log(app.auth().currentUser)

  const db = app.firestore();

  // Write mock documents before rules
  if (data) {
    const admin = initializeAdminApp({
      projectId,
    });


    for (const key in data) {
      const ref = admin.firestore().doc(key);
      await ref.set(data[key]);
    }
  }

  // Apply rules
  await loadFirestoreRules({
    projectId,
    rules: readFileSync('firestore.rules', 'utf8')
  });

  return db;
};

module.exports.teardown = async () => {
  Promise.all(firebase.apps().map(app => app.delete()));
  await clearFirestoreData();
};
```

Use Jest's hooks to call the helpers. 

{{< file "js" "rules.test.js" >}}
```javascript

const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { setup, teardown } = require('./helpers');

describe('Database rules', () => {
    let db;
  
    // Applies only to tests in this describe block
    beforeAll(async () => {
      db = await setup(mockUser, mockData);
    });
  
    afterAll(async () => {
      await teardown();
    });
  
    
  });
```