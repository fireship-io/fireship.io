---
title: Realtime SSR with Nuxt3 and Firebase
lastmod: 2022-04-28T12:14:10-07:00
publishdate: 2022-04-28T12:14:10-07:00
author: Jeff Delaney
draft: false
description: How to setup Firebase v9 for SSR and realtime hydration in Nuxt3
tags: 
    - vue
    - nuxt
    - firebase

# youtube: 
github: https://github.com/fireship-io/nuxt3-firebase-starter
vimeo: 704385496
pro: true
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Nuxt3 hit release candidate [recently](https://nuxtjs.org/announcements/nuxt3-rc/) with a variety of awesome new features. But you might be wondering... how do I use Nuxt3 with Firebase? There is no documented best practice as of today, so I put together a demo that is capable of server-side rendering (SSR) via Firestore, followed by hydration to secure realtime data on the client. This gives a website the benefits SEO-friendly HTML, without sacrificing the power the realtime data updates after the initial page load. 

## Initial Setup

To get started, you will need a Firebase project then generate a new Nuxt app. 

{{< file "terminal" "command line" >}}
```bash
npx nuxi init nuxt-app
cd nuxt-app

npm install firebase firebase-admin
```

## Server-Side Rendering

The [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin) is the preferred way to run Firebase server-side. In your Nuxt project, create the following files:

```bash
/server/api/animal.js
/server/utils/firebase.js
```
### Initialize Firebase Admin

Firebase Admin requires us to authenticate the server. Download your service account from the Firebase console and save it as `service-account.json` in the root of the project. ⚠ Keep this file secret!

{{< figure src="img/service-account.png" >}}

Now install the Firebase Admin SDK and export Firestore. 


{{< file "ts" "server/utils/firebase.ts" >}}
```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const app = initializeApp({
    credential: cert('./service-account.json'),
})

export const firestore = getFirestore();
```

### Firestore API Route

Create an API route to fetch data from Firestore and make it accessible over HTTP.

{{< file "ts" "server/api/animal.ts" >}}
```typescript
import { firestore } from '../utils/firebase';

export default defineEventHandler(async event => { 
    const ref = firestore.doc(`animals/dog`);
    const snapshot = await ref.get();
    const data = snapshot.data();
    return data;
})
```

### Fetch Data via Page

Now create a Vue component or page to fetch the data and display it in the UI. 

{{< file "vue" "pages/animal.vue" >}}
```html
<script setup>
    // Server Side
    const { data: serverData } = useFetch('/api/animal');
</script>

<template>
    <div>
        <h2>Server</h2>
        <pre>{{ serverData }}</pre>
    </div>
</template>
```

## Client-Side Hydration

At this point, we are able to fetch data from the server, but it will not respond to realtime updates. To add a realtime listener, we need to initialize the Firebase Web SDK and hydrate the data.

Note: This process results in 2 document reads on the initial page load. 

### Initialize the Firebase Web SDK

Grab the Firebase web config, then create a composable to access Firebase from a Vue component. 

{{< file "ts" "composables/useFirebase.ts" >}}
```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const useFirebase = () => {
    const firebaseConfig = {
        // your config
    };

    const firebaseApp = initializeApp(firebaseConfig);
    const firestore = getFirestore(firebaseApp);

    return {
        firebaseApp,
        firestore,
    }
}
```

### Hydrate Realtime Data

When the client loads, the app needs to refetch the same data and listen to changes with `onSnapshot`. It's important to **only run Firebase Web code on the client** by placing it inside the `onMounted` lifecycle hook on inside a function.

{{< file "js" "pages/animal.vue" >}}
```html
<script setup>
    import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";

    // Server Side
    const { data } = useFetch('/api/animal');

    // Client Side
    onMounted(async() => {
        const { firestore } = useFirebase();
        const docRef = doc(firestore, `animals`, 'dog');
        onSnapshot(docRef, (snap) => {
            data.value = snap.data();
        });
    });

    const updateAnimal = async() => {
        const { firestore } = useFirebase();
        const docRef = doc(firestore, `animals`, 'dog');
        await updateDoc(docRef, {
            name: `dog-${Math.floor(Math.random() * 1000)}`,
        });
    }
</script>

<template>
    <div>
        <h2>Data</h2>
        <pre>{{ data }}</pre>
        <button @click="updateAnimal">Update dog</button>
    </div>
</template>
```