---
title: Firebase Deployment
description: Deploy the app to Firebase hosting
weight: 62
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 
emoji: 🚀
video_length: 0:00
---

## Deploy as Static Site

Note: This method works for static sites that use `getStaticProps` ONLY. Deployment with full SSR requires cloud functions or some other form of a backend server. 

{{< file "terminal" "command line" >}}
```bash
firebase init hosting # select /out as your hosting directory

next build
next export

firebase deploy --only hosting
```


## Deployment with SSR

See the [custom server](https://nextjs.org/docs/advanced-features/custom-server) docs for a general idea of the process. 