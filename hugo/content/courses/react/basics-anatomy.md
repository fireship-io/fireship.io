---
title: Anatomy
description: What are all the files in a React project?
weight: 3
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 681073739
emoji: 💀
video_length: 2:51
---

## React Build Tools

There are many ways to build a react app. The most common options include:

- [Create React App](https://create-react-app.dev/)
- [Vite](https://vitejs.dev/)
- [Next.js](https://nextjs.org/)
- [Gatsby](https://www.gatsbyjs.org/)

## React Files

Get familiar with the files in your React project.

- `package.json` - The main file that defines the dependencies and other settings for your project.
- `node_modules` - Source code for depencies. Do not touch.
- `public` - The directory where your static files are stored.
- `src/index.js` - Main entrypoint to bootstrap the app. 
- `src/App.js` - The root component of the app.
- `src/App.spec.js` - Unit tests for the app. 
- `src/*.css` - Styles for the app.

## Challenge

Generate a new project with `npx create-react-app my-app`. 