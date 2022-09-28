---
title: GitHub Action deploying Angular App to Firebase Hosting
publishdate: 2019-02-19T23:12:09-07:00
lastmod: 2019-12-30T14:25:09-07:00
draft: false
type: lessons
author: Marc Stammerjohann
description: A step-by-step guide to create a GitHub Action to deploy your Angular App to Firebase Hosting.
tags:
  - firebase
  - github
  - angular
  - devops
---

This snippet helps you to setup [GitHub Actions](https://github.com/features/actions) in your **Angular** project to build and deploy your app to **Firebase** on `git push`.

### Step 1. Actions

In your repository click on **Actions**.

{{< figure src="/snippets/img/repo-actions.png" alt="clicking actions tab in GitHub" >}}

### Step 2. New Workflow

To create your first workflow click on **Set up a workflow yourself**

{{< figure src="/snippets/img/set-up-a-workflow.png" alt="Set up a workflow" >}}

Your first GitHub action looks like this:

{{< file "github" "main.yml" >}}
```typescript
name: CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - name: Run a one-line script
      run: echo Hello, world!
    - name: Run a multi-line script
      run: |
        echo Add other actions to build,
        echo test, and deploy your project.
```

### Step 3. Customize job name

The current job name is **build**, keep as it is or give it a new name like **firebase-deploy**

```typescript
jobs:
  firebase-deploy:
```

### Step 4. Customize workflow trigger

Currently, the workflow will be triggered on **push** into any branch. Lets change the trigger rule to only trigger the worklflow on **push** into `master` or `release/*`:

```typescript
on:
  push:
    branches:
    - master
    - release/*
```

### Step 5. Update checkout action

The workflow uses `actions/checkout@v1` which has the latest version `2.0.0`. Lets update it to `actions/checkout@v2` or even `actions/checkout@master`

```typescript
- uses: actions/checkout@master
```

### Step 6. Setup Node.js

Now lets install our dependencies and build the Angular app. We use [Setup Node.js for use with actions](https://github.com/marketplace/actions/setup-node-js-for-use-with-actions) and update our steps to look like this:

```typescript
steps:
- uses: actions/checkout@master
- uses: actions/setup-node@master
  with:
    node-version: '10.x'
- run: npm install
- run: npm run build:prod
```

### Step 7. Deploy to Firebase

Our last step is to deploy the Angular app to Firebase Hosting. [GitHub Action for Firebase](https://github.com/marketplace/actions/github-action-for-firebase) enables us to easily deploy our app to Firebase.

```typescript
steps:
- uses: actions/checkout@master
- uses: actions/setup-node@master
  with:
  node-version: '10.x'
- run: npm install
- run: npm run build:prod
- uses: w9jds/firebase-action@master
  with:
    args: deploy --only hosting
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

Now click on **Start commit** on the right side to commit your new workflow.

### Step 8. Firebase Token

GitHub requires a **FIREBASE_TOKEN** to be able to deploy your Angular app to Firebase.
Generate a token for firebase ci:

- install `npm i -g firebase-tools`
- `firebase login:ci` returns a token to be used in a CI server

{{< file "terminal" "command line" >}}
```text
Waiting for authentication...

✔ Success! Use this token to login on a CI server:

1/A29..............y

Example: firebase deploy --token "\$FIREBASE_TOKEN"
```

Go to `Settings > Secrets`:

{{< figure src="/snippets/img/firebase-token.png" alt="add firebase token to Github" >}}

### Step 9. Final Workflow

Your final workflow should look something like this in the text editor:

{{< file "github" "main.yml" >}}
```typescript
name: CI

on:
  push:
    branches:
    - master
    - release/*

jobs:
  firebase-deploy:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@master
    - uses: actions/setup-node@master
      with:
        node-version: '10.x'
    - run: npm install
    - run: npm run build:prod
    - uses: w9jds/firebase-action@master
      with:
        args: deploy --only hosting
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

Now you can commit your new workflow to your repository. This workflow is added to `.github/workflows/main.yml`. Go ahead and push a change to your Angular project and you can see the progress in the **Actions** tab and your change are deployed directly to Firebase. 

[ng-firebase-github-action](https://github.com/marcjulian/ng-firebase-github-actions) is an example Angular app w/ the `main.yml` deploying the app to Firebase hosting. The app is available on firebase [here](https://ng-firebase-github-actions.firebaseapp.com/).
