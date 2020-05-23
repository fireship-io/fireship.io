---
title: Hot Reload Node Typescript Server
lastmod: 2020-05-22T05:36:37-07:00
publishdate: 2020-05-22T05:36:37-07:00
author: Jeff Delaney
draft: false
description: Setup a Node.js server with TypeScript that automatically restarts when the source code changes
tags: 
    - typescript
    - node

# youtube: 
# code: 
type: lessons
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The following snippet demonstrates how to setup a Node.js project with TypeScript, then automatically reload or restart the node app on every code change. Basically, the goal is to run the TypeScript compiler and a node app concurrently. It is useful when you have something like an Express server and want to avoid manually restarting it. 

## Configure a Node Project with TypeScript

Start with a Node project. 

{{< file "terminal" "command line" >}}
```text
npm init -y

npm install --save-dev concurrently nodemon typescript
```

### Dependencies

Add the following dependencies and scripts. [Nodemon](https://www.npmjs.com/package/nodemon) will automatically restart the node app when the dist code changes. [Concurrently](https://www.npmjs.com/package/concurrently) runs multiple commands at the same time. 

{{< file "npm" "package.json" >}}
```json
{
  "name": "ts-hot-reload-node",
  "version": "1.0.0",
  "description": "Reload your server when typescript compiles",
  "main": "index.js",
  "devDependencies": {
    "concurrently": "^5.2.0",
    "nodemon": "^2.0.3",
    "typescript": "^3.2.2"
  }
}
```

### TS Config

Add a `tsconfig.json` to configure the TypeScript compiler. Feel free to customize it. The following config looks for code in the `src` directory and compiles it to `dist`. 

{{< file "typescript" "tsconfig.json" >}}
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "dist",
    "sourceMap": true,
    "strict": true,
    "target": "es2017",
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
```

## Build & Serve Scripts

The `dev` command runs the TypeScript compiler in watch mode, while at the same time using nodemon to monitor changes in the dist folder. 

{{< file "npm" "package.json" >}}
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "concurrently \"tsc -w\" \"nodemon dist/index.js\""
  },
}
```

{{< file "terminal" "command line" >}}
```text
npm run dev
```