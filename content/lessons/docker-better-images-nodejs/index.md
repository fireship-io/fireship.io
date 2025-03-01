---
title: Build an effective image with Node.js
lastmod: 2025-03-01T00:00:00-00:00
publishdate: 2025-03-01T02:00:00-00:00
author: Egor Chebkasov
draft: false
description: Learn techniques for creating efficient, secure, and more production-ready Docker images with Node.js
tags: 
    - docker
    - node
    - security
    - devops

youtube: 
github: https://github.com/fireship-io/docker-nodejs-advanced-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Building on our [Docker Basics Tutorial](/lessons/docker-basics-tutorial-nodejs/), this guide shows you how to create better Docker images for Node.js apps.

## The Problem with Basic Docker Images

Let's look at a simple Dockerfile that many developers start with. It works fine for learning, but has some problems we should fix:

{{< file "docker" "Dockerfile" >}}
```docker
FROM node:22
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
```

This works for development, but has several issues for production:

1. **Security vulnerabilities** - `npm install` includes dev dependencies that might have security problems
2. **Unreliable dependencies' code** - `npm install` might update packages beyond what's in package-lock.json, which can break your app
3. **Large image size** - Dev dependencies make the image much bigger than needed
4. **Huge base image** - node:22 is very large, making deployments slow and expensive

### Base image improvements

First, the base image is too big:

```docker
FROM node:22
```

We can use Alpine Linux instead, which is much smaller:

```docker
FROM node:22-alpine
```

Google offers "distroless" images that contain only what you need to run your app - nothing else. This gives you better security. The size difference between Alpine and distroless is small so you shouldn't think about it too much.

Please, don't overengineer. Distroless is what big companies like Google use, but for most projects, Alpine works great. Distroless images make debugging harder since they have no tools inside them.

```docker
FROM gcr.io/distroless/nodejs22-debian12
```

### npm install issues

This line causes many problems:

```docker
npm install
```

A better approach is using `npm ci`, which uses exactly what's in package-lock.json. It won't try to update packages.
Adding `--omit=dev` removes development tools like eslint and testing libraries. We only keep what the app needs to run:

```docker
npm ci --omit=dev
```

Here's our improved image:

{{< file "docker" "Dockerfile" >}}
```docker
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["node", "server.js"]
```

Now let's try the best practice approach with distroless images.
We need a multi-stage build because distroless images don't have tools like npm:

{{< file "docker" "Dockerfile" >}}
```docker
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /app
COPY --from=dependencies --chown=nonroot:nonroot /app .
USER nonroot
CMD ["server.js"]
```

### Non-root user for better security

Notice the USER nonroot line. This is an important security practice - by default, Docker runs as root, which creates a security risk. Distroless images come with a nonroot user built-in, making it easy to follow this best practice with just one line of code.


## Let's look at the results

I tested these approaches with a real Node.js app:

| Image Type | Size |
|------------|------|
| Basic | 1.18GB |
| Alpine | 170MB |
| Distroless | 162MB |

The difference is huge! Image size matters because your servers need to download these images. Smaller images mean faster deployments and less storage costs. 