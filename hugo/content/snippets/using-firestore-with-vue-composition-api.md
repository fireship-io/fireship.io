---
title: Vue Composition API with Firestore
lastmod: 2020-03-19T14:19:51-07:00
publishdate: 2020-03-19T14:19:51-07:00
author: Jeff Delaney
draft: true
description: Patterns for working with realtime Firestore data with the Vue.js 3 Composition API
tags: 
    - vue
    - firestore

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


## Reactive Realtime Document

The following code creates a `reactive` value, then subscribes 

### Reactive Functions

{{< file "js" "firebase.js" >}}
```javascript

```

### Usage in a Component

In a component, you can connect your realtime data by simply exporting a

{{< file "vue" "SomeComponent.vue" >}}
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

It is also a good practice to unsubscribe when the component is destroyed to prevent memory leaks. 


## VueFire

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

Now you have a generic component for working with Firestore documents. 

```html
<Doc path="products/some-id" v-slot:data="{ product }">

    <div v-if="product">
        {{ product.title }}
    </div>

</Doc>
```