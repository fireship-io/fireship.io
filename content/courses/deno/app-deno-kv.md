---
title: Deno KV
description: Using Deno's built-in database
weight: 45
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027305799
emoji: 🗄️
video_length: 3:38
---

## Generate a Shortcode

{{< file "ts" "db.ts" >}}
```typescript
const kv = await Deno.openKv();

export type ShortLink = {
    shortCode: string;
    longUrl: string;
    createdAt: number;
    userId: string;
    clickCount: number;
    lastClickEvent?: string;
}

export async function storeShortLink(
    longUrl: string,
    shortCode: string,
    userId: string,
) {
    const shortLinkKey = ["shortlinks", shortCode];
    const data: ShortLink = {
        shortCode,
        longUrl,
        userId,
        createdAt: Date.now(),
        clickCount: 0,
    };

    const res = await kv.set(shortLinkKey, data);

    if (!res.ok) {
        // handle errors
    }

    return res;


}

export async function getShortLink(shortCode: string) {
    const link = await kv.get<ShortLink>(["shortlinks", shortCode]);
    return link.value;
}


// Temporary example to try it out
// deno run -A --unstable-kv src/db.ts 
const longUrl = 'https://fireship.io';
const shortCode = await generateShortCode(longUrl)
const userId = 'test';

console.log(shortCode)


await storeShortLink(longUrl, shortCode, userId);
 
const linkData = await getShortLink(shortCode)
console.log(linkData)
```


## Updated Deno Task

{{< file "deno" "deno.json" >}}
```json
{
  "tasks": {
    "dev": "deno serve --watch -A --unstable-kv src/main.ts",
  }
}
```

## Example usage in JSON API

```typescript
app.post("/links", async (req) => {

  const { longUrl } = await req.json()

  const shortCode = await generateShortCode(longUrl);
  await storeShortLink(longUrl, shortCode, 'testUser');

  return new Response("success!", {
    status: 201,
  });
});


app.get("/links/:id", async (_req, _info, params) => {

  const shortCode = params?.pathname.groups.id;

  const data = await getShortLink(shortCode!)

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: {
      "content-type": "application/json",
    },

  });

})
```
