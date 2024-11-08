---
title: Deno Crypto
description: Create a cryptographic shortcode
weight: 44
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027305830
emoji: 📏
video_length: 2:57
---


## Generate a Shortcode

{{< file "ts" "db.ts" >}}
```typescript

import { encodeBase64Url, encodeHex } from "jsr:@std/encoding";
import { crypto } from "jsr:@std/crypto/crypto";

export async function generateShortCode(longUrl: string) {

    try {
        new URL(longUrl);
    } catch (error) {
        console.log(error);
        throw new Error("Invalid URL provided");
    }

    // Generate a unique identifier for the URL
    const urlData = new TextEncoder().encode(longUrl + Date.now());
    const hash = await crypto.subtle.digest("SHA-256", urlData);
    const hashArray = new Uint8Array(hash);
    const hashHex = encodeHex(hashArray);

    // Take the first 8 characters of the hash for the short URL
    const shortCode = encodeBase64Url(hashHex.slice(0, 8));

    return shortCode;
}
```


## Optional: Testing the ShortCode Function

{{< file "ts" "db.ts" >}}
```typescript
import { assertEquals, assertNotEquals, assertRejects } from "@std/assert";
import { delay } from "jsr:@std/async/delay";
import { generateShortCode } from "../src/db.ts";

Deno.test("URL Shortener ", async (t) => {
  await t.step("should generate a short code for a valid URL", async () => {
    const longUrl = "https://www.example.com/some/long/path";
    const shortCode = await generateShortCode(longUrl);
    
    assertEquals(typeof shortCode, "string");
    assertEquals(shortCode.length, 11);
  });

  await t.step("should be unique for each timestamp", async () => {
    const longUrl = "https://www.example.com";
    const a = await generateShortCode(longUrl);
    await delay(5)
    const b = await generateShortCode(longUrl);
    
    assertNotEquals(a, b)
  });

  await t.step("throw error on bad URL", () => {
    const longUrl = "this aint no url";
 
    assertRejects(async () => {
     await generateShortCode(longUrl);
    })
  });
});
```

## Bonus Video 

<div class="vid-center">
{{< youtube NuyzuNBFWxQ >}}
</div>