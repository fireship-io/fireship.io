---
title: Firebase Microservices With Cloud Run
lastmod: 2019-04-09T10:25:02-07:00
publishdate: 2019-04-09T10:25:02-07:00
author: Jeff Delaney
draft: false
description: How to use 
tags: 
    - cloud-run
    - gcp
    - firebase
    - vue

youtube: 
github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Yesterday Google Cloud released a game-changing new product called [Cloud Run](https://cloud.google.com/run/), which allows you to run and scale a Docker container in a serverless execution environment. 

## What is Cloud Run?

Cloud Run is a tool that deploys and runs stateless backend code with any programming language and/or dependencies. You package your service as a Docker image, which is then used by [Knative](https://cloud.google.com/knative/) to provide a fully-managed auto-scaling endpoint.

**Benefits**

- Run backend microservices with any programming language and/or dependencies.
- Serverless pricing, only pay for what you use. 
- Scale automatically.
- Prevent cloud vendor lock-in.

**Some of the things you might do with it...**

- Deploy server-rendered SSR frontend apps to Firebase, like Angular Universal, Nuxt, or Next. 
- Host WordPress, Drupal, Joomla, etc to Firebase Hosting.
- Deploy a restful API with Ruby-on-Rails, Rust, Java, Go - you name it. 
- Create a RESTful or GraphQL API. 


### Stateless Server

The server you deploy ti Cloud Run must be *stateless*, which is a requirement for any code running in a serverless environment. This means you should not save anything other than temporary files on the filesystem and you cannot use a database in the container, ie PostgreSQL, MySQL, etc. 

## Step 0: Prerequisites

1. Install [Docker](https://docs.docker.com/v17.12/install/)
1. Install [Google Clould SDK](https://cloud.google.com/sdk/)
1. Have an existing Firebase/GCP Project

## Step 1: Create a Serverside App (Nuxt)

Create a [new Nuxt app](https://nuxtjs.org/guide/installation) and make sure to choose *Universal* rendering mode when prompted.

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
npx create-nuxt-app my-app

cd my-app
npm run dev
{{< /highlight >}}


## Step 2: Dockerize It

We can containerize the app and tell it to server on the `PORT` environment variable.

### Create a Dockerfile

Create a *Dockerfile* in the root of the project. 

{{< file "docker" "Dockerfile" >}}
{{< highlight docker >}}
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
{{< /highlight >}}

### Build and Push

We can send the container directly to Google Cloud Build, but I generally prefer to run it locally first. 


{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
sudo docker build ./
{{< /highlight >}}

It will take a few minutes to build the image, then give you an `image_id`  that looks like 2cabacd123. Go ahead and run it locally to make sure it runs properly.

{{< highlight terminal >}}
sudo docker run -p 8080:8080 <your-image-id>
{{< /highlight >}}




{{< highlight terminal >}}
sudo docker tag 7e6fdc4b97db gcr.io/fireship-lessons/nuxt-server
sudo docker push gcr.io/fireship-lessons/nuxt-server
{{< /highlight >}}

{{< figure src="img/container-registry.png" caption="You should now see your image in the Container Registry on GCP" >}}

## Step 3: Create a Microservice on Cloud Run

Create your service on Cloud Run and make sure to tick `YES` to allow unauthenticated requests. 

{{< figure src="img/cloud-run-nuxt.png" caption="You should now see your image in the Container Registry on GCP" >}}

And that's basically it, you now have a server-rendered JavaScript app microservice hosted in serverless environment.

{{< figure src="img/cloud-run-deployed.png" caption="Navigate to the URL to view the deployed nuxt app." >}}

## Step 4: Connect it to Firebase Hosting

As a final touch, let's integrate our microserice with Firebase hosting. 

### Initialize Firebase Hosting

Initialize Firebase Hosting, select NO for "single page app", then delete the public folder. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
firebase init hosting
rm public
{{< /highlight >}}

{{< file "firebase" "firebase.json" >}}
{{< highlight javascript >}}
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
{{< /highlight >}}

### Deploy Hosting

Deploy your app to Firebase and you should now see nuxt running with SSR on Firebase Hosting. 

{{< highlight terminal >}}
firebase deploy --only hosting
{{< /highlight >}}

{{< figure src="img/nuxt-firebase-hosting.png" caption="Nuxt on Firebase Hosting" >}}
