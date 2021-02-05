---
title: Auth Hook
description: Join Firestore data to the current user with a custom react hook
weight: 23
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508645520
emoji: 🎣
video_length: 3:57
---

## Custom User Data Hook

Use this hook to read the current Firebase User, then use the uid to fetch the public profile document from Firestore. 

{{< file "js" "lib/hooks.js" >}}
```javascript
import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
```

## Usage in the App Component

{{< file "js" "pages/_app.js" >}}
```javascript
import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
```