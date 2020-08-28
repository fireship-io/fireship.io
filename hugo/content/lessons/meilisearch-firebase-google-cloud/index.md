---
title: Fulltext Search on Firebase with Meilisearch
lastmod: 2020-08-28T08:14:16-07:00
publishdate: 2020-08-28T08:14:16-07:00
author: Jeff Delaney
draft: false
description: Build and deploy a fulltext search engine for your Firestore data with Meilisearch. 
tags: 
    - pro
    - meilisearch
    - firestore
    - cloud-functions

vimeo: 452632526
github: https://github.com/fireship-io/meilisearch-firebase
pro: true
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

A common issue that developers face with NoSQL databases (and SQL to a lesser extent) is a lack of full-text search capabilities. If you want to build a performant typeahead search box or handle multi-property filtering on a collection, you’ll find it frustratingly difficult to implement in Firestore - it’s just not the right database for the job. There are many good solutions, like [Algolia](/lessons/algolia-cloud-functions/) and ElasticSearch, but they can be expensive and/or complex to manage. Today we’ll look at a super-fast Rust-based open-source search engine called [MeiliSearch](https://www.meilisearch.com/). We’ll use it to convert a Firestore collection into a fully searchable index (great for autocomplete search), then deploy it to a VM on Google Cloud. 

## Initial Setup

If you’re new to Docker, get familiar with my [Docker Tutorial](/lessons/docker-basics-tutorial-nodejs/)

### Run MeiliSearch with Docker

{{< file "terminal" "command line" >}}
```bash
docker run -it --rm \
    -p 7700:7700 \
    -v $(pwd)/data.ms:/data.ms \
    getmeili/meilisearch
```

The following command will run a MeiliSearch container on `http://localhost:7700`

### Create an Index

Create an index for searchable content. You can run a cURL command or use a HTTP client like Postman or Insomnia. 

{{< figure src="img/meilisearch-create-index.png" >}}

### Initialize Firebase

Initialize Firebase with Firestore, Cloud Functions, and the Emulator Suite. 

{{< file "terminal" "command line" >}}
```bash
firebase init

cd functions
npm install meilisearch
```

## MeiliSearch Cloud Functions 

Initialize the connection to meilisearch. 

{{< file "js" "functions/index.js" >}}
```javascript
const functions = require('firebase-functions');

const MeiliSearch = require('meilisearch');

const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: '',
  });
```

### Index on Firestore Create

The purpose of this function is to index every newly created Firestore document in Meilisearch. 

```javascript
exports.meilisearchIndex = functions.firestore
  .document('movies/{id}')
  .onCreate(async (snapshot, context) => {
    const index = client.getIndex('movies');

    const id = snapshot.id;
    const { title, year, description } = snapshot.data();

    const response = await index.addDocuments([
      { id, title, year, description }
    ])
    console.log(response)

  });
```

### HTTP Proxy for Searches

You can proxy searches through your Cloud Functions or make requests directly from a frontend app (using the meilisearch public key). 

```javascript
exports.meilisearchQuery = functions.https.onRequest(async (req, res) => {
  const index = client.getIndex('movies');

  const search = await index.search(req.body.q);

  res.send(search);
});
```


## Deploy MeiliSearch to Google Cloud

At this point, we need a way to deploy MeiliSearch to the cloud. Because it is a stateful service, we must mount a persistent disk volume to any container that runs it. 

The minimum monthly price on GCP you will pay is $4.53 for 1 micro VM and $1.70 10GB of SSD disk space. If pricing is important, I would recommend looking into [Digital Ocean](https://docs.meilisearch.com/resources/howtos/digitalocean_droplet.html) for small VMs like this. 


### Create a Disk

Create a persistent disk to hold your data. SSD is more expensive, but will deliver faster I/O and performance is usually critical for fulltext search. 

{{< figure src="img/gcp-disk.png" caption="Create a disk on Compute Engine" >}}

### Create a VM

Create a VM with the following settings: 

- Allow HTTP and HTTPS traffic
- Attach the disk from the previous step
- Launch from container. `getmeili/meilisearch:v0.13.0`
- Set production env variables (advanced container settings)
- Mount disk as volume (advanced container settings)

```text
MEILI_HTTP_ADDR=0.0.0.0:80 
MEILI_MASTER_KEY="super_secret" 
MEILI_ENV="production"
MEILI_DB_PATH="./meili-data"
```

{{< figure src="img/meilisearch-google-cloud-settings.png" caption="Important VM settings" >}}

This will give you an external IP that you can access over http, i.e `http://35.232.183.124`

### Get the API keys

In production, MeiliSearch requires requests to be [authenticated](https://docs.meilisearch.com/guides/advanced_guides/authentication.html#authentication) with an API key.

{{< figure src="img/meilisearch-keys.png" caption="Make a request for your API keys" >}}



