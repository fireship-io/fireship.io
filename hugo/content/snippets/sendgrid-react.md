---
title: SendGrid React
lastmod: 2019-07-05T10:43:06-07:00
publishdate: 2019-07-05T10:43:06-07:00
author: Jeff Delaney
draft: false
description: Send transactional email with SendGrid from ReactJS
type: lessons
# pro: true
tags: 
    - react
    - sendgrid

vimeo: 346869300
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

Start by installing the [Firebase Web SDK](https://firebase.google.com/docs/web/setup), then initialize the packages in the root of the project.  

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

The React component uses the `setState` hook to monintor to the user's auth state, while `sendEmail` references the callable function deployed to Firebase.

{{< file "js" "App.js" >}}
{{< highlight jsx >}}
import React, { useState } from 'react';
import './App.css';

import * as firebase from 'firebase/app';
import { auth, functions } from './firebase';

function App() {

  const [user, setUser] = useState(null);

  auth.onAuthStateChanged(setUser);

  return (
    <div className="App">
      <h2>SendGrid Transactional Email with React</h2>
      {user ? signOutUI(user) : signInUI() }
    </div>
  );
}

function signInUI() {
  return (
    <div>
      <button onClick={() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}>SignIn with Google</button>
    </div>
  )
}

function signOutUI(user) {
  return (
    <div>
      
      <p>{ JSON.stringify(user) }</p>

      <hr />

      <button onClick={() => sendEmail()}>Send Email with Callable Function</button>
      <button onClick={() => auth.signOut()}>SignOut</button>
    </div>
  )
}
function sendEmail() {
  const callable = functions.httpsCallable('genericEmail');
  return callable({ text: 'Sending email with React and SendGrid is fun!', subject: 'Email from React'}).then(console.log)
}

export default App;

{{< /highlight >}}
