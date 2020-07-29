---
title: Vue Composition API with Firestore
lastmod: 2020-03-19T14:19:51-07:00
publishdate: 2020-03-19T14:19:51-07:00
author: Jeff Delaney
draft: true
description: Patterns for working with users and realtime Firestore data with the Vue.js 3 Composition API
tags: 
    - vue
    - firebase
    - firestore
    - auth

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---



Vue + Firebase is an excellent stack for building realtime apps at any scale. The [Vue Composition API](https://vue-composition-api-rfc.netlify.com/#) unlocks new patterns with realtime data sources like Firestore. 


## Initial Setup

Before getting started with Firebase you need to initialize the SDK. I prefer to handle this in a dedicated JS file. 

{{< file "js" "firebase.js" >}}
```javascript
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = { 
  // your config here
};

firebase.initializeApp(firebaseConfig);

export const app = firebase.app();
export const db = firebase.firestore();
```


## User Component

It can be very useful to have a "data" component that exposes the Firebase user record reactively. 

{{< file "vue" "User.vue" >}}
```html
<template> 
    <div>
        <slot name="user" v-bind:user="user"></slot>
    </div>
</template>

<script>
import { ref } from '@vue/composition-api';

import { auth } from '../firebase';

export default {
  setup() {

    const user = ref(null);

    const unsubscribe = auth.onAuthStateChanged(firebaseUser =>  user.value = firebaseUser);

    return {
      auth,
      user,
    }
  },

}
</script>
```

Put this component to use anywhere in the app to access the current user's data, like a user profile for example: 

```html
<User v-slot:user="{ user }">
  Logged in as {{ user.uid }}
</User>
```

## Reactive Realtime Document

The following code creates a `reactive` value, then subscribes 

### Making Firestore Reactive in Vue

The code below provides a function that listens to a Firestore document in realtime. Each change to the underlying document data causes Firebase to emit a new object, which we can reactively update with `ref` from the Vue Composition API. 

{{< file "js" "firebase.js" >}}
```javascript
import { ref } from '@vue/composition-api';

export function reactiveDoc(path) {

    const data = ref(null);

    const docReference = db.doc(path);
    
    const unsubscribe = docReference.onSnapshot(snap => {
        
        data.value = snap.data();

    });


    return {
        docReference, 
        data,
        unsubscribe
    };
}
```

### Make Data Available in a Slot

In a component, you can connect your realtime data by simply exporting the data value. It is also a good practice to unsubscribe when the component is destroyed to prevent memory leaks. 

{{< file "vue" "Doc.vue" >}}
```html
<template>
  <div>
    <slot name="data" v-bind:data="data"></slot>
  </div>
</template>

<script>
import { reactiveDoc } from '../firebase';

export default {
  setup(props) {

    const { data, docReference, unsubscribe } = reactiveDoc(props.path);

    return {
      data,
      unsubscribe,
      docReference,
    }
  },

  destroyed() {
    this.unsubscribe()
  },
  props: [
    'path'
  ]
}
</script>
```

At this point, we can access the reactive data directly in a template using the slot props from the component. 

```html
<Doc path="products/some-id" v-slot:data="{ product }">

    <div v-if="product">
        {{ product.title }}
    </div>

</Doc>
```


## Comparison to VueFire

[VueFire](https://github.com/vuejs/vuefire) is an excellent option for building Firebase apps with Vue. 

{{< file "terminal" "command line" >}}
```text
npm i vuefire
```

{{< file "js" "main.js" >}}
```javascript
import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)
```

### VueFire Document Component

{{< file "vue" "Doc.vue" >}}
```html
<template>
  <div>
    <slot name="data" v-bind:data="doc"></slot>
  </div>
</template>

<script>

import firebase from 'firebase/app';
const db = firebase.firestore();

export default {
  data: function() {
    return { doc: null }
  },
  firestore: function() {
    return { 
        doc: db.doc(this.path) 
    }
  },
  props: ["path"]
};
</script>
```