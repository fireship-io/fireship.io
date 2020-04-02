---
title: Realtime Auth State
description: React to changes to the Firebase User Auth State
weight: 21
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403195954
emoji: 👥
free: true
video_length: 4:02
---

## Opt-in to the Composition API

{{< file "terminal" "command line" >}}
```text
npm i @vue/composition-api
```

Register it as a plugin

{{< file "js" "main.js" >}}
```javascript
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
```

## User Component

{{< file "vue" "User.vue" >}}
```html
<template>
  <div>
    <slot name="user" :user="user"></slot>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { ref } from '@vue/composition-api';

export default {
  setup() {

    const user = ref(null);
    const unsubscribe = auth.onAuthStateChanged(
        
                            firebaseUser =>  user.value = firebaseUser
                        );
    return {
      user,
      unsubscribe,
    }
  },

  destroyed() {
    this.unsubscribe()
  }
}
</script>
```

## Conditional Rendering for the User

Pseudo-example of the `User` component. 

```html
<User #user="{ user }">
    
    <UserProfile v-if="user" />

    <Login v-else />

</User>
```