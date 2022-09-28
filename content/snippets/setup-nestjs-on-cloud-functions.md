---
title: Setup Nest on Cloud Functions
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

youtube: IVy3Tm8iHQ0
github: https://github.com/fireship-io/nest-cloud-functions
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The following snippet demonstrates *two* different techniques for setting up [NestJS](https://nestjs.com/) on [Firebase Cloud Functions](/tags/cloud-functions).

## Option A - Point a Function to Nest

The first setup modifies the functions configuration to use the Nest `/dist` output, as opposed to the default functions directory. This option is ideal if you have an existing Nest app. 

### Step 1 - Create Nest App

{{< file "terminal" "command line" >}}
```text
nest generate app server
```


### Step 2 - Add Functions

Add functions, then delete the automatically generated directory.

{{< file "terminal" "command line" >}}
```bash
npm i -g firebase-tools
firebase init functions

rm -rf functions # delete functions dir
```


Now update the firebase config to point to the nest app. 

{{< file "firebase" "firebase.json" >}}
```js
  "functions": {
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ],
    "source": "server" // <-- here
  }
}
```

### Step 3 - Install Dependencies

{{< file "terminal" "command line" >}}
```text
cd server
npm i firebase-functions firebase-admin express @nestjs/platform-express
```

### Step 4 - Update the package.json

Add the following lines to your package.json. 

{{< file "npm" "package.json" >}}
```js
{
  // ...
  "main": "dist/index.js",
  "engines": {
    "node": "8"
  }
}
```


### Step 5 - Export the Server

Create a new file named `src/index.ts` that creates an exress app and wraps it with Nest.

{{< file "nest" "src/index.ts" >}}
```typescript
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as functions from 'firebase-functions';

const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  return app.init();
};



createNestServer(server)
    .then(v => console.log('Nest Ready'))
    .catch(err => console.error('Nest broken', err));

export const api = functions.https.onRequest(server);
```

### Step 6 - Build, Serve, Deploy


{{< file "terminal" "command line" >}}
```bash
npm run build
firebase serve --only functions
firebase deploy --only functions
```

## Option B - Add Nest to the Functions Source

In this setup, we perform a fresh install of Nest in the Functions source code. This is a good approach if you have existing background functions, but want to wrap Nest as an HTTP function. 

### Step 1 - Initialize Cloud Functions

Initialize Cloud Functions making sure to choose the TypeScript option. 

{{< file "terminal" "command line" >}}
```text
npm i -g firebase-tools
firebase init functions
```

### Step 2 - Install NestJS

Install Nest. If you have an existing project, also copy over the other dependencies from your Package.json. 

{{< file "terminal" "command line" >}}
```text
cd functions
npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata express @nestjs/platform-express
```


### Step 3 - Add NestCLI Support 

One of the best features in Nest is the CLI. Let's add support by creating the following file: 

{{< file "nest" "functions/nest-cli.json" >}}
```json
{
    "language": "ts",
    "collection": "@nestjs/schematics",
    "sourceRoot": "src"
  }
  
```

### Step 4 - Update the TS Config

Nest uses TypeScript features that are not enabled in Cloud Functions by default. Let's change that. 

{{< file "cog" "functions/tsconfig.json" >}}
```json
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
```

### Step 5 - Generate an App Module

{{< file "terminal" "command line" >}}
```text
nest generate module app --flat

nest generate controller egg
```

{{< figure src="/snippets/img/nest-cloud-functions-structure.png" caption="The file structure of Nest + Cloud Functions " >}}


### Step 6 - Create the Server

Lastly, create the Nest server and wrap it in a Cloud Function. It's purpose is to export an ExpressJS app and expose a function that wraps it with Nest. 

{{< file "ts" "functions/src/index.ts" >}}
```typescript
import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const server = express();

const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  return app.init();
};


createNestServer(server)
    .then(v => console.log('Nest Ready'))
    .catch(err => console.error('Nest broken', err));

export const api = functions.https.onRequest(server);

```

### Step 7 - Build, Serve, Deploy

{{< file "terminal" "command line" >}}
```text
cd functions
npm run serve

firebase deploy --only functions
```

The should give you a URL that looks like
`http://localhost:5000/YOUR-PROJECT/REGION/api/eggs` where you can start testing the API. Happy Nesting 🥚🥚🥚! 
