---
title: Getting Started
description: Basic Firebase security concepts and project setup instructions
weight: 3
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486807090
emoji: 👶
video_length: 5:09
---

## Important Links

- [Project Source Code](https://github.com/fireship-io/firebase-security-course)
- [Security Rules Docs](https://firebase.google.com/docs/firestore/security/overview)
- [Firestore Data Modeling Course](/courses/firestore-data-modeling)

## 1. Create a Firebase Project

Create a [Firebase](https://firebase.google.com/) project or use an existing one. 

## 2. Create a Frontend Project

Create a frontend project or use an existing one. As a bare minimum requirement, simply initialize an NPM project using the command below. 

{{< file "terminal" "command line" >}}
```bash
npm init -y

# OR 

npx create-react-app myapp
```

# 3. Connect your Local Code to Firebase

{{< file "terminal" "command line" >}}
```bash
npm -g firebase-tools

firebase-login

firebase init 
# choose firestore, functions, storage, and emulators
```




