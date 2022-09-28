---
title: Continuous Integration and Deployment with Google Cloud Build
lastmod: 2019-01-17T04:17:11-07:00
publishdate: 2019-01-17T04:17:11-07:00
author: Jeff Delaney
draft: false
description: Learn how to automate the testing and deployment of an app with Google Cloud Build
tags: 
    - cloud-build
    - devops
    - docker

youtube: Zd014DjonqE
github: https://github.com/fireship-io/147-cloud-build-firebase
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions:
   firebase-tools: 6.3
---

Continuous Integration and Delivery, aka CI/CD, aka [DevOps](https://www.atlassian.com/devops) is the process of automating build, test, and deploy tasks between code changes to your software. The practice can yield a wide range of benefits, but most importantly it keeps your development code looking nearly identical to your production code. The adoption of devops has been a macrotrend in tech for the last few years and presents opportunites for both large teams and independent entrepreneurs.

In the following lesson, you will learn how to use [Google Cloud Build](https://cloud.google.com/cloud-build) to automate the following tasks by simply committing your code to Github:

- Run unit tests
- Build the production code
- Deploy to Firebase Hosting

## Step 0: Prerequisites

2. Install [firebase-tools](https://github.com/firebase/firebase-tools) CLI. 
3. Install [gcloud](https://cloud.google.com/sdk/gcloud/) CLI. 
4. Be able to create a frontend of your choice like Angular, Vue, or React. 
5. Billing must be enabled on Google Cloud, but the service is free for 120 minutes of build time per day (that's a lot). 


## Step 1: Build an App

You can follow along with this lesson using your existing Firebase project or by starting from scratch. The frontend code does not really matter - it just needs to be an NPM project that we can build and test. Below are some popular options to quikly create a frontend JS app from the command line. 


{{< file "terminal" "command line" >}}
```bash
# pick your poison ☠️
ng new my-app
vue create my-app
npx create-react-app my-app

cd my-app

firebase init
# select hosting
```


All of these frameworks ship with basic automated specs and build commands. This is what we want to automate with Cloud Build.

{{< file "terminal" "command line" >}}
```text
npm run test
npm run build
firebase deploy
```

## Step 2: Create a Remote Git Repo

At this point, we need to connect your code to a remote git repo. This lesson will be using Github, but Cloud Build also integrates with GCP Source Repositories and BitBucket. 

Create a [Github repo](https://help.github.com/articles/create-a-repo/) (can be public or private), then commit your initial code to it.

```text
git add .
git commit -m "initial commit"

git remote add origin git@github.com:<your-repo>.git
git push -u origin master
```

## Step 3: Grant Cloud Build IAM Permissions

Activate the Cloud Build API on GCP. 

Next, give Cloud Build access to your Firebase project. Go to the IAM menu and find the service account for **@cloudbuild.gserviceaccount.com**. Go ahead to grant permission to **KMS Cryptokey Decrypter** and **Firebase Admin**  and the **API Keys Admin**. 

{{< figure src="img/iam-cloud-build.png" alt="grant permission to cloud build via IAM on google cloud" >}}

## Step 4: Build Steps

Now it's time for the fun part, writing out the build steps in the   *cloudbuild.yaml* file, but first we need a Docker container with `firebase-tools` installed. 

### Upload the Firebase Builder

Firebase is not available in of the default NPM image on GCP, but we can use a [community builder](https://github.com/GoogleCloudPlatform/cloud-builders-community). You can add it to your GCP project with the following steps:

{{< file "terminal" "command line" >}}
```bash
git clone https://github.com/GoogleCloudPlatform/cloud-builders-community
cd cloud-builders-community/firebase

gcloud builds submit --config cloudbuild.yaml .

# wait for it to finish, then cleanup...

cd ../..
rm -rf cloud-builders-community
```

Now we should see the image in the container registry. 

{{< figure src="img/container-firebase.png" alt="firebase container in the register GCP" >}}


### Define the Build Steps

Create a file named `cloudbuild.yaml` in the root of the project. It will tell Cloud Build the steps required to build and test your code. 

The build takes place in four steps. Notice how the `name` field points to a container with a cooresponding command, i.e *npm* or *firebase*. Keep in mind, there are many [additional options](https://cloud.google.com/cloud-build/docs/configuring-builds/create-basic-configuration) you can pass to these steps. 

- Install NPM dependencies
- Run unit tests
- Run production build
- Deploy

{{< file "yaml" "cloudbuild.yaml" >}}
```yaml
steps:
# Install
- name: 'gcr.io/cloud-builders/npm'
  args: ['install']
# Test
- name: 'gcr.io/cloud-builders/npm'
  args: ['run', 'test:unit']
# Build
- name: 'gcr.io/cloud-builders/npm'
  args: ['run', 'build']
# Deploy
- name: 'gcr.io/$PROJECT_ID/firebase'
  args: ['deploy']
```

### Add the Build Trigger

Almost done! We just need to connect our Github repo to Cloud Build by registering the build trigger. Make sure to point the trigger the cloudbuild.yaml. 

{{< figure src="img/cloudbuild-trigger.png" alt="github cloud build trigger" >}}

### Trigger it

Now for the moment of truth...

```text
git add .
git commit -m "feat: added CI/CD pipeline"
git push origin master
```


{{< figure src="img/cloud-build-fail.png" alt="cloud build results" >}}


Hopefully your build succeeds, but errors are very common when setting up CI/CD for the first time. All of the logs can be found be directly in build details page, so review the last entries to see what failed. 

## Advanced: Secure your Environment Secrets


The env encryption steps are optional for Firebase because you can grant access via IAM. However, this is still a good pattern to follow if you need to authorize other 3rd party APIs. For example, you might want to update your Algolia Search index before deployment, which would require a sensitive API key. 


There are several ways to manage environment variables for your CI builds, but I find the method outlined below to be the most flexible and it can easily scale to a large number of secret tokens. 


### Obtain the Firebase CI Auth Token

The command below will create an auth token that can authenticate a server into Firebase.

```text
firebase login:ci
```

Let's add a custom NPM script for deployment using this token as an environment variable. 

{{< file "npm" "package.json" >}}
```json
{
  "scripts": {
      // ...
    "deploy": "firebase deploy --debug --token \"$FIREBASE_TOKEN\"",
  }
}
```


### Create an .env file
 

Do not share the contents of the `.env` file publicly and do not commit it to your public source code. It could be used to take destructive action on your project. 


Create a file named `.env` in the root of your project. It will used to manage the secret tokens (or API keys) required to build/deploy your code. Currently this is only Firebase, but it is likely you will use other APIs and will organize complexity down the road. 

Lastly, let's make sure to add this file to the `.gitignore`


{{< file "git" ".gitignore" >}}
```text
.env
```

Now copy and paste the token from the previous step to the environment.

{{< file "file" ".env" >}}
```text
FIREBASE_TOKEN=<your-token>
```

### Create a Keyring

We now have a secret token, so how do we transfer it to the server via a public git repo? We encrypt it. 

Go the GCP console and find **IAM >> Cryptographic Keys**. First, create a keyring for your app - it can be used to encrypt multiple keys via a single container. 

{{< figure src="img/kms-keyring.png" alt="create a keyring on GCP" >}}

Next, create a key for your secrets - let's give it a name of **cloudbuild-env**. 

{{< figure src="img/kms-key.png" alt="create the crypto key" >}}


### Encrypt

Run the command below to encrypt the environment secrets into a single file named `env.enc` - this file is safe to commit to the repo and can only be read by services with access to the keyring. 

{{< file "terminal" "command line" >}}
```text
gcloud kms encrypt \
  --plaintext-file=.env \
  --ciphertext-file=.env.enc \
  --location=global \
  --keyring=YOUR_KEYRING_NAME \
  --key=cloudbuild-env
```

### Decrypt Env Secrets

The first step is important. It unwraps our environment variables and makes them available in the build container, allowing them to work with NPM scripts. Without this step, the server would not have authorization to interact with our 3rd party APIs. Also, make sure firebase-tools is installed in your dev dependencies `npm i -D firebase-tools`. 

{{< file "yaml" "cloudbuild.yaml" >}}
```yaml
steps:
- name: gcr.io/cloud-builders/gcloud
  args:
  - kms
  - decrypt
  - --ciphertext-file=.env.enc
  - --plaintext-file=.env
  - --location=global
  - --keyring=myproject
  - --key=cloudbuild-env
# Insert other build steps here
# Deploy
- name: 'gcr.io/cloud-builders/npm'
  args: ['run', 'deploy']
```


## Additional Pro Tips

### Run a Build without a Git Trigger

Sometimes you just want to build without making a git commit. You can do this at any time from the command line: 

```text
gcloud builds submit . --config=cloudbuild.yaml
```


### Conditionally Filter Steps in Cloud Build

It most cases, you only want to deploy your code when changes are merged into the master branch. However, you may still want to run the other CI steps to ensure all tests pass when a pull request is submitted. If you followed the advanced settings above, you can add a conditional bash statement that looks at the `$BRANCH_NAME` env variable. 

{{< file "npm" "package.json" >}}
```json
{
  "scripts": {
    "deploy": "...",
    "deploy:ci": "if test \"$BRANCH_NAME\" = \"master\"; then npm run deploy; fi"
  }
}
```

If we use the `deploy:ci` command in our *cloudbuild.yaml* it will only deploy when the master branch changes. 

### Using a Custom Docker Container Builder

This very site, fireship.io, uses Google Cloud Build for CI/CD, but it cannot use the default Node or Go builders because they don't contain the right mix of dependencies. Fortunately, we can create our own custom builder that serves as the cloud environment for building and testing our code. 

{{< file "docker" "Dockerfile" >}}
```docker
FROM node:8

RUN npm i -g firebase-tools

ADD your-weird-dependencies-here

```

You can then deploy this image to the GCP container registry and use it in your build steps. 

## The End

There are many great CI/CD providers out there like Travis, CircleCI, etc, but Cloud Build is especially nice for Firebase apps because it's a GCP service with generous pricing. It comes with 120 free build minutes per day (that's a lot) then becomes pay-as-you-go if you manage to exceed that cap. By comparison, standalone services usually have a small free tier, then jump to $50+ per month. While it can be tedious and frustrating to configure initially, a solid CI/CD pipeline can be a huge productivity-booster in the long run. 

