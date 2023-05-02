---
title: API Routes
description: Create a basic API endpoint
weight: 13
lastmod: 2023-04-26T11:11:30-09:00
draft: false
vimeo: 822821188
emoji: 🌠
video_length: 2:40
---

{{< file "ts" "route.ts" >}}
```typescript
import { NextResponse } from 'next/server';

// Dummy data
const posts = [
  {
    title: 'Lorem Ipsum',
    slug: 'lorem-ipsum',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
  },
];

export async function GET() {
  return NextResponse.json(posts);
}

```