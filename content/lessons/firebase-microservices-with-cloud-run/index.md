---
title: Firebase Microservices With Cloud Run
lastmod: 2019-04-09T10:25:02-07:00
publishdate: 2019-04-09T10:25:02-07:00
author: Jeff Delaney
draft: false
description: How to use Cloud Run on GCP to covert a Docker container into a serverless microservice.
tags: 
    - cloud-run
    - gcp
    - firebase
    - vue

youtube: 3OP-q55hOUI
github: https://github.com/fireship-io/179-cloud-run-ssr
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Yesterday Google Cloud released a game-changing new product called [Cloud Run](https://cloud.google.com/run/) that allows you to run and scale stateless Docker containers in a serverless execution environment powered by [Knative](https://cloud.google.com/knative/).

**Benefits**
 
- Run backend microservices with any programming language and/or dependencies.
- Serverless pricing, only pay for what you use. 
- Scale automatically.
- Prevent cloud vendor lock-in.

**Some of the things you might do with it...**

- Deploy server-rendered SSR frontend apps to Firebase Hosting, like Angular Universal, Nuxt, or Next. 
- Host WordPress, Drupal, Joomla, etc on Firebase Hosting.
- Create a RESTful or GraphQL API. 
- Perform background tasks in any programming language.
- And really anything else you can imagine




#### What is a Stateless Container?

The server you deploy to Cloud Run must be *stateless*, which is a requirement for any code running in a serverless environment. This means you should not save anything other than temporary files on the filesystem and you cannot use a database in the container, ie PostgreSQL, MySQL, etc. All persistent data should be handed off to a different service like Cloud Storage or Firestore. 



## Step 0: Prerequisites

The following steps demonstrate how to deploy a serverside-rendered SSR JavaScript app (Nuxt/Vue) with Cloud Run. 

1. Install [Docker](https://docs.docker.com/v17.12/install/)
1. Install [Google Clould SDK](https://cloud.google.com/sdk/)
1. Have an existing Firebase/GCP Project

## Step 1: Create a Serverside App (Nuxt)

Create a [new Nuxt app](https://nuxtjs.org/guide/installation) and make sure to choose *Universal* rendering mode when prompted.

{{< file "terminal" "command line" >}}
```text
npx create-nuxt-app my-app

cd my-app
npm run dev
```


## Step 2: Dockerize It

We need to containerize the app and tell it to serve on the `PORT` environment variable.

### Create a Dockerfile

Create a *Dockerfile* in the root of the project. 

{{< file "docker" "Dockerfile" >}}
```docker
# base node image
FROM node:10

WORKDIR /usr/src/app

ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm install --only=production

# Copy local nuxt code to the container
COPY . .

# Build production app
RUN npm run build

# Start the service
CMD npm start
```

### Build and Push

We can send the container directly to Google Cloud Build, but I generally prefer to run it locally first. 


{{< file "terminal" "command line" >}}
```text
sudo docker build ./
```

It will take a few minutes to build the image, then give you an `image_id`  that looks like 2cabacd123. Go ahead and run it locally to make sure it works properly.

```text
sudo docker run -p 8080:8080 <your-image-id>
```


Next, upload the image to Google Cloud's [Container Registry](https://cloud.google.com/container-registry/). 


```text
sudo docker tag 7e6fdc4b97db gcr.io/fireship-lessons/nuxt-server
sudo docker push gcr.io/fireship-lessons/nuxt-server
```

{{< figure src="img/container-registry.png" caption="You should now see your image in the Container Registry on GCP" >}}

## Step 3: Create a Microservice on Cloud Run

Create your service on Cloud Run and make sure to tick `YES` to allow unauthenticated requests. 

{{< figure src="img/cloud-run-nuxt.png" caption="Create a service for Nuxt on the Cloud Run dashboard" >}}

And that's basically it, you now have a server-rendered JavaScript app microservice hosted in a serverless environment.

{{< figure src="img/cloud-run-deployed.png" caption="Navigate to the URL to view the deployed Nuxt app." >}}

## Step 4: Connect it to Firebase Hosting

As a final touch, let's integrate our microserice with Firebase hosting. 

### Initialize Firebase Hosting

Initialize Firebase Hosting, select NO for "single page app", then delete the public folder. 

{{< file "terminal" "command line" >}}
```text
firebase init hosting
rm public
```

{{< file "firebase" "firebase.json" >}}
```js
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [ 
      {
        "source": "**",
        "run": {
          "serviceId": "nuxt-server",
          "region": "us-central1" 
        }
      }
    ]
  }
}
```

### Deploy Hosting

Deploy your app to Firebase and you should now see Nuxt running with SSR on Firebase Hosting. 

```text
firebase deploy --only hosting
```

{{< figure src="img/nuxt-firebase-hosting.png" caption="Nuxt on Firebase Hosting" >}}
