---
title: Google SignIn
description: Sign in via OAuth with Google SignIn
weight: 21
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 
emoji: 🔥
video_length: 11:47
---

{{< file "js" "lib/firebase.js" >}}
```javascript
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
```

{{< file "js" "posts/enter.js" >}}
```javascript
import { auth, googleAuthProvider } from '../lib/firebase';

export default function Enter(props) {
  const user = null;
  const username = null;

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {user ? 
        !username ? <UsernameForm /> : <SignOutButton /> 
        : 
        <SignInButton />
      }
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  return null;
}

```