---
title: Setup NestJS on Cloud Functions
lastmod: 2019-08-12T10:26:16-07:00
publishdate: 2019-08-12T10:26:16-07:00
author: Jeff Delaney
draft: false
description: Steps to run NestJS on Firebase Cloud Functions  

tags:
    - nest
    - typescript
    - cloud-functions

type: lessons

youtube: 
github: https://github.com/fireship-io/nest-cloud-functions
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The following snippet demonstrates how to setup [NestJS](https://nestjs.com/) on [Firebase Cloud Functions](/tags/cloud-functions)

## Nest on Cloud Functions Step-by-Step

I recommend starting from a Cloud Functions project, then bring in Nest incrementally. It is more difficult in my experience to merge Cloud Functions. 

### Step 1 - Initialize Cloud Functions

Initialize Cloud Functions making sure to choose the TypeScript option. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
npm i -g firebase-tools
firebase init functions
{{< /highlight >}}

### Step 2 - Install NestJS

Install Nest. If you have an existing project, also copy over the other dependencies from your Package.json. 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
cd functions
npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata express @nestjs/platform-express
{{< /highlight >}}


### Step 3 - Add NestCLI Support 

One of the best features in Nest is the CLI. Let's add support by creating the following file: 

{{< file "nest" "functions/nest-cli.json" >}}
{{< highlight json >}}
{
    "language": "ts",
    "collection": "@nestjs/schematics",
    "sourceRoot": "src"
  }
  
{{< /highlight >}}

### Step 4 - Update the TS Config

Nest uses TypeScript features that are not enabled in Cloud Functions by default. Let's change that. 

{{< file "cog" "functions/tsconfig.json" >}}
{{< highlight json >}}
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": false,
    "target": "es2017",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "declaration": true,
    "removeComments": true,
    "baseUrl": "./",
    "incremental": true,
    "esModuleInterop": true
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
{{< /highlight >}}

### Step 5 - Generate an App Module

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
nest generate module app --flat

nest generate controller egg
{{< /highlight >}}

{{< figure src="/img/snippets/nest-cloud-functions-structure.png" caption="The file structure of Nest + Cloud Functions " >}}


### Step 6 - Create the Server

Create a main file. Its purpose is to export an ExpressJS app and expose a function that wraps it with Nest. 

{{< file "typescript" "functions/src/main.ts" >}}
{{< highlight typescript >}}
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express, { Express } from 'express';


export const server: Express = express();

export const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  return app.init();
};

{{< /highlight >}}

Lastly, create the Nest server and wrap it in a Cloud Function. 

{{< file "typescript" "functions/src/index.ts" >}}
{{< highlight typescript >}}
import * as functions from 'firebase-functions';
import { server, createNestServer } from './main';

createNestServer(server)
    .then(v => console.log('Nest Ready'))
    .catch(err => console.error('Nest broken', err));

export const api = functions.https.onRequest(server);
{{< /highlight >}}

### Step 7 - Test It

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
cd functions
npm run serve
{{< /highlight >}}

The should give you a URL that looks like
`http://localhost:5000/YOUR-PROJECT/REGION/api/eggs` where you can start testing the API. Happy Nesting 🥚🥚🥚! 
