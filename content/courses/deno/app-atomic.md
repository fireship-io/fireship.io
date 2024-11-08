---
title: Atomic Writes
description: ACID compliant transactions
weight: 49
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027526766
emoji: 💥
video_length: 3:25
---



## Query Records by Username


{{< file "ts" "main.ts" >}}
```typescript
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

  const userKey = [userId, shortCode];
  
  const res = await kv.atomic()
    .set(shortLinkKey, data)
    .set(userKey, shortCode)
    .commit()


  return res;
}

export async function getUserLinks(userId: string) {

  const list = kv.list<string>({ prefix: [userId]});
  const res = await Array.fromAsync(list);
  const userShortLinkKeys = res.map((v) => ['shortlinks', v.value]);

  const userRes = await kv.getMany<ShortLink[]>(userShortLinkKeys)
  const userShortLinks = await Array.fromAsync(userRes)

  return userShortLinks.map(v => v.value);
}
```

## Increment a Count

{{< file "ts" "main.ts" >}}
```typescript
export async function incrementClickCount(
  shortCode: string,
  data?: Partial<ClickAnalytics>,
) {
  const shortLinkKey = ["shortlinks", shortCode];
  const shortLink = await kv.get(shortLinkKey);
  const shortLinkData = shortLink.value as ShortLink;

  const newClickCount = shortLinkData?.clickCount + 1;

  const analyicsKey = ["analytics", shortCode, newClickCount];
  const analyticsData = {
    shortCode,
    createdAt: Date.now(),
    ...data,
    // ipAddress: "192.168.1.1",
    // userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    // country: "United States"
  };

  const res = await kv.atomic()
    .check(shortLink)
    .set(shortLinkKey, {
      ...shortLinkData,
      clickCount: shortLinkData?.clickCount + 1,
    })
    .set(analyicsKey, analyticsData)
    .commit();
  if (res.ok) {
    console.log("Logged click");
  } else {
    console.error("Not logged");
  }

  return res;
}
```