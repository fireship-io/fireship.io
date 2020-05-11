---
title: Docker
description: Dockererize your Node.js API and deploy it to Cloud Run
weight: 71
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416900666
icon: docker
video_length: 4:22
chapter_start: Deployment
---

## Dockerize

{{< file "terminal" "command line" >}}
```text
docker build -t fireship/stripe-server .
docker run -p 3333:3333 fireship/stripe-server 
```

## Deploy to Cloud Run

Push the container to Container Registry. 

{{< file "terminal" "command line" >}}
```text
gcloud config set project <PROJECT_ID>
gcloud builds submit --tag gcr.io/PROJECT_ID/stripe-server
```

Then follow the steps in the video to create a Cloud Run Service. 