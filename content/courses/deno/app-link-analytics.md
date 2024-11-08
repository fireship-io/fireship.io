---
title: Link Analytics
description: Keep track of shortlink clicks
weight: 50
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027526752
emoji: 📈
video_length: 3:19
---


## Handle Shortlink Redirects

{{< file "ts" "main.ts" >}}
```typescript
app.get("/:id", async (req, _info, params) => {
  const shortCode = params.pathname.groups["id"];
  const shortLink = await getShortLink(shortCode);

  if (shortLink) {
    // Capture analytics data
    const ipAddress = req.headers.get("x-forwarded-for") ||
      req.headers.get("cf-connecting-ip") || "Unknown";
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const country = req.headers.get("cf-ipcountry") || "Unknown";

    // Increment click count and store analytics data
    await incrementClickCount(shortCode, {
      ipAddress,
      userAgent,
      country,
    });

    // Redirect to the long URL
    return new Response(null, {
      status: 303,
      headers: {
        "Location": shortLink.longUrl,
      },
    });
  } else {
    // Render 404 page
    return new Response(render(NotFoundPage({ shortCode })), {
      status: 404,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
});
```

## Write Analytics Data to Database

{{< file "ts" "main.ts" >}}
```typescript
```


## Display ShortLink Details Page

{{< file "ts" "main.ts" >}}
```typescript
app.get("/links/:id", async (_req, _info, params) => {
  const shortCode = params?.pathname.groups["id"];
  const shortLink = await getShortLink(shortCode!);

  return new Response(render(ShortlinkViewPage({ shortLink })), {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});

```