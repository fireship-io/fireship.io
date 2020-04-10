---
title: Auto-save Vue Forms with Firestore
lastmod: 2020-03-31T15:14:17-07:00
publishdate: 2020-03-31T15:14:17-07:00
author: Jeff Delaney
draft: false
description: Build forms that preload and autosave data with Firestore with the option to revoke the data
tags: 
    - pro
    - vue
    - firestore
    - forms

pro: true
# youtube: In5b6TDxb30
github: https://github.com/fireship-io/vue-autosaving-forms-with-firestore
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

We see more and more application replacing the manually save-action by the user with automatically saving changes. A few examples are Google Docs and Microsoft Office: 
{{< figure src="img/office-autosave.png" caption="Microsoft Office files are auto-saved" >}} 

Two years ago, we have made a reliable solution for syncing frondend forms to any backend database with a custom Angular Directive on a the [ReactiveFormsModule](https://angular.io/guide/reactive-forms). In this lesson we take a look at a from made in VueJs which autosaves the form data automatically into Firestore. But this could be saved to any backed database. Because we are automatically saving the data, we provide the form with a 'Revoke to original data' function, which resets Firestore and the form with the original data.

Setup and saving data form a form in VueJs is a breath, with Firestore as backend which manage the data and provide realtime updates, we have a powerful combination to build extensive webapplications. 

{{< figure src="img/vue-autosaving-forms-firestore-demo.gif" caption="Auto saving Vue form data in to Firestore with a revoke function" >}}

## Setup a black Vue project
Make sure you have the latest vue-cli installed.
```shell
npm install -g @vue/cli

vue create vue-autosaving-forms-with-firestore
```

{{< figure src="img/createvueproject.png"> caption="You will see this when Vue created this project"}}

Open the folder `vue-autosaving-forms-with-firestore` in VS Code and run:
```shell
npm i firebase vuefire debounce
npm run serve
```

Now our VueJs project is up and running with three additional packages: Firebase, Vuefire (a wrapper for Vue to add Firebase logic) and Debounce (a package which we'll use to delay the auto-save function).

## Setup Firebase project with a Firestore database
1. Create a new Firebase project
2. Create a the Firestore database with one collection and one document and three fields: name, email and phonenumber.
3. Add a wep-app to the Firebase project and copy the firebaseConfig-data

Now Firebase is up and running 🔥

## Connect Firestore to the VueJs project
1. Open the `main.ts` file and the Vuefire package like:
```typescript
// omitted

import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin, { wait: true })

// omitted
```
2. Create a file `firebase.ts` 
3. Copy and paste your Firebase config-data into this file, even with the following code:

```typescript
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseApp = firebase.initializeApp({
  // Populate your firebase configuration data here.
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
});

const db = firebaseApp.firestore();

// Export the database for components to use.
export { db }
```
Now we can use the Firestore database in every component we want to.

## Setup the form and connect it to Firestore
There are several different ways to connect the Firestore data and the VueJs form. In our case we just create three variables in the component to store and show the:
- Form data
- Original data
- Firestore data, which will be automatically updates

First let's start with some CSS to style the page and the form. So, within the style-tags paste the following CSS:
```SCSS
h1,
h2,
h3 {
  font-weight: 600;
}

#app {
  font-family: "sofia-pro", sans-serif;
  text-align: center;
  padding: 10vh 15vw;
}

p.help {
  text-align: left;
}
```

Then we add the logic to the App.vue as follows:
```typescript
import { db } from "./firebase";
import { debounce } from "debounce";

export default {
  data() {
    return {
      state: "",
      originalData: {},
      formData: {},
      firebaseData: {}
    };
  },

  firestore() {
    return {
      firebaseData: db.doc("documents/contact")
    };
  },

  methods: {
    updateFirebase: debounce(async function() {
      try {
        this.state = "synced";
        await db.doc("documents/contact").set(this.formData);
      } catch (error) {
        this.state = "error";
      }
    }, 1500),

    revokeData() {
      const _that = this as any;
      this.formData = (_that as any).originalData;
      this.updateFirebase();
      this.state = "revoked";
    },

    getDataOnce: async function() {
      const data = await db.doc("documents/contact").get();
      return data.data();
    },

    fieldUpdate() {
      this.state = "modified";
      this.updateFirebase();
    },
  },

  created: async function() {
    (this as any).originalData = await (this as any).getDataOnce();
    (this as any).formData = await (this as any).getDataOnce();
  }
};
```
There is quite a bit happening here, so let's walk through it:
- Frist, we import the Firestore logic from our `firebase.ts` file
- We import the Debounce package for use here

We initialize four properties in this Vue-component:
- state: "" => here we store the active state in which the data is, we implement: *synced*, *modified*, *revoked* and *error*.
They will speak for themselves:
- originalData: {},
- formData: {},
- firebaseData: {}

Next we implement:
```Typescript
firebaseData: db.doc("documents/contact")
```
To subscribe to the changes from the Firestore database.

In our function `getDataOnce` we will get the data when the pages is created and assign it to the properties:
```typescript
getDataOnce: async function() {
  const data = await db.doc("documents/contact").get();
  return data.data();
},

// ...

created: async function() {
  (this as any).originalData = await (this as any).getDataOnce();
  (this as any).formData = await (this as any).getDataOnce();
}
```

With the VueJs directive `@input` we listen to changes on a form-field. So, every time the value in a field changes, we call `fieldUpdate()` to change the state and call `updateFirebase()`.

With the debounce wrapped around the `updateFirebase()` function, we can wait to finish the user typing in the formfield:    
```typescript
updateFirebase: debounce(async function() {
  try {
    this.state = "synced";
    await db.doc("documents/contact").set(this.formData);
  } catch (error) {
    this.state = "error";
  }
}, 1500),
```

But when we're not content with the changes, we can call `revokeData()` which simply pass the *originalData* to the form, which triggers the `fieldUpdate()` and everything starts over.
```typescript
revokeData() {
  const _that = this as any;
  this.formData = (_that as any).originalData;
  this.updateFirebase();
  this.state = "revoked";
},
```

Finally, to wrap up the form, we have to setup the html in the template-tag as follows:

```html
<div id="app">
  <div class="notification is-success" v-if="state === 'synced'">Form is synced with Firestore</div>
  <div
    class="notification is-link"
    v-else-if="state === 'modified'"
  >From data changed, will sync with Firebase</div>
  <div
    class="notification is-warning"
    v-else-if="state === 'revoked'"
  >From data and Firebase revoked to original data</div>
  <div class="notification is-danger" v-else-if="state === 'error'">Failed to save to Firestore</div>
  <div class="notification is-info" v-else>Waiting for changes...</div>

  <hr />
  <div class="columns">
    <div class="column">
      <h3>Original Data</h3>
      <br />
      {{ originalData }}
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <h3>Vue Form Data</h3>
      <br />
      {{ formData }}
    </div>
    <div class="column">
      <h3>Firestore Data</h3>
      <br />
      {{ firebaseData }}
    </div>
  </div>

  <hr />

  <form @submit.prevent="saveForm">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Contact</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded has-icons-left">
            <input
              class="input"
              type="text"
              name="name"
              v-model="formData.name"
              @input="fieldUpdate"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </p>
        </div>
        <div class="field">
          <p class="control is-expanded has-icons-left has-icons-right">
            <input
              class="input"
              type="email"
              name="email"
              v-model="formData.email"
              @input="fieldUpdate"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Phone</label>
      </div>
      <div class="field-body">
        <div class="field is-expanded">
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">+44</a>
            </p>
            <p class="control is-expanded">
              <input
                class="input"
                type="tel"
                name="phonenumber"
                v-model="formData.phonenumber"
                @input="fieldUpdate"
              />
            </p>
          </div>
          <p class="help">Do not enter the first zero</p>
        </div>
      </div>
    </div>
    <hr />
    Vue Form State: {{ state == '' ? "waiting for changes" : state }}
    <hr />
  </form>
  <button class="button is-warning is-rounded" @click="revokeData">
    <span class="icon">
      <i class="fas fa-undo"></i>
    </span>
    <span>Revoke to original data</span>
  </button>
</div>
```

In VueJs it's possible to make your own custom directives as well, just take a look [Custom Directives in VueJs](https://vuejs.org/v2/guide/custom-directive.html)

In this example we have placed the whole form and logic around it into a simple file, but this could be easily separated to use in a global Vue-project. If you have any questions or feedback, please leave a comment or drop me a line on Slack.