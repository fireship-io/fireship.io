---
title: Custom Router
description: Build a custom express-like router
weight: 43
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027117748
emoji: 🚅
video_length: 4:50
---


## Custom Deno Express-like Router

{{< file "ts" "router.ts" >}}
```typescript
import { type Route, route, Handler } from "jsr:@std/http"

export class Router {
    #routes: Route[] = [];

    get(path: string, handler: Handler) {
        this.#addRoute("GET", path, handler);
    }

    post(path: string, handler: Handler) {
        this.#addRoute("POST", path, handler);
    }

    put(path: string, handler: Handler) {
        this.#addRoute("PUT", path, handler);
    }

    delete(path: string, handler: Handler) {
        this.#addRoute("DELETE", path, handler);
    }

    #addRoute(method: string, path: string, handler: Handler) {
        const pattern = new URLPattern({ pathname: path });
        this.#routes.push({
            pattern,
            method,
            handler: async (req, info, params) => {
                try {
                    return await handler(req, info!, params!);
                } catch (error) {
                    console.error("Error handling request:", error);
                    return new Response("Internal Server Error", { status: 500 });
                }
            },
        });
    }

    get handler() {
        return route(this.#routes, () => new Response("Not Found", { status: 404 }))
    }

}
```


## Using the Custom Router

{{< file "ts" "main.ts" >}}
```typescript
import { Router } from "./router.ts";
const app = new Router();

app.get('/', () => new Response('Hi Mom!'))

app.post('/health-check', () => new Response("It's ALIVE!"))

export default {
  fetch(req) {
    return app.handler(req);
  },
} satisfies Deno.ServeDefaultExport;
```
