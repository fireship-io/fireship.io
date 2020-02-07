---
title: SendGrid Vue
lastmod: 2019-07-05T10:43:06-07:00
publishdate: 2019-07-05T10:43:06-07:00
author: Jeff Delaney
draft: false
description: Send transactional email from Vue with SendGrid
type: lessons
# pro: true
tags: 
    - vue
    - sendgrid

vimeo: 346869657
github: https://github.com/fireship-io/196-sendgrid-email-cloud-functions
# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3

# chapters:

---

{{< box emoji="👀" >}}
This tutorial is an extension of the [SendGrid Transactional Email Guide](/lessons/sendgrid-transactional-email-guide/). You must have the Cloud Functions deployed to start sending email from your frontend app. 
{{< /box >}}


## Initial Setup

Start by installing the [Firebase Web SDK](https://firebase.google.com/docs/web/setup), then initialize the packages in the root of the project.  Vuefire can be installed as well, but is not required for this feature. 

{{< file "js" "firebase.js" >}}
{{< highlight javascript >}}
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';

const config = {
 // your firebase config
}

firebase.initializeApp(config);

export const app = firebase.app();
export const auth = firebase.auth();
export const functions = firebase.functions();
{{< /highlight >}}


## Transactional Email Component

The [Vue](https://vuejs.org/) component uses the `beforeCreate` lifecycle hook to monintor to the user's auth state, while `sendEmail` references the callable function deployed to Firebase.

{{< file "vue" "HelloWorld.vue" >}}
{{< highlight html >}}
<template>
<div>

  <div v-if="user">
    {{ JSON.stringify(user) }}
    <button v-on:click="sendEmail()">Send Email with Callable Function</button>
    <button v-on:click="signOut()">Sign Out</button>
  </div>

  <div v-else>
    <button v-on:click="signInWithGoogle()">Login with Google</button>
  </div>

</div>
</template>

<script>

import * as firebase from 'firebase/app';
import { auth, functions } from '../firebase';

export default {
  name: 'HelloWorld',
  data: function () {
    return {
      user: null
    }
  },
  beforeCreate: function() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    })
  },
  methods: {
    signInWithGoogle: function() {
      return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    },
    signOut: function() {
      return auth.signOut();
    },
    sendEmail: function() {
      const callable = functions.httpsCallable('genericEmail');
      return callable({ text: 'Sending email with Vue and SendGrid is fun!', subject: 'Email from Vue'}).then(console.log);
    },
  }
}
</script>
{{< /highlight >}}