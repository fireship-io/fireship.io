---
title: Github Action deploying Angular App to Firebase Hosting
publishdate: 2019-02-19T23:12:09-07:00
lastmod: 2019-02-20T00:04:09-07:00
draft: false
author: Marc Stammerjohann
description: A step-by-step guide to create a Github Action to deploy your Angular App to Firebase Hosting.
tags:
    - firebase
    - github
    - ci/cd
---

This snippet helps you to setup [Github Actions](https://github.com/features/actions) in your **Angular** project to build and deploy your app to **Firebase** on `git push`.

{{% box icon="github" class="box-orange" %}}
### Github Action in Beta
Github Action is still in Beta and requires you to sign up and is limited to private repositories.
{{% /box %}}

### Step 1. Actions

In your repository click **Actions**.

{{< figure src="/img/snippets/repo-actions.png" alt="clicking actions tab in github" >}}

### Step 2. New Workflow

To create your first workflow click on **Create a new workflow**

{{< figure src="/img/snippets/create-your-first-workflow.png" alt="Create your first workflow" >}}

### Step 3. Change workflow name

Click on **Edit** to change your workflow name and change it to e.g. **Build and deploy on push**.

{{< figure src="/img/snippets/main-workflow.png" alt="main workflow" >}}

### Step 4. npm install

Now lets create your first action to run **npm install**. Pull down the blue connector.

{{< figure src="/img/snippets/first-action.png" alt="first action" >}}

On the right side a selection windows appears to select an action available on Github. Click on **Use** for **Github Action for npm**.

{{< figure src="/img/snippets/choose-action.png" alt="choose action" >}}

Now you can set the label to **Install** and add `install` in the **args** input field. Don't forget to click **Done**.

{{< figure src="/img/snippets/npm-install.png" alt="npm install" >}}

Your main workflow should look like this.

{{< figure src="/img/snippets/main-workflow-with-install-action.png" alt="main workflow with install action" >}}

### Step 5. ng build

Drag the blue connector again down to create the **Build** action. Use **Github Action for npm** again with the label **Build** and add to **args** `run build:prod`. This executes `npm run build:prod`, hence you need to add this script to your package.json: `"build:prod": "ng build --prod"`.

{{< figure src="/img/snippets/main-workflow-with-build-action.png" alt="main workflow with install and build action" >}}

### Step 6. Deploy to Firebase

Now to our last action, **Deploy to Firebase**. Pull the blue connector and search for **firebase**.

{{< figure src="/img/snippets/search-firebase-action.png" alt="search for firebase action" >}}

Update the label to **Deploy to Firebase** and deploy command `deploy --only hosting` to **args**. 

Github requires a **FIREBASE_TOKEN** to be able to deploy your Angular app to Firebase.
Generate a token for firebase ci:

* install `npm i -g firebase-tools`
* `firebase login:ci` returns a token to be used in a CI server 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
Waiting for authentication...

✔  Success! Use this token to login on a CI server:

1/A29..............y

Example: firebase deploy --token "$FIREBASE_TOKEN"
{{< /highlight >}}

Click in Github in the Firebase Action on **Create a new secret** and enter **FIREBASE_TOKEN** as **SECRET_KEY** and your firebase token as **Secret value**.

Add this firebase token as secret to github actions.

{{< figure src="/img/snippets/firebase-token.png" alt="add firebase token to github action" >}}

### Step 7. Final Workflow

Your final workflow should look something like this in the text editor:

{{< file "github" "main.workflow" >}}
{{< highlight typescript >}}
workflow "Build and deploy on push" {
  on = "push"
  resolves = ["Deploy to Firebase"]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install"]
  args = "[\"run\", \"build:prod\"]"
}

action "Deploy to Firebase" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["GitHub Action for npm"]
  args = "deploy --only hosting"
  secrets = ["FIREBASE_TOKEN"]
}
{{< /highlight >}}

Now you can commit your new workflow to your repository. This workflow is added to `.github/main.workflow`. Go ahead and push a change to your Angular project and you can see the progress in the **Actions** tab and your change are deployed directly to Firebase. 

The workflow takes around ~3-4 minutes to complete.
