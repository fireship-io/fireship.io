---
title: Web Deployment
description: Deploy the React app to Netlify hosting
weight: 53
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773631487
emoji: 🌌
video_length: 0:46
---

Netlify: https://app.netlify.com/

Your public/netlify.toml file:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
