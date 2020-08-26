---
title: Docker Basics Tutorial with Node.js
lastmod: 2020-08-24T08:08:56-07:00
publishdate: 2020-08-24T08:08:56-07:00
author: Jeff Delaney
draft: false
description: Learn the fundamentals of Docker by containerizing a Node.js app
tags: 
    - docker
    - node

youtube: gAkwW2tuIqE
github: https://github.com/fireship-io/docker-nodejs-basic-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

## Code Breakdown

### Dockerfile

A Dockerfile is like DNA for building a Docker Image. 

{{< file "docker" "Dockerfile" >}}
```docker
FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD [ "npm", "start" ]
```

### Dockerignore

A Dockerignore file is required so we don't add the node_modules folder to the image.

{{< file "docker" ".dockerignore" >}}
```docker
node_modules
```


### Node.js App

This is the code we went to run as the container's process.

{{< file "js" "src/index.js" >}}
```javascript
const app = require('express')();

app.get('/', (req, res ) => 
    res.json({ message: 'Docker is easy 🐳' }) 
);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`app listening on http://localhost:${port}`) );
```

## Commands

### Build the Image

{{< file "terminal" "command line" >}}
```bash
docker build -t fireship/demoapp:1.0 .
```

### Run the Container

This maps the local port 5000 to the docker port 8080. You should be able to view the app on your local system at `https://localhost:5000`. You can choose any port you want. 

{{< file "terminal" "command line" >}}
```bash
docker run -p 5000:8080 <image-id>
```


## Docker Compose

[Docker Compose](https://docs.docker.com/compose/) makes it easy to manage multiple containers and volumes. 

{{< file "yaml" "docker-compose.yml" >}}
```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "8080:8080"
  db:
    image: "mysql"
    environment: 
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - db-data:/foo

volumes:
  db-data:
```

### Run multiple Containers

{{< file "terminal" "command line" >}}
```bash
docker-compose up
```

## Docker in 100s

{{< youtube Gjnup-PuquQ >}}

