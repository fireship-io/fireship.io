---
title: API Route Fetching
description: Fetch data from an API route
weight: 33
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822820952
emoji: 💽
video_length: 1:02
---

{{< file "react" "route.tsx" >}}
```tsx
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const users = await prisma.user.findMany();
  console.log(users);

  return NextResponse.json(users);
}
```