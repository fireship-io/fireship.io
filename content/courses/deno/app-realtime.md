---
title: Realtime Streams
description: Listen to the database in realtime
weight: 51
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027526736
emoji: ⚡
video_length: 4:01
---


## Backend Realtime Stream

{{< file "ts" "main.ts" >}}
```typescript
app.get("/realtime/:id", (_req, _info, params) => {
  const shortCode = params?.pathname.groups["id"];
  
  // Setup KV watch reader
  const shortLinkKey = ["shortlinks", shortCode];
  const shortLinkStream = kv.watch([shortLinkKey]).getReader();

  // Create stream response body
  const body = new ReadableStream({
    async start(controller) {
      // Fetch initial data if needed
      // const initialData = await getShortLink(shortCode);
      // controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ clickCount: initialData.clickCount })}\n\n`));

      while (true) {
        const { done } = await stream.read();
        if (done) {
          return;
        }
        const shortLink = await getShortLink(shortCode);
        const clickAnalytics = shortLink.clickCount > 0 &&
          await getClickEvent(shortCode, shortLink.clickCount);

        controller.enqueue(
          new TextEncoder().encode(
            `data: ${
              JSON.stringify({
                clickCount: shortLink.clickCount,
                clickAnalytics,
              })
            }\n\n`,
          ),
        );
        console.log("Stream updated");
      }
    },
    cancel() {
      stream.cancel();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
});
```

## Frontend Realtime Listener

Example of how to listen to a realtime stream from frontend code. This code would typically be placed in a `<script>` tag in your HTML. 

```js
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('realtime script loaded')
    const pathParts = window.location.pathname.split('/');
    const shortCode = pathParts[pathParts.length - 1]; 
    const eventSource = new EventSource('/realtime/' + shortCode);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data)
        document.getElementById('clickCount').innerText = data.clickCount
    };

    eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
    };
});
```

