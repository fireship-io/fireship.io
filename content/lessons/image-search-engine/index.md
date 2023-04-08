---
title: Build an Image Search Engine
lastmod: 2023-04-03T10:56:12-07:00
publishdate: 2023-04-03T10:56:12-07:00
author: Jeff Delaney
draft: false
description: Build your own Image Search Engine with vector database Weaviate and Node.js
tags: 
    - ml
    - node

youtube: mBcBoGhFndY
# github: 
---

[Weaviate](https://weaviate.io/) is a [vector database](https://learn.microsoft.com/en-us/semantic-kernel/concepts-ai/vectordb) that allows you to create and query embeddings with pre-trained deep learning models. It integrates with ResNet-50 to vectorize images, making it possible to build an image similarity search engine with relative ease. 




## Initial Setup

### Docker Compose Wizard

To run Weaviate locally, use their [wizard](https://weaviate.io/developers/weaviate/installation/docker-compose) to generate a Docker Compose config that supports the image module. 

### Install the Weaviate Client

Create a new Node.js project and install the Weaviate TS client. 

{{< file "terminal" "command line" >}}
```bash
npm init -y
npm i weaviate-ts-client
```

## Image Search Engine App

{{< figure src="img/image-search-vector-db.png" caption="Image search in a vector database" >}}

### Initialize the Client

Initialize the client and fetch the schema just to make sure the database is up and running. 

{{< file "js" "app.js" >}}
```javascript
import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const schemaRes = await client.schema.getter().do();

console.log(schemaRes)
```

### Create a Schema

Create a schema that contains an image property. 

{{< file "js" "index.js" >}}
```javascript
const schemaConfig = {
    'class': 'Meme',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
        }
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob']
        },
        {
            'name': 'text',
            'dataType': ['string']
        }
    ]
}

await client.schema
    .classCreator()
    .withClass(schemaConfig)
    .do();
```

### Store an Image

Images must first be converted to base64. Once converted, store it to the cooresponding class in the schema. Weaviate will automatically use the neural network in the background to vectorize it and update the embedding. 

{{< file "js" "index.js" >}}
```javascript
const img = readFileSync('./img/hi-mom.jpg');

const b64 = Buffer.from(img).toString('base64');

await client.data.creator()
  .withClassName('Meme')
  .withProperties({
    image: b64,
    text: 'matrix meme'
  })
  .do();
```

### Query an Image

After storing a few images, we can provide an image as a query input. The database will use [HNSW](https://arxiv.org/abs/1603.09320) to quickly find similar looking images. 

{{< file "js" "index.js" >}}
```javascript
const test = Buffer.from( readFileSync('./test.jpg') ).toString('base64');

const resImage = await client.graphql.get()
  .withClassName('Meme')
  .withFields(['image'])
  .withNearImage({ image: test })
  .withLimit(1)
  .do();

// Write result to filesystem
const result = resImage.data.Get.Meme[0].image;
writeFileSync('./result.jpg', result, 'base64');
```

And finally, run it with Node to your search engine in action!

{{< file "terminal" "command line" >}}
```bash
node index.js
```