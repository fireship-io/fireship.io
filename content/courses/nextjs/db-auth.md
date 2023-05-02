---
title: Auth Data Store
description: Store user data in your database
weight: 32
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822820985
emoji: 💽
video_length: 0:56
---

Refer to the [Prisma setup docs](https://authjs.dev/reference/adapter/prisma) to address any issues. 


{{< file "terminal" "command line" >}}
```bash
npm install @prisma/client @next-auth/prisma-adapter
```

{{< file "ts" "route.ts" >}}
```typescript
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {

  adapter: PrismaAdapter(prisma),
    //  ...
}
```