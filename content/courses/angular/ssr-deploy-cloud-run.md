---
title: Angular Universal on Google Cloud Run
description: Deploy to Angular Universal to Google Cloud Run and connect it to Firebase Hosting
weight: 54
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359204468
emoji: 🌩️
video_length: 5:55
---

Deploy Angular Universal to Google [Cloud Run](https://cloud.google.com/run/) and connect it to Firebase hosting. Make sure [Google Cloud SDK](https://cloud.google.com/sdk/) is installed on your local machine. Cloud Run is a solid choice, because it gives you a fully-managed "serverless" runtime using a Docker container - not to mention a generous free tier. 

## Dockerize the App
 
{{< file "docker" "Dockerfile" >}}
```docker
FROM node:10
WORKDIR usr/src/app
COPY package*.json ./
RUN npm install
# Copy local angular/nest code to the container
COPY . .
# Build production app
RUN npm run build:ssr
CMD ["npm", "run", "serve:ssr"]
```

## Register the Container on GCP

{{< file "terminal" "command line" >}}
```text
gcloud config set project <PROJECT_ID>
gcloud builds submit --tag gcr.io/PROJECT_ID/nest-angular-ssr
```

## Connect to Firebase

Connect your Cloud Run service to Firebase hosting. 

{{< file "terminal" "command line" >}}
```text
 firebase init hosting
 firebase deploy --only hosting
```

{{< file "js" "firebase.json" >}}
```json
{
  "hosting": {
    "public": "dist/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [ 
      {
        "source": "**",
        "run": {
          "serviceId": "nest-angular-ssr",
          "region": "us-central1" 
        }
      }
    ]
  }
}
```





