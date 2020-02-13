---
title: How to Share Code between JavaScript Apps
lastmod: 2018-09-04T17:48:24-07:00
publishdate: 2018-09-04T17:48:24-07:00
author: Jeff Delaney
draft: false
description: Share code between frontend/backend apps in JavaScript with NPM packages. 
tags: 
    - javascript
    - typescript
    - node

youtube: MflUMIeADZU
github: https://github.com/AngularFirebase/136-big-projects
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


The right project structure for your app depends primarily on (1) its complexity, and (2) the size of your team. In this lesson, I will show you how to use NPM packages to share code in a big JavaScript project that contains multiple apps. 


## Monorepos versus Multiple Repos

There are two high-level strategies for handling source control in a large complex web application - monorepo and multiple repos. Some developers have [very strong preferences](https://redfin.engineering/well-never-know-whether-monorepos-are-better-2c08ab9324c0) for one or the other, but it mostly just boils down to a series of tradeoffs. 

A monorepo is a single git repository that synchronizes multiple packages. This pattern has become very popular with large organizations, like Google and Facebook, and is well suited large teams. Multiple repos are, well, exactly like they sound - multiple isolated repos maintained as individual packages. 

There are pros and cons to both strategies, so let's examine some of the tradeoffs. 

- Monorepos are big and complex, usually requiring a tool like [Lerna](https://lernajs.io/) or [Nx](https://github.com/nrwl/nx). 
- Multiple repos are less complex on the surface, but might become chaotic if you have many projects and/or contributors.  
- Monorepos have long testing & deployment [CI/CD](/lessons/devops-continuous-integration-with-angular-firebase-circleci/) pipelines. 
- Monorepos share a git timeline, which makes reverting commits on a single package difficult. 


Because I'm working on this project as an indie developer and only have a few apps, I will go with the multiple repos strategy. In either case, sharing code follows the same basic process. 

## Code Sharing in Large Projects

The ultimate goal of any project structure is to maximize code reusability. [Do Not Repeat Yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). 

It's very common to share code like TypeScript interfaces and business logic between multiple projects. The beauty of building a fullstack JavaScript app is that code can easily reused on both the frontend and the server. Let's quickly bootstrap a complex JS project using the CLI tools for Angular, Vue, and Firebase.

```shell
mkdir big-app
cd big-app

ng new angular-frontend

vue create vue-frontend

firebase init functions
```



And just like that we now have a fullstack multi-app project. 

### Share TypeScript Interfaces between Apps

Take for example this very common scenario - you have an Angular frontend written in TypeScript, then you want to share its interfaces with your NodeJS backend. You might have a file in Angular at `src/app/user.model.ts`:

```typescript
export interface User {
  uid: string;
  name: string;
  age: number;
  admin: boolean;
}
```

How can your backend Node code use this interface? Well, it can't when it lives in your frontend Angular code. You could just copy-and-paste it over the server code, but that does not scale very well. In the next section, we'll share this interface by creating an NPM package from scratch. 

{{< figure src="img/vscode-intellisense.png" caption="Shared TS interface" >}}

### Create a Shared NPM Package

Let's expand our workspace with another package (or library) that is specifically for sharing code and typings.  

```shell
mkdir shared-stuff
cd shared-stuff

npm init --yes
touch index.ts
```

We now have the basic outline for a shared library. 


{{< figure src="img/multirepo-project.png" caption="Project structure in a multirepo" >}}


At this point, we can add our shared code and/or interfaces to the index file. This code can be consumed by other apps in the project after we package it. Let's add typings and a build script to the `package.json`

```js
{ 
  "main": "index.js",
  "types": "index.d.ts"
  "scripts" : {
    "build": "tsc index.ts -d"
  }
}
```


We can build this package and install it in our shared apps.

```shell
cd shared-stuff
npm run build

cd ../angular-frontend
npm i path/to/shared-stuff

cd ../functions
npm i path/to/shared-stuff
```

```typescript
import { User } from 'shared-stuff';
```

<p class="success">If you have many shared libs, it is well-worth the investment to setup an [NPM organization](https://www.npmjs.com/docs/orgs/) to scope packages to your company `@awesomeinc/shared-stuff` and install them remotely.</p>


### Sharing a Local NPM Package with Cloud Functions

Cloud Functions are deployed to a remote *serverless* server, so we need a way for functions environment to access the source code. You have three options: 

1. Publish your library publicly on NPM. 
2. Publish it privately by creating an NPM organization. 
3. Package it up, then install it from the functions directory. 

The third option makes the most sense in the early stages of development, so let's look at that process. 

In the shared lib, update the build command to zip the library after building. 


```js
{ 
  "main": "index.js",
  "types": "index.d.ts"
  "scripts" : {
    "build": "tsc index.ts -d && npm pack",
  }
}
```

This will give us a tarball that looks like `shared-stuff-1.0.0.tgz` that we needs to be copied over the functions dir, then installed from the path in the functions dir. When you deploy, the contents of the functions directory will be included in the deployed bundle. 

```shell
cd shared-stuff
npm run build

# copy tarball to /functions

cd ../functions
npm i shared-stuff-1.0.0.tgz

firebase deploy --only functions
```

The relationship between your shared lib and functions should look something like this:

{{< figure src="img/local-npm-cloud-function.png" caption="File structure when sharing code with Firebase Cloud Functions" >}}


