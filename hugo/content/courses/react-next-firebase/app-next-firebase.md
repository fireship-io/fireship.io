---
title: Firebase Setup
description: Install Firebase in a Next.js project
weight: 13
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 
emoji: 🔥
video_length: 11:47
---

## Firebase Setup

{{< file "terminal" "command line" >}}
```bash
npm install firebase react-firebase-hooks
```

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

