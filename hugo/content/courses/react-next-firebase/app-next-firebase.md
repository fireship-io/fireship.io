---
title: Firebase Setup
description: Install and configure Firebase in a Next.js project
weight: 13
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508599406
emoji: 🔥
video_length: 5:09
---

## Firebase Setup

{{< file "terminal" "command line" >}}
```bash
npm install firebase react-firebase-hooks
```

- [Firebase JS](https://firebase.google.com/docs/web/setup) works in both the browser and Node.js
- [react-firebase-hooks](https://www.npmjs.com/package/react-firebase-hooks) abstracts realtime Firebase streams to React hooks 

## Firebase Lib

Export common Firebase SDKs and utilities.

{{< file "js" "lib/firebase.js" >}}
```javascript
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    // your config
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
```

## Optional

Consider setting up the Firestore emulator to work with mock data on your local machine.

[Firebase Emulator PRO Video](/lessons/firebase-emulator-advanced/)

