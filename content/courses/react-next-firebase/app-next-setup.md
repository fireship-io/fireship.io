---
title: Next.js Setup
description: Setup a Next.js app and explore the file system
weight: 11
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508599862
emoji: 💻
video_length: 5:41
---

## Create a Next.js App

{{< file "terminal" "command line" >}}
```bash
npx create-next-app nextfire
```

## File Structure

- `components` reusable UI components
- `lib` reusable JavaScript libraries and/or helper functions
- `pages` main routes for site

## Global CSS
https://raw.githubusercontent.com/fireship-io/next-firebase-course/main/styles/globals.css


## Update May 2023
Note - this guide was written for the Page Router
The current version of Next [13 / May 2023] recommends and selects using the App Router by default in new projects
To follow along with this course make sure you choose not to use the 'App' router and use the Page Router instead

If you don't choose the Page Router you will may errors during build time about conflicts between similarly named files in /app/ and /pages/ and some files like globals.css may not be where you expect them [now in app/globals.css NOT /styles/globals.css ]. 
