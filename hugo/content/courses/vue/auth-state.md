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

  unmounted() {
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

{{< transcript >}}

At this point we can get a user logged in, but we need Vue to react to the changes in the app state or the user state to show a different UI for logged in users versus non logged in users. There's a few different ways we could handle this, but I'm going to implement a solution using the new Vue composition API.

This API makes it a little bit easier, in my opinion, to manage real time streams like the user authentication state. What we'll do in this video is create a user component that gives us the current user state. This means we can declare the user component anywhere in the UI, and then we can do a conditional check if the user is defined and we'll know if the user's logged in or not.

This is a very powerful pattern because we can do a simple conditional check in a template to reactively render a different UI based on the users off state. And that's way easier than trying to check the off state in the JavaScript of every single component that you build. First, create a new component called user dot view.

And because this uses the composition API, we need to opt into it. We first installed the composition API using NPM, and then we go into our main JS file, import that module, and then tell Vue to use it as a plugin. In our user component, we'll go into the script and import ref from the composition. API rep is basically a way to create a reactive value whenever the value of ref changes Vue will react by re rendering the UI, and that's not to be confused with another thing in the composition API called reactive.

Ref and reactive - both do a very similar thing about reactive is used more when you have individual object properties that need to change, but let's not overthink things here. We just need a reference to the user object and have it rendered. Anytime that user object changes, we can set up the state for this component by using the setup lifecycle hook.

Inside this function, we can define our reactive user value, which will give a default of null when the user value is null. It means the user is not signed in. We can listen to changes on the user state by setting up a realtime stream using auth on state changed. And this actually returns as a function that we can call to unsubscribe from that stream when needed, which is generally a good idea.

So you don't create memory leaks in your application. Now on all state changed takes a callback as an argument that will fire every time the state changes, like when the user logs in or logs out. And we can make our user state on this component reactive by simply defining the user value as the Firebase user.

And now we simply return these values on an object from the setup function. From there, we'll set up the destroyed lifecycle hook, so we unsubscribed from the user state whenever this component is destroyed, that's technically an optional step, but it's a good idea to dispose of any realtime stream when it's no longer needed and a component.

And now that we're listening to state changes on the user, we need a way to access the user in a template. To maximize the reasonability of this component. We'll do that with a slot and we'll make the actual user data available by binding it to the user property on this slot. This is what we call a slot crop, and it makes the user data available to any other component that consumes the user component.

Let's jump over to our home component to see why this is so awesome. We import the user component. And then we declare it in the template and put our login component inside of it. We can reference the actual user data of the current user by using V slot and pointing it to that user slot prop. And now we can access the user data as if it were reactive data on this component.

Now remember, if the user is logged in, then the user object will be defined. Otherwise it will be normal. Knowing that we can do some conditional rendering, we'll say Vue if user go ahead and print out logged in as user dot user ID. And there's all kinds of other properties on this user object, like the email address, the photo URL if they sign in with OAuth and a bunch of other stuff.

But if the user object is null, then we'll just use v-else to show the login form. And now if we go preview the app, you can see it shows that we're logged in as this user ID and you'll notice that it no longer displays the login form. But one thing we're missing at this point is a way for the user to sign out, so that's what we'll look at in the next video.
