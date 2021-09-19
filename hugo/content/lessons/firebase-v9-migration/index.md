---
title: Firebase v9 Migration
lastmod: 2021-09-02T12:10:52-07:00
publishdate: 2021-09-02T12:10:52-07:00
author: Jeff Delaney
draft: false
description: How to migrate to the new Firebase V9 JavaScript SDK. A complete guide. 
tags: 
    - pro
    - javascript
    - firebase

# youtube: 
pro: true
vimeo: 596932628
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The Firebase team [recently released](https://firebase.googleblog.com/2021/08/the-new-firebase-js-sdk-now-ga.html) a new web SDK that utilizes [tree-shaking](https://webpack.js.org/guides/tree-shaking/) in order to lower 
JavaScript bundle sizes when used with module bundlers like Webpack and Rollup. At a high level, it works by only importing the functions/classes/code that we actually NEED, versus importing entire modules like auth, firestore, and so on. The Fireship site was able to **reduce its JavaScript bundle size by ~35%** 🤯 by upgrading to the new version.

Below is a guide for migrating from Firebase version 8 or older *to version 9+*. This lesson is designed as a reference that can be used for converting an existing app in production, starting a new project from scratch, or making adjustments to your code while going through a past Fireship tutorial. 

In this article, we will do a side-by-side comparison of the old and new versions of the Firebase SDK:

1. [Initializing Firebase, Authentication, and Firestore](#initialization)
2. [Sign-in with Google as a provider, email/password, sign out, and the auth state listener](#authentication)
3. [Add/read/update/delete documents && collections, timestamps, querying data, and using batch operations](#firestore)

Also watch the more basic [Firebase v9 overview](https://youtu.be/zd6ffqoK_EU) on YouTube. 

## Setup

### Configuration

{{< file "js" "firebaseConfig.js" >}}
```js
// Your projects firebase configuration
const firebaseConfig = {
  apiKey: "<apiKey>",
  authDomain: "<authDomain>",
  projectId: "<projectId>",
  storageBucket: "storageBucket",
  messagingSenderId: "<messagingSenderId>",
  appId: "<appId>",
  measurementId: "<measurementId>",
};

export default firebaseConfig;
```

### Initialization

v8 and earlier:

{{< file "js" "firebaseConfig.js" >}}
```js
import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// Initialize and export auth && firestore
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;
```

v9 and later:

```js
import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize firebase
const firebaseApp = initializeApp(config);

// Initialize auth && firestore with the 'firebaseApp' property
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export default firebaseApp;
```

## Authentication

### Sign in with Google (auth provider)

v8 and earlier:

{{< file "js" "auth.js" >}}

```js
import firebase, { auth } from "./firebaseInit";

// Sign in with popup && Google as the provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

export const googleSignIn = async () => {
  await auth
    .signInWithPopup(googleProvider)
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.error(error);
    });
};
```

v9 and later:

```js
import { auth } from "./firebaseInit";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Sign in with popup && Google as the provider
const googleProvider = new GoogleAuthProvider();

export const googleSignIn = async () => {
  await signInWithPopup(auth, googleProvider)
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.error(error);
    });
};
```

### Sign in with email and password

v8 and earlier:

```js
import { auth } from "./firebaseInit";

// Sign in with Email and password
const emailSignIn = async (email, password) => {
  await auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log(userCredential.user);
    })
    .catch((error) => {
      console.log(error);
    });
};
```

v9 and later:

```js
import { auth } from "./firebaseInit";
import { signInWithEmailAndPassword } from "firebase/auth";

// Sign in with Email and password
const emailSignIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential.user);
    })
    .catch((error) => {
      console.log(error);
    });
};
```

### Sign out

v8 and earlier:

```js
import { auth } from "./firebaseInit";

// Sign out
const signOutUser = async () => {
  await auth.currentUser
    .signOut()
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error(error);
    });
};
```

v9 and later:

```js
import { auth } from "./firebaseInit";
import { signOut } from "firebase/auth";

// Sign out
const signOutUser = async () => {
  await signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error("There was an error signing out");
    });
};
```

### Auth state listener

v8 and earlier:

```js
import { auth } from "./firebaseInit";

let signedIn = false;

auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    signIn = true;
  } else {
    // No user signed in
    signedIn = false;
  }
});
```

v9 and later:

```js
import { auth } from "./firebaseInit";
import { onAuthStateChanged } from "firebase/auth";

let signedIn = false;

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    signIn = true;
  } else {
    // No user signed in
    signedIn = false;
  }
});
```

## Firestore

### Add/Set a document

v8 and earlier:

{{< file "js" "firestore.js" >}}
```js
import { firestore } from "./firebaseInit";

// Collection/doc ref
const collectionRef = firestore.collection("some-collection");
const documentRef = firestore.doc("some-collection/some-doc-name");

// Add a document to a collection | Option #1
const addDocOption1 = async () => {
  await collectionRef.doc("some-doc-name").set({
    contents: "some-data",
  });
};
// Add a document to a collection | Option #2
const addDocOption2 = async () => {
  await documentRef.set({
    contents: "some-data",
  });
};

// Add a document to a collection (with an auto assigned doc ID) | Option #1
const addDocWithAutoIdOption1 = async () => {
  await collectionRef.add({
    contents: "some-data",
  });
};

// Add a document to a collection (with an auto assigned doc ID) | Option #2
const addDocWithAutoIdOption2 = async () => {
  await collectionRef.set({
    contents: "some-data",
  });
};
```

v9 and later:

```js
import { firestore } from "./firebaseInit";
import { addDoc, setDoc, doc,, collection } from "firebase/firestore";

// Collection/doc ref
const collectionRef = collection(firestore, "some-collection");
const documentRef = doc(firestore, "some-collection", "some-doc-name");

// Add a document to a collection | Option #1
const addDocOption1 = async () => {
  await setDoc(collectionRef, "some-doc-name", {
    contents: "some-data",
  });
};
// Add a document to a collection | Option #2
const addDocOption2 = async () => {
  await setDoc(documentRef, {
    contents: "some-data",
  });
};

// Add a document to a collection (with an auto assigned doc ID) | Option #1
const addDocWithAutoIdOption1 = async () => {
  await addDoc(collectionRef, {
    contents: "some-data",
  });
};

// Add a document to a collection (with an auto assigned doc ID) | Option #2
const addDocWithAutoIdOption2 = async () => {
  await setDoc(collectionRef, {
    contents: "some-data",
  });
};

// Merging a document if it exists
const mergeExisitngDoc = async () => {
  await setDoc(
    documentRef,
    {
      contents: "some-data",
    },
    { merge: true }
  );
};
```

### Update/delete a document

v8 and earlier:

```js
import firebase, { firestore } from "./firebaseInit";

// Collection/doc ref
const collectionRef = firestore.collection("some-collection");
const documentRef = firestore.doc("some-collection", "some-doc-name");

// Update/merge a document if it exists
const mergeExisitngDoc = async () => {
  await documentRef
    .set(
      {
        contents: "some-data",
      },
      { merge: true }
    )
    .then(() => {
      console.log("Updated/merged!");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Update a document if it exists
const updateExisitngDoc = async () => {
  await documentRef
    .update({
      contents: "some-data",
    })
    .then(() => {
      console.log("Updated!");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Deleting a document
const deleteDoc = async () => {
  await documentRef
    .delete()
    .then(() => {
      console.log("Deleted!");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Add/update elements in an array
const arrayAdd = firebase.firestore.FieldValue.arrayUnion();
const updateAnArray = async () => {
  await documentRef.update({
    recentUpdates: arrayAdd("8/17/2021"),
  });
};
// Remove elements in an array
const arrayRemove = firebase.firestore.FieldValue.arrayRemove();
const RemoveArrayItem = async () => {
  await documentRef.update({
    recentUpdates: arrayRemove("7/04/2021"),
  });
};
```

v9 and later:

```js
import { firestore } from "./firebaseInit";
import {
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  doc,
  collection,
} from "firebase/firestore";

// Collection/doc ref
const collectionRef = collection(firestore, "some-collection");
const documentRef = doc(firestore, "some-collection", "some-doc-name");

// Update/merge a document if it exists
const mergeExisitngDoc = async () => {
  await setDoc(
    documentRef,
    {
      contents: "some-data",
    },
    { merge: true }
  )
    .then(() => {
      console.log("Updated/merged!");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Update a document if it exists
const updateExisitngDoc = async () => {
  await updateDoc(documentRef, {
    contents: "some-data",
  })
    .then(() => {
      console.log("Updated!");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Deleting a document
const deleteDoc = async () => {
  await deleteDoc(documentRef)
    .then(() => {
      console.log("Deleted!");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Add/update elements in an array
const updateAnArray = async () => {
  await updateDoc(documentRef, {
    recentUpdates: arrayUnion("8/17/2021"),
  });
};

// Remove elements in an array
const RemoveArrayItem = async () => {
  await updateDoc(documentRef, {
    recentUpdates: arrayRemove("7/04/2021"),
  });
};
```

### Server timestamps and incrementing counters

v8 and earlier:

```js
import firebase, { firestore } from "./firebaseInit";

// Doc ref
const documentRef = firestore.doc("some-collection", "some-doc-name");

// Timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp();
const useTimestamp = async () => {
  await documentRef.set({
    createdAt: timestamp,
  });
};

// Increment/decrement a numeric value/counter
const increment = firebase.firestore.FieldValue.increment();
const incrementCounter = async () => {
  await documentRef.update({
    increasingValue: increment(33),
    decreasingValue: increment(-13),
  });
};
```

v9 and later:

```js
import { firestore } from "./firebaseInit";
import { serverTimestamp, increment, doc } from "firebase/firestore";

// Doc ref
const documentRef = doc(firestore, "some-collection", "some-doc-name");

// Timestamp
const timestamp = serverTimestamp();
const useTimestamp = async () => {
  await setDoc(collectionRef, {
    createdAt: timestamp,
  });
};

// Increment/decrement a numeric value/counter
const incrementCounter = async () => {
  await updateDoc(documentRef, {
    increasingValue: increment(33),
    decreasingValue: increment(-13),
  });
};
```

### Batch operations

v8 and earlier:

```js
import firebase, { firestore } from "./firebaseInit";

// Doc ref
const documentRef = firestore.doc("some-collection", "some-doc-name");

// Get a new batch
const batch = firestore.batch();

// Set a batch value
batch.set(documentRef, { contents: "some-data" });

// Batch update
batch.update(documentRef, { contents: "some-updated-data" });

// Batch delete
batch.delete(documentRef);

// Commit the batch
const commitBatch = async () => {
  await batch
    .commit()
    .then(() => {
      console.log("Batch operation successful");
    })
    .catch((error) => {
      console.error(error);
    });
};
```

v9 and later:

```js
import { firestore } from "./firebaseInit";
import { writeBatch, doc } from "firebase/firestore";

// Doc ref
const documentRef = doc(firestore, "some-collection", "some-doc-name");

// Get a new batch
const batch = writeBatch(firestore);

// Set a batch value
batch.set(documentRef, { contents: "some-data" });

// Batch update
batch.update(documentRef, { contents: "some-updated-data" });

// Batch delete
batch.delete(documentRef);

// Commit the batch
const commitBatch = async () => {
  await batch
    .commit()
    .then(() => {
      console.log("Batch operation successful");
    })
    .catch((error) => {
      console.error(error);
    });
};
```

### Querying and reading data

v8 and earlier:

```js
import { firestore } from "./firebaseInit";

// Collection/doc ref
const collectionRef = firestore.collection("some-collection");
const documentRef = firestore.doc("some-collection", "some-doc-name");

// Get/read a document once
const getDocData = async () => {
  await documentRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
    }
  });
};

// Use a query to get collection docs
const getCollectionDocs = async () => {
  const collectionQuery = collectionRef.where("some-data", "==", true);

  await collectionQuery.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(data);
    });
  });
};

// Use a query with collection listener
const collectionListener = () => {
  collectionQuery.onSnapshot((querySnapshot) => {
    let dataArray = [];
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.data());
    });
    dataArray.map((d) => console.log(d));
  });
};
```

v9 and later:

```js
import { firestore } from "./firebaseInit";
import {
  query,
  where,
  limit,
  getDocs,
  collection,
  doc,
} from "firebase/firestore";

// Collection/doc ref
const collectionRef = collection(firestore, "some-collection");
const documentRef = doc(firestore, "some-collection", "some-doc-name");

// Get/read a document once
const getDocData = async () => {
  const docSnap = await getDoc(documentRef);

  if (docSnap.exists()) {
    console.log("Document data:", doc.data());
  }
};

// Use a query to get collection docs
const getCollectionDocs = async (collection) => {
  const collectionQuery = query(
    collectionRef,
    where("some-data", "==", true),
    limit(25)
  );
  const querySnapshot = await getDocs(collectionQuery);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(data);
  });
};

// Use a query with collection listener
const collectionListener = (collection) => {
  const collectionQuery = query(collectionRef, where("some-data", "==", true));

  onSnapshot(collectionQuery, (querySnapshot) => {
    let dataArray = [];
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.data());
    });
    dataArray.map((d) => console.log(d));
  });
};
```