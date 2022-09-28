---
title: Intro
description: Build a Progressive Web App
weight: 30
lastmod: 2022-02-22T11:11:30-09:00
draft: false
vimeo: 689134783
emoji: 🕹️
video_length: 2:43
chapter_start: Memento
---


## Links

- [Source Code](https://github.com/fireship-io/react-course/tree/main/memento)
- [Live Demo](https://react-course-46df0.web.app/)

## Create React App

Use the CRA [PWA template](https://create-react-app.dev/docs/making-a-progressive-web-app/) to create a new React app.

{{< file "terminal" "command line" >}}
```bash
npx create-react-app my-app --template cra-template-pwa
```

## Firebase

Create a Firebase project and deploy the app to the cloud.


{{< file "terminal" "command line" >}}
```bash
npm install -g firebase-tools
firebase init --hosting
npm run build
firebase deploy
```