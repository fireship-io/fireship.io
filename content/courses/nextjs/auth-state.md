---
title: Check Auth State
description: Get the current user server and client-side
weight: 21
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822820728
emoji: 🤠
video_length: 2:04
---

## Add the Session Provider

{{< file "react" "AuthProvider.tsx" >}}
```tsx
'use client';

import { SessionProvider } from 'next-auth/react';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Use it in the root layout

{{< file "react" "App.tsx" >}}
```tsx
export default function RootLayout({ children }: Props) {
  return (
    <AuthProvider>
        ...
    </AuthProvider>
  )
```

## Serverside


```typescript
import { getServerSession } from 'next-auth';


  const session = await getServerSession();

  if (!session) {
    // redirect or render something else
  }
```


## Clientside


```tsx
"use client";

import { useSession } from "next-auth/react"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    console.log(session, status)

    if (status === 'authenticated') {
        return <>{children}</>
    } else {
        return <>Not logged in to see this</>
    }
}
```

