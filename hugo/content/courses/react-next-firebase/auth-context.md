---
title: Auth Context
description: Manage the global auth state with the React context API
weight: 22
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 
emoji: 🔥
video_length: 11:47
---

## Create Context

{{< file "js" "lib/context.js" >}}
```javascript
import { createContext } from 'react';

export const UserContext = createContext({ user: null, username: null });

```

## Provide Context

{{< file "js" "lib/context.js" >}}
```javascript
import { UserContext } from '../lib/context';

function MyApp({ Component, pageProps }) {
  
  return (
    <UserContext.Provider>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

```

## Consume Context

{{< file "js" "components/Navbar.js" >}}
```javascript
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Top navbar
export default function Navbar() {

  const { user, username } = useContext(UserContext)

}
```

{{< file "js" "pages/enter.js" >}}
```javascript
import { useContext } from 'react';
import { UserContext } from '../lib/context';

export default function Enter(props) {
  const { user, username } = useContext(UserContext)

}
```