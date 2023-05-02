---
title: SignIn Buttons
description: Create buttons for SignIn and SignOut
weight: 22
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822820665
emoji: 🤠
video_length: 2:10
---

{{< file "react" "buttons.tsx" >}}
```tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export function SignInButton() {
  const { data: session, status } = useSession();
  console.log(session, status);

  if (status === 'loading') {
    return <>...</>;
  }

  if (status === 'authenticated') {
    return (
      <Link href={`/dashboard`}>
        <Image
          src={session.user?.image ?? '/mememan.webp'}
          width={32}
          height={32}
          alt="Your Name"
        />
      </Link>
    );
  }

  return <button onClick={() => signIn()}>Sign in</button>;
}

export function SignOutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}

```