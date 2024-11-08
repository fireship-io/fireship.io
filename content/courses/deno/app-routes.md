---
title: Deno HTTP
description: Deno's powerful HTTP primitives  
weight: 42
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027117767
emoji: 🚡
video_length: 3:18
---


{{< file "ts" "main.ts" >}}
```typescript
import { type Route, route, serveDir } from "@std/http";

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/" }),
    handler: () => new Response("Home page"),
  },
  {
    pattern: new URLPattern({ pathname: "/users/:id" }),
    handler: (_req, _info, params) => new Response(params?.pathname.groups.id),
  },
  {
    pattern: new URLPattern({ pathname: "/static/*" }),
    handler: (req) => serveDir(req),
  },
];

function defaultHandler(_req: Request) {
  return new Response("Not found", { status: 404 });
}

const handler = route(routes, defaultHandler);

export default {
  fetch(req) {
    return handler(req);
  },
} satisfies Deno.ServeDefaultExport;
```

### Bonus Video

<div class="vid-center">
{{< youtube -MTSQjw5DrM >}}
</div>