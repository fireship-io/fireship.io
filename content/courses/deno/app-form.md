---
title: Form Submission
description: Submit HTML forms to the backend
weight: 48
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027526776
emoji: 📃
video_length: 2:36
---


{{< file "ts" "main.ts" >}}
```typescript
app.get("/links/new", (_req) => {
  if (!app.currentUser) return unauthorizedResponse();

  return new Response(render(CreateShortlinkPage()), {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});


app.post("/links", async (req) => {
  if (!app.currentUser) return unauthorizedResponse();

  // Parse form data
  const formData = await req.formData();
  const longUrl = formData.get("longUrl") as string;

  if (!longUrl) {
    return new Response("Missing longUrl", { status: 400 });
  }

  const shortCode = await generateShortCode(longUrl);
  await storeShortLink(longUrl, shortCode, app.currentUser.login);

  // Redirect to the links list page after successful creation
  return new Response(null, {
    status: 303,
    headers: {
      "Location": "/links",
    },
  });

  app.get("/links", async () => {
  if (!app.currentUser) return unauthorizedResponse();

  const shortLinks = await getUserLinks(app.currentUser.login);

  return new Response(render(LinksPage({ shortLinkList: shortLinks })), {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});
```

## Form UI

{{< file "react" "ui.tsx" >}}
```tsx
export function CreateShortlinkPage() {
  return (
    <Layout>
        <h2>Create a New Shortlink</h2>
            <form action="/links" method="POST">
            <div>
                <label>
                <span>Long URL</span>
                </label>
                <input
                    type="url"
                    name="longUrl"
                    required
                    placeholder="https://example.com/your-long-url"
                />
            </div>
            <button type="submit">
                Create Shortlink
            </button>
        </form>
    </Layout>
  );
}
```

