---
title: Firebase Client Setup
description: Setup the Firebase JS SDK in SvelteKit
weight: 21
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840313432
emoji: 🔥
video_length: 2:08
---

## Install Firebase JS

{{< file "terminal" "command line" >}}
```bash
npm i firebase
```


## Client SDK Setup

{{< file "ts" "lib/firebase.ts" >}}
```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    // your config
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
```

