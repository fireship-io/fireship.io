---
title: Node Setup
description: Configure Node.js for hot reloading with TypeScript
weight: 15
lastmod: 2020-04-20T10:23:30-09:00
draft: false
vimeo: 416483002
icon: node
video_length: 4:50
free: true
---

## Create a Node Project

Start with an empty Node project. 

{{< file "terminal" "command line" >}}
```text
npm init -y
```

## Dependencies

Add the following dependencies and scripts. 

{{< file "npm" "package.json" >}}
```json
{
  "name": "stripe-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "tsc",
    "start": "node lib/index.js",
    "dev": "concurrently \"tsc -w\" \"nodemon lib/index.js\""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "firebase-admin": "^8.6.0",
    "stripe": "^8.43.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.6",
    "@types/cors": "^2.8.6",
    "concurrently": "^5.2.0",
    "nodemon": "^2.0.3",
    "tslint": "^5.12.0",
    "typescript": "^3.2.2"
  }
}
```

{{< file "terminal" "command line" >}}
```text
npm install

npm run dev
```


## TS Config

Add a `tsconfig.json` to handle TS compilation. 

{{< file "ts" "tsconfig.json" >}}
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noImplicitAny": false,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017",
    "lib": ["ESNext"],
    "strictNullChecks": false,
    "esModuleInterop": true
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
```

## Setup Environment Variables

{{< file "cog" ".env" >}}
```text
STRIPE_SECRET=sk_test_YOUR_KEY
WEBAPP_URL="http://localhost:3000"
```