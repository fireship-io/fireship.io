---
title: API Mutation
description: Add an api endpoint to handle form submission
weight: 41
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822976744
emoji: 🧑‍🚀
video_length: 1:40
---

{{< file "ts" "route.ts" >}}
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from "../auth/[...nextauth]/route"

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;

  const data = await req.json();
  data.age = Number(data.age);

  const user = await prisma.user.update({
    where: {
      email: currentUserEmail,
    },
    data,
  });

  return NextResponse.json(user);
}
```
