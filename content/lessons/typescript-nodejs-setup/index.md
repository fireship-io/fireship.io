---
title: Setup Node with TypeScript
lastmod: 2022-11-26T14:42:50-07:00
publishdate: 2022-11-26T14:42:50-07:00
author: Jeff Delaney
draft: false
description: How to configure a new Node.js project with TypeScript and ES Modules
tags: 
    - typescript
    - node

youtube: H91aqUHn8sE
github: https://github.com/fireship-io/nodejs-typescript-starter
---

The following lesson demonstrates how to setup a Node.js (v18)project with [TypeScript](https://www.typescriptlang.org) when using ES Modules. TS version 4.7 introduced a new `NodeNext` compliler option that can translate ES Modules to CommonJS modules. It simplifies the setup process for Node.js projects, but there are important caveats to be aware of.


More about [ES Modules in TS](https://www.typescriptlang.org/docs/handbook/esm-node.html) from the TypeScript docs.

## Setup

### Package.json Module Type

```bash
npm init -y
npm install -D typescript @types/node
```

Update the package.json with a build script and change the type to module. 

{{< file "npm" "package.json" >}}
```json
{
  "type": "module",
  "scripts": {
    "build": "tsc"
  },
}
```

### TS Config

Create a tsconfig.json file.

```bash
touch tsconfig.json
```

Use the `NodeNext` option to handle ES Modules with interop between CommonJS modules. If you want a detailed explaination of why this option is needed, check out this [Stack Overflow thread](https://stackoverflow.com/questions/71463698/why-we-need-nodenext-typescript-compiler-option-when-we-have-esnext). 

{{< file "ts" "tsconfig.json" >}}
```json
{
    "compilerOptions": {
      "module": "NodeNext",
      "moduleResolution": "NodeNext",
      "target": "ES2020",
      "sourceMap": true,
      "outDir": "dist",
    },
    "include": ["src/**/*"],
  }
```
## Modules

### Use ES Modules

An important caveat to be aware of is that the `import` statement for local files must contain an extension. 

{{< file "ts" "src/hello.ts" >}}
```ts
export const hello = 'hi mom!';
```

{{< file "ts" "src/index.ts" >}}
```ts
import { hello } from './hello.js';
```

### Use CommonJS Modules

{{< file "ts" "src/hello.cts" >}}
```ts
module.exports = 'hola mama!';
```

{{< file "ts" "src/index.ts" >}}
```ts
import hola from './hello.cjs';
```

Now run the code.

```bash
npm run build
node dist/index.js
```