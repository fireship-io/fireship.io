---
title: Autosave Vue Forms with Firestore
lastmod: 2020-04-07T15:14:17-07:00
publishdate: 2020-04-07T15:14:17-07:00
author: Johan Walhout
draft: false
description: Build a form that preloads and autosaves data to Firestore in realtime. 
tags: 
    - vue
    - firestore
    - forms

youtube: wvRVfyPKOA0
github: https://github.com/fireship-io/vue-autosaving-forms-with-firestore
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Modern applications that accept complex user inputs often provide an automatic save action that runs in the background, such as Google Docs and Microsoft Office: 

{{< figure src="img/office-autosave.png" caption="Microsoft Office files are auto-saved" >}} 

The following lesson builds a reactive Vue form that automatically syncs the user's input to a backend database -  [Firestore](/tags/firestore). It keeps track of the state of the form, and when modified, waits for a short debounce before writing the changes to the backend database. From a UX perspective, this feature allows a user to save their progress and access it later from any device.  Also, see the [Angular Auto-saving Forms Demo](/lessons/auto-save-reactive-forms-with-firestore/) demo. 

{{< tweet 1247955207448924161 >}}

## Initial Setup

Make sure you have the latest vue-cli installed.

```shell
npm install -g @vue/cli

vue create vue-autosaving-forms-with-firestore
```

Open the folder `vue-autosaving-forms-with-firestore` in VS Code and run:

```shell
npm i firebase vuefire debounce
npm run serve
```

Now our project is up and running with three additional packages: [Firebase](https://firebase.google.com/docs/reference/js), [Vuefire](https://vuefire.vuejs.org/) (a wrapper for Vue to add Firebase logic) and [debounce](https://www.npmjs.com/package/debounce) (a package which we'll use to delay the auto-save function).

### Setup a Firebase Project with Firestore

1. Create a new [Firebase project](https://firebase.google.com/).
2. Create a the Firestore database in test mode. 
3. Add a web app to the Firebase project and copy the `firebaseConfig` object. 

Firebase is up and running 🔥

### Initialize Firebase

Create a file named `firebase.js`. Copy and paste your Firebase config from the console and export the Firestore database. 

```typescript
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseApp = firebase.initializeApp({
  // Populate your firebase configuration data here.
});

const db = firebaseApp.firestore();

// Export the database for components to use.
export { db }
```
Now we can use the Firestore database throughout the application. 

### Enable VueFire

Open the `main.js` file and the enable the Vuefire package:

```typescript
// omitted

import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin, { wait: true })

// omitted
```

## Autosave Feature

### Make a Realtime Connection to Firestore

First, make a realtime connection to Firestore using the VueFire plugin. We also initialize the reactive data that will be needed to manage the state of the form, which includes: 

- `firebaseData` - the realtime data from Firestore database.
- `formData` - the data entered by the user in the HTML form.
- `state` - possible states include loading, synced, modified, revoked, error

{{< file "vue" "AutoForm.vue" >}}
```js
import { db } from './firebase';
import { debounce } from 'debounce';

const documentPath = 'contacts/jeff';

export default {
  data() {
    return {
      state: 'loading', // synced, modified, revoked, error
      firebaseData: null,
      formData: {},
      errorMessage: ''
    };
  },

  firestore() {
    return {
      firebaseData: db.doc(documentPath),
    };
  },
});
```

### Preload the Form Data

Next, preload the data from Firestore so the user can continue working on an existing form using the `created` lifecycle hook. 

```js
export default {

  // omitted

  created: async function () {
    const docRef = db.doc(documentPath);

    let data = (await docRef.get() ).data();

    if (!data) {
      data = { name: '', phone: '', email: '' }
      docRef.set(data)
    }

    this.formData = data;
    this.state = 'synced'
  },
});
```

### Save the Form Data to Firestore

Create a form to accept user input and bind it to the data with `v-model`. 

```html
    <form @submit.prevent="updateFirebase">

      <input type="text" name="name" v-model="formData.name" />
      <input type="email" name="name" v-model="formData.email" />
      <input type="tel" name="name" v-model="formData.phone" />

      <button type="submit" v-if="state === 'modified'">Save Changes</button>

    </form>
```

Create a method that uses the form data to run a `set` operation to the document in Firestore. We can also handle errors here by wrapping it in a try/catch block. 


```js
  methods: {
    async updateFirebase() {
      try {
        await db.doc(documentPath).set(this.formData);
        this.state = 'synced';
      } catch (error) {
        this.errorMessage = JSON.stringify(error)
        this.state = 'error';
      }
    }
  },
```

### Debounce and Autosave Changes

Currently, the form can be saved by the user manually. Update the form to listen the `@input` event. In addition, let's clearly display the state of the form in the UI. 



```html
<template>
  <div id="app">

    <div v-if="state === 'synced'">
      Form is synced with Firestore
    </div>
    <div v-else-if="state === 'modified'">
      From data changed, will sync with Firebase
    </div>
    <div v-else-if="state === 'revoked'">
      From data and Firebase revoked to original data
    </div>
    <div v-else-if="state === 'error'">
      Failed to save to Firestore. {{ errorMessage }}
    </div>
    <div v-else-if="state === 'loading'">Loading...</div>


    <form @submit.prevent="updateFirebase" @input="fieldUpdate">

      <input type="text" name="name" v-model="formData.name" />
      <input type="email" name="name" v-model="formData.email" />
      <input type="tel" name="name" v-model="formData.phone" />

      <button type="submit" v-if="state === 'modified'">Save Changes</button>

    </form>
  </div>
</template>
```

Write a method the handles changes to the form. Debounce the call to Firestore to prevent excessive writes to the database that could cost money and/or exceed Firestore's rate limits. 

```js
  methods: {
    fieldUpdate() {
      this.state = 'modified';
      this.debouncedUpdate();
    },
    debouncedUpdate: debounce(function() {
      this.updateFirebase()
    }, 1500)
  },
```

And we're done! Keep in mind, it is possible to make your own custom directives to share autosaving logic across multiple forms. Learn more in the [Custom Directives in Vue](https://vuejs.org/v2/guide/custom-directive.html) doc. If you have any questions or feedback, please leave a comment or drop me a line on Slack.