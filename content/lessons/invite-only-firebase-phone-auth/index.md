---
title: Invite-Only Firebase Phone Auth
lastmod: 2021-02-24T15:42:55-07:00
publishdate: 2021-02-24T15:42:55-07:00
author: Jeff Delaney
draft: false
description: Harness the power of FOMO by building an invite-only phone authentication system with Firebase & React. 
tags: 
    - react
    - firebase
    - authentication

youtube: yJ5agkia4o8
github: https://github.com/fireship-io/invite-only-phone-auth
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The meteoric rise of [Clubhouse](https://apps.apple.com/us/app/clubhouse-drop-in-audio-chat/id1503133294) from a mostly unknown app to 10M weekly users demonstrates the power of #FOMO - fear of missing out. No, you can't just download the app and start having fun. It uses an invite-only authentication system that requires a current user to invite you to the club with your phone number. Once you're in, you're granted two invites to send to your friends, creating a pyramid of organic user growth. 

The following lesson implements [Firebase Phone Auth](https://firebase.google.com/docs/auth/web/phone-auth) in React, but with a custom twist. Before a user can sign up, they must have an invite document in Firestore that matches their phone number. A user can also send invites via SMS text using the Messaging API from [Plivo](https://www.plivo.com/). 

## Initial Setup

The project starts with a basic React app using Firebase and [react-firebase-hooks](https://www.npmjs.com/package/react-firebase-hooks). 

{{< file "terminal" "command line" >}}
```bash
npx create-react-app fomo
cd fomo

npm i firebase react-firebase-hooks
```

Initialize Firebase in React, add the following imports, and listen to the auth state of the user at the top level. 

{{< file "js" "App.js" >}}
```javascript
import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
    // your config
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <SendInvites user={user} /> : <SignUp />}
    </div>
  );
}

function SignUp() {}

function PhoneNumberVerification() {}

function SendInvites() {}

export default App;
```

### Enable Phone Auth

Enable phone auth from the Firebase Auth console.

{{< figure src="img/enable-phone-auth.png" caption="Enable phone auth from the Firebase Auth console" >}}

### Data Model

This feature contains in `invites` collection where each document ID contains the phone number of an invited user in E164 format. Each document has a `sender` field with the corresponding user ID. 

{{< figure src="img/invite-data-model.png" caption="Firestore invites collection" >}}


## Phone Auth

Firebase supports phone authentication out of the box, but we're adding a customization (step 2) to validate the number was invited before allowing the sign in to happen. 

### 1. Verify a reCaptcha 

The user must first verify a [reCaptcha](https://developers.google.com/recaptcha/docs/versions) before using Phone Auth. 

{{< file "react" "App.js" >}}
```jsx
function SignUp() {
  const [recaptcha, setRecaptcha] = useState(null);
  const element = useRef(null);

  useEffect(() => {
    if (!recaptcha) {

      const verifier = new firebase.auth.RecaptchaVerifier(element.current, {
        size: 'invisible',
      })

      verifier.verify().then(() => setRecaptcha(verifier));

    }
  });

  return (
    <>
      {recaptcha && <PhoneNumberVerification recaptcha={recaptcha} />}
      <div ref={element}></div>
    </>
  );
}
```


### 2. Validate Phone Number was Invited

We can verify a phone number has been invited by checking its existence in the Firestore database. If it does not exist, the user has not been invited and will not be shown the sign in button.  

{{< file "react" "App.js" >}}
```jsx
function PhoneNumberVerification({ recaptcha }) {
  const [digits, setDigits] = useState('');
  const [invited, setInvited] = useState(false);

  const phoneNumber = `+1${digits}`;

  // Step 1 - Verify Invite
  useEffect(() => {
    if (phoneNumber.length === 12) {
      const ref = firestore.collection('invites').doc(phoneNumber);
      ref.get().then(({ exists }) => { setInvited(exists) });
    } else {
      setInvited(false);
    }
  }, [phoneNumber]);

  return (
    <div>
      <h1>Sign Up!</h1>
      <fieldset>
        <label>10 digit US phone number</label>
        <br />
        <input value={digits} onChange={(e) => setDigits(e.target.value)} />

        {invited ? 
          <p className="success">You are one of the cool kids! 👋</p> : 
          <p className="danger">This phone number is not cool 😞</p>
        } 

      </fieldset>

    </div>
  );
}
```

### 3. Sign In and Verify Code

If a user has been invited, they can complete the sign in process. Clicking the *Sign In* button will return a confirmation from Firebase that an SMS text has been sent to the user. The code is then confirmed by having the user enter it into a second form input. 

```jsx
function PhoneNumberVerification({ recaptcha }) {
  // ...
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState('');

  const phoneNumber = `+1${digits}`;

  // ...

  // Step 2 - Sign in
  const signInWithPhoneNumber = async () => {
    setConfirmationResult( await auth.signInWithPhoneNumber(phoneNumber, recaptcha) );
  };

  // Step 3 - Verify SMS code
  const verifyCode = async () => {
    const result = await confirmationResult.confirm(code);
    console.log(result.user);
  };

  return (
    <div>
      <h1>Sign Up!</h1>
      <fieldset>
        <label>10 digit US phone number</label>
        <br />
        <input value={digits} onChange={(e) => setDigits(e.target.value)} />

        <button className={!invited ? 'hide' : ''} onClick={signInWithPhoneNumber}>
          Sign In
        </button>

        {invited ? 
          <p className="success">You are one of the cool kids! 👋</p> : 
          <p className="danger">This phone number is not cool 😞</p>
        }  

      </fieldset>

      {confirmationResult && (
        <fieldset>
          <label>Verify code</label>
          <br />
          <input value={code} onChange={(e) => setCode(e.target.value)} />

          <button onClick={verifyCode}>Verify Code</button>
        </fieldset>
      )}
    </div>
  );
}
```

Firebase will send a code to the user that looks like this:

{{< figure src="img/text-firebase.png" caption="Phone auth verification text from Firebase" >}}

After submitting the code the user will be fully authenticated in the app. 

## Send Invites

Now that the user is authenticated, let's give them a way to send invites to other phone numbers. 

### Create Invites in Firestore

The component below queries all invites sent by that user to ensure that no more than 2 can be sent. The user can then enter an invitee's number into a form and write it Firestore.

{{< file "react" "App.js" >}}
```jsx
function SendInvites({ user }) {
  const query = firestore.collection('invites').where('sender', '==', user.uid);
  const [invites] = useCollectionData(query);

  const [digits, setDigits] = useState('');
  const phoneNumber = `+1${digits}`;

  const sendInvite = async () => {
    const inviteRef = firestore.collection('invites').doc(phoneNumber);
    await inviteRef.set({
      phoneNumber,
      sender: user.uid,
    });
  };

  return (
    <div>
      <h1>Invite your BFFs</h1>
      {invites?.map((data) => (
        <p>You invited {data?.phoneNumber}</p>
      ))}

      {invites?.length < 2 && (
        <>
          <input value={digits} onChange={(e) => setDigits(e.target.value)} />
          <button onClick={sendInvite}>Send Invite</button>
        </>
      )}

      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}
```

### Sign Up for Plivo

Firebase does not have an SMS messaging API, so we need a 3rd party service. There are many options - like Twilio and MessageBird - but [Plivo](https://www.plivo.com/docs/sms/quickstart/node#install-plivo-nodejs-package) stands out as an exceptional choice to me and it provides a free sandbox credit.

Create an account and make a note of your (1) phone number and (2) auth ID and token, which can be found on the dashboard

{{< figure src="img/plivo-dashboard.png" caption="Plivo dashboard" >}}

### SMS Text Cloud Function

Initialize Cloud Functions and install Plivo. 

{{< file "terminal" "command line" >}}
```bash
firebase init --only functions
cd functions

npm i plivo
```

Create a function the listens to the creation of an invite document. When the document is created it will take the invited phone number and send an invite notification via SMS text. 

{{< file "js" "functions/index.js" >}}
```javascript
const functions = require('firebase-functions');
const plivo = require('plivo');
const client = new plivo.Client('YOUR_ID', 'YOUR_TOKEN');

exports.sendInvite = functions.firestore.document('invites/{phoneNumber}').onCreate(async (doc) => {
  const from = 'YOUR_PLIVO_NUMBER';
  const to = doc.data().phoneNumber;

  const text = 'You are one one of the cool kids now! 👋👋👋';

  return client.messages.create(from, to, text);
});
```

{{< figure src="img/text-plivo.png" caption="Invite text message from Plivo" >}}

