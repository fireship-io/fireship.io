---
title: Protect Routes
description: Redirect unauthenticated routing requests
weight: 23
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822820761
emoji: 🤠
video_length: 1:01
---


```typescript
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
    // return <p>You must be signed in...</p>
  }
```