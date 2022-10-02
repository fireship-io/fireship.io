---
title: Firebase Setup
description: Install Firebase and the Vuefire package
weight: 13
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403196231
emoji: 🔥
video_length: 3:25
---


## Install the Vuefire & Firebase

{{< file "terminal" "command line" >}}
```text
npm i vuefire firebase
```

## Install the Vuefire & Firebase

{{< file "js" "main.js" >}}
```javascript
import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)
```

## Initialize Firebase

{{< file "js" "firebase.js" >}}
```javascript
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = { 
    // Add your config here
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
```